import discord
import os
import logging
from dotenv import load_dotenv


class AltTextBot(discord.Client):
	async def on_ready(self):
		print(f'Connected to Discord API as {self.user}\n')
		for guild in client.guilds:
			print(f'{self.user} is connected to {guild.name}')

	async def on_message(self, message: discord.Message):
		# ignore messages sent by the bot
		if message.author == client.user: return

		# sends same message back in the same channel
		channel = message.channel
		await channel.send(f'{message.author} has said: {message.content}')


# create a bot client with the right permissions
intents = discord.Intents.default()
intents.message_content = True
client = AltTextBot(intents=intents)

# setting up a debug log file
handler = logging.FileHandler(filename='altTextBot.log', encoding='utf-8', mode='w')

# grab bot key
load_dotenv()
token = os.getenv('TOKEN')

# run bot
client.run(token=token, log_handler=handler, log_level=logging.DEBUG)