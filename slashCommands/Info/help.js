const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "help",
  category: "info",
  description: "Shows an interactive help menu",
  usage: "help",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message, args) => {
    try {
      const categories = [...new Set(client.commands.map(c => c.category).filter(Boolean))];

      const menuOptions = categories.map(cat => {
        return {
          label: cat.toUpperCase(),
          description: `View all ${cat} commands`,
          value: cat
        };
      });

      const menuRow = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help_menu")
          .setPlaceholder("📂 Select a category")
          .addOptions(menuOptions)
      );

      const mainEmbed = new MessageEmbed()
        .setColor(es.color)
        .setAuthor(`Help Menu`, client.user.displayAvatarURL())
        .setDescription(`Use the dropdown menu below to browse commands by category.\n\nPrefix: \`${prefix}\``)
        .setFooter(client.getFooter(es));

      const helpMessage = await message.reply({ embeds: [mainEmbed], components: [menuRow] });

      const filter = (i) => i.customId === "help_menu" && i.user.id === message.author.id;
      const collector = helpMessage.createMessageComponentCollector({ filter, time: 60000 });

      collector.on("collect", async (i) => {
        const selectedCat = i.values[0];
        const cmds = client.commands
          .filter(c => c.category === selectedCat)
          .map(c => `\`${prefix}${c.name}\` - ${c.description || "No description"}`)
          .join("\n");

        const catEmbed = new MessageEmbed()
          .setColor(es.color)
          .setTitle(`${selectedCat.toUpperCase()} Commands`)
          .setDescription(cmds || "No commands found")
          .setFooter(`Use ${prefix}help [command] for details`, client.user.displayAvatarURL());

        await i.update({ embeds: [catEmbed], components: [menuRow] });
      });

      collector.on("end", () => {
        helpMessage.edit({ components: [] }).catch(() => { });
      });

    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
    }
  }
};