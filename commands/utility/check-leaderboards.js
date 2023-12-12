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
                    const username = childSnapshot.val().username;
                    const points = childSnapshot.val().points;
                    // console.log(`User ID: ${user_id}, Username: ${username}, Points: ${points}`);

                    if (count <= 10) {
                        // Add the field to the embed
                        users.push([username, points]);
                    }
                })
            })

    // sort the users by points. (index 1 is the number of points)
    users.sort((userA, userB) => userB[1] - userA[1]);

    var ranking = 0
    // Users is an array of [user_id , points] pairs
    users.forEach(async (entry) => {
        ranking += 1; 
        username = entry[0];
        points = entry[1];
        // TODO: need to make it so that it displays the user's display name, not id. this has been done :D
        // const name = await interaction.guild.members.fetch(user_id).displayName;
        // console.log(name) 
        embed.addFields({name: `#${ranking} - ${username}`, value: `Score: ${points}`, inline: false});
    });
    
    await interaction.reply({ embeds: [embed] });
	},
};