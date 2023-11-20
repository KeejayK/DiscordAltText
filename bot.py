import discord
import os
import logging
from dotenv import load_dotenv
from ai import get_text_from_image


# bot instance
class AltTextBot(discord.Client):
    async def on_ready(self):
        print(f"Connected to Discord API as {self.user}")
        for guild in client.guilds:
            print(f"{self.user} is connected to {guild.name}")

    async def on_message(self, message: discord.Message):
        # ignore messages sent by the bot
        if message.author == client.user:
            return

        print(message.attachments)

        # sends same image
        await message.channel.send(content=message.attachments[0].url)



def run():
    global client
    intents = discord.Intents.default()
    intents.message_content = True
    client = AltTextBot(intents=intents)

    # setting up a debug log file
    handler = logging.FileHandler(filename="altTextBot.log", encoding="utf-8", mode="w")

    # grab bot key
    load_dotenv()
    token = os.getenv("DISCORD_TOKEN")

    # setting up a debug log file
    handler = logging.FileHandler(filename="altTextBot.log", encoding="utf-8", mode="w")

    # run bot
    client.run(token=token, log_handler=handler, log_level=logging.DEBUG)
