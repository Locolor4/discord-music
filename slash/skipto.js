const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("saltea a la cancion seleccionada")
        .addNumberOption((option) =>
            option.setName("tracknumber").setDescription("cancion a la cual saltar").setMinValue(1).setRequired(true)),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("no hay canciones en la cola")

        const trackNum = interaction.options.getNumber("tracknumber")
        if(trackNum > queue.tracks.length)
            return await interaction.editReply("Numero de cancion invalido kgada")
        queue.skipTo(trackNum - 1)

        await interaction.editReply(`cancion salteada a ${trackNum}`)
    },
}