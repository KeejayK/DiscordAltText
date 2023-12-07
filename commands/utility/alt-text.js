const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("alt-text")
        .setDescription("Generate alt text for the most recent image")
        // CHOOSE BETWEEN IMAGES
        ,
    async execute(interaction, args) {
        let mostRecent =  args.pop()
        // Call AI function
        await interaction.reply({ content: mostRecent, ephemeral: false });
    },
};
