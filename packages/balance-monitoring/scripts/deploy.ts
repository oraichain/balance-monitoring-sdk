import { REST, Routes } from "discord.js";
import { clientId, guildId, token } from "../config.json";
import { monitor, ping } from "../src/command";

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);
const commands = [monitor.toJSON(), ping.toJSON()];

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, "941260590578544660"),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
