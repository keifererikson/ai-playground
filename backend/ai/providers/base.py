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

    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generate an embedding for the given text.
        This method is optional and may not be implemented by all providers.
        """
        raise NotImplementedError(
            f"{self.__class__.__name__} does not support embeddings."
        )

    @abstractmethod
    async def get_embedding_model(self) -> str | None:
        """
        Get the embedding model name.
        This method is optional and may not be implemented by all providers.
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

    @abstractmethod
    async def validate_credentials(self) -> None:
        """
        Validate the API credentials.
        """
        pass
