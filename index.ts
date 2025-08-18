import { config } from "dotenv";
import { handler } from "./01-createReactAgent";
import { handler as basicHandler } from "./04-edges/01-basic";
import { handler as textProcessHandler } from "./04-edges/02-text-process";
config();

// handler();
// basicHandler();
textProcessHandler();
