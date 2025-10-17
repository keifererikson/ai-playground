import os
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("WARNING: DATABASE_URL is not set. Defaulting to local ./sqlite_dev.db")
    DATABASE_URL = "sqlite+aiosqlite:///./sqlite_dev.db"

engine = create_async_engine(DATABASE_URL, echo=True, pool_recycle=1800)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

Base = declarative_base()


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
