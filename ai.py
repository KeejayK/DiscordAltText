import os
import requests
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

open_ai_token = os.getenv("OPENAI_TOKEN")
client = AsyncOpenAI(api_key=open_ai_token)

# https://platform.openai.com/docs/api-reference/chat/create?lang=python
async def get_text_from_image(image_url):
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": image_url,
                    },
                ],
            }
        ],
        max_tokens=300,
    )
    print(response.choices[0])


