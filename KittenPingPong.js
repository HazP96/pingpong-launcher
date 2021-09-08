const SECRETS = require("./secrets.js");
const tmi = require("tmi.js");
const axios = require("axios");

let ballCount = 1;

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
const launchBall = () => {
  axios
    .post(`http://${SECRETS.ip}/switch/pingpong/turn_on`, {
      todo: "Toggle",
    })
    .then((result) => {
      console.log("Server fired ball");
    })
    .catch((error) => {
      console.log("Server failed to fire ball");
    });
};

const resetBallCount = () => {
  ballCount = 25
}

client.on("message", (channel, tags, message, self) => {
  if (self) return;
  
  if (message === "!ballcount") {
    client.say(channel, `@${tags.username} there is ${ballCount} ball${ballCount !== 1 ? "'s" : ""} remaining`);
  }

  const userName  = tags.username.toLowerCase();

  if (userName === "mawrtron" || userName === "tormentend_hazard" || userName === "bic_dig_boii") {
    if (message === "balls out for Harambe") {
      ballCount--;
      launchBall();
      client.say(channel, `There are ${ballCount} balls remaining!`);
      client.say(channel,`Thanks @${userName}! Dropping another ball for our fallen brother, Harambe! RIP hairy lad.`);
    }
  }

  if ((userName === "mawrtron" || userName === "tormented_hazard" || userName === "bic_dig_boii" || userName === "kittenclubhouse") && message === "!reload") {
    resetBallCount();
    client.say(channel, `lock and load!`);
  }

  if (userName === "streamelements" && message.includes("bitties for the kitties!")) { // Stream elements zone
    const regEx = /\d+/;
    const userNameFromString = message.split(" ")[0];
    const bitCount = message.toLowerCase().match(regEx)[0];
    
    if (ballCount == 0) {
      client.say(channel, `There are no balls remaining, nag me to refil`)
    } else if (parseInt(bitCount) >= 500) {
      ballCount--;
      launchBall();
      client.say(channel,`Thanks @${userNameFromString}! Dropping another ball for the kittens`);
      client.say(channel, `There are ${ballCount} balls remaining!`);
    } else {
      //Do nothing
    }
  }
  // No user interaction
});
