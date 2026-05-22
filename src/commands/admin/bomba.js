const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, AttachmentBuilder  } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState, VoiceConnectionStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const path = require('path');

module.exports = {
    cooldown: 60,
	data: new SlashCommandBuilder()
    .setName('bomba')
    .setDescription('Bomba, zakończ to wszystko w wybuchowy sposób')
    .addChannelOption((option) => option.setName('głosowy').setDescription('gdzie chcesz żeby był komunikat głosowy').addChannelTypes(ChannelType.GuildVoice))
    .addChannelOption((option) => option.setName('kanał').setDescription('gdzie chcesz żeby było odliczanie').addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        const channel = interaction.options.getChannel('kanał') ?? interaction.channel;
        const type = interaction.options.getNumber('typ');
        const voiceChannel = interaction.options.getChannel('głosowy') ?? interaction.member.voice.channel;
        if (!voiceChannel)
            return await interaction.reply({ content:'Żeby wysadzić bombe trzeba byc na kanale głosowym albo go podać w argumencie, chyba logiczne cn' , ephemeral: true });


        const colors = ["czerwony", "niebieski", "pedalski", "żółty"];
        const goodColor = colors[Math.floor(Math.random() * colors.length)];

        const iconPath = path.join(__dirname, '../../../assets/icon.png');
        const file = new AttachmentBuilder(iconPath);
        
        const Embed = new EmbedBuilder()
        .setTitle("Bomb has been planted!")
        .setColor(0xcf0000)
        .setDescription(`Żeby rozbroić bombe musisz przeciąć kabelek o odpowiednim kolorze masz do wyboru:\n- ${colors.join('\n- ')}\nAby przeciąć dany kabel trzeba napisać jego kolor. Jeśli przetniesz zły kabel nie będziesz już mógł zatrzymać bomby. Powodzenia 🫡`)
        .setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });
        
        await interaction.reply({ content: `Bomba podłożona`, ephemeral: true });
        await channel.send({ embeds: [Embed], files: [file] });

        let connection;
        try 
        {
            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        } 
        catch (err) 
        {
            console.error(err);
            return interaction.followUp({ content: '❌ Nie mogę dołączyć na kanał głosowy', ephemeral: true });
        }

        const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        },
        });

        const resourceStart = createAudioResource(
        path.resolve(__dirname, '../../../assets/sounds/scpAlphaWarhead.mp3')
        );

        const resourceDefuse = createAudioResource(
        path.resolve(__dirname, '../../../assets/sounds/cancelWarhead.mp3')
        );
        
        let started = false;

        player.on(AudioPlayerStatus.Playing, () => {
            started = true;
        });

        player.on(AudioPlayerStatus.Idle, () => {
        if (started) {
            connection.destroy();
        }
        });

        connection.subscribe(player);
        player.play(resourceStart);

        let counter = 30;
        
        const countdown = await channel.send({ content: `### Bomb will be detonated in ${counter}` });

        let defused = false;

        const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedColors = colors.map(escapeRegex);
        const regex = new RegExp(`(^|[^\\p{L}])(${escapedColors.join('|')})(?=[^\\p{L}]|$)`,'iu');


        const filter = (m) => {
            if (m.author.bot) return false;

            return regex.test(m.content);
        };


        const collector = channel.createMessageCollector({
            filter,
            max: 1,
            time: 60_000
        });

        collector.on('collect', async m => {
            const match = m.content.match(regex);
            const usedColor = match?.[1].toLowerCase();

            collector.stop();
            if(usedColor === goodColor) 
            {
                defused = true;
                player.play(resourceDefuse);
                await m.reply(`Bomb has been defused!`);
                await countdown.edit(`~~Bomb will be detoneted in ${counter}~~ (defused)`);
            }
            else await m.reply(`Bomb is unstoppable now 💀`);

        });

        const tick = async () => {
            while (counter > 0 && !defused)
            {
                counter--;
                await countdown.edit(`### Bomb will be detoneted in ${counter}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            collector.stop();
            if(!defused) 
            {
                await countdown.edit({ content: "https://tenor.com/view/megumin-explosion-anime-konosuba-burst-forth-gif-17387790" });
            }
        };
        await tick();

        if(!defused)
        {

            const voiceChannels = interaction.guild.channels.cache.filter(
                channel => channel.type === ChannelType.GuildVoice
            );

            let disconnected = 0;

            for (const [id, channel] of voiceChannels) {
                for (const [memberId, member] of channel.members) {
                    if (member.user.bot) continue;

                    try {
                        if(member.voice.channelId)
                        {
                            disconnected++;
                            await member.voice.disconnect().catch(() => {});

                        }

                    } catch (err) {
                        console.log(`Nie mogę rozłączyć ${member.user.tag}: ${err.message}`);
                    }
                }
            }
            await channel.send({ content: `${disconnected} personnel had been killed by a bomb!` });
        }
	},
};