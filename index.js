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
var recentImages = '';
var voteTimer = 10000;
var voteOverride = false;


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

/**
 * Give a point to the user who voted for the caption
 * 
 * @param {Message<boolean>} message 
 */
const awardPointToUser = (interaction) => {
    let guild_id = interaction.guild.id;
    let member_id = interaction.user.id;
    database.ref(`${guild_id}/${member_id}`).once('value', snapshot => {
        let member_object;
        if (snapshot.exists()) {
            points = snapshot.val().points;
        } else {
            points = 0;
            database.ref(`${guild_id}/${member_id}`).set({ username: member.user.username, points: points });
        }
        
        // Increase the count by 1
        points++;
        
        // Update the count
        database.ref(`${guild_id}/${member_id}/points`).set(points);
    });
}

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    
    // Loop through every guild and create a new key for it. commenting out because i already ran this once, so the info is in the firebase
    // client.guilds.cache.forEach(async guild => {
    //     let member_object = {};
    //     await guild.members.fetch().then(members => {
    //         members.forEach(member => {
    //             member_object[member.id] = {
    //                 username: member.user.username,
    //                 points: 0
    //             };
    //         });
    //     }).catch(console.error);
    //     database.ref(guild.id).set(member_object);
    // });
});

// testing leaderboard/database. upon joining a new server, create a new key for it
client.on('guildCreate', async guild => {
    let member_object = {};
    await guild.members.fetch().then(members => {
        members.forEach(member => {
            member_object[member.id] = {
                username: member.user.username,
                points: 0
            };
        });
    }).catch(console.error);
    database.ref(guild.id).set(member_object);
});

// On every message
client.on("messageCreate", async (message) => {
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
            recentImages = value.url
        }
	});
	// console.log(images);

    // Create the button reactions that we'll append to the
    // "vote on these captions" message the bot sends.
    var voteOpenAi = new ButtonBuilder()
        .setCustomId('vote-openai')
        .setLabel('1️⃣ 0')
        .setStyle(ButtonStyle.Secondary);

    var voteAzure = new ButtonBuilder()
        .setCustomId('vote-azure')
        .setLabel('2️⃣ 0')
        .setStyle(ButtonStyle.Secondary);

    var row = new ActionRowBuilder()
        .addComponents(voteOpenAi, voteAzure);

	// Only generate and reply with images if auto reply is enabled
	if (enableAutoReply & hasImage) {
		// call ai get_text_from_image_openai and get_text_from_image_azure from ai.py
        const openaiAltObj = await openaiApiCall(recentImageURL);
        const azureAltObj = await azureVisionApiCall(recentImageURL);
        const reply = await message.reply({
            content: `:one: ${openaiAltObj}\n\n:two: ${azureAltObj}\n\nPlease vote :one: or :two: for better caption`,
            components: [row],
        });
        // message.channel.send({ content: `${message.author} Has sent: ${message.content}`, files: [attachment] });
        // message.delete()

        // Use a 
        var votes_openai = 0;
        var votes_azure = 0;

        // Filter checks to see if the button that was clicked or
        // interacted with is the same as the message that was sent
        // (this ensures that we're only listening for interactions with
        // buttons that are part of the message the discord bot sent).
        const filter = (i) => i.user.id === message.author.id;
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: voteTimer,
            max: 5,
            filter: filter,
        });

        collector.on('collect', (interaction) => {
            if (interaction.customId === 'vote-openai') {
                votes_openai += 1;
                interaction.deferUpdate();
                voteOpenAi.setLabel(`1️⃣ ${votes_openai}`);
            }

            if (interaction.customId === 'vote-azure') {
                votes_azure += 1;
                interaction.deferUpdate();
                voteAzure.setLabel(`2️⃣ ${votes_azure}`);
            }

            awardPointToUser(interaction);
            row = new ActionRowBuilder()
                .addComponents(voteOpenAi, voteAzure);

            reply.edit({
                content: `:one: ${openaiAltObj}\n\n:two: ${azureAltObj}\n\nPlease vote :one: or :two: for better caption`,
                components: [row]
            });
            return;
        });

        collector.on('end', () => {
            voteOpenAi.setDisabled(true);
            voteAzure.setDisabled(true);

            if (voteOverride) {
                const altContent = votes_openai >= votes_azure ? openaiAltObj : azureAltObj;
                reply.edit({
                    content: `Alt: ${altContent}`,
                    components: []
                });
            } else {
                const altContent = votes_openai >= votes_azure ? `:one: ${openaiAltObj}\n\n:two: ${azureAltObj}` : `:one: ${azureAltObj}\n\n:two: ${openaiAltObj}`;
                reply.edit({
                    content: `Alt:\n\n${altContent}`,
                    components: []
                });
            }
        });
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
        if ('time' in response) {
            voteTimer = response['time']
        }
        if ('override' in response) {
            voteOverride = response['override']
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