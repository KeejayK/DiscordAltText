const { SlashCommandBuilder } = require("discord.js");
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
        // Call AI function
        const openaiAltObj = await openaiApiCall(mostRecent);
        const azureAltObj = await azureVisionApiCall(mostRecent);
        console.log('generated alt text:', openaiAltObj, azureAltObj);
        // await interaction.reply({
        //     content: `:one: ${openaiAltObj}\n\n:two: ${azureAltObj}\n\nPlease vote :one: or :two: for better caption`,
        // });
        interaction.editReply(`:one: ${openaiAltObj}\n\n:two: ${azureAltObj}\n\nPlease vote :one: or :two: for better caption`)
    },
};
