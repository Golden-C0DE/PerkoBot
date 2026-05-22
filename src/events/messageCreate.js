const { Events, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {

        if (message.author.bot) return;

        if(message.channel.id === process.env.SUGGESTCHANNELID)
        {

            let answer = "### ❌ Sugestia odrzucona!\nDziękujemy za sugestie, ale może następnym razem. Pozdro";
            let emoji = '👎';
            let color = 0xff1c1c;

            if(message.member.permissions.has(PermissionFlagsBits.BanMembers))
            {
                answer = "### ✅ Sugestia przyjęta!\nDziękujemy za pomocne sugestie, jesteś ważnym członkiem naszej społeczności!";
                emoji = '👍';
                color = 0x00ff2f;
            }

            const path = require('path');
            const iconPath = path.join(__dirname, '../../assets/icon.png');
            const file = new AttachmentBuilder(iconPath);
            const Embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(answer)
            .setFooter({ text: 'PerkoBot', iconURL: 'attachment://icon.png' });
            
            await message.react(emoji);
            return await message.reply({embeds: [Embed], files: [file]});
        }

        if(message.content.replace(/\s+/g, "").length >= 700)
        {
            await message.reply({content: `Too long didn't read 🗿`, files: ["https://tenor.com/view/geeked-locked-in-angry-bubu-red-bird-red-gif-13807202352659823415.gif"]});
        }

        const emojis = ['🧑‍🦽', '🗿', '🏳️‍🌈', '💀', '🤓', '💩', '👨‍❤️‍👨', '🐒', '🎰', '🐕‍🦺', '👎'];
        let chance = Math.floor(Math.random() * 20);

        if(chance === 0)
        {
            let chance = Math.floor(Math.random() * emojis.length);
            await message.react(emojis[chance]);
        }

	}
};