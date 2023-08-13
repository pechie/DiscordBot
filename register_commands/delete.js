require("dotenv").config();
const axios = require("axios").default;

let url = `https://discord.com/api/v8/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands/1140037128923910316`;

const headers = {
  Authorization: `Bot ${process.env.BOT_TOKEN}`,
  "Content-Type": "application/json",
};

axios.delete(url, {
  headers: headers,
});
