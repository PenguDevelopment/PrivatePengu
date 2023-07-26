// import { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder } from "discord.js";
// import { readdirSync } from "fs";
// import { join } from "path";
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// let data = new SlashCommandBuilder()
//     .setName("help-economy")
//     .setDescription("Get help with any command in PenguEmpire.")
//     .addStringOption((option) => option
//     .setName("command")
//     .setDescription("Enter the command you want help with.")
//     .setRequired(false));
// export { data };
// export async function execute(interaction) {
//     var randomColor = Math.floor(Math.random() * 16777215).toString(16);
//     const commands = readdirSync(join(__dirname, '..', 'commands', 'economy'))
//         .filter(file => file.endsWith('.js'));
//     const command = interaction.options.getString("command");
//     const embed = new EmbedBuilder()
//         .setTitle("PenguEmpire Commands")
//         .setDescription("Here are all the commands you can use in PenguEmpire.")
//         .setColor(randomColor)
//         .setTimestamp();
//     const row = new ActionRowBuilder()
//         .addComponents(new ButtonBuilder()
//         .setLabel("PenguDev")
//         .setStyle(5)
//         .setURL("https://discord.gg/haAUu2DaWm"));
//     if (command) {
//         const cmd = commands.find((c) => c.split(".")[0] === command.toLowerCase());
//         if (!cmd) {
//             const notExist = new EmbedBuilder()
//                 .setTitle("Piplup Not Found!")
//                 .setDescription("The command you entered does not exist.")
//                 .setColor(randomColor)
//                 .setTimestamp();
//             await interaction.reply({ embeds: [notExist] });
//         }
//         else {
//             const commandFile = await import(`../commands/economy/${cmd}`);
//             const data = commandFile.data;
//             const name = data.name;
//             const description = data.description;
//             const options = data.options;
//             const embed = new EmbedBuilder()
//                 .setTitle(`Help with ${name}`)
//                 .setDescription(description)
//                 .setColor(randomColor)
//                 .setTimestamp();
//             if (options) {
//                 for (let i = 0; i < options.length; i++) {
//                     embed.addFields({ name: options[i].name, value: options[i].description });
//                 }
//             }
//             await interaction.reply({ embeds: [embed] });
//         }
//     }
//     else {
//         for (let i = 0; i < commands.length; i++) {
//             const commandFile = await import(`../commands/economy/${commands[i]}`);
//             const data = commandFile.data;
//             const name = data.name;
//             const description = data.description;
//             embed.addFields({ name: name, value: description });
//         }
//         await interaction.reply({ embeds: [embed], components: [row] });
//     }
// }