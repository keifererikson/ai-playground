from typing import cast
from langchain_anthropic import ChatAnthropic
from langchain_core.utils import convert_to_secret_str
from langchain_core.messages import AIMessage, HumanMessage, BaseMessage
from .base import LLMProvider
import anthropic


class AnthropicProvider(LLMProvider):
    """Concrete LLM provider for Anthropic models using langchain-anthropic."""

    def __init__(
        self,
        api_key: str,
        model: str = "claude-3-5-haiku-latest",
        temperature: float = 0.7,
    ):
        """Initializes the AnthropicProvider instance.

        Args:
            api_key: The Anthropic API key.
            model: The model name to use, e.g., "claude-3-5-haiku-latest".
            temperature: The sampling temperature for the model.
        """
        super().__init__(api_key)
        self.model = model
        self.temperature = temperature
        self._update_llm_instance()

    def _update_llm_instance(self):
        """Creates or recreates the internal ChatAnthropic LLM instance."""
        self.llm = ChatAnthropic(
            model=self.model,
            temperature=self.temperature,
            api_key=convert_to_secret_str(self.api_key),
        )

    async def generate_text(self, prompt: str) -> str:
        """Generates a text response for a given prompt using Anthropic.

        Args:
            prompt: The user's input prompt as a string.

        Returns:
            The AI's text response as a string.

        Raises:
            TypeError: If the model returns a non-string content type.
            # Any exceptions from the Anthropic API will also be propagated.
        """
        try:
            response_base: BaseMessage = await self.llm.ainvoke(
                [HumanMessage(content=prompt)]
            )
            response: AIMessage = cast(AIMessage, response_base)

            if isinstance(response.content, str):
                return response.content
            else:
                raise TypeError(
                    f"Expected a string response, but got {type(response.content)}"
                )
        except Exception as e:
            print(f"Error generating Anthropic text: {e}")
            raise

    async def generate_embedding(self, text: str) -> list[float]:
        """Generates a text embedding for the given input text using Anthropic.

        Note: Anthropic does not provide embedding services. Consider using Voyage AI or OpenAI for embeddings.

        Args:
            text: The input text to be converted into an embedding.
        Returns:
            A list of floats representing the text embedding.
        Raises:
            NotImplementedError: Anthropic does not support embeddings.
        """
        raise NotImplementedError("Anthropic does not provide embedding services.")

    async def get_embedding_model(self) -> str | None:
        """Returns the name of the embedding model used.

        Returns:
            The embedding model name as a string.
        Raises:
            NotImplementedError: Anthropic does not support embeddings.
        """
        return None

    async def list_models(self) -> list[str]:
        """Lists available models from Anthropic.

        Returns:
            A list of model names as strings.
        """
        try:
            client = anthropic.AsyncAnthropic(api_key=self.api_key)
            models = await client.models.list()
            model_names = [model.id for model in models.data if "claude" in model.id]
            return model_names
        except Exception as e:
            print(f"Error listing Anthropic models: {e}")
            raise

    async def set_model(self, model: str):
        """Sets the model to be used for text generation.

        Args:
            model: The model name as a string.
        """
        self.model = model
        self._update_llm_instance()

    async def set_temperature(self, temperature: float):
        """Sets the temperature for text generation.

        Args:
            temperature: The sampling temperature as a float.
        """
        self.temperature = temperature
        self._update_llm_instance()

    async def validate_credentials(self) -> None:
        """
        Validates the Anthropic API credentials by making a test API call.

        Raises:
            Exception: If the API key is invalid or another API error occurs.
        """
        try:
            client = anthropic.AsyncAnthropic(api_key=self.api_key)
            await client.models.retrieve("claude-3-haiku-20240307")
        except Exception as e:
            raise e
