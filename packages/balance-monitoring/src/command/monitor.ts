import { SlashCommandBuilder } from "discord.js";

export enum subCommands {
  QUERY_BALANCES_MAPPING = "query_balances_mapping",
  QUERY_LOW_BALANCES = "query_low_balance",
  QUERY_BALANCE_MAPPING = "query_balance_mapping",
}

const balanceCommand = new SlashCommandBuilder()
  .setName("monitor_balance")
  .setDescription("Balance commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName(subCommands.QUERY_LOW_BALANCES)
      .setDescription("Query low balance"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(subCommands.QUERY_BALANCES_MAPPING)
      .setDescription("Query balances mapping"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(subCommands.QUERY_BALANCE_MAPPING)
      .setDescription("Query balances mapping")
      .addStringOption((input) =>
        input
          .setName("address")
          .setDescription("Address of the wallet")
          .setRequired(true),
      ),
  );

export default balanceCommand;
