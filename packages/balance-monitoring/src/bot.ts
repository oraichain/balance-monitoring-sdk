import { Client, Events, Partials } from "discord.js";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OraiBalanceProcessorQueryClient } from "@oraichain/balancing-monitoring-contracts-sdk";
import { subCommands as monitorSubcommand } from "./command/monitor";
import { createEmbedBalanceResponse } from "./discordUtils";
import config from "../config.json";
import { WebhookClient } from "discord.js";
import * as dotenv from "dotenv";
import { QueryLowBalancesResponse } from "@oraichain/balancing-monitoring-contracts-sdk/build/OraiBalanceProcessor.types";
dotenv.config();

let cosmwasmClient: CosmWasmClient;
let oraiBalanceProcessorContract: OraiBalanceProcessorQueryClient;
const webhook = new WebhookClient({
  url: config.webhookUrl,
});
const maxConstainst = 10;

export async function connect() {
  cosmwasmClient = await CosmWasmClient.connect(config.rpc);

  oraiBalanceProcessorContract = new OraiBalanceProcessorQueryClient(
    cosmwasmClient,
    config.contract_address,
  );
}

connect().then(() => {
  (async () => {
    while (true) {
      console.log("Start checking low balance");
      const low_balances =
        await oraiBalanceProcessorContract.queryLowBalances();
      if (low_balances.low_balance_assets.length > 0) {
        await webhook.send({
          content: `<@&${config.role_defi}> Please topup wallet above`,
          embeds: [
            createEmbedBalanceResponse(
              {
                title: "Low balance",
                description:
                  "Alert about the low balance asset in tracking list wallet",
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
      await new Promise((r) => setTimeout(r, 15000));
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
          // const response =
          //   await oraiBalanceProcessorContract.queryLowBalances();
          const response: QueryLowBalancesResponse = {
            low_balance_assets: [
              {
                addr: "test1",
                assets: [
                  {
                    info: {
                      native_token: {
                        denom: "orai",
                      },
                    },
                    amount: "1000000",
                  },
                  {
                    info: {
                      token: {
                        contract_addr: "orai112312ir-120391-2",
                      },
                    },
                    amount: "1000000",
                  },
                  {
                    info: {
                      token: {
                        contract_addr:
                          "orai1xv4z9w0q2z4q0z2q0z2q0z2q0z2q0z2q0z2q0z",
                      },
                    },
                    amount: "1000000",
                  },
                ],
                label: "test",
              },
              {
                addr: "test2",
                assets: [
                  {
                    info: {
                      native_token: {
                        denom: "orai",
                      },
                    },
                    amount: "1000000",
                  },
                  {
                    info: {
                      token: {
                        contract_addr: "token1",
                      },
                    },
                    amount: "1000000",
                  },
                  {
                    info: {
                      token: {
                        contract_addr: "token2",
                      },
                    },
                    amount: "1000000",
                  },
                ],
                label: "test",
              },
            ],
          };
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
