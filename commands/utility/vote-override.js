const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote-override")
        .setDescription("Override the alt text for the most recent image to the most upvoted alt text")
        .addBooleanOption((option) =>
            option
                .setName("override")
                .setDescription(
                    "Override the alt text for the most recent image to the most upvoted alt text"
                )
                .setRequired(true)
        ),
    async execute(interaction, args) {
        let override = interaction.options.getBoolean("override");
        let response = override
            ? "Vote override enabled! Alt text will be changed to the most upvoted alt text"
            : "Vote override disabled. Alt text will not be changed to the most upvoted alt text";
        await interaction.reply({ content: response, ephemeral: false });
        return {'override': override} 
    },
};
