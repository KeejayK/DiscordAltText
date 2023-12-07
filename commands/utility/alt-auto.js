const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("alt-auto")
        .setDescription("Toggle to enable Alti to generate alt text for every image")
        .addBooleanOption((option) =>
            option
                .setName("enable")
                .setDescription(
                    "Enable auto replies"
                )
                .setRequired(true)
        ),
    async execute(interaction, args) {
        let enable = interaction.options.getBoolean("enable");
        let response = enable
            ? "Auto generate enabled! Alt text will be provided for every image sent"
            : "Auto generate disabled. Alt text will only be provide if prompted with the /alt command";
        await interaction.reply({ content: response, ephemeral: true });
        return {'enable': enable} 
    },
};
