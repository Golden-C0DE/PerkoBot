const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder().setName('rpokemon').setDescription('Wylosuj pokemona'),
    async execute(interaction) {

        if(Math.floor(Math.random() * 25) === 0)
        {

            let imgPath = path.join(__dirname, '../../../assets/img/szmeraAlt.webp');
            fileThumbnail = new AttachmentBuilder(imgPath, { name: 'szmeraAlt.webp' });

            imgPath = path.join(__dirname, '../../../assets/img/szmerkaZnak.png');
            fileImage = new AttachmentBuilder(imgPath, { name: 'szmerkaZnak.png' });

            const embed = new EmbedBuilder()
                .setTitle("SZMERKA")
                .setDescription("Height: 0,8 alka\nWeight: 0,4 maćka")
                .setThumbnail('attachment://szmeraAlt.webp')
        		.setImage('attachment://szmerkaZnak.png')

                .addFields(
                    { name: 'Types:', value: "białoruski, psychiczny, melonowate" },
                    { name: "HP", value: `69`, inline: true },
                    { name: "ADHD", value: `100`, inline: true },
                    { name: "IQ", value: `√-1`, inline: true },
                    { name: "MELONS", value: `2` },
                    { name: "MENTAL STABLE", value: `0`},
                    { name: "SPECIAL-ATTACK", value: `szał adhd` },
                    )
                .setColor(0x9e17ff)
                .setFooter({ text: 'PerkoBot - Źródło: https://pokeapi.co', iconURL: "attachment://szmeraAlt.webp" })

            const change = new ButtonBuilder()
            .setCustomId('change:szmerka:shiny')
            .setLabel('SHINY')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✨');

            const row = new ActionRowBuilder().addComponents(change);

            return await interaction.reply({ embeds: [embed], components: [row], files: [fileThumbnail, fileImage], withResponse: true});
        }

        await interaction.deferReply();
        try 
        {
            const nr = Math.floor(Math.random() * 1025)+1;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nr}`);
            const data = await response.json();
            const name = data.name;
            const height = data.height*10;
            const weight = data.weight/10;
            const imgs = data.sprites;
            const stats = data.stats;

            const typesString = data.types.map(t => t.type.name).join(", ");

            
            const embed = new EmbedBuilder()
                .setTitle(name.toUpperCase())
                .setDescription(`Height: ${height}cm\nWeight: ${weight}kg`)
                .setThumbnail(imgs.other["showdown"].front_default )
                .setImage(imgs.other["official-artwork"].front_default)
                .addFields(
                    { name: 'Types:', value: typesString },
                    { name: stats[0].stat.name, value: `${stats[0].base_stat}`, inline: true },
                    { name: stats[1].stat.name, value: `${stats[1].base_stat}`, inline: true },
                    { name: stats[2].stat.name, value: `${stats[2].base_stat}`, inline: true },
                    { name: stats[3].stat.name, value: `${stats[3].base_stat}`, inline: true },
                    { name: stats[4].stat.name, value: `${stats[4].base_stat}`, inline: true },
                    { name: stats[5].stat.name, value: `${stats[5].base_stat}`, inline: true },
                    )
                .setColor(0x9e17ff)
                .setFooter({ text: 'PerkoBot - Źródło: https://pokeapi.co', iconURL: imgs.other["official-artwork"].front_default })


            const change = new ButtonBuilder()
            .setCustomId(`change:shiny:${nr}`)
            .setLabel('SHINY')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✨');

            if(!imgs.other["official-artwork"].front_shiny) 
            {
                    change
                    .setDisabled(true)
                    .setLabel('NIE MA WERSJI SHINY');
            }
                

            const row = new ActionRowBuilder().addComponents(change);
                
            await interaction.editReply({ embeds: [embed], components: [row], withResponse: true});
        } 
        catch (error)
        {
            console.error(error);
            await interaction.editReply({ content: 'Nie udało się pobrać pokemona 😢', ephemeral: true });
        }
    },
};
