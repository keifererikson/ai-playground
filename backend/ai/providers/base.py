from abc import ABC, abstractmethod
from typing import List


class LLMProvider(ABC):
    """
    Abstract base class for LLM providers.
    """

    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("API key must be provided")
        self.api_key = api_key
        self.model = ""
        self.temperature = 0.7

    @abstractmethod
    async def generate_text(self, prompt: str) -> str:
        """
        Generate text based on the given prompt.
        """
        pass

    @abstractmethod
    async def list_models(self) -> List[str]:
        """
        List available models from the provider.
        """
        pass

    @abstractmethod
    async def set_model(self, model: str):
        """
        Set the model to be used for text generation.
        """
        pass

    @abstractmethod
    async def set_temperature(self, temperature: float):
        """
        Set the temperature for text generation.
        """
        pass
