const { SlashCommandBuilder, PermissionFlagsBits, ChannelType  } = require('discord.js');

module.exports = {
    cooldown: 6, 
	data: new SlashCommandBuilder().setName('fake')
    .setDescription('Podszyj się pod kogoś')
    .addUserOption((option) => option.setName('kto').setDescription('osoba za którą chcesz się podszyć').setRequired(true))
    .addStringOption((option) => option.setName('tekst').setDescription('co chcesz żeby napisał bot').setRequired(true))
    .addChannelOption((option) => option.setName('kanał').setDescription('gdzie chcesz żeby to napisał').addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        const user = interaction.options.getUser('kto')
        const message = interaction.options.getString('tekst');
        const channel = interaction.options.getChannel('kanał') ?? interaction.channel;
        const member = interaction.guild.members.cache.get(user.id);

        await channel.createWebhook({
            name: member.displayName,
            avatar: user.displayAvatarURL({ dynamic: true }),
        })
        .then((webhook) => {
            webhook.send({ content: message })
            setTimeout(() => {
                webhook.delete();
            }, 3_000)
        })
        .catch(console.error);

        await interaction.reply({ content: `Fałszywa wiadomość wysłana na ${channel}`, ephemeral: true });
	},
};