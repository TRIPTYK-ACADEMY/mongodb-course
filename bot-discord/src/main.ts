import { ActivityType, Client, Events, GatewayIntentBits, Partials, TextChannel } from "discord.js";
import { connect } from "mongoose";
import { TrackingModel } from "./tracker.ts";
import { ReminderModel } from "./reminders.ts";

await connect("mongodb://root:test123@localhost:27017/bot?authSource=admin");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});



client.on(Events.MessageReactionAdd, async (reaction) => {
    const messageId = reaction.message.id;
    const userId = reaction.users.cache.last()?.id;
    
    if (!userId) return;
    
    const reminder = await ReminderModel.findOne({
        "reminders.messageId": messageId
    });
    
    if (reminder) {
        const reminderItem = reminder.reminders.find(r => r.messageId === messageId);
        
        if (reminderItem && !reminderItem.reactions.includes(userId)) {
            reminderItem.reactions.push(userId);
            await reminder.save();
        }
    }
});

client.on(Events.MessageReactionRemove, (reaction) => {
    console.log("reactionremove",reaction);
});

client.once(Events.ClientReady, async (c) => {
    c.user.setActivity("MongoDB Course", { type: ActivityType.Competing });
    c.user.setUsername("MongolBot Amaury")
    c.user.setPresence({
        status: "dnd"
    })
    console.log("Le bot est prêt à pinger");
});

/**
 * Filtre anti
*/
client.on(Events.MessageCreate, async (message) => {
    const content = message.content.toLowerCase().trim();
    const MONGO_CHANNEL_ID = "1448246373354049718";
    
    // on écoute que dans le channel mongodb
    if (message.channelId !== MONGO_CHANNEL_ID) return;
    
    // utilisateurs qui sont taggés
    // const taggedUsers = message.mentions.users;
    if (message.author.id === client.user?.id) return;
    
    if (content.includes("angular")) {
        let tracking = await TrackingModel.findOne({
            userId: message.author.id
        });
        
        if (tracking) {
            tracking.angularCount += 1;
        } else {
            tracking = new TrackingModel({
                userId: message.author.id,
                angularCount: 1
            });
        }
        
        await tracking.save();
        
        await message.reply("Attention, vous utilisez le mot interdit qui est angular, vous l'avez dit " + tracking.angularCount + " fois");
    }
});

await client.login(process.env.BOT_TOKEN);

setInterval(async () => {
    const reminders = await ReminderModel.find();
    const channel = await client.channels.fetch("1449047431818772621") as TextChannel;
    await channel.guild.members.fetch();
    
    for (const reminder of reminders) {
        const hours = parseInt(reminder.time.split("-")[0], 10);
        const minutes = parseInt(reminder.time.split("-")[1], 10);
        const now = new Date();

        console.log(reminder);
        

        // send notification five minutes before
        const reminderTime = new Date(now);
        reminderTime.setHours(hours, minutes - 5, 0, 0);

        if (now.getHours() === reminderTime.getHours() && now.getMinutes() === reminderTime.getMinutes()) {
            const sent = await channel.send(`@everyone: ${reminder.message}`);

            reminder.reminders.push(
                {
                    messageId: sent.id,
                    reactions: []
                }
            );

            await reminder.save();
        }

        console.log(now.getMinutes());
        
        console.log(now.getHours() === hours,now.getMinutes() === minutes);
        
        if (now.getHours() === hours && now.getMinutes() === minutes) {


            let usersToPing = channel.guild.members.cache
                .filter(member => !member.user.bot)
                .filter(member => member.roles.cache.some(role => role.name === "Apprenants"))
                .map(member => member.user.id)
                .filter(memberId => !reminder.reminders.some(r => r.reactions.includes(memberId)))

            console.log(usersToPing);
            


            await channel.send(usersToPing.map(userId => `<@${userId}>`).join(" ") + " " + reminder.message);
        }
    }
}, 60000);