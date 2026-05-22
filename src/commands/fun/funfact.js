const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    cooldown: 6,
    data: new SlashCommandBuilder().setName('funfact').setDescription('Losowy funfact (może nie być fun)'),

    async execute(interaction) {
        await interaction.deferReply();
        try 
        {
            const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
            const data = await response.json();
            const fact = data.text;

            if (!fact) throw new Error('No reply from API');

            const iconPath = path.join(__dirname, '../../../assets/icon.png');
            const file = new AttachmentBuilder(iconPath);

            const embed = new EmbedBuilder()
                .setColor(0xe7ba19)
                .setDescription(`### ${fact}`)
                .setFooter({ text: 'PerkoBot - Źródło: https://uselessfacts.jsph.pl', iconURL: 'attachment://icon.png' });

            await interaction.editReply({ embeds: [embed], files: [file] });
        } 
        catch (error)
        {
            console.error(error);
            await interaction.editReply({ content: 'Nie udało się pobrać funfactu 😢', ephemeral: true });
        }
    },
};
