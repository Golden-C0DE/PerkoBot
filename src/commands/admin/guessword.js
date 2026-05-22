const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits, ChannelType  } = require('discord.js');

module.exports = {
	cooldown: 60, 
	data: new SlashCommandBuilder()
    .setName('newgame')
    .setDescription('Stwórz grę polegającą na tym, żeby użytkownicy próbowali odgadnąć słowo, które wymyślisz')
    .addStringOption((option) => option.setName('słowo').setDescription('tajne słowo do odgadnięcia').setRequired(true))
    .addIntegerOption((option) => option.setName('czas').setDescription('Podaj ile mają na to czasu w MINUTACH').setRequired(true).setMinValue(1).setMaxValue(180))
    .addStringOption((option) => option.setName('podpowiedź').setDescription('podpowiedź, którą mogą dostać'))
    .addChannelOption((option) => option.setName('kanał').setDescription('gdzie chcesz żeby odbyła się gra').addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        const time = interaction.options.getInteger('czas');
        const now = Math.floor(Date.now() / 1000);
        const duration = 60 * time;
        const expiredTimestamp = now + duration;
        const secretWord = interaction.options.getString('słowo');
        const hint = interaction.options.getString('podpowiedź') ?? "brak";

        const member = interaction.guild.members.cache.get(interaction.user.id);

        const channel = interaction.options.getChannel('kanał') ?? interaction.channel;

        if(!channel || !channel.isTextBased()) 
        {
            return interaction.reply({ content: "Nie mogę stworzyć gry na tym kanale.", ephemeral: true });
        }

        const path = require('path');
        const iconPath = path.join(__dirname, '../../../assets/icon.png');
        const file = new AttachmentBuilder(iconPath);
        
        const Embed = new EmbedBuilder()
        .setTitle("🎲 GUESS WORD THE GAME 🎮")
        .setAuthor({name: member.displayName, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setColor(0x17e625)
        .setDescription(`### Spróbujcie zgadnąć sekretne słowo 🤫\nAby zgadnąc słowo wystarczy je napisać. Słowo musi występować osobno w zdaniu np. "to jest **hasło**!"\n### Koniec czasu: <t:${expiredTimestamp}:R>\n### Podpowiedź: ${hint}`)
        .setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

        await channel.send({ embeds: [Embed], files: [file] });
        await interaction.reply({ content: 'The game begins!', ephemeral: true });


        const filter = (m) => {
            if (m.author.bot) return false;

                const regex = new RegExp(`\\b${secretWord}\\b`, 'i');
                return regex.test(m.content);
        };

        const collector = channel.createMessageCollector({
            filter,
            max: 1,
            time: time * 60_000
        });

        collector.on('collect', async m => {
            await m.reply(`🎉 Brawo ${m.author}, zgadłeś/aś słowo! **${secretWord}**`);
            collector.stop();
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await channel.send(`⏳ Czas minął! Nikt nie zgadł słowa. Tajemnicze słowo to **${secretWord}**.`);
            }
        });

	},
};