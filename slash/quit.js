const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("detiene el bot y limpia la cola de reproduccion"),
    
    run: async ({client,interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue) return await interaction.editReply("no hay canciones en la cola")
        
        queue.destroy()
        await interaction.editReply("alamos crranos feos")
    },
}