import { Client, Events, Partials, WebhookClient } from "discord.js";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OraiBalanceProcessorClient } from "@oraichain/balancing-monitoring-contracts-sdk";
import { subCommands as monitorSubcommand } from "./command/monitor";
import { createEmbedBalanceResponse } from "./discordUtils";
import * as dotenv from "dotenv";
import {
  DirectSecp256k1HdWallet,
  makeCosmoshubPath,
} from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
dotenv.config();

let signingCosmwasmClient: SigningCosmWasmClient;
let oraiBalanceProcessorContract: OraiBalanceProcessorClient;
const webhook = new WebhookClient({
  url: process.env.WEBHOOK_URL,
});
const maxConstainst = 10;

export async function connect() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.MNEMONIC,
    {
      prefix: "orai",
      hdPaths: [makeCosmoshubPath(0)],
    },
  );
  const [sender] = await wallet.getAccounts();
  signingCosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
    process.env.RPC,
    wallet,
    {
      gasPrice: GasPrice.fromString("0.003orai"),
    },
  );

  oraiBalanceProcessorContract = new OraiBalanceProcessorClient(
    signingCosmwasmClient,
    sender.address,
    process.env.CONTRACT_ADDRESS,
  );
}

connect().then(() => {
  (async () => {
    // eslint-disable-next-line
    while (true) {
      console.log("Start checking low balance");
      const low_balances =
        await oraiBalanceProcessorContract.queryLowBalances();
      if (low_balances.low_balance_assets.length > 0) {
        await webhook.send({
          content: `<@&${process.env.ROLE_DEFI}> Please topup wallets below`,
          embeds: [
            createEmbedBalanceResponse(
              {
                title: "Low balance",
                description:
                  "Alert about the low balance asset in tracking list wallet",
                color: "Red",
              },
              low_balances.low_balance_assets,
            ),
          ],
          allowedMentions: {
            parse: ["roles", "users"],
          },
        });
        console.log("Sent alert about low balance");
      }
      console.log("End checking low balance");
      await new Promise((r) => setTimeout(r, 30000));
    }
  })();
});

