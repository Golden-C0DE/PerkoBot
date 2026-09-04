const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder().setName('gamble')
    .setDescription('Spróbuj szczęścia'),
	async execute(interaction) {

        const chance = Math.floor(Math.random() * 1000);
        const user = interaction.user;
        let color = 0xa72727;

        if(chance === 0)
        {
            const guild = interaction.guild;
            const member = interaction.member;

            const role = guild.roles.cache.find(r => r.name === "gambler");

            message = `# JACKPOT!!!\n## |  7️⃣ |  7️⃣ |  7️⃣ |\n### ${user} został prawdziwym gamblerem 🎰`;

            if(role) 
            {
                await member.roles.add(role).catch(err => {console.error("Nie udało się dodać roli:", err.message);});
                message = `# JACKPOT!!!\n## |  7️⃣ |  7️⃣ |  7️⃣ |\n### ${user} dostał role ${role}, tym samym został prawdziwym gamblerem 🎰`;
            }

            color = 0xebfa13;
        }   
        else if(chance < 50)
        {
            const nr = Math.floor(Math.random() * 3);

            switch(nr)
            {
                case 0:
                    message = `# Money drop\n## | 💸 | 💸 | 💸 |\n### ${user} zarobiłeś 20zł na wejście\n### [tu masz link, żeby wypłacić hajs](https://youtu.be/KSPxHniCtmw?si=uIDncDtEszZkJAOW)`;
                    color = 0x1dd833;
                    break;
                case 1:
                    message = `# Monkey drop\n## | 🐒 | 🐒 | 🐒 |\n### ${user} nie każda małpa trafia\nhttps://pl.wikipedia.org/wiki/Twierdzenie_o_nieskończonej_liczbie_małp`;
                    color = 0x6c3d0f;
                    break;
                case 2:
                    message = `# Melon drop\n## | 🍈 | 🍈 | 🍈 |\n### ${user} spokojnie, to jest jakby okej`;
                    color = 0x3a6905;
                    break;
            }
        }
        else if(chance < 80)
        {
            const iconPath = path.join(__dirname, '../../../assets/img/alekFemboy.png');
            const icon = new AttachmentBuilder(iconPath);

            const imgPath = path.join(__dirname, '../../../assets/icon.png');
            const img = new AttachmentBuilder(imgPath);
            
            message = `# Secret drop 🤫\n## | ❓ | ❓ | ❓ |\n### ${user} w nagrode jako jedyny masz dostęp do tajnego zdjęcia`;
            color = 0x777474;

            const Embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(message)
            .setImage('attachment://alekFemboy.png')
            .setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

            return await interaction.reply({embeds: [Embed], files: [icon, img], ephemeral: true});
        }
        else if(chance < 120)
        {
            const member = interaction.member;

            const penalties = [60_000, 180_000, 300_000, 600_000, 1_297_000] // 1min, 3min, 5min, 10min, 21min 37s

            const time = penalties[Math.floor(Math.random() * penalties.length)];

            
            message = `# Gówno drop\n## | 💩 | 💩 | 💩 |\n### ${user} gratuluje, masz time out`;

            await member.timeout(time, 'W kasynie raz się przegrywa, a raz się wygrywa')
            .then()
            .catch(() => message = `# Gówno drop\n## | 💩 | 💩 | 💩 |\n### ${user} gratuluje, masz time out, a raczej miałbyś, ale nie mogę go ci dać, więc pogroże ci tylko paluszkiem`)

            color = 0x5c2207;
        }
        else
        {
            const items = ['🍈', '🍌', '🍆', '🍒', '🍊', '🫐', '🍇', '🍋', '🍑', '🍅', '❓', '🍕', '🍟', '🥭', '🥝', '🥜', '🧄', '🌶️', '🥐', '🌯', '🍔', '🧀', '🍍', '🍪', '🥚', '🐧', '🐒', '🐍', '💩', '💸', '7️⃣'];
            const pool = [...items].sort(() => Math.random() - 0.5);
                        
            message = `# Ajajaj\n## | ${pool[0]} | ${pool[1]} | ${pool[2]} |\n### ${user} nie tym razem koleżko`;
        }


		const iconPath = path.join(__dirname, '../../../assets/icon.png');
		const file = new AttachmentBuilder(iconPath);

		const Embed = new EmbedBuilder()
		.setColor(color)
		.setDescription(message)
		.setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });

		await interaction.reply({embeds: [Embed], files: [file]});
	},
};