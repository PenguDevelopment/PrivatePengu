const { REST, Routes } = require('discord.js');

const chalk = require("chalk");
require('dotenv').config();
const clientId = process.env.CLIENT_ID;
// const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;
const fs = require('node:fs');
const path = require('node:path');
const commands = [];

// Function to recursively load command files from a specific folder
function loadCommandsFromFolder(folderPath) {
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    if ('data' in command && !command.subCommand || 'execute' in command && !command.subCommand) {
      commands.push(command.data.toJSON());
    } else if (!command.subCommand) {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Call the function to load commands from the root 'commands' folder
loadCommandsFromFolder(path.join(__dirname, 'commands'));

// Call the function to load commands from subfolders inside the 'commands' folder
const subfolders = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => fs.lstatSync(path.join(__dirname, 'commands', file)).isDirectory());
for (const subfolder of subfolders) {
  const subfolderPath = path.join(__dirname, 'commands', subfolder);
  loadCommandsFromFolder(subfolderPath);
}
// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		// blue is better
		console.log(`Started refreshing ${chalk.blue(`${commands.length}`)} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log(`${chalk.green("Success! ✔")} reloaded ${chalk.red(`${data.length}`)} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(`${chalk.red(`${error}`)}`);
  }
})();
