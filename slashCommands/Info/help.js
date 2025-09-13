const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  Interaction
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { duration, handlemsg } = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "help",
  description: "Returns all Commands, or one specific command",
  options: [
    {
      type: 3, // STRING
      name: "category",
      description: "See the Commands of a Category",
      required: true,
      choices: [
        { name: "⌨️ Programming", value: "⌨️ Programming" },
        { name: "⚙️ Settings", value: "⚙️ Settings" },
        { name: "⚜️ Custom Queue(s)", value: "⚜️ Custom Queue(s)" },
        { name: "🎤 Voice", value: "🎤 Voice" },
        { name: "🎮 MiniGames", value: "🎮 MiniGames" },
        { name: "🎶 Music", value: "🎶 Music" },
        { name: "🏫 School Commands", value: "🏫 School Commands" },
        { name: "👀 Filter", value: "👀 Filter" },
        { name: "👑 Owner", value: "👑 Owner" },
        { name: "💪 Setup", value: "💪 Setup" },
        { name: "💸 Economy", value: "💸 Economy" },
        { name: "📈 Ranking", value: "📈 Ranking" },
        { name: "🔊 Soundboard", value: "🔊 Soundboard" },
        { name: "🔞 NSFW", value: "🔞 NSFW" },
        { name: "🔰 Info", value: "🔰 Info" },
        { name: "🕹️ Fun", value: "🕹️ Fun" },
        { name: "🚫 Administration", value: "🚫 Administration" },
      ]
    },
    {
      type: 3, // STRING
      name: "command",
      description: "Is there a specific Command you want details from?",
      required: false
    }
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    const { member, guild } = interaction;

    let CommandStr = interaction.options.getString("command");
    let Category = interaction.options.getString("category");

    if (!Category)
      return interaction.reply({
        content: "Please repeat but add a CATEGORY",
        ephemeral: true
      });

    Category = Category.replace("_", " ");
    try {
      let allembeds = [];
      if (Category) {
        const cat = client.categories.find(c =>
          c.toLowerCase().includes(Category.toLowerCase())
        );
        if (cat) {
          var category = cat;
          const items = client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `\`${cmd.name}\``);

          const embed = new EmbedBuilder()
            .setColor(es.color || "#2f3136")
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle("Help Menu - " + category)
            .setDescription(items.join(", ") || "No commands found.")
            .setFooter({
              text: handlemsg(client.la[ls].cmds.info.help.nocustom, {
                prefix: prefix
              }),
              iconURL: client.user.displayAvatarURL()
            });

          allembeds.push(embed);
        }
      }

      if (CommandStr) {
        const cmd =
          client.commands.get(CommandStr.toLowerCase()) ||
          client.commands.get(client.aliases.get(CommandStr.toLowerCase()));

        const embed = new EmbedBuilder()
          .setColor(es.color || "#2f3136")
          .setThumbnail(client.user.displayAvatarURL());

        if (!cmd) {
          embed.setDescription(
            `No info found for command \`${CommandStr.toLowerCase()}\``
          );
        } else {
          if (cmd.name)
            embed.addFields({ name: "Name", value: `\`${cmd.name}\`` });
          if (cmd.description)
            embed.addFields({
              name: "Description",
              value: `\`\`\`${cmd.description}\`\`\``
            });
          if (cmd.aliases?.length)
            embed.addFields({
              name: "Aliases",
              value: cmd.aliases.map(a => `\`${a}\``).join(", ")
            });
          embed.addFields({
            name: "Cooldown",
            value: `\`\`\`${cmd.cooldown || 3} Seconds\`\`\``
          });
          if (cmd.usage)
            embed.addFields({
              name: "Usage",
              value: `\`\`\`${prefix}${cmd.usage}\`\`\``
            });
        }
        allembeds.push(embed);
      }

      return interaction.reply({ embeds: allembeds, ephemeral: true });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
    }
  }
};