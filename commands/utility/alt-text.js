const { SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { openaiApiCall, azureVisionApiCall } = require("../../ai.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("alt-text")
        .setDescription("Generate alt text for the most recent image")
        // CHOOSE BETWEEN IMAGES
        ,
    async execute(interaction, args) {
        let mostRecent =  args
        await interaction.deferReply();

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

        // Call AI function
        const openaiAltObj = await openaiApiCall(mostRecent);
        const azureAltObj = await azureVisionApiCall(mostRecent);
        const reply = await interaction.reply({
            content: `:one: ${openaiAltObj}\n\n:two: ${azureAltObj}\n\nPlease vote :one: or :two: for better caption`,
            components: [row],
        });
        var votes_openai = 0;
        var votes_azure = 0;

        // Filter checks to see if the button that was clicked or
        // interacted with is the same as the message that was sent
        // (this ensures that we're only listening for interactions with
        // buttons that are part of the message the discord bot sent).
        const filter = (i) => i.user.id === message.author.id;
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 10000,
            max:5,
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

            if (votes_openai >= votes_azure) {
                reply.edit({
                    content: `Alt: ${openaiAltObj}`,
                    components: []
                });
            } else {
                reply.edit({
                    content: `Alt: ${azureAltObj}`,
                    components: []
                })
            }
        });
        
    },
};
