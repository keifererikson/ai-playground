from sqlalchemy import Column, Integer, String, Float
from .database import Base


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, nullable=False, default="openai")
    model = Column(String, nullable=False, default="gpt-5-nano")
    temperature = Column(Float, nullable=False, default=0.7)

    def __repr__(self):
        return f"<Settings(provider={self.provider}, model={self.model}, temperature={self.temperature})>"
