const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('rship').setDescription('random ship'),
	async execute(interaction) {

        const members = interaction.guild.members.cache
        .filter(member => !member.user.bot)
        .map(member => member.user);

        if (members.length < 2)
        {
            await interaction.reply({content: "Za mało użytkowników do wylosowania.", ephemeral: true});
            return;
        } 

        const shuffled = members.sort(() => Math.random() - 0.5);
        const [user1, user2] = shuffled.slice(0, 2);

		const path = require('path');
		const iconPath = path.join(__dirname, '../../../assets/icon.png');
		const file = new AttachmentBuilder(iconPath);

		const Embed = new EmbedBuilder()
		.setColor(0xff0073)
		.setDescription(`### Miłość rośnie wokół nas ${user1} ❤️ ${user2}`)
		.setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

		await interaction.reply({embeds: [Embed], files: [file]});
	},
};