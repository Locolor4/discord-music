const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("muestra informacion acerca de la cancion actual"),
    
    run: async ({client,interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue) return await interaction.editReply("no hay canciones en la cola")

        let bar = queue.createProgressBar({
            queue:false,
            length: 19
        })

        const song = queue.current

        await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setThumbnail(song.thumbnail)
                .setDescription(`reproduciendo [${song.title}](${song.url})\n\n` + bar)
            ],
        })
    },
}