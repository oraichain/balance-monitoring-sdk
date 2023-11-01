export interface InstantiateMsg {}
export type ExecuteMsg = {
  add_balance: AddNewBalanceMappingMsg;
} | {
  update_balance: UpdateBalanceMappingMsg;
} | {
  delete_balance_mapping: DeleteBalanceMappingMsg;
} | {
  update_admin: {
    new_admin: string;
  };
};
export type AssetInfo = {
  token: {
    contract_addr: Addr;
  };
} | {
  native_token: {
    denom: string;
  };
};
export type Addr = string;
export type Uint128 = string;
export interface AddNewBalanceMappingMsg {
  addr: string;
  balance_info: AssetInfo;
  decimals: number;
  label?: string | null;
  lower_bound: Uint128;
}
export interface UpdateBalanceMappingMsg {
  addr: string;
  balance_info: AssetInfo;
  decimals?: number | null;
  lower_bound?: Uint128 | null;
}
export interface DeleteBalanceMappingMsg {
  addr: string;
}
export type QueryMsg = {
  query_low_balances: {};
} | {
  query_balances_mapping: {};
} | {
  query_balance_mapping: {
    addr: string;
  };
} | {
  query_admin: {};
};
export interface AdminResponse {
  admin?: string | null;
}
export interface QueryBalanceMappingResponse {
  assets: AssetData[];
  label: string;
}
export interface AssetData {
  asset: AssetInfo;
  decimals: number;
  lower_bound: Uint128;
}
export interface QueryBalancesMappingResponse {
  balance_assets: BalancesMappingQuery[];
}
export interface BalancesMappingQuery {
  addr: Addr;
  assets: AssetData[];
  label: string;
}
export interface QueryLowBalancesResponse {
  low_balance_assets: BalancesQuery[];
}
export interface BalancesQuery {
  addr: Addr;
  assets: Asset[];
  label: string;
}
export interface Asset {
  amount: Uint128;
  info: AssetInfo;
}