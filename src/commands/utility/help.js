const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Zobacz wszystkie komendy'),

    async execute(interaction) {

        const foldersPath = path.join(__dirname, "..");
        const commandFolders = fs.readdirSync(foldersPath);

        const categories = {};

        for (const folder of commandFolders) {

            const commandsPath = path.join(foldersPath, folder);

            if (!fs.lstatSync(commandsPath).isDirectory()) continue;

            const commandFiles = fs
                .readdirSync(commandsPath)
                .filter((file) => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.resolve(commandsPath, file);
                const command = require(filePath);

                if (command.data && command.data.name && command.data.description) {

                    if (!categories[folder]) categories[folder] = [];

                    categories[folder].push(
                        `**/${command.data.name}** - ${command.data.description}`
                    );
                }
            }
        }

        let description = "";

        for (const category in categories)
        {
            const pretty = category.charAt(0).toUpperCase() + category.slice(1);

            description += `### 📁 ${pretty}\n`;
            description += categories[category].join("\n") + "\n\n";
        }

        const iconPath = path.join(__dirname, '../../../assets/icon.png');
        const file = new AttachmentBuilder(iconPath);

        const embed = new EmbedBuilder()
            .setTitle('🛠️ Lista komend 🛠️')
            .setColor(0xffbb00)
            .setDescription(description)
            .setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

        await interaction.reply({ embeds: [embed], files: [file] });
    },
};