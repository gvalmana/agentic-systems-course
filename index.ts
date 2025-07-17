import { config } from "dotenv";
import { handler } from "./createReactAgent/smileAgent";

config();

handler();
