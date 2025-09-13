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
      StringChoices: {
        name: "category",
        description: "See the Commands of a Category",
        required: true,
        choices: [
          ["⌨️ Programming", "⌨️ Programming"],
          ["⚙️ Settings", "⚙️ Settings"],
          ["⚜️ Custom Queue(s)", "⚜️ Custom Queue(s)"],
          ["🎤 Voice", "🎤 Voice"],
          ["🎮 MiniGames", "🎮 MiniGames"],
          ["🎶 Music", "🎶 Music"],
          ["🏫 School Commands", "🏫 School Commands"],
          ["👀 Filter", "👀 Filter"],
          ["👑 Owner", "👑 Owner"],
          ["💪 Setup", "💪 Setup"],
          ["💸 Economy", "💸 Economy"],
          ["📈 Ranking", "📈 Ranking"],
          ["🔊 Soundboard", "🔊 Soundboard"],
          ["🔞 NSFW", "🔞 NSFW"],
          ["🔰 Info", "🔰 Info"],
          ["🕹️ Fun", "🕹️ Fun"],
          ["🚫 Administration", "🚫 Administration"],
        ]
      }
    },
    {
      String: {
        name: "command",
        description: "Is there a specific Command you want details from?",
        required: false
      }
    }
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    const { member } = interaction;
    const { guild } = member;

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
            .setColor(es.color || "#2F3136")
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable2"]))
            .setFooter({
              text: handlemsg(client.la[ls].cmds.info.help.nocustom, {
                prefix: prefix
              }),
              iconURL: client.user.displayAvatarURL()
            });

          if (category.toLowerCase().includes("custom")) {
            try {
              embed.setDescription(
                eval(client.la[ls]["cmds"]["info"]["help"]["variable3"])
              );
            } catch {}
          } else {
            embed.setDescription(
              eval(client.la[ls]["cmds"]["info"]["help"]["variable4"])
            );
          }
          allembeds.push(embed);
        }
      }

      if (CommandStr) {
        const cmd =
          client.commands.get(CommandStr.toLowerCase()) ||
          client.commands.get(
            client.aliases.get(CommandStr.toLowerCase())
          );

        if (!cmd) {
          allembeds.push(
            new EmbedBuilder()
              .setColor(es.wrongcolor || "#ED4245")
              .setDescription(
                handlemsg(client.la[ls].cmds.info.help.noinfo, {
                  command: CommandStr.toLowerCase()
                })
              )
          );
        } else {
          const embed = new EmbedBuilder()
            .setColor(es.color || "#2F3136")
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(
              handlemsg(client.la[ls].cmds.info.help.detail.about, {
                cmdname: cmd.name
              })
            )
            .addFields(
              {
                name: handlemsg(client.la[ls].cmds.info.help.detail.name),
                value: `\`${cmd.name}\``
              },
              {
                name: handlemsg(client.la[ls].cmds.info.help.detail.desc),
                value: `\`\`\`${cmd.description || "No description"}\`\`\``
              },
              {
                name: handlemsg(client.la[ls].cmds.info.help.detail.cooldown),
                value: `\`\`\`${cmd.cooldown || 3} Seconds\`\`\``
              }
            );

          if (cmd.aliases?.length) {
            embed.addFields({
              name: handlemsg(client.la[ls].cmds.info.help.detail.aliases),
              value: `\`${cmd.aliases.join("`, `")}\``
            });
          }

          if (cmd.usage) {
            embed.addFields({
              name: handlemsg(client.la[ls].cmds.info.help.detail.usage),
              value: `\`\`\`${prefix}${cmd.usage}\`\`\``
            });
            embed.setFooter({
              text: handlemsg(client.la[ls].cmds.info.help.detail.syntax),
              iconURL: client.user.displayAvatarURL()
            });
          }

          allembeds.push(embed);
        }
      }

      return interaction.reply({ embeds: allembeds, ephemeral: true });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
    }
  }
};