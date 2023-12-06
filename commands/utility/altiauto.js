const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("altiauto")
        .setDescription("Let Alti respond to every image")
        .addBooleanOption((option) =>
            option
                .setName("enable")
                .setDescription(
                    "Whether or not Alti should respond to every image"
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        let enable = interaction.options.getBoolean("enable");
        let response = enable
            ? "Auto generate enabled! Alti will provide alt text for every image sent"
            : "Auto generate disabled. Alti will only provide alt text if prompted with the /alt command";
        await interaction.reply({ content: response, ephemeral: true });
        return {'enable': enable} 
    },
};
