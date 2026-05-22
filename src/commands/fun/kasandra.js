const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('kasandra')
    .setDescription('Zapytaj wyrocznie o swój los')
    .addStringOption((option) => option.setName('pytanie').setDescription('O co chesz zapytać kasandre').setRequired(true)),
	async execute(interaction) {

        const question = interaction.options.getString('pytanie');

        const answers = [
            "Nie",
            "Tak",
            "Może",
            "Nie wiem",
            "Tak, to JoJo reference",
            "67",
            "Pytasz bota czy sra online",
            "Przeczytaj regulamin",
            "Wpisz `/żart`",
            "Nie byłbym do końca szczery twierdząc że nie mogę z całą mocą zaprzeczyć że to twierdzenie jest lub nie jest prawdziwe",
            "Na głupie pytania nie odpowiadam",
            "Lepszy ser na pierogach niż miód na uszach",
            "🐭(Knowing the mouse might one day leave its hole and get the cheese...) 🧀 (It fills you with determination.)",
            "Jak kiedyś opowiadałem wam św. pamięci mój wujaszek, miałem bardzo mało lat. O ziomuś miałem może z 5 lat może 6, nie wiem nawet bardzo młody byłem i wujek u babci był i DLA ŻARTU PODKREŚLAM DLA ŻARTU zrymowałem do wujka Wujek-Kujek przez k, przez k bo to mi się rymowało, przez k. powiedziałem wujek-kujek I wujek wyjebał mi liścia w pysk i od tamtej pory żadnego żartu nie zrobiłem w stosunku do wujka.",
            "Moim zdaniem to nie ma tak, że dobrze albo że nie dobrze. Gdybym miał powiedzieć, co cenię w życiu najbardziej, powiedziałbym, że ludzi. Ekhm... Ludzi, którzy podali mi pomocną dłoń, kiedy sobie nie radziłem, kiedy byłem sam. I co ciekawe, to właśnie przypadkowe spotkania wpływają na nasze życie. Chodzi o to, że kiedy wyznaje się pewne wartości, nawet pozornie uniwersalne, bywa, że nie znajduje się zrozumienia, które by tak rzec, które pomaga się nam rozwijać. Ja miałem szczęście, by tak rzec, ponieważ je znalazłem. I dziękuję życiu. Dziękuję mu, życie to śpiew, życie to taniec, życie to miłość. Wielu ludzi pyta mnie o to samo, ale jak ty to robisz?, skąd czerpiesz tę radość? A ja odpowiadam, że to proste, to umiłowanie życia, to właśnie ono sprawia, że dzisiaj na przykład odpowiadam na pytania, a jutro... kto wie, dlaczego by nie, oddam się pracy społecznej i będę ot, choćby sadzić... znaczy... marchew."
        ];

        const nr = Math.floor(Math.random() * answers.length);
        const text = `### *Wyrocznia pochyliła się nad problemem:* ${question}\n### *Odpowiedź wyroczni brzmi:* ${answers[nr]}`;

        const path = require('path');
		const iconPath = path.join(__dirname, '../../../assets/icon.png');
		const file = new AttachmentBuilder(iconPath);

		const Embed = new EmbedBuilder()
		.setColor(0x0f70d1)
		.setDescription(text)
		.setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

		await interaction.reply({embeds: [Embed], files: [file]});
	},
};