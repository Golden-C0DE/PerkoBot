const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,

	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);


		const MyActivities = [
			{
				activities: [{
					type: ActivityType.Custom,
					name: "wyspa cwela",
					state: "🏝️ Wyspa Cwela 🏝️",
				}],
				status: "online"
			},
			{
				activities: [{
					type: ActivityType.Playing,
					name: "Kalkulator 🧮",
				}],
				status: "online"
			},
			{
				activities: [{
					type: ActivityType.Streaming,
					name: "Stream na wyspie cwela",
					url: "https://www.twitch.tv/mamm0n",
				}],
				status: "online"
			},
			{
				activities: [{
					type: ActivityType.Listening,
					name: "🎵 Kutas records 🎵",
				}],
				status: "online"
			},
			{
				activities: [{
					type: ActivityType.Watching,
					name: "Pay Gorn 🏳️‍🌈",
				}],
				status: "online"
			},
					{
				activities: [{
					type: ActivityType.Competing,
					name: "Turniej szachowy na wyspie cwela ♟️",
				}],
				status: "online"
			},
			{
				activities: [{
					type: ActivityType.Listening,
					name: "La Cweloza",
				}],
				status: "online"
			},
			{
				activities: [{
					type: ActivityType.Playing,
					name: "Wyspa Cwela MC",
				}],
				status: "online"
			},
		];


		let i = 0;
		client.user.setPresence(MyActivities[i]);
		setInterval(() => {
			i = (i+1)%MyActivities.length;
			client.user.setPresence(MyActivities[i]);
		}, 300_000); //5 min

	}
};