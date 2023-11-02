import {
  ExecuteInstruction,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import {
  DirectSecp256k1HdWallet,
  makeCosmoshubPath,
} from "@cosmjs/proto-signing";
import {
  AssetInfo,
  Uint128,
} from "@oraichain/balancing-monitoring-contracts-sdk/build/OraiBalanceProcessor.types";

import config from "../config.json";
import fs from "fs";
import csv from "csv-parser";

import * as dotenv from "dotenv";
import path from "path";
import { GasPrice } from "@cosmjs/stargate";
dotenv.config();

type RowFromCSV = {
  address: string;
  network: string;
  denom: string;
  threshold: string;
  decimal: string;
  description: string;
  gitRepo: string;
  note: string;
};

const mappingCW20DenomToAddress = {
  AIRI: "orai10ldgzued6zjp0mkqwsv2mux3ml50l97c74x8sg",
  KWT: "orai1nd4r053e3kgedgld2ymen8l9yrw8xpjyaal7j5",
  ORAIX: "orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge",
  USDT: "orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh",
  MILKY: "orai1gzvndtzceqwfymu2kqhta2jn6gmzxvzqwdgvjw",
};

async function produceDataFromCSV(): Promise<RowFromCSV[]> {
  const filePath = process.argv[2];
  const absolutePath = path.resolve(__dirname, filePath);
  const result: RowFromCSV[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(absolutePath)
      .on("error", reject)
      .pipe(csv())
      .on("data", (data) => {
        result.push(data);
      })
      .on("end", () => {
        resolve(result);
      });
  });
}

function createAddBalanceInstruction(row: RowFromCSV): ExecuteInstruction {
  const balanceInfo: AssetInfo =
    row.denom.toLowerCase() === "orai"
      ? { native_token: { denom: row.denom.toLowerCase() } }
      : { token: { contract_addr: mappingCW20DenomToAddress[row.denom] } };

  return {
    contractAddress: config.contract_address,
    msg: {
      add_balance: {
        addr: row.address,
        balance_info: balanceInfo,
        decimals: parseInt(row.decimal),
        label: row.description,
        lower_bound: row.threshold === "0" ? "1" : row.threshold,
      },
    },
  };
}

async function addBalance() {
  const data = await produceDataFromCSV();

  const parseThresholdata = data.map((row) => {
    return {
      ...row,
      threshold: parseInt(row.threshold.replace(/,/g, "")).toString(),
    };
  });
  const filterIBCDenomAndOtherNetwork = parseThresholdata
    .filter((row) => row.denom.split(" ").length <= 1)
    .filter((row) => row.network === "Oraichain" && row.decimal);

  const instructions = filterIBCDenomAndOtherNetwork.map((row) =>
    createAddBalanceInstruction(row),
  );
  instructions.forEach((instruction) =>
    console.log(instruction.msg.add_balance.balance_info),
  );

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.MNEMONIC as string,
    {
      prefix: "orai",
      hdPaths: [makeCosmoshubPath(0)],
    },
  );
  const accounts = await wallet.getAccounts();
  const [signer] = accounts;
  const signClient = await SigningCosmWasmClient.connectWithSigner(
    config.rpc,
    wallet,
    {
      gasPrice: GasPrice.fromString("0.025orai"),
    },
  );
  const tx = await signClient.executeMultiple(
    signer.address,
    instructions,
    "auto",
  );
  console.log(`Sucessfully add balances at ${tx.transactionHash}`);
}

addBalance();
