import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { OraiBalanceProcessorQueryClient } from '@oraichain/balancing-monitoring-contracts-sdk';

const client = await CosmWasmClient.connect('https://rpc.orai.io');

const oraiBalanceProcessorContract = new OraiBalanceProcessorQueryClient(client, 'orai1m8dzwnxyrkvqpdkk35z8xq4rqcdf75g7fkf5y0gf63yqyrjeqk6s2fwj2f');

console.dir(await oraiBalanceProcessorContract.queryBalancesMapping(), { depth: null });
