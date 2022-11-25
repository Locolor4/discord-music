const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("pausea la cancion"),
    
    run: async ({client,interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue) return await interaction.editReply("no hay canciones en la cola")
        
        queue.setPaused(true)
        await interaction.editReply("cancion pausada")
    },
}