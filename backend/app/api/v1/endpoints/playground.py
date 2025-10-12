from fastapi import APIRouter, Depends, Body
from ai.llm_manager import LLMManager
from app.api.v1.schemas import (
    TestPromptRequest,
    TestPromptResponse,
    SettingsResponse,
    UpdateSettingsRequest,
)

router = APIRouter()


@router.get(
    "/settings", response_model=SettingsResponse, summary="Get current LLM settings"
)
async def get_settings(llm_manager=Depends(LLMManager)):
    """Retrieves the current LLM settings including provider, model, temperature, and available models."""

    provider = llm_manager.get_current_provider()

    available_models = await provider.list_models()

    return SettingsResponse(
        provider=llm_manager.current_provider,
        model=provider.model,
        temperature=provider.temperature,
        available_models=available_models,
    )
