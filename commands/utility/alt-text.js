const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType, // TODO: Remove any of these if not used
 } = require("discord.js");
const { openaiApiCall, azureVisionApiCall } = require("../../ai.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("alt-text")
        .setDescription("Generate alt text for the most recent image")
        // CHOOSE BETWEEN IMAGES
        ,
    async execute(interaction, args) {
        let mostRecent =  args['recentImages']
        await interaction.deferReply();
        const openaiAltObj = await openaiApiCall(mostRecent);
        const azureAltObj = await azureVisionApiCall(mostRecent);
        interaction.editReply(`:one: ${openaiAltObj}\n\n:two: ${azureAltObj}\n\n`)
    },
};
