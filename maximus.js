const { Client } = require("discord.js");
const genel = require("./genel.json")
const { tokens, channels, staffRoles, unregisterRoles, welcomeSound, staffSound } = require("./ayarlar.json");

tokens.forEach((token, i) => {
  const client = new Client()
  let connection;
  client.on("ready", async () => connection = await client.channels.cache.get(channels[i]).join());

  client.on("voiceStateUpdate", async (oldState, newState) => {
    if ((oldState.channelID && !newState.channelID) || (oldState.channelID && newState.channelID && oldState.channelID === newState.channelID) || newState.member.user.bot || newState.channelID !== channels[i]) return;
    const hasStaff = newState.channel.members.some((x)=> staffRoles.some((r) => x.roles.cache.has(r)));
    const staffSize = newState.channel.members.filter((x) => staffRoles.some((r) => x.roles.cache.has(r))).size;
    const unregisterSize = newState.channel.members.filter((x) => unregisterRoles.some((r) => x.roles.cache.has(r))).size;
    if (!hasStaff && unregisterSize === 1) await connection.play(welcomeSound);
    else if (hasStaff && staffSize === 1 && unregisterSize === 1) await connection.play(staffSound);
  });

  client.on("ready", async () => {
    client.user.setPresence({ activity: { name: genel.activity }, status: "dnd" });
    console.log("Welcome Of The GOD")
    });
  client.login(token).then(() => console.log(`${client.user.tag} Aktif!`)).catch(() => console.error(`${token} Tokeni aktif edilemedi!`));
});