const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('Economy commands.')
        .addSubcommand(subcommand => subcommand
            .setName('bal')
            .setDescription('Check your balance.')
            .addUserOption(option => option.setName('user')
            .setDescription('The user to check the balance of.')
            .setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('clan')
            .setDescription('Check your clan.')
            .addUserOption(option => option.setName('user').setDescription('The user\'s clan you want to see.')))
        .addSubcommand(subcommand => subcommand
            .setName('codes')
            .setDescription('Redeem PenguEmpire Codes.')
            .addStringOption(option =>
              option
                .setName('code')
                .setDescription('Enter the code you want to redeem.')
                .setRequired(true)
            ))
        .addSubcommand(subcommand => subcommand
            .setName('daily')
            .setDescription('Claim your daily rewards by beating a random minigame. (currently in development)'))
        .addSubcommand(subcommand => subcommand
            .setName('dep')
            .setDescription('Deposit your money into your bank.')
            .addStringOption(option =>
              option.setName('amount').setDescription('Enter the amount you want to deposit.').setRequired(true)
            ))
        .addSubcommand(subcommand => subcommand
            .setName('edit-job')
            .setDescription('Edit your profile')
        )
        .addSubcommand(subcommand => subcommand
            .setName('gather')
            .setDescription('Gather supplies.'))
        .addSubcommand(subcommand => subcommand
            .setName('give')
            .setDescription('Give money to another user.')
            .addUserOption(option =>
              option
                .setName('user')
                .setDescription('Enter the user you want to give money to.')
                .setRequired(true)
            )
            .addIntegerOption(option =>
              option
                .setName('amount')
                .setDescription('Enter the amount you want to give.')
                .setRequired(true)
            ))
        .addSubcommand(subcommand => subcommand
            .setName('inventory')
            .setDescription('Check your inventory.')
            .addUserOption(option => option.setName('user').setDescription('The user to check the inventory of.').setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('join')
            .setDescription('Join the Empire.'))
        .addSubcommand(subcommand => subcommand
            .setName('lb')
            .setDescription('Shows the leaderboard')
            .addStringOption(option => option
              .setName('type')
              .setDescription('The type of leaderboard you want to see.')
              .setRequired(true)
              .addChoices({ name: 'Global', value: 'global' }, { name: 'Guild', value: 'guild' }))
            .addStringOption(option => option
              .setName('sort')
              .setDescription('The type of sort you want to see.')
              .setRequired(true)
              .addChoices(
                { name: 'Balance', value: 'Balance' },
                { name: 'Clan Members', value: 'members' },
                { name: 'Leafs', value: 'Leafs' },
                { name: 'Meat', value: 'Meat' },
                { name: 'Fish', value: 'Fish' },
                { name: 'Insects', value: 'Insects' }
              )))
        .addSubcommand(subcommand => subcommand
            .setName('refill')
            .setDescription('Refill your turns once a day.'))
        .addSubcommand(subcommand => subcommand
            .setName("rob")
            .setDescription("Rob someone for money.")
            .addUserOption((option) => option
              .setName("user")
              .setDescription("Enter the user you want to rob.")
              .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName("with")
            .setDescription("Withdraw your money from your bank.")
            .addStringOption((option) => option
              .setName("amount")
              .setDescription("Enter the amount you want to withdraw.")
              .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('work')
            .setDescription('Work for money'))
}
module.exports.category = 'economy';