// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const database = require('./firebase.js');
const { openaiApiCall, azureVisionApiCall } = require("./ai.js");
const { 
    Client, 
    Collection, 
    Events, 
    GatewayIntentBits, 
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType, // TODO: Remove any of these if not used
 } = require("discord.js");
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
    
    // Loop through every guild and create a new key for it. commenting out because i already ran this once, so the info is in the firebase
    // client.guilds.cache.forEach(guild => {
    //     let member_object = {};
    //     guild.members.cache.forEach(member => {
    //         member_object[member.id] = 0;
    //     });
    //     database.ref(guild.id).set(member_object);
    // });
});

// testing leaderboard/database. upon joining a new server, create a new key for it
client.on('guildCreate', guild => {
    let member_object = {};
    guild.members.cache.forEach(member => {
        member_object[member.id] = 0;
    });
    database.ref(guild.id).set(member_object);
});

// On every message
client.on("messageCreate", async (message) => {
    // console.log(message);
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
	// console.log(images);

	// Only generate and reply with images if auto reply is enabled
	if (enableAutoReply & hasImage) {
		// call ai get_text_from_image_openai and get_text_from_image_azure from ai.py
        const openaiAltObj = await openaiApiCall(recentImageURL);
        const azureAltObj = await azureVisionApiCall(recentImageURL);
        console.log(openaiAltObj, azureAltObj);
        const reply = await message.reply({
            content: `:one: ${openaiAltObj}\n\n:two: ${azureAltObj}\n\nPlease vote :one: or :two: for better caption`,
            fetchReply: true,
        });
        // message.channel.send({ content: `${message.author} Has sent: ${message.content}`, files: [attachment] });
        // message.delete()

        reply.react("👍");

        // Filter checks to see if the button that was clicked or
        // interacted with is the same as the message that was sent
        // (this ensures that we're only listening for interactions with
        // buttons that are part of the message the discord bot sent).
        const vote_openai_filter = (reaction, user) => {
            return reaction.emoji.name === '👍' && user.id === message.author.id;
        }
        const vote_azure_filter = (reaction, user) => {
            return reaction.emoji.name === ':two:' && user.id === message.author.id;
        }
        const collector = reply.createReactionCollector({
            filter: vote_openai_filter,
            time: 10000,
            max: 5,
        });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

            // if (reaction === ':two:') {
            //     console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            //     // interaction.reply('You voted for the Azure caption!');
            //     return;
            // }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
            collected.forEach((value, key) => {
                console.log(`Key: ${key}, Value: ${value}`);
            })

            // reply.edit({
            //     content: `:one: ${openaiAltObj}\n\n:two: ${azureAltObj}`,
            //     components: [button]
            // })
        });
	}

    // 

    // testing database. increment count of each user by 1 when they send a message.
    let guild_id = message.guild.id;
    let member_id = message.author.id;
    database.ref(`${guild_id}/${member_id}`).once('value', snapshot => {
        let member_object;
        if (snapshot.exists()) {
            member_object = snapshot.val();
        } else {
            member_object = 0;
            database.ref(`${guild_id}/${member_id}`).set(member_object);
        }

        // Increase the count by 1
        member_object += 1;

        // Update the count
        database.ref(`${guild_id}/${member_id}`).set(member_object);
    });

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