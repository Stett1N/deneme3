const {SlashCommandBuilder, Embed, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require ('discord.js')

module.exports = {
data:new SlashCommandBuilder()
.setName("raporstn")
.setDescription("Kisiyi rapor et")
.addUserOption(option => option.setName('kisi').setDescription('rapor edilecek kisi'))
.addStringOption(option => option.setName('sebep').setDescription('Sebep belirtin')),
run: async (client, interaction) => {
    const kullanici = interaction.options.getUser('kisi')
    const neden = interaction.options.getString('sebep')
    const yeni = new EmbedBuilder()
    .setColor(0x0ffa2f)
    .setThumbnail(`https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2hlYWc1cWpwY3J6NHFlMm1hcnh2MmJ0NTRkaWo3OHJoNjhreGQ5cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v8cANzZwAHZ0cGNxPx/giphy.gif`)
    .setDescription(`Bu kişi ${kullanici}
    
    ${neden}:  sebebiyle rapor olusturdu `)

    const onyl = new ButtonBuilder()
            .setCustomId('onayla')
            .setLabel('Onayla')
            .setStyle(ButtonStyle.Success);

        const rd = new ButtonBuilder()
            .setCustomId('red')
            .setLabel('Reddedildi')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
        .addComponents(onyl)
        .addComponents(rd)

    let channel = await client.channels.fetch("1248796914758193215")
    channel.send({embeds: [yeni], components: [row]})
    interaction.reply("rapor gonderildi")

}
}