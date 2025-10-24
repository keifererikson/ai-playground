import os
import httpx
from fastapi import Request, HTTPException, status

HCAPTCHA_SECRET_KEY = os.getenv("HCAPTCHA_SECRET_KEY")
HCAPTCHA_VERIFY_URL = "https://hcaptcha.com/siteverify"


async def verify_captcha(request: Request):
    """Verify hCaptcha token from the incoming request."""
    captcha_token = request.headers.get("X-Captcha-Token")

    if not HCAPTCHA_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Captcha secret key is not configured.",
        )

    if not captcha_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Captcha token is missing."
        )

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                HCAPTCHA_VERIFY_URL,
                data={"secret": HCAPTCHA_SECRET_KEY, "response": captcha_token},
            )
            response.raise_for_status()
            result = response.json()
            if not result.get("success"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Captcha verification failed. Please try again.",
                )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Error during CAPTCHA verification: {str(e)}",
            )
