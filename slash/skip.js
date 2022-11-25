const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("saltea la cancion actual"),
    
    run: async ({client,interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue) return await interaction.editReply("no hay canciones en la cola")
        
        const currentSong = queue.current

        queue.skip()
        await interaction.editReply({
            embeds: [
                new EmbedBuilder().setDescription(`${currentSong.title} fue salteada`).setThumbnail(currentSong.thumbnail)
            ]
        })
    },
}