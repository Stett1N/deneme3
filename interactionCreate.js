const { EmbedBuilder, InteractionType } = require("discord.js");
const { readdirSync } = require("fs");
const { owner } = require("../../config.js");
const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction, client) => {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.run(client, interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) return;
                await interaction.reply({ content: 'Bir hata oluştu!', ephemeral: true });
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'ticketModal') {
                const selectedOption = interaction.fields.getComponent('select').values[0];
                const reason = interaction.fields.getComponent('reasonInput').value;

                // Burada seçilen seçenek ve girilen açıklama ile gerekli işlemler yapılabilir
                console.log(`Seçilen Seçenek: ${selectedOption}, Açıklama: ${reason}`);

                await interaction.reply({ content: 'Ticket talebi alındı!', ephemeral: true });
            } else {
                return;
            }
        } else {
            // Diğer etkileşim türleri için işlem yapılmayacak
            return;
        }
    }
}
