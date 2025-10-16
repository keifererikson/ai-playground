from typing import cast
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.utils import convert_to_secret_str
from langchain_core.messages import AIMessage, HumanMessage, BaseMessage
from .base import LLMProvider
import google.genai as genai


class GeminiProvider(LLMProvider):
    """Concrete LLM provider for Google Gemini models using langchain-google-genai."""

    def __init__(
        self,
        api_key: str,
        model: str = "gemini-2.5-flash",
        temperature: float = 0.7,
    ):
        """Initializes the GeminiProvider instance.

        Args:
            api_key: The Google API key.
            model: The model name to use, e.g., "gemini-2.5-flash".
            temperature: The sampling temperature for the model.
        """
        super().__init__(api_key)
        self.model = model
        self.temperature = temperature
        self.embedding_model = "models/gemini-embedding-001"
        self._update_llm_instance()

    def _update_llm_instance(self):
        """Creates or recreates the internal ChatGoogleGenerativeAI LLM instance."""
        self.llm = ChatGoogleGenerativeAI(
            model=self.model,
            temperature=self.temperature,
            api_key=convert_to_secret_str(self.api_key),
            convert_system_message_to_human=True,
        )

    async def generate_text(self, prompt: str) -> str:
        """Generates a text response for a given prompt using Gemini."""
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
            print(f"Error generating Gemini text: {e}")
            raise

    async def generate_embedding(self, text: str) -> list[float]:
        """Generates a text embedding for the given input text using Google."""
        try:
            async with genai.Client(api_key=self.api_key).aio as aclient:
                response = await aclient.models.embed_content(
                    model=self.embedding_model,
                    contents=text,
                )

                if (
                    response.embeddings
                    and len(response.embeddings) > 0
                    and response.embeddings[0].values is not None
                ):
                    return response.embeddings[0].values
                else:
                    raise ValueError("No embeddings returned from the API.")
        except Exception as e:
            print(f"Error generating Google embedding: {e}")
            raise

    async def get_embedding_model(self) -> str:
        """Returns the name of the embedding model used."""
        return self.embedding_model

    async def list_models(self) -> list[str]:
        """Lists available models from Google."""
        try:
            excluded_substrings = [
                "preview",
                "exp",
                "lite",
                "live",
                "robotics",
                "tts",
                "image",
                "audio",
                "aqa",
                "computer-use",
            ]

            filtered_models = []

            async with genai.Client(api_key=self.api_key).aio as aclient:
                async for model in await aclient.models.list():
                    if (
                        model.name
                        and "gemini" in model.name
                        and "embedding" not in model.name
                        and not any(sub in model.name for sub in excluded_substrings)
                    ):
                        model_name = model.name.replace("models/", "")
                        filtered_models.append(model_name)

            return sorted(filtered_models)
        except Exception as e:
            print(f"Error listing Google models: {e}")
            raise

    async def set_model(self, model: str):
        """Sets the model to be used for text generation."""
        self.model = model
        self._update_llm_instance()

    async def set_temperature(self, temperature: float):
        """Sets the temperature for text generation."""
        self.temperature = temperature
        self._update_llm_instance()

    async def validate_credentials(self) -> None:
        """
        Validates the Google API credentials by making a test API call.

        Raises:
            Exception: If the API key is invalid or another API error occurs.
        """
        try:
            async with genai.Client(api_key=self.api_key).aio as aclient:
                await aclient.models.list()
        except Exception as e:
            raise e
