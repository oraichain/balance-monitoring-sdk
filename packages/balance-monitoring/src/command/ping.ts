import { SlashCommandBuilder } from "discord.js";

const ping = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ping to discord bot");

export default ping;
