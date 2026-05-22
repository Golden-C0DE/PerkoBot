const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('żart').setDescription('żart'),
	async execute(interaction) {

		const path = require('path');
		const iconPath = path.join(__dirname, '../../../assets/icon.png');
		const file = new AttachmentBuilder(iconPath);

		const Embed = new EmbedBuilder()
		.setColor(0x000043)
		.setDescription("### Dowcip, żart, kawał - krótka forma humorystyczna, służąca rozśmieszeniu słuchacza. Najczęstszą formą rozpowszechniania dowcipu jest przekaz słowny.\n(https://pl.wikipedia.org/wiki/Dowcip)")
		.setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

		await interaction.reply({embeds: [Embed], files: [file]});
	},
};