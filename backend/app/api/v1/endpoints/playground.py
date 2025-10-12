from fastapi import APIRouter, Depends, Body, HTTPException, Request
from ai.llm_manager import LLMManager
from app.api.v1.dependencies import get_api_key
from app.api.v1.schemas import (
    TestPromptRequest,
    TestPromptResponse,
    EmbeddingRequest,
    EmbeddingResponse,
    SettingsResponse,
    UpdateSettingsRequest,
)

router = APIRouter()


@router.get(
    "/settings", response_model=SettingsResponse, summary="Get current LLM settings"
)
async def get_settings(request: Request):
    """Retrieves the current LLM settings including provider, model, temperature, and available models."""
    llm_manager: LLMManager = request.app.state.llm_manager

    provider = llm_manager.get_current_provider()

    available_models = await provider.list_models()

    return SettingsResponse(
        provider=llm_manager.current_provider,
        model=provider.model,
        embedding_model=await provider.get_embedding_model(),
        temperature=provider.temperature,
        available_models=available_models,
    )


@router.put(
    "/settings",
    response_model=SettingsResponse,
    summary="Update LLM settings",
)
async def update_settings(request: Request, payload: UpdateSettingsRequest = Body(...)):
    """Updates the LLM settings including provider, model, and temperature."""
    llm_manager: LLMManager = request.app.state.llm_manager

    if payload.provider is not None:
        try:
            llm_manager.set_provider(payload.provider)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    provider = llm_manager.get_current_provider()

    if payload.model is not None:
        await provider.set_model(payload.model)

    if payload.temperature is not None:
        await provider.set_temperature(payload.temperature)

    available_models = await provider.list_models()
    return SettingsResponse(
        provider=llm_manager.current_provider,
        model=provider.model,
        embedding_model=await provider.get_embedding_model(),
        temperature=provider.temperature,
        available_models=available_models,
    )


@router.post(
    "/test",
    response_model=TestPromptResponse,
    summary="Test LLM with a prompt",
    dependencies=[Depends(get_api_key)],
)
async def test_prompt(request: Request, payload: TestPromptRequest = Body(...)):
    """Sends a test prompt to the current LLM provider and returns the response."""
    llm_manager: LLMManager = request.app.state.llm_manager

    provider = llm_manager.get_current_provider()
    try:
        response_text = await provider.generate_text(payload.prompt)
        return TestPromptResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating text: {e}")


@router.post(
    "/embed",
    response_model=EmbeddingResponse,
    summary="Generate text embedding",
    dependencies=[Depends(get_api_key)],
)
async def create_embedding(request: Request, payload: EmbeddingRequest = Body(...)):
    """
    Generates a text embedding for the given input text.
    Returns the truncated embedding vector and the model used.

    """
    llm_manager: LLMManager = request.app.state.llm_manager

    provider = llm_manager.get_current_provider()
    try:
        provider = llm_manager.get_current_provider()
        embedding = await provider.generate_embedding(payload.text)
        embedding_model = await provider.get_embedding_model()

        return EmbeddingResponse(embedding=embedding[:10], model=embedding_model)
    except NotImplementedError:
        raise HTTPException(
            status_code=400,
            detail=f"Provider '{llm_manager.current_provider}' does not support embeddings.",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {e}")