const client = new Client({
  intents: ["Guilds", "GuildMessages", "GuildWebhooks", "MessageContent"],
  partials: [Partials.Channel],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  switch (interaction.commandName) {
    case "ping": {
      await interaction.reply("Pong!");
      break;
    }
    case "monitor_balance": {
      switch (interaction.options.getSubcommand()) {
        case monitorSubcommand.QUERY_BALANCE_MAPPING: {
          const address = interaction.options.getString("address", true);
          const response =
            await oraiBalanceProcessorContract.queryBalanceMapping({
              addr: address,
            });
          response.assets;
          await interaction.reply({
            embeds: [
              createEmbedBalanceResponse(
                {
                  title: monitorSubcommand.QUERY_BALANCE_MAPPING.toUpperCase(),
                  description: `Return a mapping balance of a wallet to the list of assets. Address: ${address}`,
                  color: "Green",
                },
                [{ addr: address, ...response }],
              ),
            ],
          });
          break;
        }
        case monitorSubcommand.QUERY_BALANCES_MAPPING: {
          const response =
            await oraiBalanceProcessorContract.queryBalancesMapping();
          const sortLabel = response.balance_assets.sort((a, b) =>
            a.label.localeCompare(b.label),
          );
          for (
            let i = 0;
            i < response.balance_assets.length;
            i += maxConstainst
          ) {
            const batch = sortLabel.slice(
              i,
              Math.min(i + maxConstainst, sortLabel.length),
            );
            if (i === 0) {
              await interaction.reply({
                embeds: [
                  createEmbedBalanceResponse(
                    {
                      title:
                        monitorSubcommand.QUERY_BALANCES_MAPPING.toUpperCase(),
                      description:
                        "Return an array that contains the mapping the tracking wallet addresses to the list of assets",
                      color: "Blue",
                    },
                    batch,
                  ),
                ],
              });
            } else {
              await interaction.followUp({
                embeds: [
                  createEmbedBalanceResponse(
                    {
                      title:
                        monitorSubcommand.QUERY_BALANCES_MAPPING.toUpperCase(),
                      description:
                        "Return an array that contains the mapping the tracking wallet addresses to the list of assets",
                      color: "Blue",
                    },
                    batch,
                  ),
                ],
              });
            }
            await new Promise((r) => setTimeout(r, 2000));
          }
          break;
        }
        case monitorSubcommand.QUERY_LOW_BALANCES: {
          const response =
            await oraiBalanceProcessorContract.queryLowBalances();
          await interaction.reply({
            embeds: [
              createEmbedBalanceResponse(
                {
                  title: monitorSubcommand.QUERY_LOW_BALANCES,
                  description:
                    "Return an array that contains the mapping the low balances wallet addresses",
                  color: "Red",
                },
                response.low_balance_assets,
              ),
            ],
          });
          break;
        }
        case monitorSubcommand.QUERY_ALL_CURRENT_BALANCES: {
          const response =
            await oraiBalanceProcessorContract.queryAllCurrentBalances({});
          const sortLabel = response.balance_assets.sort((a, b) =>
            a.label.localeCompare(b.label),
          );
          for (
            let i = 0;
            i < response.balance_assets.length;
            i += maxConstainst
          ) {
            const batch = sortLabel.slice(
              i,
              Math.min(i + maxConstainst, sortLabel.length),
            );
            if (i === 0) {
              await interaction.reply({
                embeds: [
                  createEmbedBalanceResponse(
                    {
                      title:
                        monitorSubcommand.QUERY_ALL_CURRENT_BALANCES.toUpperCase(),
                      description:
                        "Return an array that contains the mapping the tracking wallet addresses to the list of assets",
                      color: "Blue",
                    },
                    batch,
                  ),
                ],
              });
            } else {
              await interaction.followUp({
                embeds: [
                  createEmbedBalanceResponse(
                    {
                      title:
                        monitorSubcommand.QUERY_BALANCES_MAPPING.toUpperCase(),
                      description:
                        "Return an array that contains the mapping the tracking wallet addresses to the list of assets",
                      color: "Blue",
                    },
                    batch,
                  ),
                ],
              });
            }
            await new Promise((r) => setTimeout(r, 2000));
          }
          break;
        }

        case monitorSubcommand.ADD_BALANCE: {
          await interaction.reply("Adding balance mapping ...");
          const addr = interaction.options.getString("address", true);
          const lower_bound = interaction.options.getString(
            "lower_bound",
            true,
          );
          const decimals = interaction.options.getInteger("decimals", true);
          const label = interaction.options.getString("project", true);
          const denom = interaction.options.getString("denom", true);

          const balanceInfo =
            denom === "orai"
              ? { native_token: { denom } }
              : { token: { contract_addr: denom } };

          try {
            const response = await oraiBalanceProcessorContract.addBalance({
              addr,
              decimals,
              label,
              lowerBound: lower_bound,
              balanceInfo,
            });
            await interaction.followUp(
              `Add balance successfully at ${response.transactionHash}`,
            );
          } catch (error) {
            await interaction.followUp(`Add balance failed: ${error.message}`);
          }

          break;
        }

        case monitorSubcommand.UPDATE_BALANCE_MAPPING: {
          await interaction.reply("Updating balance info...");
          const addr = interaction.options.getString("address", true);
          const lower_bound = interaction.options.getString(
            "lower_bound",
            true,
          );
          const denom = interaction.options.getString("denom", true);

          const balanceInfo =
            denom === "orai"
              ? { native_token: { denom } }
              : { token: { contract_addr: denom } };

          try {
            const response = await oraiBalanceProcessorContract.updateBalance({
              addr,
              lowerBound: lower_bound,
              balanceInfo,
            });
            await interaction.followUp(
              `Update balance successfully at ${response.transactionHash}`,
            );
          } catch (error) {
            await interaction.followUp(
              `Update balance failed: ${error.message}`,
            );
          }
          break;
        }

        case monitorSubcommand.DELETE_BALANCE_MAPPING: {
          await interaction.reply("Updating balance info...");
          const addr = interaction.options.getString("address", true);
          try {
            const response = await oraiBalanceProcessorContract.deleteBalanceMapping({addr});
            await interaction.followUp(
              `Delete balance successfully at ${response.transactionHash}`,
            );
          } catch (error) {
            await interaction.followUp(
              `Update balance failed: ${error.message}`,
            );
          }

          break;
        }
        default:
          await interaction.reply("unknown command");
      }
      break;
    }
    default: {
      await interaction.reply("unknown command");
    }
  }
});

client.on("error", (error) => {
  console.log(error);
});

export default client;
