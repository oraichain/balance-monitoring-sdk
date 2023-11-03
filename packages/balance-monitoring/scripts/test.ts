// import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
// import { GasPrice } from "@cosmjs/stargate";
// import config from "../config.json";
// import {
//   DirectSecp256k1HdWallet,
//   makeCosmoshubPath,
// } from "@cosmjs/proto-signing";
//
// import * as dotenv from "dotenv";
//
// dotenv.config();
//
// (async () => {
//   const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
//     process.env.MNEMONIC,
//     {
//       prefix: "orai",
//       hdPaths: [makeCosmoshubPath(0), makeCosmoshubPath(1)],
//     },
//   );
//   const [broastcast, signer] = await wallet.getAccounts();
//   const client = await SigningCosmWasmClient.connectWithSigner(
//     config.rpc,
//     wallet,
//     {
//       gasPrice: GasPrice.fromString("0.025orai"),
//     },
//   );
//   console.log(signer.address);
//
  // const tx = await client.signAndBroadcast(
  //   broastcast.address,
  //   [
  //     {
  //       typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
  //       value: Grant.fromPartial({
  //         allowance: {
  //           typeUrl: "/cosmos.feegrant.v1beta1.BasicAllowance",
  //           value: BasicAllowance.encode({
  //             spendLimit: coins(10000, "orai"),
  //           }) as any,
  //         },
  //         granter: broastcast.address,
  //         grantee: signer.address,
  //       }),
  //     },
  //   ],
  //   "auto",
  // );
  // const tx = await client.execute(
  //   signer.address,
  //   "orai19uhvhgndmrm36we4cvfs4ty8vnrtd7a7u249nrxn499ytcnzskvq00tgdz",
  //   {
  //     send: {
  //       msg: btoa(
  //         JSON.stringify({
  //           buy_nft: {
  //             offering_id: 1516,
  //             amount: "1",
  //           },
  //         }),
  //       ),
  //       amount: "1",
  //       contract: "orai1m0cdln6klzlsk87jww9wwr7ksasa6cnava28j5",
  //     },
  //   },
  //   {
  //     granter: broastcast.address,
  //     amount: coins(10000, "orai"),
  //     gas: "1000000",
  //   },
  // );
  // console.log(tx);
})();
