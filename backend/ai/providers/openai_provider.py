from typing import cast
from langchain_openai import ChatOpenAI
from langchain_core.utils import convert_to_secret_str
from langchain_core.messages import AIMessage, HumanMessage, BaseMessage
from .base import LLMProvider
import openai
import re


class OpenAIProvider(LLMProvider):
    """Concrete LLM provider for OpenAI models using langchain-openai."""

    def __init__(
        self, api_key: str, model: str = "gpt-5-nano", temperature: float = 0.7
    ):
        """Initializes the OpenAIProvider instance.

        Args:
            api_key: The OpenAI API key.
            model: The model name to use, e.g., "gpt-5-nano".
            temperature: The sampling temperature for the model.
        """
        super().__init__(api_key)
        self.model = model
        self.temperature = temperature
        self.embedding_model = "text-embedding-3-small"
        self._update_llm_instance()

    def _update_llm_instance(self):
        """Creates or recreates the internal ChatOpenAI LLM instance."""
        self.llm = ChatOpenAI(
            model=self.model,
            temperature=self.temperature,
            api_key=convert_to_secret_str(self.api_key),
        )

    async def generate_text(self, prompt: str) -> str:
        """Generates a text response for a given prompt using OpenAI.

        Args:
            prompt: The user's input prompt as a string.

        Returns:
            The AI's text response as a string.

        Raises:
            TypeError: If the model returns a non-string content type.
            # Any exceptions from the OpenAI API will also be propagated.
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
            print(f"Error generating OpenAI text: {e}")
            raise

    async def generate_embedding(self, text: str) -> list[float]:
        """Generates a text embedding for the given input text using OpenAI.

        Args:
            text: The input text to be converted into an embedding.
        Returns:
            A list of floats representing the text embedding.
        Raises:
            Exception: If the embedding generation fails.
        """
        try:
            client = openai.AsyncOpenAI(api_key=self.api_key)
            text_to_embed = text.replace("\n", " ")

            response = await client.embeddings.create(
                input=[text_to_embed], model=self.embedding_model
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error generating OpenAI embedding: {e}")
            raise

    async def get_embedding_model(self) -> str:
        """Returns the name of the embedding model used.

        Returns:
            The embedding model name as a string.
        """
        return self.embedding_model

    async def list_models(self) -> list[str]:
        """Lists available models from OpenAI.

        Returns:
            A list of model names as strings.
        """
        try:
            client = openai.AsyncOpenAI(api_key=self.api_key)
            models = await client.models.list()

            excluded_substrings = [
                "ft:",
                "instruct",
                "preview",
                "vision",
                "image",
                "audio",
                "embed",
                "json",
            ]
            date_pattern = re.compile(r"\d{4}-\d{2}-\d{2}")

            filtered_models = [
                m.id
                for m in models.data
                if ("gpt-" in m.id or "o3" in m.id or "o4" in m.id)
                and not any(sub in m.id for sub in excluded_substrings)
                and not date_pattern.search(m.id)
            ]

            return sorted(filtered_models)
        except Exception as e:
            print(f"Error listing OpenAI models: {e}")
            return ["gpt-5-nano", "gpt-4o-mini", "gpt-3.5-turbo"]  # Fallback models

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
