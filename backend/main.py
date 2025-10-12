from fastapi import FastAPI
from dotenv import load_dotenv
from ai.llm_manager import LLMManager

load_dotenv()

app = FastAPI()

llm_manager = LLMManager()


@app.get("/")
def read_root():
    return {"Hello": "World"}
