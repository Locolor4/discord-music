const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("muestra la playlist actual")
        .addNumberOption((option) => option.setName("page").setDescription("numero de pagina").setMinValue(1)),

    run: async ({ client,interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if(!queue || !queue.playing){
            return await interaction.editReply("no hay canciones en la cola")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if(page > totalPages){
            return await interaction.editReply(`pagina inexistente, solo existen ${totalPages}`)
        }

        const queueString = queue.tracks.slice(page*10, page*10+10).map((song,i) => {
            return `${page * 10 + i + 1}. \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}`
        }).join("\n")

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Reproduciendo**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "none") +
                    `\n\n**queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `pagina ${page + 1} de ${totalPages}`,
                    })
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}