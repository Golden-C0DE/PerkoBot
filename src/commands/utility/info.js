const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('info').setDescription('Informacje o bocie'),
	async execute(interaction) {

		const path = require('path');
		const iconPath = path.join(__dirname, '../../../assets/icon.png');
		const file = new AttachmentBuilder(iconPath);

		const Embed = new EmbedBuilder()
		.setColor(0x434545)
        .setTitle("PerkoBot INFO")
		.setDescription("### Siema, robiłem tego bota około 7 miesięcy, głównie przez moje lenistwo.\n### Bot specialnie zrobiony pod Serwer mperko i nikogo innego.\n### Mam nadzieję, że ludzie będą enjoyować. Dałem dużo easter eggów.\n### Dla technicznych świrków link do kodu na GitHub: https://github.com/Golden-C0DE/PerkoBot\n### Pozdro z wyspy cwela")
		.setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

		await interaction.reply({embeds: [Embed], files: [file]});
	},
};