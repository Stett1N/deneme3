const { Client, Collection, GatewayIntentBits, Partials, ChannelType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { prefix, owner, token } = require("./config.js");
const { readdirSync } = require("fs");
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ],
    shards: "auto",
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember
    ]
});

client.commands = new Collection();

const rest = new REST({ version: '10' }).setToken(token);

const log = l => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${l}`) };

// Command Handler
const commands = [];
const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    commands.push(command.data); // Burayı değiştirdik
    client.commands.set(command.data.name, command);
}


client.on("ready", async () => {
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
    } catch (error) {
        console.error(error);
    }
    log(`${client.user.username} Aktif Edildi!`);
});

// Event Handler
const eventFiles = readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.run(client, interaction);
    } catch (error) {
        console.error(error);
        if (interaction.deferred || interaction.replied) return;
        await interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'ticket-modal') {
            const userId64 = interaction.fields.getTextInputValue('userId64');
            const complaint = interaction.fields.getTextInputValue('complaint');
            const selectedOption = interaction.customId.split('-')[1];

            const channel = await interaction.guild.channels.create({
                name: `destek-${selectedOption}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Destek Talebi: ${selectedOption}`)
                .addFields(
                    { name: '64 ID', value: userId64 },
                    { name: 'Şikayet', value: complaint }
                );

            await channel.send({ embeds: [embed] });
            await interaction.reply({ content: `Destek talebi oluşturuldu: ${channel}`, ephemeral: true });
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'ticket-menu') {
        const selectedOption = interaction.values[0];
        require('./src/commands/ticket-modal').execute(interaction, selectedOption);
    }
});

client.login(token);
