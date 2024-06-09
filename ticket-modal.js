const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ticket-modal',
    },
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('ticket-modal')
            .setTitle('Destek Talebi');

        const userId64Input = new TextInputBuilder()
            .setCustomId('userId64')
            .setLabel('64 ID')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Lütfen 64 ID\'nizi girin')
            .setRequired(true);

        const complaintInput = new TextInputBuilder()
            .setCustomId('complaint')
            .setLabel('Şikayet')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Lütfen şikayetinizi girin')
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(userId64Input);
        const secondActionRow = new ActionRowBuilder().addComponents(complaintInput);

        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);
    },
};
