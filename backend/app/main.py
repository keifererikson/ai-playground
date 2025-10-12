from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.v1.endpoints import playground
from ai.llm_manager import LLMManager

load_dotenv()

llm_manager = LLMManager()

app = FastAPI(
    title="AI Playground",
    description="An interactive platform to experiment with various AI models and providers.",
    version="0.0.1",
)

app.include_router(
    playground.router,
    prefix="/api/v1",
    tags=["Playground"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}
