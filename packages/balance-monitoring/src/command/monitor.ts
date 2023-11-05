import { SlashCommandBuilder } from "discord.js";
import { OraiBalanceProcessorClient } from "@oraichain/balancing-monitoring-contracts-sdk";
OraiBalanceProcessorClient.prototype.updateBalance;
export enum subCommands {
  QUERY_BALANCES_MAPPING = "query_balances_mapping",
  QUERY_LOW_BALANCES = "query_low_balance",
  QUERY_BALANCE_MAPPING = "query_balance_mapping",
  QUERY_ALL_CURRENT_BALANCES = "query_all_current_balance",
  ADD_BALANCE = "add_balance",
  DELETE_BALANCE_MAPPING = "delete_balance",
  UPDATE_BALANCE_MAPPING = "update_balance",
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
          .setDescription("Native orai or contract address of cw20 token")
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
          .setDescription("Project that wallet belongs to"),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(subCommands.DELETE_BALANCE_MAPPING)
      .setDescription("Delete balance mapping information in the smartcontract")
      .addStringOption((input) =>
        input
          .setName("address")
          .setDescription("Address of the wallet")
          .setRequired(true),
      ),
  )
  .addSubcommand((subCommand) =>
    subCommand
      .setName("query_all_current_balance")
      .setDescription("Query all currnet balance of tracking wallets"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(subCommands.UPDATE_BALANCE_MAPPING)
      .setDescription("Update balance mapping information in the smartcontract")
      .addStringOption((input) =>
        input
          .setName("address")
          .setDescription("Address of the wallet")
          .setRequired(true),
      )
      .addStringOption((input) =>
        input
          .setName("denom")
          .setDescription("Native orai or contract address of cw20 token")
          .setRequired(true),
      )
      .addStringOption((input) =>
        input.setName("lower_bound").setDescription("Lower bound of the asset"),
      ),
  );
export default balanceCommand;
