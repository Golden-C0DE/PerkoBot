const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder  } = require('discord.js');

require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
    .setName('gay')
    .setDescription('Zobacz w ilu procentach jesteś lub ktoś jest gejem')
    .addUserOption((option) => option.setName('kto').setDescription('osoba, którą chcesz sprawdzić')),
	async execute(interaction) {
        
        const user = interaction.options.getUser('kto') ?? interaction.user;
        const member = interaction.options.getMember('kto') || interaction.member;
        let percent = Math.floor(Math.random() * 101);

        if(member.roles.cache.some((role) => role.name === 'gei')) percent = 100;

        if(user.id === '793754514590400533') percent = 0;

        let message = `### ${user} jest gejem w ${percent}% 🏳️‍🌈`;

        switch(percent)
        {
            case 100:
                message = `### ${user} jest gejem w ${percent}% 🏳️‍🌈\n### [Obiecałem twojej matce, że wyleczę cię z homoseksualizmu](https://youtu.be/EfpWFwGktXA?si=bmhvSuD29w1Zv567)`;
                break;

            case 69:
                message = `### ${user} jest gejem w ${percent}% 🏳️‍🌈\n### hehe 69`;
                break;

            case 67:
                message = `### ${user} jest gejem w ${percent}% 🏳️‍🌈\n### haha 67`;
                break;

            case 50:
                message = `### ${user} jest gejem w ${percent}% 🏳️‍🌈\n### Takie homo nie wiadomo`;
                break;

            case 0:
                message = `### ${user} jest gejem w ${percent}%\n### 100% hetero 💪`;
                break;

        }

        const path = require('path');
        const iconPath = path.join(__dirname, '../../../assets/icon.png');
        const file = new AttachmentBuilder(iconPath);

        const Embed = new EmbedBuilder()
        .setColor(0xff00fb)
        .setDescription(message)
        .setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

        await interaction.reply({ embeds: [Embed], files: [file]});

	},
};