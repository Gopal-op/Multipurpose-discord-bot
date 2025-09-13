const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Show all commands or info about a specific command",
  usage: "help [command]",
  run: async (client, message, args) => {
    const prefix = "!"; // change to your bot's prefix or get from config
    const commandName = args[0];

    if (commandName) {
      const cmd =
        client.commands.get(commandName.toLowerCase()) ||
        client.commands.get(client.aliases.get(commandName.toLowerCase()));

      if (!cmd) {
        return message.reply(`❌ Command \`${commandName}\` not found.`);
      }

      const embed = new MessageEmbed()
        .setColor("#2f3136")
        .setTitle(`Help: ${cmd.name}`)
        .setDescription(cmd.description || "No description provided.")
        .addField("Usage", `\`${prefix}${cmd.usage || cmd.name}\``)
        .addField(
          "Aliases",
          cmd.aliases?.length ? cmd.aliases.join(", ") : "None"
        )
        .setFooter(client.user.username, client.user.displayAvatarURL());

      return message.channel.send({ embeds: [embed] });
    }

    // Show all commands
    const categories = [...new Set(client.commands.map(c => c.category))];
    const embed = new MessageEmbed()
      .setColor("#2f3136")
      .setTitle("Help Menu")
      .setDescription(
        categories
          .map(cat => {
            const cmds = client.commands
              .filter(c => c.category === cat)
              .map(c => `\`${c.name}\``)
              .join(", ");
            return `**${cat}**\n${cmds}`;
          })
          .join("\n\n")
      )
      .setFooter(`Use ${prefix}help [command] for more info`);

    return message.channel.send({ embeds: [embed] });
  }
};