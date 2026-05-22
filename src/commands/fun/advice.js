const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    cooldown: 6,
    data: new SlashCommandBuilder().setName('advice').setDescription('Daje ci pomocną radę'),

    async execute(interaction) {
        await interaction.deferReply();
        try 
        {
            const response = await fetch('https://api.adviceslip.com/advice');
            const data = await response.json();
            const advice = data.slip.advice;

            if (!advice) throw new Error('No reply from API');

            const iconPath = path.join(__dirname, '../../../assets/icon.png');
            const file = new AttachmentBuilder(iconPath);

            const embed = new EmbedBuilder()
                .setColor(0x00dec4)
                .setDescription(`### ${advice}`)
                .setFooter({ text: 'PerkoBot - Źródło: https://api.adviceslip.com', iconURL: 'attachment://icon.png' });

            await interaction.editReply({ embeds: [embed], files: [file] });
        } 
        catch (error)
        {
            console.error(error);
            await interaction.editReply({ content: 'Nie udało się pobrać porady 😢', ephemeral: true });
        }
    },
};
