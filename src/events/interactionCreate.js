const { Events, MessageFlags, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if(interaction.isChatInputCommand()) 
		{
			const command = interaction.client.commands.get(interaction.commandName);
	
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
			const { cooldowns } = interaction.client;

			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}
			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const defaultCooldownDuration = 3;
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				return interaction.reply({
					content: `Wow zluzuj man, jest cooldown. Komenda \`${command.data.name}\` będzie dostępna <t:${expiredTimestamp}:R>.`,
					flags: MessageFlags.Ephemeral,
				});
				
			}
			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: 'Błąd w wykonaniu komendy!',
						flags: MessageFlags.Ephemeral,
					});
				} else {
					await interaction.reply({
						content: 'Błąd w wykonaniu komendy!',
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		}

		else if(interaction.isButton())
		{
			await interaction.deferUpdate();
			const [action, mode, nr] = interaction.customId.split(':');
			if(action === "change")
			{
				if(mode === "szmerka")
				{
					const newEmbed = EmbedBuilder.from(interaction.message.embeds[0])
					const row = new ActionRowBuilder()

					let fileThumbnail, fileImage, imgPath;

					if(nr === "shiny")
					{

						imgPath = path.join(__dirname, '../../assets/gifs/szmerakiss.gif');
						fileImage = new AttachmentBuilder(imgPath, { name: 'szmerakiss.gif' });

						imgPath = path.join(__dirname, '../../assets/img/szmerkaSecret.jpg');
						fileThumbnail = new AttachmentBuilder(imgPath, { name: 'szmerkaSecret.jpg' });

						newEmbed
						.setTitle(`✨ SHINY SZMERKA ✨`)
						.setThumbnail("attachment://szmerkaSecret.jpg")
						.setImage( 'attachment://szmerakiss.gif' )
						.setColor(0xebdfc0)

						
						row.addComponents(
							new ButtonBuilder()
								.setCustomId('change:szmerka:normal')
								.setLabel("DEFAULT")
								.setStyle(ButtonStyle.Primary)
								.setEmoji('😐')
						);
					}
					else
					{
						imgPath = path.join(__dirname, '../../assets/img/szmeraAlt.webp');
						fileThumbnail = new AttachmentBuilder(imgPath, { name: 'szmeraAlt.webp' });

						imgPath = path.join(__dirname, '../../assets/img/szmerkaZnak.png');
						fileImage = new AttachmentBuilder(imgPath, { name: 'szmerkaZnak.png' });

						newEmbed
						.setTitle(`SZMERKA`)
                		.setThumbnail('attachment://szmeraAlt.webp')
                		.setImage('attachment://szmerkaZnak.png')
						.setColor(0x9e17ff)

						
						row.addComponents(
							new ButtonBuilder()
								.setCustomId('change:szmerka:shiny')
								.setLabel('SHINY')
								.setStyle(ButtonStyle.Primary)
								.setEmoji('✨')
						);
					}

					return await interaction.editReply({ embeds: [newEmbed], components: [row], files: [fileThumbnail, fileImage] });
				}
				
				const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nr}`);
				const data = await response.json();
				const name = data.name;
				const imgs = data.sprites;

				const newEmbed = EmbedBuilder.from(interaction.message.embeds[0])
				const row = new ActionRowBuilder()

				if(mode === "shiny")
				{
					newEmbed
					.setTitle(`✨ SHINY ${name.toUpperCase()} ✨`)
					.setThumbnail(imgs.other["showdown"].front_shiny)
					.setImage(imgs.other["official-artwork"].front_shiny)
					.setColor(0xebdfc0)

					
					row.addComponents(
						new ButtonBuilder()
							.setCustomId(`change:normal:${nr}`)
							.setLabel("DEFAULT")
							.setStyle(ButtonStyle.Primary)
							.setEmoji('😐')
					);
				}
				else
				{
					newEmbed
					.setTitle(name.toUpperCase())
					.setThumbnail(imgs.other["showdown"].front_default)
					.setImage(imgs.other["official-artwork"].front_default)
					.setColor(0x9e17ff)

					
					row.addComponents(
						new ButtonBuilder()
							.setCustomId(`change:shiny:${nr}`)
							.setLabel('SHINY')
							.setStyle(ButtonStyle.Primary)
							.setEmoji('✨')
					);
				}

				await interaction.editReply({
					embeds: [newEmbed],
					components: [row]
				});
			}
			
		}
		else if (interaction.isStringSelectMenu()) 
		{
			if (interaction.customId === 'select-webhook') 
			{
				const webhookId = interaction.values[0];
				const webhooks = await interaction.channel.fetchWebhooks();
				const webhook = webhooks.get(webhookId);

				if (!webhook)
					return interaction.reply({
						content: '❌ Nie znaleziono webhooka',
						ephemeral: true,
					});

				const modal = new ModalBuilder()
					.setCustomId(`webhook-modal-${webhookId}`)
					.setTitle(`Wyślij wiadomość przez ${webhook.name}`);

				const input = new TextInputBuilder()
					.setCustomId('webhookMessage')
					.setLabel('Treść wiadomości')
					.setStyle(TextInputStyle.Paragraph)
					.setRequired(true);

				const row = new ActionRowBuilder().addComponents(input);
				modal.addComponents(row);

				await interaction.showModal(modal);
			}
		}
		else if (interaction.isModalSubmit()) 
		{
			if (interaction.customId.startsWith('webhook-modal-'))
			{
				const webhookId = interaction.customId.replace('webhook-modal-', '');
				const webhooks = await interaction.channel.fetchWebhooks();
				const webhook = webhooks.get(webhookId);

				if (!webhook)
					return await interaction.reply({
						content: '❌ Nie znaleziono webhooka',
						ephemeral: true,
					});

				const messageContent = interaction.fields.getTextInputValue('webhookMessage');

				await webhook.send({
					content: messageContent,
					allowedMentions: { parse: [] },
				});

				await interaction.reply({ content: '✅ Wiadomość wysłana przez webhooka', ephemeral: true });
			}
		}

	},
};