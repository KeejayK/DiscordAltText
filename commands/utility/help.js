const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Lists all available commands"),
    async execute(interaction) {
		let helpEmbed = new EmbedBuilder()
			.setTitle('Commands')
		const commandFiles = fs
			.readdirSync('./commands/utility')
			.filter((file) => file.endsWith(".js"));
		for (const file of commandFiles) {
			const command = require(`./${file}`);
			helpEmbed.addFields({ name: `/${command.data.name}`, value: command.data.description})
		}
        return interaction.reply({
            embeds: [helpEmbed],
            ephemeral: true,
        });
    },
};
