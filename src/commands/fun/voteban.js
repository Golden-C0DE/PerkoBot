const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ChannelType } = require('discord.js');

module.exports = {
	cooldown: 240,
	data: new SlashCommandBuilder()
    .setName('voteban')
    .setDescription('Demokracja to kult szakali wyznawany przez osły')
    .addUserOption((option) => option.setName('kto').setDescription('cwel do wygłosowania').setRequired(true))
    .addIntegerOption((option) =>
		option
			.setName('czas')
			.setDescription('Czas timeoutu')
			.addChoices(
                { name: '2 min (5 głosów)', value: 120_000 },
                { name: '6 min 7s (6 głosów)', value: 367_000 },
                { name: '10 min (9 głosów)', value: 600_000 },
				{ name: '21min 37s (10 głosów)', value: 1_297_000 },
			).setRequired(true))
    .addChannelOption((option) => option.setName('kanał').setDescription('gdzie chcesz żeby odbyło się głosowanie').addChannelTypes(ChannelType.GuildText)),
	async execute(interaction) {
        const time = interaction.options.getInteger('czas');
        const member = interaction.options.getMember('kto');

        const channel = interaction.options.getChannel('kanał') ?? interaction.channel;

        let neededVotes;

        switch(time)
        {
            case 120_000:
                neededVotes = 5;
                break;
            case 367_000:
                neededVotes = 6;
                break;
            case 600_000:
                neededVotes = 9;
                break;
            case 1_297_000:
                neededVotes = 10;
                break;
            default:
                neededVotes = 5;
                break;
        }

        if(!channel || !channel.isTextBased()) 
        {
            return interaction.reply({ content: "Nie mogę stworzyć głosowania na tym kanale.", ephemeral: true });
        }

        const path = require('path');
        const iconPath = path.join(__dirname, '../../../assets/icon.png');
        const file = new AttachmentBuilder(iconPath);
        
        const Embed = new EmbedBuilder()
        .setTitle(":pirate_flag: VOTEBAN :man_judge:")
        .setAuthor({name: member.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true })})
        .setColor(0x000000)
        .setDescription(`### Powstał voteban, żeby wygłosować ${member}\n### Wystarczy napisać\n\`\`\`voteban ${member.displayName}\`\`\`\n### Potrzebujecie ${neededVotes} głosów\n### Macie na to 3 minuty\nPS. każdy ma jeden głos 😉`)
        .setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

        await interaction.reply({ embeds: [Embed], files: [file] });

        let votes = 0;
        const usedUsers = new Set();


        const filter = (m) => {
    
            const escapedName = member.displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`^voteban\\s+${escapedName}$`, 'i');

            return regex.test(m.content.trim());
        };

        const collector = channel.createMessageCollector({
            filter,
            max: neededVotes,
            time: 180_000
        });

        collector.on('collect', async m => {
            const userId = m.author.id;
            if (usedUsers.has(userId)) return

            votes++;
            usedUsers.add(userId);
            await m.reply(`voteban ${member} **${votes}/${neededVotes}**`);

            if(neededVotes === votes) collector.stop();
        });

        collector.on('end', async collected => {
            if (collected.size === 0)
            {
                await channel.send("Koniec czasu na głosowanie\nhttps://tenor.com/view/tik-tok-meme-waiting-wait-time-gif-16450082290173148616");
            }
            else 
            {
                await member.timeout(time, 'demokracja')
                .then(async () => await channel.send(`${member} został wygłosowany 🎉`))
                .catch(async () => await channel.send("nie udało się dać timeouta, dzisiaj demokracja przegrała :wilted_rose:"))
            }
        });

	},
};