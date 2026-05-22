const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { spawn } = require('child_process');
const path = require('path');

module.exports = {
	cooldown: 9, 
	data: new SlashCommandBuilder().setName('zadanko')
    .setDescription('Losowe zadanko matematyczne z matury')
    .addStringOption((option) =>
		option
			.setName('poziom')
			.setDescription('Wybierz z jakiego poziomu chcesz zadanie (domyślnie rozszerzony)')
			.addChoices(
                { name: 'podstawowy (zamknięte i otwarte)', value: 'pod' },
                { name: 'podstawowy (zamknięte)', value: 'pod-Z' },
                { name: 'podstawowy (otwarte)', value: 'pod-O' },
				{ name: 'rozszerzony', value: 'roz' },
			),
	),
	async execute(interaction) {
        const lvl = interaction.options.getString('poziom') ?? "roz";

        const getPuzzleFromAPI = () => {
        return new Promise((resolve, reject) => {
            const py = spawn("python", ["./src/api/zadankaAPI.py", lvl]);

            let data = "";
            py.stdout.on("data", chunk => data += chunk.toString());
            py.stderr.on("data", err => reject(err.toString()));

            py.on("close", () => {
            resolve(JSON.parse(data));
            });
        });
        }

        await interaction.deferReply(); 
        try
        {
            const puzzle = await getPuzzleFromAPI();

            const iconPath = path.join(__dirname, '../../../assets/icon.png');
            const file = new AttachmentBuilder(iconPath);


            const Embed = new EmbedBuilder()
                .setTitle("Zadanko maturalne 📝")
                .setDescription(`### ${puzzle.text}`)
                .addFields(
                    { name: "Poziom:", value: puzzle.level, inline:true },
                    { name: "Dział:", value: puzzle.subject, inline:true },
                    { name: "Typ:", value: puzzle.type, inline:true },
                    { name: 'Link:', value: puzzle.src },
                )
                .setColor(0xffffff)
                .setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });


            await interaction.editReply({ embeds: [Embed], files: [file]});
        }
        catch (error)
        {
            console.error(error);
            await interaction.editReply({ content: 'Nie udało się pobrać zadanka 😢', ephemeral: true });
        }
        

    },
};