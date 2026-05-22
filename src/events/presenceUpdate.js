const { Events } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.PresenceUpdate,
	async execute(oldPresence, newPresence) {

        if (!newPresence || !newPresence.user) return;
        if (newPresence.user.bot) return;

        const guild = newPresence.guild;
        if (!guild) return;

        
        const oldGame = oldPresence?.activities?.[0]?.name;
        const newGame = newPresence.activities?.[0]?.name;
        
        if(newGame === "League of Legends" && oldGame !== newGame)
        {
            const role = guild.roles.cache.find(r => r.name === "cicha banicja za lige");
            const role2 = guild.roles.cache.find(r => r.name === "gei");

            if(role) await newPresence.member.roles.add(role).catch(err => {console.error("Nie udało się dodać roli:", err.message);});
            if(role2) await newPresence.member.roles.add(role2).catch(err => {console.error("Nie udało się dodać roli:", err.message);});
            
            const channel = guild.channels.cache.get(process.env.ANNOUNCEMENTCHANNELID);
            if (channel && channel.isTextBased())
            {
                await channel.send({ content:`Uwaga ${newPresence.member} włączył lige 🏳️‍🌈. Przeczytaj #8 zasadę! Hańba ci!\nhttps://media.discordapp.net/attachments/1074650569496604673/1167590330279919656/843a3a.gif?ex=694d117b&is=694bbffb&hm=52554ecf239f1c1d5b98d9cb0ab5f74763bf9d2211c5cae879bb7f28b020aba1&` });
            }

            await newPresence.user.send("Rodzina się ciebie nie wstydzi?\nhttps://youtu.be/EfpWFwGktXA?si=bmhvSuD29w1Zv567");
        }
        else if(oldGame === "League of Legends" && oldGame !== newGame)
        {
            await newPresence.user.send("Brawo, wyłączyłeś tą grę. Mam nadzieję, że po to, żeby ją odnistalować");
        }
	}
};