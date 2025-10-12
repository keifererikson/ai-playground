import os
from typing import Dict, Type
from .providers.base import LLMProvider
from .providers.openai_provider import OpenAIProvider


class LLMManager:
    """
    Manages multiple LLM providers using a Singleton design pattern.
    This ensures a single instance of LLMManager throughout the application.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LLMManager, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.providers: Dict[str, LLMProvider] = {}

        provider_registry: Dict[str, Type[LLMProvider]] = {
            "openai": OpenAIProvider,
        }

        for name, provider_class in provider_registry.items():
            api_key = os.getenv(f"{name.upper()}_API_KEY")
            if api_key:
                self.providers[name] = provider_class(api_key=api_key)
                print(f"Initialized {name} provider.")

        if not self.providers:
            raise ValueError(
                "No LLM providers were initialized. Please set API keys in .env."
            )

        default_provider = os.getenv("DEFAULT_AI_PROVIDER", "openai")
        self.current_provider = (
            default_provider
            if default_provider in self.providers
            else list(self.providers.keys())[0]
        )

    def get_current_provider(self) -> LLMProvider:
        """Returns the currently selected LLM provider instance."""
        return self.providers[self.current_provider]

    def set_provider(self, provider_name: str):
        """Sets the current provider to the specified one if it exists."""
        if provider_name in self.providers:
            self.current_provider = provider_name
        else:
            raise ValueError(f"Provider '{provider_name}' is not available.")
