import { REST, Routes } from "discord.js";
import { monitor, ping } from "../src/command";
import * as dotenv from "dotenv";
dotenv.config();

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);
const commands = [monitor.toJSON(), ping.toJSON()];
//"941260590578544660"
// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands,
      },
    );

    console.log(`Successfully reloaded ${data} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
