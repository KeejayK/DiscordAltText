<p align="center"><img width="30%" src="https://alti-9e674.web.app/img/alti_transparent.png"></p>
<h1 align="center">
	<a href="https://alti-9e674.web.app">
		Alti
	</a>
</h1>
<font size="1">
	<h2 align="center" font-size:1em> A <a href="https://alti-9e674.web.app">bot</a> that automatically generates alt text for any image that gets uploaded onto Discord.</h2>
</font>

---

### Why
Currently, Discord allows for any user to add alt text manually to images they upload onto the platform.

However:
* Many users don't know what alt text is
* Many users are unwilling to add alt text 
* Once an image with alt text is sent, alt text cannot be edited

Due to these issues, Discord remains inaccessible for many blind and low vision users who rely on screen readers. 

### Features
Alti replies to every image sent in a Discord server with two different alt text options from different AI models. Once images are sent, members have the ability to vote on which alt text they like better or manually override generated text. Contributions are also tracked through a leaderboard.

Image alt text is generated by integrating with two AI models:
- GPT-4: Using the [OpenAI Node API Library](https://www.npmjs.com/package/openai)
- Azure AI Vision: Using the [Azure Computer Vision Library](https://www.npmjs.com/package/@azure/cognitiveservices-computervision)

Avaiable commands on the bot:
`/alt-auto`: Enables or disables automatic alt text generation on every image
`/alt-text`: Prompts Alti to generate alt text for most recent image
`/edit-alt-text`: Write over generated alt text
`/check-leaderboards`: Displays a leaderboard containing your top members who've contributed to alt text generation
`/vote-override`: Override the alt text for the most recent image to the most upvoted alt text
`/vote-timer`: Edit the time between votes in seconds
`/help`: Lists all available commands




### Config
Tokens and keys have been split into 3 files
- Discord related keys in `config.json`
```
{
  "token": "",
  "clientId": "",
}
```

- Google auth tokens and ids in `serviceAccountKey.json`
```
{
  "type": "service_account",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_id": "",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "",
  "universe_domain": "googleapis.com"
}
```

- OpenAI, Azure, and Firebase related keys in `.env`
```
{
  OPENAI_TOKEN=""
  VISION_ENDPOINT=""
  VISION_KEY=""
  FB_API_KEY=""
  FB_AUTH_DOMAIN=""
  FB_DATABASE_URL=""
  FB_PROJECT_ID=""
  FB_STORAGE_BUCKET=""
  FB_SENDER_ID=""
  FB_APP_ID=""
}
```

### Dependencies
This project was developed using the following packages:
- [OpenAI Node API Library](https://www.npmjs.com/package/openai)
- [Azure Computer Vision SDK](https://www.npmjs.com/package/@azure/cognitiveservices-computervision)
- [Discord js](https://www.npmjs.com/package/discord.js)
- [Firebase](https://www.npmjs.com/package/firebase)
- [Firebase Admin SDK](https://www.npmjs.com/package/firebase-admin)



---

Developed by [Keejay Kim](https://github.com/KeejayK), [Lucas Lee](https://github.com/LucasL53), [Ashley Mochizuki](https://github.com/azukiplus), [Ben Kosa](https://github.com/Greatroot)

