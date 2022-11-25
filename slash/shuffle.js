const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("cola aleatoria"),
    
    run: async ({client,interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue) return await interaction.editReply("no hay canciones en la cola")
        
        queue.shuffle()
        await interaction.editReply("cola mezclada")
    },
}