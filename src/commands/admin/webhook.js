const { SlashCommandBuilder,  ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wh')
        .setDescription('Przemów głosem swojego alter ego')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks),
    async execute(interaction) {
        const webhooks = await interaction.channel.fetchWebhooks();
        if (!webhooks.size) 
        {
            return interaction.reply({
                content: '❌ Brak webhooków w tym kanale. W ustawieniach możesz zmienić kanał docelowy obecnych lub stworzyć nowe webhooki',
                ephemeral: true,
            });
        }

        const choices = webhooks.map((w) => ({
            label: w.name,
            value: w.id,
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-webhook')
            .setPlaceholder('Wybierz webhook')
            .addOptions(choices);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: 'Wybierz swoje alter ego:',
            components: [row],
            ephemeral: true,
        });
    },
};
