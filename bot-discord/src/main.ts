import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, () => {
    console.log("Le bot est prêt à pinger");
});

client.on(Events.MessageCreate, (message) => {
    console.log("Un message a été posté par", message.author.displayName, message.content)
});

await client.login(process.env.BOT_TOKEN);