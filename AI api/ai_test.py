import os
import asyncio
from ai import get_text_from_image_openai
from ai import get_text_from_image_azure

async def try_get_text_from_image_openai():
    image_url = "https://cdn.discordapp.com/attachments/1178516600824012834/1181396109646630942/6011ac2b6dfbe10018e0049f.webp?ex=6580e7dd&is=656e72dd&hm=59829e3fc9cec79707cdf9681ae5867830f8a8ccf19f0aa470b54a2e2cadab27&"
    context = {}  # Optional context data
    
    # Call the function and get the result
    result = await get_text_from_image_openai(image_url, context)

async def try_get_text_from_image_azure():
    image_url = "https://images.foxtv.com/static.fox5ny.com/www.fox5ny.com/content/uploads/2021/07/764/432/AP_Mel_Elam_Floki_1.jpg?ve=1&tl=1"
    
    # Call the function and get the result
    result = await get_text_from_image_azure(image_url)

# Call the function to try it out
asyncio.run(try_get_text_from_image_openai())
# asyncio.run(try_get_text_from_image_azure())