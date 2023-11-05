export interface IProcessEnv {
  MNEMONIC: string;
  TOKEN: string;
  CLIENT_ID: string;
  GUILD_ID: string;
  WEBHOOK_URL: string;
  RPC: string;
  CONTRACT_ADDRESS: string;
  ROLE_DEFI: string;
  [key: string]: string | undefined;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnv {}
  }
}
