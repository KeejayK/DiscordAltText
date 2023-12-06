const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('Alti-auto')
		.setDescription('Let Alti respond to every image'),
	async execute(interaction) {
		await interaction.reply('Working...');
		// something here 
	},
};