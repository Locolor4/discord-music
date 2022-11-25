const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("reproduce canciones pedidas por el mima")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("cancion")
                .setDescription("carga una cancion desde una url")
                .addStringOption((option) => option.setName("url").setDescription("url de la canción").setRequired(true))
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("playlist")
                .setDescription("añade una playlist desde una url")
                .addStringOption((option) => option.setName("url").setDescription("la url de la playlist").setRequired(true))
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("buscar")
                .setDescription("buscar nombres de canciones")
                .addStringOption((option) => option.setName("searchterms").setDescription("introduce el nombre de la cancion p").setRequired(true))
        ),
        run: async ({client,interaction}) => {
            if(!interaction.member.voice.channel){
                return interaction.editReply("entra a un canal de voz primero p no seas cholo")
            }

            const queue = await client.player.createQueue(interaction.guild)
            if(!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new EmbedBuilder()

            if(interaction.options.getSubcommand() === "cancion"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if(result.tracks.length === 0){
                    return interaction.editReply("No hay resultados bbto")
                }
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`la cancion ${song.title}[${song.url}] fue añadida a la cola`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({text: `duración: ${song.duration}`})
            }else if(interaction.options.getSubcommand() === "playlist") {
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
                if(result.tracks.length === 0){
                    return interaction.editReply("No hay resultados bbto")
                }
                const playlist = result.playlist
                await queue.addTracks(result.tracks)
                embed
                    .setDescription(`${result.tracks.length} canciones fueron añadidas desde ${playlist.title} [${playlist.url}]`)
                    .setThumbnail(playlist.thumbnail)
            }else if(interaction.options.getSubcommand() === "buscar"){
                let url = interaction.options.getString("searchterms")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                if(result.tracks.length === 0){
                    return interaction.editReply("No hay resultados bbto")
                }
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`la cancion ${song.title}[${song.url}] fue añadida a la cola`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({text: `duración: ${song.duration}`})
            }
            if(!queue.playing) await queue.play()
            await interaction.editReply({
                embeds: [embed]
            })
        }
}
