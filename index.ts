import { config } from "dotenv";
import { handler } from "./01-createReactAgent";

config();

handler();
