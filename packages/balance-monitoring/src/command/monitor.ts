import { OraiBalanceProcessorClient } from "@oraichain/balancing-monitoring-contracts-sdk";
import { SlashCommandBuilder } from "discord.js";

OraiBalanceProcessorClient.prototype.addBalance({
  addr: "orai1d0x3wzg5h7x7w2d4s9j5q4x7g3z7z8qf7w4m6q",
  balanceInfo: {
    native_token: {
      denom: "orai",
    },
  },
  decimals: 6,
  label: "test",
  lowerBound: "10000000000000",
});

export enum subCommands {
  QUERY_BALANCES_MAPPING = "query_balances_mapping",
  QUERY_LOW_BALANCES = "query_low_balance",
  QUERY_BALANCE_MAPPING = "query_balance_mapping",
  ADD_BALANCE = "add_balance",
  DELETE_BALANCE_MAPPING = "delete_balance_mapping",
  UPDATE_BALANCE_MAPPING = "update_balance_mapping",
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
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(subCommands.ADD_BALANCE)
      .setDescription("Add balance mapping")
      .addStringOption((input) =>
        input
          .setName("address")
          .setDescription("Address of the wallet")
          .setRequired(true),
      )
      .addStringOption((input) =>
        input
          .setName("denom")
          .setDescription("Asset need to be tracked")
          .setRequired(true),
      )
      .addIntegerOption((input) =>
        input
          .setName("decimals")
          .setDescription("Decimals of denom")
          .setRequired(true),
      )
      .addStringOption((input) =>
        input
          .setName("lower_bound")
          .setDescription("Lower bound of the asset")
          .setRequired(true),
      )
      .addStringOption((input) =>
        input
          .setName("project")
          .setDescription("Project that wallet belongs to")
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(subCommands.DELETE_BALANCE_MAPPING)
      .setDescription("Delete balance mapping"),
  );
export default balanceCommand;
