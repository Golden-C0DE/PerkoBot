const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 6, 
	data: new SlashCommandBuilder().setName('ping').setDescription('Zobacz ping bota'),
	async execute(interaction) {
		const sent = await interaction.reply({content: "Pong!", fetchReply:true });
		const pingTime = sent.createdTimestamp - interaction.createdTimestamp;

		await interaction.editReply(`Pong! :ping_pong:**${pingTime}ms**`);

	},
};