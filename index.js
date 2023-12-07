// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const { openaiApiCall, azureVisionApiCall } = require("./ai.js");
const { Client, Collection, Events, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const { token } = require("./config.json");


var enableAutoReply = true;
var recentImages = [];


// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Command handling
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// On every message
client.on("messageCreate", async (message) => {
    console.log(message);
	// Ignore messages sent by self
    if (message.author.bot) return;
	let images = [];
    let recentImageURL = "";
    let hasImage = false;
	message.attachments.forEach((value) => {
        if (value.width && value.height) {
            images.push(value.url);
            recentImageURL = value.url;
            hasImage = true;
        }
	});
	console.log(images);

	// Only generate and reply with images if auto reply is enabled
	if (enableAutoReply & hasImage) {
		// call ai get_text_from_image_openai and get_text_from_image_azure from ai.py
        const openaiAltObj = openaiApiCall(recentImageURL);
        const azureAltObj = azureVisionApiCall(recentImageURL);
        await message.reply({ content: `ALT TEXT: \n:one: ${openaiAltObj[content]}\n\n:two: ${azureAltObj[content   ]}\n\nPlease vote :one: or :two: for better caption` });
        // message.channel.send({ content: `${message.author} Has sent: ${message.content}`, files: [attachment] });
        // message.delete()
	}
});

// Error handling
process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
});

// Some more error handling
client.on("error", (error) => {
    console.error("Unhandled promise rejection:", error);
});

// Listener for the interactionCreate event
client.on(Events.InteractionCreate, async (interaction) => {
    // Ignore interactions that aren't slash commands
    if (!interaction.isChatInputCommand()) return;

    // Identify Command
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        );
        return;
    }

    // Command Logic
    try {
		args = recentImages
        response = await command.execute(interaction, args);
		if (typeof response === 'undefined') return
		if ('enable' in response ) {
			enableAutoReply = response['enable']
		}
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
});

// Log in to Discord with your client's token
client.login(token);
