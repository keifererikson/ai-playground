import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.api.v1.endpoints import playground
from ai.llm_manager import LLMManager
from app.database import get_db, engine, Base
from app import crud, models


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application startup: Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created (if they didn't exist).")

    print("Initializing and validating LLM providers...")
    llm_manager = LLMManager()
    await llm_manager.validate_providers()
    app.state.llm_manager = llm_manager
    print("LLM Manager initialized.")

    print("Loading initial settings from database...")
    async for db in get_db():
        try:
            db_settings = await crud.get_settings(db)

            if not db_settings:
                print("No settings found. Seeding database with defaults...")

                default_provider_name = list(llm_manager.providers.keys())[0]
                default_provider = llm_manager.providers[default_provider_name]
                available_models = await default_provider.list_models()
                default_model = (
                    available_models[0] if available_models else "default-model"
                )

                db_settings = await crud.create_default_settings(
                    db=db, provider=default_provider_name, model=default_model
                )
                print(
                    f"Default settings created: {default_provider_name} / {default_model}"
                )

            print(f"Applying settings: {db_settings.provider} / {db_settings.model}")
            llm_manager.set_provider(db_settings.provider)
            provider = llm_manager.get_current_provider()
            await provider.set_model(db_settings.model)
            await provider.set_temperature(db_settings.temperature)

        except Exception as e:
            print(f"CRITICAL: Failed to load or create settings: {e}")
            raise e

        finally:
            break

    yield


app = FastAPI(
    lifespan=lifespan,
    title="AI Playground",
    description="An interactive platform to experiment with various AI models and providers.",
    version="0.0.1",
)

origins = [
    "http://localhost:3000",
    "http://10.0.0.10:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    playground.router,
    prefix="/api/v1",
    tags=["Playground"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}
