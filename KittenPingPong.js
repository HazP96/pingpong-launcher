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
    // Grabs persons username on twitch and returns it in a string to confirm bot is running.]
    client.say(channel, `Hey @${tags.username}, all up and running!`);
  }
// uncomment below log to test if prompts are working in terminal.
// console.log("Hello World");
});
