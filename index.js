
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

require("dotenv").config();

// JAN BOT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Alle geplanten Module
const modules = [
  "moderation",
  "levelsystem",
  "tickets",
  "welcome",
  "goodbye",
  "logs",
  "giveaways",
  "economy",
  "leaderboard",
  "autoroles",
  "antispam",
  "antilink",
  "statistics",
  "birthdays",
  "minigames",
  "ai",
  "setup",
  "announcements",
  "suggestions",
  "dashboard"
];

// Slash-Befehle
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Zeigt die Bot-Latenz"),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Zeigt alle Befehle"),

  new SlashCommandBuilder()
    .setName("server")
    .setDescription("Zeigt Server-Informationen"),

  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Zeigt Benutzerinformationen"),

  new SlashCommandBuilder()
    .setName("modules")
    .setDescription("Zeigt die Jan-Bot-Module"),

  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Zeigt die Server-Einrichtung")
];

// Bot bereit
client.once("ready", async () => {
  console.log("--------------------------------");
  console.log("🤖 JAN BOT IST ONLINE!");
  console.log(`Name: ${client.user.tag}`);
  console.log(`Server: ${client.guilds.cache.size}`);
  console.log("--------------------------------");

  const rest = new REST({ version: "10" })
    .setToken(process.env.DISCORD_TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      {
        body: commands.map(command => command.toJSON())
      }
    );

    console.log("Slash-Befehle registriert!");
  } catch (error) {
    console.error("Befehlerregistrierung:", error);
  }
});

// Befehle verarbeiten
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  if (command === "ping") {
    return interaction.reply({
      content: `🏓 Pong! ${client.ws.ping} ms`,
      ephemeral: true
    });
  }

  if (command === "help") {
    const embed = new EmbedBuilder()
      .setColor("#2583FF")
      .setTitle("🤖 Jan Bot – Hilfe")
      .setDescription(
        "Willkommen bei Jan Bot!\n\n" +
        "**Allgemeine Befehle:**\n" +
        "`/ping` – Bot-Latenz\n" +
        "`/help` – Hilfe\n" +
        "`/server` – Server-Informationen\n" +
        "`/userinfo` – Benutzerinformationen\n" +
        "`/modules` – Module\n" +
        "`/setup` – Einrichtung"
      )
      .setFooter({ text: "Jan Bot | All Servers" });

    return interaction.reply({ embeds: [embed] });
  }

  if (command === "server") {
    const guild = interaction.guild;

    if (!guild) {
      return interaction.reply({
        content: "Dieser Befehl funktioniert nur auf einem Server.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor("#2583FF")
      .setTitle(`📊 ${guild.name}`)
      .addFields(
        {
          name: "Mitglieder",
          value: `${guild.memberCount}`,
          inline: true
        },
        {
          name: "Server-ID",
          value: guild.id,
          inline: true
        }
      );

    return interaction.reply({ embeds: [embed] });
  }

  if (command === "userinfo") {
    const user = interaction.user;

    const embed = new EmbedBuilder()
      .setColor("#2583FF")
      .setTitle("👤 Benutzerinformationen")
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Name", value: user.username },
        { name: "ID", value: user.id }
      );

    return interaction.reply({ embeds: [embed] });
  }

  if (command === "modules") {
    const embed = new EmbedBuilder()
      .setColor("#2583FF")
      .setTitle("🧩 Jan Bot – Module")
      .setDescription(
        modules.map((module, index) =>
          `**${index + 1}.** ${module}`
        ).join("\n")
      )
      .setFooter({
        text: `${modules.length} geplante Module`
      });

    return interaction.reply({ embeds: [embed] });
  }

  if (command === "setup") {
    if (!interaction.memberPermissions?.has(
      PermissionFlagsBits.ManageGuild
    )) {
      return interaction.reply({
        content: "Du brauchst die Berechtigung Server verwalten.",
        ephemeral: true
      });
    }

    return interaction.reply({
      content:
        "⚙️ **Jan Bot Setup**\n\n" +
        "Die Server-Konfiguration wird gerade vorbereitet.\n" +
        "Weitere Einstellungen folgen!",
      ephemeral: true
    });
  }
});

// Fehlerbehandlung
client.on("error", error => {
  console.error("Discord-Fehler:", error);
});

process.on("unhandledRejection", error => {
  console.error("Unbehandelter Fehler:", error);
});

// Verbindung herstellen
if (!process.env.DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN fehlt!");
} else {
  client.login(process.env.DISCORD_TOKEN);
}

