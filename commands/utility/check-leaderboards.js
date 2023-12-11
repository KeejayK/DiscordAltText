const { SlashCommandBuilder, MessageEmbed, EmbedBuilder } = require('discord.js');
const database = require('../../firebase.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check-leaderboards')
		.setDescription('Shows alt text leaderboard.'),
	async execute(interaction, args) {
        guild_id = interaction.guild.id;

        var embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setColor('#3498db')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/5987/5987898.png');

        // Limit the leaderboard to 10 entries
        let count = 0;
        users = [];

		leaderboard_data = await database.ref(`${guild_id}/`).orderByValue();
        await leaderboard_data.once('value')
            .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    count += 1;
                    const user_id = childSnapshot.key;
                    const points = childSnapshot.val();
                    console.log(`User_id: ${user_id}`);
                    console.log(`points: ${points}`);

                    if (count <= 10) {
                        // Add the field to the embed
                        users.push([user_id, points]);
                    }
                })
            })

    console.log(users);
    var ranking = 0
    // Users is an array of [user_id , points] pairs
    users.reverse().forEach(async (entry) => {
        ranking += 1; 
        user_id = entry[0];
        points = entry[1];
        // TODO: need to make it so that it displays the user's display name, not id.
        // const name = await interaction.guild.members.fetch(user_id).displayName;
        // console.log(name)
        embed.addFields({name: `#${ranking} - ${user_id}`, value: `Score: ${points}`, inline: false});
    });
    
    await interaction.reply({ embeds: [embed] });
	},
};