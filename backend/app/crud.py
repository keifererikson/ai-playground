from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models


async def get_settings(db: AsyncSession):
    """Fetch the current settings from the database."""
    result = await db.execute(select(models.Settings).where(models.Settings.id == 1))
    return result.scalars().first()


async def update_settings(db: AsyncSession, settings_data: dict):
    """Update the settings in the database."""
    db_settings = await get_settings(db)
    if not db_settings:
        return None

    for key, value in settings_data.items():
        if value is not None:
            setattr(db_settings, key, value)

    await db.commit()
    await db.refresh(db_settings)
    return db_settings
