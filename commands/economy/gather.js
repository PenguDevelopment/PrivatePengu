const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

async function execute(interaction) {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const user = await pengu.findOne({ id: interaction.user.id });
    const turns = user.clanturns;
    if (turns == 0) {
        const embed = new EmbedBuilder()
            .setTitle('Gather')
            .setDescription(`You have no more turns left today.`)
            .addFields({ name: 'Current Location:', value: 'Earth' })
            .setColor(randomColor)
            .setTimestamp();
        const disabledRow = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
            .setCustomId('meat')
            .setLabel('Go Hunting')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true), new ButtonBuilder()
            .setCustomId('leafs')
            .setLabel('Go Foraging')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true), new ButtonBuilder()
            .setCustomId('fish')
            .setLabel('Go Fishing')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true), new ButtonBuilder()
            .setCustomId('insects')
            .setLabel('Go Insect Catching')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true));
        return await interaction.reply({ embeds: [embed], components: [disabledRow] });
    }
    const embed = new EmbedBuilder()
        .setTitle('Gather')
        .setDescription(`Collect food and resources for your clan's hoard.`)
        .setAuthor({ name: `Turns Left Today: ${turns}` })
        .addFields({ name: 'Current Location:', value: 'Earth' })
        .setColor(randomColor)
        .setTimestamp();
    const row = new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
        .setCustomId('meat')
        .setLabel('Go Hunting')
        .setStyle(ButtonStyle.Danger), new ButtonBuilder()
        .setCustomId('leafs')
        .setLabel('Go Foraging')
        .setStyle(ButtonStyle.Success), new ButtonBuilder()
        .setCustomId('fish')
        .setLabel('Go Fishing')
        .setStyle(ButtonStyle.Primary), new ButtonBuilder()
        .setCustomId('insects')
        .setLabel('Go Insect Catching')
        .setStyle(ButtonStyle.Secondary));
    const message = await interaction.reply({ embeds: [embed], components: [row] });
    let collecotor = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30 * 1000 });
    collecotor.on('collect', async (i) => {
        let values = i.customId;
        if (i.user.id === interaction.user.id) {
            if (turns <= 1) {
                const embed = new EmbedBuilder()
                    .setTitle('Gather')
                    .setDescription(`You have no more turns left today.`)
                    .addFields({ name: 'Current Location:', value: 'Earth' })
                    .setColor(randomColor);
                return await i.update({ embeds: [embed], components: [row] });
            }
            if (values == 'meat') {
                const meat = Math.floor(Math.random() * 10) + 1;
                await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { clanturns: -1 } });
                const user = await pengu.findOne({ id: interaction.user.id });
                const turns = user.clanturns;
                const embed = new EmbedBuilder()
                    .setTitle('Gather')
                    .setDescription(`You went hunting and found ${meat} meat.`)
                    .setAuthor({ name: `Turns Left Today: ${turns}` })
                    .addFields({ name: 'Current Location:', value: 'Earth' })
                    .setColor(randomColor)
                    .setTimestamp();
                if (turns <= 0) {
                    const row = new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                        .setCustomId('meat')
                        .setLabel('Go Hunting')
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('leafs')
                        .setLabel('Go Foraging')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('fish')
                        .setLabel('Go Fishing')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('insects')
                        .setLabel('Go Insect Catching')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true));
                    return await i.update({ embeds: [embed], components: [row] });
                }
                else {
                    await i.update({ embeds: [embed], components: [row] });
                    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { meat: meat } });
                }
            }
            if (values == 'leafs') {
                const leafs = Math.floor(Math.random() * 10) + 1;
                await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { clanturns: -1 } });
                const user = await pengu.findOne({ id: interaction.user.id });
                const turns = user.clanturns;
                const embed = new EmbedBuilder()
                    .setTitle('Gather')
                    .setDescription(`You went foraging and found ${leafs} leafs.`)
                    .setAuthor({ name: `Turns Left Today: ${turns}` })
                    .addFields({ name: 'Current Location:', value: 'Earth' })
                    .setColor(randomColor)
                    .setTimestamp();
                if (turns <= 0) {
                    const row = new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                        .setCustomId('meat')
                        .setLabel('Go Hunting')
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('leafs')
                        .setLabel('Go Foraging')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('fish')
                        .setLabel('Go Fishing')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('insects')
                        .setLabel('Go Insect Catching')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true));
                    return await i.update({ embeds: [embed], components: [row] });
                }
                else {
                    await i.update({ embeds: [embed], components: [row] });
                    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { leafs: leafs } });
                }
            }
            if (values == 'fish') {
                const fish = Math.floor(Math.random() * 10) + 1;
                await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { clanturns: -1 } });
                const user = await pengu.findOne({ id: interaction.user.id });
                const turns = user.clanturns;
                const embed = new EmbedBuilder()
                    .setTitle('Gather')
                    .setDescription(`You went fishing and found ${fish} fish.`)
                    .setAuthor({ name: `Turns Left Today: ${turns}` })
                    .addFields({ name: 'Current Location:', value: 'Earth' })
                    .setColor(randomColor)
                    .setTimestamp();
                if (turns <= 0) {
                    const row = new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                        .setCustomId('meat')
                        .setLabel('Go Hunting')
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('leafs')
                        .setLabel('Go Foraging')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('fish')
                        .setLabel('Go Fishing')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('insects')
                        .setLabel('Go Insect Catching')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true));
                    return await i.update({ embeds: [embed], components: [row] });
                }
                else {
                    await i.update({ embeds: [embed], components: [row] });
                    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { fish: fish } });
                }
            }
            if (values == 'insects') {
                const insects = Math.floor(Math.random() * 10) + 1;
                await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { clanturns: -1 } });
                const user = await pengu.findOne({ id: interaction.user.id });
                const turns = user.clanturns;
                const embed = new EmbedBuilder()
                    .setTitle('Gather')
                    .setDescription(`You went insect catching and found ${insects} insects.`)
                    .setAuthor({ name: `Turns Left Today: ${turns}` })
                    .addFields({ name: 'Current Location:', value: 'Earth' })
                    .setColor(randomColor)
                    .setTimestamp();
                if (turns <= 0) {
                    const row = new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                        .setCustomId('meat')
                        .setLabel('Go Hunting')
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('leafs')
                        .setLabel('Go Foraging')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('fish')
                        .setLabel('Go Fishing')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true), new ButtonBuilder()
                        .setCustomId('insects')
                        .setLabel('Go Insect Catching')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true));
                    return await i.update({ embeds: [embed], components: [row] });
                }
                else {
                    await i.update({ embeds: [embed], components: [row] });
                    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { insects: insects } });
                }
            }
        }
        else {
            i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
        }
    });
}
;

module.exports.execute = execute;
module.exports.subCommand = "economy.gather";