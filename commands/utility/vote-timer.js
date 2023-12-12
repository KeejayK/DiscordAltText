const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote-timer")
        .setDescription("Edit the time between votes in seconds")
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription(
                    "Time between votes in seconds"
                )
                .setRequired(true)
        ),
    async execute(interaction, args) {
        let time = interaction.options.getString("time");

        let time_int = parseInt(time) * 1000; // convert to seconds to match (10000 = 10 seconds)

        let response = `Time between votes set to ${time} seconds`;
        await interaction.reply({ content: response, ephemeral: false });
        return {'time': time_int} 
    },
};
