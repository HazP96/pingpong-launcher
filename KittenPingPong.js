const SECRETS = require("./secrets.js");
const tmi = require("tmi.js");
const axios = require("axios");

let ballCount = 25;

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

//This is the function that allows the HTTP post is sent to server to trigger drop.
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
  //Ignores itself if accidentally uses a trigger ir someone is logged into the account.
  
  if (message === "!ballcount") {
    client.say(channel, `@${tags.username} there is ${ballCount} ball${ballCount !== 1 ? "'s" : ""} remaining`);
  }
  //Returns the remaining amount of balls in the tube - Avalible to everyone.

  const userName  = tags.username.toLowerCase();
  //Grabs persons twitch user and makes it into a const for the triggers to pull into messages.

  if ((userName === "mawrtron" || userName === "tormented_hazard" || userName === "bic_dig_boii" || userName ==="kittenclubhouse") && message ==="FIRE!") {
    ballCount--;
    launchBall();
    client.say(channel,`I AM FIRING THE CANNON NOW!!`);
    client.say(channel, `There are ${ballCount} balls remaining!`);
  }
  //Allows the manual firing of pingpongballs if there are bits donated when there are none in the chamber.

  if (userName === "mawrtron" || userName === "tormented_hazard" || userName === "bic_dig_boii") {
    if (message === "balls out for Harambe") {
      ballCount--;
      launchBall();
      client.say(channel, `There are ${ballCount} balls remaining!`);
      client.say(channel,`Thanks @${userName}! Dropping another ball for our fallen brother, Harambe! RIP hairy lad.`);
    }
  }
  //Dont worry about this, easter eggs are fun. - Avalible to only the coolest of dudes.

  if ((userName === "mawrtron" || userName === "tormented_hazard" || userName === "bic_dig_boii" || userName === "kittenclubhouse") && message === "!reload") {
    resetBallCount();
    client.say(channel, `locked and loaded!`);
  }
  //If balls are restocked use the !reload command in twitch chat to reset the counter. -Avalibe to admins. Set the userNames as your admins twitch users.

  //This is the main triggering mechanism, when someone donates bits, stream labs announces it and this function grabs that and sends the HTTP request.  -Avalibe to StreamElements only!
  if (userName === "streamelements" && message.includes("bitties for the kitties!")) { // Stream elements zone + custom bit donation message ender for the statement to zone in on.
    const regEx = /\d+/;
    const userNameFromString = message.split(" ")[0];
    const bitCount = message.toLowerCase().match(regEx)[0];
    //Grabs bit amount and user name to pass on to check if enough bits were donated.
    
    //Makes sure there are balls to drop first.
    if (ballCount == 0) {
      client.say(channel, `There are no balls remaining, nag me to refil`)
    } else if (parseInt(bitCount) >= 500) {
      ballCount--;
      launchBall();
      client.say(channel,`Thanks @${userNameFromString}! Dropping another ball for the kittens`);
      client.say(channel, `There are ${ballCount} balls remaining!`);
      //If the bit donation is enough it triggers a drop and thanks the user.
    } else {
      //Do nothing
    }

    }
    
  }
  // No user interaction
);
