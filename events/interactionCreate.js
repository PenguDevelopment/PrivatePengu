const { Events, ButtonStyle, TextInputBuilder, TextInputStyle} = require('discord.js');
const suggest = require('../modals/suggestions-schema.js');
const { EmbedBuilder } = require('discord.js');
const { ButtonBuilder } = require('discord.js');
const { ActionRowBuilder, ModalBuilder } = require('discord.js');
const guilds = require('../modals/guild-schema.js');
const linkSchema = require('../modals/links-schema.js');
const personalLinkSchema = require('../modals/personallink-schema.js');
const { Emojis, Colors, EmojiIds } = require('../statics.js');
require('dotenv').config();
const { createCanvas, registerFont } = require('canvas');
const randomstring = require('randomstring');
const path = require('path');
const verifySchema = require('../modals/verify-schema.js');

const fontPath = path.join(__dirname, '../fonts/arial/arial.ttf');
registerFont(fontPath, { family: 'Arial' });
const Captcha = require("@haileybot/captcha-generator");

async function generateCaptcha(type = 'pengu') {
	if (type === 'pengu') {
		const canvas = createCanvas(200, 80);
		const ctx = canvas.getContext('2d');
	
		// Transparent background
		ctx.fillStyle = 'rgba(255, 255, 255, 0)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	
		// Generate random string (letters and numbers) for the captcha
		const captchaText = randomstring.generate({
		length: 6, // Change the length of the captcha string as per your requirement
		charset: 'alphanumeric', // Include letters and numbers for the captcha
		});
	
		// Randomly place gray dummy letters on the canvas, ensuring they don't overlap with the answer characters
		ctx.fillStyle = 'gray';
		const dummyCharset = 'alphanumeric'.replace(/[A-Za-z0-9]/g, ''); // Get all the characters not present in the answer charset
		const dummyCharsCount = Math.min(10, captchaText.length); // Limit the number of dummy characters to 10 or less
	
		ctx.font = '30px Arial';
	
		// Draw gray dummy characters in the bottom layer
		for (let i = 0; i < dummyCharsCount; i++) {
		const dummyChar = randomstring.generate({ length: 1, charset: dummyCharset });
		let x, y;
	
		// Keep generating random positions until they don't overlap with the green answer characters
		do {
			x = Math.random() * 200;
			y = Math.random() * 80;
		} while (isCloseToGreenChars(x, y, captchaText, ctx));
	
		ctx.fillText(dummyChar, x, y);
		}
	
		// Draw green answer characters on top
		ctx.fillStyle = 'lightgreen'; // Use lightgreen for the answer characters
		const xStart = 20;
		const xStep = 160 / captchaText.length; // To make the answer linear, we divide the width evenly
		for (let i = 0; i < captchaText.length; i++) {
		const x = xStart + xStep * i;
		const y = Math.random() * 40 + 40;
		ctx.fillText(captchaText.charAt(i), x, y);
		}
	
		// Draw the green line through the letters
		ctx.beginPath();
		ctx.moveTo(xStart, Math.random() * 20 + 40);
		for (let i = 0; i < captchaText.length; i++) {
		const x = xStart + xStep * i;
		const y = Math.random() * 20 + 40;
		ctx.lineTo(x, y);
		}
		ctx.strokeStyle = 'lightgreen';
		ctx.lineWidth = 2;
		ctx.stroke();
	
		// Convert the canvas to a buffer
		const captchaBuffer = canvas.toBuffer();
		return { captchaBuffer, answer: captchaText };
	} else if (type === 'hailey') {
		const captcha = new Captcha();
		const captchaBuffer = await captcha.PNGStream;
		return { captchaBuffer, answer: captcha.value };
	}
  }
  
  // Helper function to check if a point is within a distance of the green characters
  function isCloseToGreenChars(x, y, captchaText, ctx) {
    const xStart = 20;
    const xStep = 160 / captchaText.length;
    for (let i = 0; i < captchaText.length; i++) {
      const xChar = xStart + xStep * i;
      const yChar = Math.random() * 40 + 40;
      const distance = Math.sqrt((x - xChar) ** 2 + (y - yChar) ** 2);
      if (distance < 20) {
        return true;
      }
    }
    return false;
  }
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

		if (process.env.DEV_MODE === 'true') {
			// if not owner
			if (interaction.user.id !== process.env.OWNER_ID) {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' This bot is currently in development mode. Please be patient as we are adding new features and fixing bugs.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	} else if (interaction.isButton() && interaction.customId.startsWith('sug-')) {
		const id = interaction.customId.split('-')[1];
		const vote = interaction.customId.split('-')[2];
		const suggestion = await suggest.findOne({ id: id });
		if (!suggestion) {
			const embed = new EmbedBuilder()
				//.setTitle('Error!')
				.setDescription(Emojis.error + ' That suggestion does not exist.')
				.setColor(Colors.errpr)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} else {
			if (vote === 'yes') {
				const newVotes = suggestion.votes;
				const newAnswers = suggestion.answers;
				const action = interaction.customId.split('-')[2];
				const find = newAnswers.find(x => x.id == interaction.user.id);
				if (find) {
					if (action == find.type) {
						const embed = new EmbedBuilder()
							.setDescription(Emojis.error + ' You already voted on this suggestion.')
							.setColor(Colors.error)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					} else if (action == 'yes' && find.type == 'no') {
						newVotes.no = newVotes.no - 1;
						newAnswers.splice(newAnswers.indexOf(find), 1);
					}
				}
				newVotes.yes = newVotes.yes + 1;
				newAnswers.push({ id: `${interaction.user.id}`, type: 'yes' });
				await suggest.updateOne({ id: id }, { votes: newVotes, answers: newAnswers });	
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`sug-${id}-yes`)
							.setLabel(`${newVotes.yes}`)
							.setEmoji(EmojiIds.success)
							.setStyle(2),
						new ButtonBuilder()
							.setCustomId(`sug-${id}-no`)
							.setLabel(`${newVotes.no}`)
							.setEmoji(EmojiIds.error)
							.setStyle(2),
					);
				const message = await interaction.channel.messages.fetch(suggestion.messageId);
				if (!message) {
					const embed = new EmbedBuilder()
						//.setTitle('Error!')
						.setDescription(Emojis.error + ' That suggestion does not exist.')
						.setColor(Emojis.error)
					return interaction.reply({ embeds: [embed], ephemeral: true });
				}
				await message.edit({ components: [row] });
				await interaction.reply({ content: 'You voted yes!', ephemeral: true });
			} else if (vote === 'no') {
				const newVotes = suggestion.votes;
				const newAnswers = suggestion.answers;
				const action = interaction.customId.split('-')[2];
				const find = newAnswers.find(x => x.id == interaction.user.id);
				if (find) {
					if (action == find.type) {
						const embed = new EmbedBuilder()
							// .setTitle('Error!')
							.setDescription(Emojis.error + ' You\'ve already voted for this suggestion.')
							.setColor(Colors.error)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					} else if (action == 'no' && find.type == 'yes') {
						newVotes.yes = newVotes.yes - 1;
						newAnswers.splice(newAnswers.indexOf(find), 1);
					}
				}
				newVotes.no = newVotes.no + 1;
				newAnswers.push({ id: `${interaction.user.id}`, type: 'no' });
				await suggest.updateOne({ id: id }, { votes: newVotes, answers: newAnswers });
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`sug-${id}-yes`)
							.setLabel(`${newVotes.yes}`)
							.setEmoji(EmojiIds.success)
							.setStyle(2),
						new ButtonBuilder()
							.setCustomId(`sug-${id}-no`)
							.setLabel(`${newVotes.no}`)
							.setEmoji(EmojiIds.error)
							.setStyle(2),
					);
				const message = await interaction.channel.messages.fetch(suggestion.messageId);
				if (!message) {
					const embed = new EmbedBuilder()
						// .setTitle('Error!')
						.setDescription(Emojis.error + ' That suggestion does not exist.')
						.setColor(Colors.error)
					return interaction.reply({ embeds: [embed], ephemeral: true });
				}
				await message.edit({ components: [row] });
				await interaction.reply({ content: 'You voted no!', ephemeral: true });
				} else if (vote === 'approve') {
					const id = interaction.customId.split('-')[1];
					const suggestion = await suggest.findOne({ id: id });
					if (!suggestion) {
						const embed = new EmbedBuilder()
							.setTitle('Error!')
							.setDescription('That suggestion does not exist.')
							.setColor(Colors.normal)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					const reviewmessage = await interaction.channel.messages.fetch(suggestion.reviewMessageId);
					if (!reviewmessage) {
						const embed = new EmbedBuilder()
							// .setTitle('Error!')
							.setDescription(Emojis.error + ' That suggestion does not exist.') 
							.setColor(Colors.error)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					// get channel from guild
					const guild = await guilds.findOne({ guildID: interaction.guild.id });
					// find suggestionChannel
					const suggestionChannel = interaction.guild.channels.cache.get(`${guild.channelID}`);
					if (!suggestionChannel) {
						return interaction.reply({ content: 'Suggestion channel not found.', ephemeral: true });
					}
					const user = interaction.guild.members.cache.get(suggestion.author);

					const embed = new EmbedBuilder()
						//.setTitle(`Suggestion from ${user.user.tag}`)
						.setDescription(suggestion.suggestion)// set avatar image as author
						.setAuthor({ name: `New suggestion from ${user.user.tag}`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
						.setTimestamp()
						.setColor(Colors.normal)
					const embed2 = new EmbedBuilder()
						//.setTitle('Information')
						.setAuthor({ name: `New suggestion from ${user.user.tag}`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
						.addFields({ name: 'Suggestion:', value: `${suggestion.suggestion}` })
						.setColor(Colors.normal)
						.setTimestamp()
					const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`sug-${id}-approve`)
								.setLabel('Approve')
								.setEmoji(EmojiIds.success)
								.setStyle(3)
								.setDisabled(true),
							new ButtonBuilder()
								.setCustomId(`sug-${id}-deny`)
								.setLabel('Deny')
								.setEmoji(EmojiIds.error)
								.setStyle(4)
								.setDisabled(true),
						);
					await reviewmessage.edit({ embeds: [embed2], components: [row] });
					const row1 = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`sug-${id}-yes`)
								.setLabel(`${suggestion.votes.yes}`)
								.setEmoji(EmojiIds.success)
								.setStyle(2),
							new ButtonBuilder()
								.setCustomId(`sug-${id}-no`)
								.setLabel(`${suggestion.votes.no}`)
								.setEmoji(EmojiIds.error)
								.setStyle(2)
						);
					await suggestionChannel.send({ embeds: [embed], components: [row1] });
					const msg = await suggestionChannel.messages.fetch({ limit: 1 });
					// add suggestion to database and also add the message id
					await suggest.findOneAndUpdate({ id: id }, { $set: { messageId: msg.first().id } });
					await interaction.reply({ content: Emojis.success + ' Successfully approved this suggestion!', ephemeral: true });
				} else if (vote === 'deny') {
					const id = interaction.customId.split('-')[1];
					const suggestion = await suggest.findOne({ id: id });
					if (!suggestion) {
						const embed = new EmbedBuilder()
							//.setTitle('Error!')
							.setDescription(Emojis.error + ' This suggestion does not exist.')
							.setColor(Colors.error)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					const reviewmessage = await interaction.channel.messages.fetch(suggestion.reviewMessageId);
					if (!reviewmessage) {
						const embed = new EmbedBuilder()
							//.setTitle('Error!')
							.setDescription(Emojis.error + ' This suggestion does not exist.')
							.setColor(Colors.normal)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					const user = interaction.guild.members.cache.get(suggestion.author);
					const embed = new EmbedBuilder()
						.setTitle('Suggestion Denied')
						.setDescription(`Suggestion: ${suggestion.suggestion}`)
						.addFields(
							{ name: 'Denied by:', value: `${interaction.user.tag}` },
							{ name: 'Suggestion By:', value: `${user.user.tag}` },
							{ name: 'Denied at:', value: `${new Date().toLocaleString()}` },
						)
					.setColor(Colors.normal)
					const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`sug-${id}-approve`)
								.setLabel('Approve')
								.setEmoji(EmojiIds.success)
								.setStyle(3)
								.setDisabled(true),
							new ButtonBuilder()
								.setCustomId(`sug-${id}-deny`)
								.setLabel('Deny')
								.setEmoji(EmojiIds.error)
								.setStyle(4)
								.setDisabled(true),
						);
					await reviewmessage.edit({ embeds: [embed], components: [row] });
					await interaction.reply({ content: Emojis.error + ' Successfully denied this suggestion.', ephemeral: true });
				}
			}
	} else if (interaction.isButton() && interaction.customId.startsWith('verify-')) {
		const id = interaction.customId.split('-')[1];
		const verify = await verifySchema.findOne({ specificId: id });
		if (!verify) {
			const embed = new EmbedBuilder()
				.setDescription(Emojis.error + ' This verification does not exist.')
				.setColor(Colors.error)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		
		if (verify.type === 'channel-captcha') {
			const guild = interaction.guild;
			const member = guild.members.cache.get(interaction.user.id);
			const role = guild.roles.cache.get(`${verify.roleId}`);
			let date = Date.now();

			if (!role) {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' This role does not exist.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			if (member.roles.cache.has(verify.roleId)) {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' You are already verified.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			const channel = interaction.guild.channels.cache.get(verify.channelId);
			if (!channel) {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' This channel does not exist.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			const message = await channel.messages.fetch(verify.messageId);
			if (!message) {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' This message does not exist.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			
			if (verify.captchaType === 'instant') {
				await member.roles.add(role).catch(async (error) => {
					const embed = new EmbedBuilder()
						.setDescription(Emojis.error + ' I do not have permission to add that role. Please contact a server administrator.')
						.setColor(Colors.error)
					return await interaction.reply({ embeds: [embed], ephemeral: true });
				}
				);
				const embed = new EmbedBuilder()
					.setDescription(Emojis.success + ' You have been verified.')
					.setColor(Colors.success)
				return await interaction.reply({ embeds: [embed], ephemeral: true });
			}

			const captchaBuffer = await generateCaptcha(verify.captchaType);

			let text;
			if (verify.captchaType === 'pengu') {
				text = `${Emojis.rename} Type out the green colored characters from left to right. \n \n ${Emojis.no_decoy} Ignore the decoy characters, including the fake line. \n \n ${Emojis.case} You don\'t have to respect character cases.`;
			} else if (verify.captchaType === 'hailey') {
				text = `${Emojis.rename} Type out the characters from left to right. \n \n ${Emojis.case} You don\'t have to respect character cases.`;
			}

			const embed = new EmbedBuilder()
				.setTitle('Are you a human?')
				.setDescription('Please complete the captcha below to verify.')
				.addFields(
					{ name: 'Tips:', value: text, inline: false }
				)
				.setImage('attachment://captcha.png')
				.setColor(Colors.normal)
				.setFooter({ text: `Verification Time: 2 minutes.`})
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`captcha-${id}-${date}`)
						.setLabel('Answer')
						.setStyle(ButtonStyle.Success)
				)
			let captcha;
			try {
				captcha = await interaction.reply({ embeds: [embed], files: [{ attachment: captchaBuffer.captchaBuffer, name: 'captcha.png' }], components: [row], ephemeral: true });
			}
			catch {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' I was unable to send you a captcha.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			const filter = i => i.user.id === interaction.user.id;
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

			function generateModalCustomId(id, date) {
				return `${id}-${date}`;
			}
			let alreadyReplied = false;
			collector.on('collect', async i => {
				if (i.customId === `captcha-${id}-${date}`) {
					const modalCustomId = generateModalCustomId(id, date);
					const modal = new ModalBuilder()
						.setTitle('Are you a human?')
						.setCustomId(`modalCaptcha-${id}-${date}`)

					const answerInput = new TextInputBuilder()
						.setCustomId(`answerInput-${modalCustomId}`)
						.setLabel('Answer')
						.setStyle(TextInputStyle.Short)
					
					const row = new ActionRowBuilder().addComponents(answerInput);

					modal.addComponents(row);

					await i.showModal(modal);
					const submitted = await i.awaitModalSubmit({
						time: 120000,
						filter: (interaction) => interaction.user.id === i.user.id,
					}).catch((error) => {
						console.error(error);
						return null;
					});

					if (submitted && !alreadyReplied) {
						alreadyReplied = true;
						const answer = submitted.fields.getTextInputValue(`answerInput-${modalCustomId}`);
						if (answer.toLowerCase() === captchaBuffer.answer.toLowerCase()) {
							await submitted.deferUpdate().catch(() => {});
							let perms = true;
							await member.roles.add(role).catch(async (error) => {
								const embed = new EmbedBuilder()
									.setDescription(Emojis.error + ' I do not have permission to add that role. Please contact a server administrator.')
									.setColor(Colors.error)
								perms = false;
								return await i.followUp({ embeds: [embed], ephemeral: true });
							});
							if (!perms) return;
							await captcha.delete().catch(() => {});
							const followUp = new EmbedBuilder()
								.setDescription(Emojis.success + ' You have been verified.')
								.setColor(Colors.success)
							await interaction.followUp({ embeds: [followUp], ephemeral: true });
							await collector.stop();
						} else {
							await submitted.deferUpdate();
							const followUp = new EmbedBuilder()
								.setDescription(Emojis.error + ' That is not the correct answer. Please try again.')
								.setColor(Colors.error)
							await i.followUp({ embeds: [followUp], ephemeral: true });
							alreadyReplied = false;
						}
					}
				}
			});
			collector.on('end', async collected => {
				if (collected.size === 0) {
					const embed = new EmbedBuilder()
						.setDescription(Emojis.error + ' You did not answer in time. Please try again.')
						.setColor(Colors.error)
					await interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
				}
			}
			);
		} else if (verify.type === 'dm-captcha') {
			const guild = interaction.guild;
			const member = guild.members.cache.get(interaction.user.id);
			const role = guild.roles.cache.get(`${verify.roleId}`);

			if (!role) {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' This role does not exist.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			if (member.roles.cache.has(verify.roleId)) {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' You are already verified.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			const captchaBuffer = await generateCaptcha(verify.captchaType);

			let text;
			if (verify.captchaType === 'pengu') {
				text = `${Emojis.rename} Type out the green colored characters from left to right. \n \n ${Emojis.no_decoy} Ignore the decoy characters, including the fake line. \n \n ${Emojis.case} You don\'t have to respect character cases.`;
			} else if (verify.captchaType === 'hailey') {
				text = `${Emojis.rename} Type out the characters from left to right. \n \n ${Emojis.case} You don\'t have to respect character cases.`;
			}

			const embed = new EmbedBuilder()
				.setTitle('Are you a human?')
				.setDescription('Please complete the captcha below to verify.')
				.addFields(
					{ name: 'Tips:', value: text, inline: false }
				)
				.setImage('attachment://captcha.png')
				.setColor(Colors.normal)
				.setFooter({ text: `Verification Time: 2 minutes.`})
			let captcha;
			try {
				captcha = await interaction.user.send({ embeds: [embed], files: [{ attachment: captchaBuffer.captchaBuffer, name: 'captcha.png' }]});
				const dmUrl = `https://discord.com/channels/@me/${captcha.channel.id}`;
				const successEmbed = new EmbedBuilder()
					.setDescription(Emojis.success + ` I have sent you a captcha in [your DMs](${dmUrl}).`)
					.setColor(Colors.success)
				await interaction.reply({ embeds: [successEmbed], ephemeral: true });
			}
			catch (error) {
				console.log(error);
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' I was unable to send you a captcha.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			const filter = m => m.author.id === interaction.user.id;

			const collector = await captcha.channel.createMessageCollector({ filter, time: 2 * 60 * 1000 });
			
			collector.on('collect', async (message) => {
				if (message.content.toLowerCase() === captchaBuffer.answer.toLowerCase()) {
					let perms = true;
					await member.roles.add(role).catch(async (error) => {
						const embed = new EmbedBuilder()
							.setDescription(Emojis.error + ' I do not have permission to add that role. Please contact a server administrator.')
							.setColor(Colors.error)
						perms = false;
						return await message.channel.send({ embeds: [embed], ephemeral: true });
					});
					if (!perms) return;
					const embed = new EmbedBuilder()
						.setDescription(Emojis.success + ' You have been verified.')
						.setColor(Colors.success)
					await message.channel.send({ embeds: [embed], ephemeral: true });
					await collector.stop();
				} else {
					const embed = new EmbedBuilder()
						.setDescription(Emojis.error + ' That is not the correct answer. Please try again.')
						.setColor(Colors.error)
					await message.channel.send({ embeds: [embed], ephemeral: true });
				}
			}
			);
			await collector.on('end', async collected => {
				if (collected.size === 0) {
					const embed = new EmbedBuilder()
						.setDescription(Emojis.error + ' You did not answer in time. Please try again.')
						.setColor(Colors.error)
					await captcha.channel.send({ embeds: [embed], components: [], ephemeral: true });
				}
			}
			);
		}
	} else if (interaction.isButton() && interaction.customId.startsWith("get-link")) {
		const linkName = interaction.customId.split('-')[2];
		const links = await linkSchema.findOne({ guildID: interaction.guild.id });

		if (!links || !links.links.length > 0) {
			const embed = new EmbedBuilder()
				.setDescription(Emojis.error + ' This server has no links configured.')
				.setColor(Colors.error)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const link = await links.links.find((l) => l.linkName === linkName);

		if (!link) {
			const embed = new EmbedBuilder()
				.setDescription(Emojis.error + ' This Link Dispencer does not exist.')
				.setColor(Colors.error)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		let personalLink = await personalLinkSchema.findOne({ userId: interaction.user.id, guildID: interaction.guild.id });

		if (!personalLink) {
			personalLink = await new personalLinkSchema({
				userId: interaction.user.id,
				guildID: interaction.guild.id,
				linksThisMonth: 0,
			}).save();
		}

		if (personalLink.linksThisMonth >= link.linkLimit) {
			let date = Date.now();
			date = new Date(date);

			const day = date.getDate();
			if (day === 1) {
				personalLink.linksThisMonth = 0;
				await personalLink.save();
			} else {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' You have reached your link limit for this month.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		const randomLink = link.links[Math.floor(Math.random() * link.links.length)];
		let remaining = link.linkLimit - (personalLink.linksThisMonth + 1);
		let message = remaining === 1 ? 'link' : 'links';
		
		const embed = new EmbedBuilder()
			.setTitle('Your link is here!')
			.addFields(
				{ name: `${Emojis.link} Link`, value: `${Emojis.reply} ${randomLink.link}` },
			)
			.setFooter({ text: `You have ${remaining} ${message} remaining!`, iconURL: 'https://cdn.discordapp.com/emojis/1091035673882009651.png?v=1'})
			.setColor(Colors.normal)

		try {
			const onItsway = new EmbedBuilder()
				.setDescription(Emojis.loading + ' Your link is on its way! (Check your DMs)')
				.setColor(Colors.normal)
			await interaction.reply({ embeds: [onItsway], ephemeral: true });
			await interaction.user.send({ embeds: [embed] });
			personalLink.linksThisMonth++;
			await personalLink.save();
		} catch {
			const embed = new EmbedBuilder()
				.setDescription(Emojis.error + ' I was unable to send you a DM. Please enable DMs from server members.')
				.setColor(Colors.error)
			personalLink.linksThisMonth--;
			await personalLink.save();
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	}
	},
};