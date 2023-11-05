import client from "./bot";
import * as dotenv from "dotenv";
dotenv.config();

client.login(process.env.TOKEN);
