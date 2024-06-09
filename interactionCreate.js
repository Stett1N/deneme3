const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === 'ticket-menu') {
            const selectedOption = interaction.values[0];
            const modal = require('../commands/ticket-modal');
            await modal.execute(interaction);
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'ticket-modal') {
                const userId64 = interaction.fields.getTextInputValue('userId64');
                const complaint = interaction.fields.getTextInputValue('complaint');

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
    },
};
