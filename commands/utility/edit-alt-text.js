const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edit-alt-text")
        .setDescription("Edit alt text for the most recent image")
        .addStringOption((option) =>
            option
                .setName("text-replacement")
                .setDescription("Replaces the most recent Alt text provided")
                .setRequired(true)
        ),
    async execute(interaction, args) {
        const replacement = interaction.options.getString("text-replacement");
        const mostRecent = args["recentResponse"];
        await mostRecent.edit(`Alt: ${replacement}`);
        await interaction.reply({
            content: `Alt text has been replaced with: ${replacement}`,
            ephemeral: true,
        });
        return {'editflag': true}
    },
};
