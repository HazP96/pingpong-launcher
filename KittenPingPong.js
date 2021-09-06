import { SECRETS } from "../secrets";
const tmi = require("tmi.js");

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    cluster: "aws",
    reconnect: true,
  },
  identity: {
    username: SECRETS.username,
    password: SECRETS.password,
  },
  channels: [SECRETS.channels],
});

client.connect();

client.on("message", (channel, tags, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  if (message.toLowerCase() === "!test") {
    // "@alca, heya!"
    client.say(channel, `Hey @${tags.username}, all up and running!`);
  }

console.log("Hello World");
});
