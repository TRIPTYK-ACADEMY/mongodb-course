import { Client, Events, GatewayIntentBits } from 'discord.js';
import express from 'express';

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Express server listening on port ${PORT}`);
});

client.on(Events.MessageCreate, (message) => {
	console.log(`Message from ${message.author.tag}: ${message.content}`);
});

await client.login(process.env.DISCORD_BOT_TOKEN);

console.log('Bot is running...');

