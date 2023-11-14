import {
  Asset,
  AssetData,
  BalancesMappingQuery,
  BalancesQuery,
} from "@oraichain/balancing-monitoring-contracts-sdk/build/OraiBalanceProcessor.types";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import _ from "lodash";

type BalanceQueryOmitLabel = Omit<BalancesQuery, "label">;
type BalanceMappingQueryOmitLabel = Omit<BalancesMappingQuery, "label">;

const mappingCW20DenomToAddress = {
  orai10ldgzued6zjp0mkqwsv2mux3ml50l97c74x8sg: "AIRI",
  orai1nd4r053e3kgedgld2ymen8l9yrw8xpjyaal7j5: "KWT",
  orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge: "ORAIX",
  orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh: "USDT",
  orai1gzvndtzceqwfymu2kqhta2jn6gmzxvzqwdgvjw: "MILKY",
};

const transferAssetToField = (assetData: Asset | AssetData) => {
  if ("decimals" in assetData) {
    const { lower_bound, asset } = assetData;
    const denom =
      "token" in asset ? asset.token.contract_addr : asset.native_token.denom;
    return {
      lower_bound:
        lower_bound +
        " " +
        `${
          mappingCW20DenomToAddress[denom]
            ? mappingCW20DenomToAddress[denom]
            : denom
        }`,
    };
  } else {
    const { amount, info } = assetData;
    const denom =
      "token" in info ? info.token.contract_addr : info.native_token.denom;

    return {
      amount:
        amount +
        " " +
        `${
          mappingCW20DenomToAddress[denom]
            ? mappingCW20DenomToAddress[denom]
            : denom
        }`,
    };
  }
};

const createTable = (data: object[]) => {
  const headers = Object.keys(data[0]);
  const mapHeader = {};
  headers.forEach((header) => {
    mapHeader[`${header}`] = data.map((d) => d[`${header}`]);
  });

  const table = headers.map((header) => {
    return {
      name: header.toUpperCase(),
      value: mapHeader[`${header}`].join("\n"),
      inline: true,
    };
  });
  return table;
};

const createFieldByLabel = (
  label: string,
  assets: BalanceMappingQueryOmitLabel[] | BalanceQueryOmitLabel[],
) => {
  const info = assets.map(
    (balance: BalanceMappingQueryOmitLabel | BalanceQueryOmitLabel) =>
      balance.assets.map((a: Asset | AssetData) => {
        return { addr: balance.addr, ...transferAssetToField(a) };
      }),
  );
  const table = createTable(info.flat());

  table.unshift({
    name: "Topic",
    value: label,
    inline: false,
  });

  return table;
};

type EmbedBase = {
  title: string;
  color?: ColorResolvable;
  description?: string;
};

export const createEmbedBalanceResponse = (
  embedBase: EmbedBase,
  balanceAssets: BalancesMappingQuery[] | BalancesQuery[],
) => {
  const embedBalance = new EmbedBuilder()
    .setTitle(embedBase.title)
    .setColor(embedBase.color)
    .setDescription(embedBase.description)
    .setTimestamp();

  const groupByAsset = _.mapValues(_.groupBy(balanceAssets, "label"), (list) =>
    list.map((e) => _.omit(e as any, "label")),
  );

  const fields = Object.entries(groupByAsset).map(([label, assets]) => {
    return createFieldByLabel(label, assets as any);
  });
  fields.forEach((field) => {
    embedBalance
      .addFields(field)
      .addFields({ name: "\u200B", value: "\u200B" });
  });

  return embedBalance;
};

