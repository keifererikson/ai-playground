import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.api.v1.endpoints import playground
from ai.llm_manager import LLMManager
from app.database import AsyncSessionLocal
from app import crud, models


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    llm_manager = LLMManager()
    await llm_manager.validate_providers()

    app.state.llm_manager = llm_manager

    async with AsyncSessionLocal() as db:
        db_settings = await crud.get_settings(db)
        if not db_settings:
            print("No settings found in db, initializing default settings...")
            default_settings = models.Settings()
            db.add(default_settings)
            await db.commit()
            await db.refresh(default_settings)
            db_settings = default_settings

        print("Syncing LLM Manager with settings from database...")
        llm_manager.set_provider(db_settings.provider)
        provider = llm_manager.get_current_provider()

        await provider.set_model(db_settings.model)
        await provider.set_temperature(db_settings.temperature)

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
