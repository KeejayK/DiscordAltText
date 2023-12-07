import os
import asyncio
from ai import get_text_from_image_openai
from ai import get_text_from_image_azure

async def try_get_text_from_image_openai():
    image_url = "https://media.discordapp.net/attachments/1178516600824012834/1179517086205223003/burg.png?width=1999&height=1333"
    context = {}  # Optional context data
    
    # Call the function and get the result
    result = await get_text_from_image_openai(image_url, context)

async def try_get_text_from_image_azure():
    image_url = "https://media.discordapp.net/attachments/1178516600824012834/1179517086205223003/burg.png?width=1999&height=1333"
    
    # Call the function and get the result
    result = await get_text_from_image_azure(image_url)

# Call the function to try it out
asyncio.run(try_get_text_from_image_openai())
# asyncio.run(try_get_text_from_image_azure())