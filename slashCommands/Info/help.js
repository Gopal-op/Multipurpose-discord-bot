const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Show all categories or a specific command",
  options: [
    {
      type: "STRING",
      name: "category",
      description: "Category of commands",
      required: false
    },
    {
      type: "STRING",
      name: "command",
      description: "Specific command to get details",
      required: false
    }
  ],
  run: async (client, interaction) => {
    try {
      const category = interaction.options.getString("category");
      const commandName = interaction.options.getString("command");

      // If specific command is requested
      if (commandName) {
        const cmd =
          client.commands.get(commandName.toLowerCase()) ||
          client.commands.get(client.aliases.get(commandName.toLowerCase()));

        if (!cmd) {
          return interaction.reply({
            content: `❌ Command \`${commandName}\` not found!`,
            ephemeral: true
          });
        }

        const embed = new MessageEmbed()
          .setColor("#2f3136")
          .setTitle(`Help: ${cmd.name}`)
          .setDescription(cmd.description || "No description provided")
          .addField("Usage", `\`${cmd.usage || "No usage"}\``)
          .setFooter(client.user.username, client.user.displayAvatarURL());

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // If category requested
      if (category) {
        const cmds = client.commands.filter(
          c => c.category && c.category.toLowerCase() === category.toLowerCase()
        );

        if (!cmds.size) {
          return interaction.reply({
            content: `❌ No commands found in category \`${category}\`.`,
            ephemeral: true
          });
        }

        const embed = new MessageEmbed()
          .setColor("#2f3136")
          .setTitle(`Category: ${category}`)
          .setDescription(cmds.map(c => `\`${c.name}\``).join(", "))
          .setFooter(client.user.username, client.user.displayAvatarURL());

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // If nothing requested -> show all categories
      const categories = [...new Set(client.commands.map(c => c.category))];
      const embed = new MessageEmbed()
        .setColor("#2f3136")
        .setTitle("Help Menu")
        .setDescription(
          categories.map(cat => `• **${cat}**`).join("\n") ||
            "No categories found"
        )
        .setFooter(client.user.username, client.user.displayAvatarURL());

      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: "⚠️ Something went wrong while running help command.",
        ephemeral: true
      });
    }
  }
};