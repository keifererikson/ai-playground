from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Float
from .database import Base


class Settings(Base):
    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    provider: Mapped[str] = mapped_column(String, nullable=False, default="openai")
    model: Mapped[str] = mapped_column(String, nullable=False, default="gpt-5-nano")
    temperature: Mapped[float] = mapped_column(Float, nullable=False, default=0.7)

    def __repr__(self):
        return f"<Settings(provider={self.provider}, model={self.model}, temperature={self.temperature})>"
