from fastapi import FastAPI
from dotenv import load_dotenv
from ai.llm_manager import LLMManager

load_dotenv()

app = FastAPI()

llm_manager = LLMManager()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/test")
async def test_llm():
    provider = llm_manager.get_current_provider()
    response = await provider.generate_text("Hello, how are you?")
    return {"response": response}
