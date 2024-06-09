const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Bir destek talebi oluşturun.'),
    async run(client, interaction) {
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Destek Talebi')
            .setDescription('**Destek talebi hakkında bilgi**\n・Destek talebi oluşturmak için aşağıdaki butona tıklayın.\n・Yetkililerimiz en kısa sürede yanıt vereceklerdir.\n\n**Destek Kuralları**\n・Troll, alakasız, saçma talepler ceza almanıza neden olur.\n・Ticket içerisinde saygılı olunuz ve yetkilileri etiketlemeyin!\n・Burası selamlaşma yeri değildir! Selam, Kimse var mı gibi şeyler yazmak yerine direk sorununuzu belirtiniz..\nFoxt Scp',);

        const options = [
            {
                label: 'RolePlay',
                value: 'roleplay',
                description: 'RolePlay ile ilgili bir destek talebi oluşturun.',
            },
            {
                label: 'Modlu',
                value: 'modlu',
                description: 'Modlu ile ilgili bir destek talebi oluşturun.',
            },
            {
                label: 'Discord',
                value: 'discord',
                description: 'Discord ile ilgili bir destek talebi oluşturun.',
            },
            {
                label: 'Yetkili Şikayet',
                value: 'yetkili-sikayet',
                description: 'Bir yetkili hakkında şikayet oluşturun.',
            },
        ];

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket-menu')
            .setPlaceholder('Bir seçenek belirleyin')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
