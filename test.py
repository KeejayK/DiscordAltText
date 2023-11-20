from bot import *
from dotenv import load_dotenv
import requests

load_dotenv()
discord_response = requests.get("https://discordstatus.com/api/v2/summary.json")
openai_response = requests.get("https://status.openai.com/api/v2/summary.json")


def test_discord_key():
    token = os.getenv("DISCORD_TOKEN")
    assert token is not None, "Discord API key not found"


def test_openai_key():
    token = os.getenv("OPENAI_TOKEN")
    assert token is not None, "Open AI API key not found"


def test_discord_status_code():
    code = discord_response.status_code
    assert code == 200


def test_openai_status_code():
    code = openai_response.status_code
    assert code == 200


def test_discord_status():
    body = discord_response.json()
    api_status = body["components"][0]["status"]
    assert api_status == "operational"


def test_openai_status():
    body = openai_response.json()
    api_status = body["components"][0]["status"]
    assert api_status == "operational"
