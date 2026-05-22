const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits, ChannelType  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('say')
    .setDescription('Vox populi, Vox Dei')
    .addStringOption((option) => option.setName('tekst').setDescription('co chcesz żeby napisał bot').setRequired(true))
    .addChannelOption((option) => option.setName('kanał').setDescription('gdzie chcesz żeby to napisał').addChannelTypes(ChannelType.GuildText))
    .addBooleanOption((option) => option.setName('embed').setDescription('Czy wiadomość ma być w Embedzie'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        const message = interaction.options.getString('tekst');
        const channel = interaction.options.getChannel('kanał') ?? interaction.channel;

        if(!interaction.options.getBoolean('embed'))
        {
            await interaction.reply({ content: `Wiadomość wysłana na ${channel}`, ephemeral: true });
            await channel.send({ content: message });
            return;
        }

        const path = require('path');
        const iconPath = path.join(__dirname, '../../../assets/icon.png');
        const file = new AttachmentBuilder(iconPath);
        
        const Embed = new EmbedBuilder()
        .setColor(0x37e654)
        .setDescription(`### ${message}`)
        .setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

        await interaction.reply({ content: `Wiadomość wysłana na ${channel}`, ephemeral: true });
		await channel.send({ embeds: [Embed], files: [file] });
	},
};