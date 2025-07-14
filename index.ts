import { config } from "dotenv";

config();

// ================================ 04-edges ================================
// import { handler as basicHandler } from "./04-edges/01-basic";
// import { handler as aiTextProcessorHandler } from "./04-edges/02-text-processor";
// import { handler as conditionalEdgeHandler } from "./04-edges/03-conditional-edge";
// import { handler as toolNodeHandler } from "./04-edges/04-tool-node";
// import { handler as parallelHandler } from "./04-edges/05-parallel";

// 01-basic
// basicHandler();

// 02-text-processor
// aiTextProcessorHandler(
//   "Ayer fuimos a la plalla aver si encontrabamos algun lugar donde comieramos algo rico. No abia muchas personas por que estaba nublado, pero iguál nos divertimos mucho. Mi ermano jugo con la pelota mientras yo leia un libro que me prestaron en la viclioteca. Al final del día, nos regresamos cansados pero felis."
// );

// 03-conditional-edge
// conditionalEdgeHandler("Me siento muy frustrado con estos errores.");

//04-tool-node
// toolNodeHandler([
//   {
//     role: "user",
//     content: "Cual es el clima en San Francisco?",
//   },
// ]);

// 05-parallel
// parallelHandler("Argentina");

// ================================ 05-command ================================
// import { handler as commandHandler } from "./05-command";

// commandHandler("Me siento muy frustrado con estos errores.");
