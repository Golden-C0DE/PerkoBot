const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    cooldown: 6,
    data: new SlashCommandBuilder().setName('ranime').setDescription('Wylosuj anime'),

    async execute(interaction) {
        await interaction.deferReply();
        try
        {
            const response = await fetch('https://api.jikan.moe/v4/random/anime');
            const data = await response.json();
            const anime = data.data;

            const genres = anime.genres.map(e => e.name).join(", ");
            const themes = anime.themes.map(e => e.name).join(", ");
            
            let synopsis = anime.synopsis || "Unknown";

            if(synopsis.length>1024)
            {
                synopsis = synopsis.slice(0, 1021) + "..."
            }
            

            const iconPath = path.join(__dirname, '../../../assets/icon.png');
            const file = new AttachmentBuilder(iconPath);

            const embed = new EmbedBuilder()
                .setColor(0x09a4dc)
                .setTitle(anime.title)
                .addFields(
                    { name: 'English title', value: `${anime.title_english || "Unknown"}` },
                    { name: 'Type', value:  `${anime.type || "Unknown"}`, inline: true },
                    { name: 'Episodes', value: `${anime.episodes || "Unknown"}`, inline: true },
                    { name: 'Duration', value: `${anime.duration || "Unknown"}`, inline: true },
                    { name: 'Score', value: `${anime.score || "Unknown"}`, inline: true },
                    { name: 'Rank', value: `${anime.rank ? '#'+anime.rank : "Unknown"}`, inline: true },
                    { name: 'Popularity', value: `${anime.popularity ? '#'+anime.popularity : "Unknown"}`, inline: true },
                    { name: 'Year', value: `${anime.year || "Unknown"}`, inline: true },
                    { name: 'Status', value: `${anime.status || "Unknown"}`, inline: true },
                    { name: 'Source', value: `${anime.source || "Unknown"}`, inline: true },
                    { name: 'Genres', value: `${genres === "" ? "Unknown" : genres}` },
                    { name: 'Themes', value: `${themes === "" ? "Unknown" : themes}` },
                    { name: 'Synopsis', value: synopsis },
                    { name: 'Link', value: anime.url },
                    )
                .setImage(anime.images.webp.large_image_url)
                .setFooter({ text: 'PerkoBot - Źródło: https://jikan.moe', iconURL: 'attachment://icon.png' });

            await interaction.editReply({ embeds: [embed], files: [file] });
        } 
        catch (error)
        {
            console.error(error);
            await interaction.editReply({ content: 'Sumimasen, nie udało się pobrać anime 😢', ephemeral: true });
        }
    },
};
