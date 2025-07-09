import { handler as basicHandler } from "./01-basic";
import { handler as aiTextProcessorHandler } from "./02-text-processor";
import { handler as conditionalEdgeHandler } from "./03-conditional-edge";
import { handler as toolNodeHandler } from "./04-tool-node";

// 01-basic
// basicHandler();

// 02-text-processor
// aiTextProcessorHandler(
//   "Ayer fuimos a la plalla aver si encontrabamos algun lugar donde comieramos algo rico. No abia muchas personas por que estaba nublado, pero iguál nos divertimos mucho. Mi ermano jugo con la pelota mientras yo leia un libro que me prestaron en la viclioteca. Al final del día, nos regresamos cansados pero felis."
// );

// 03-conditional-edge
conditionalEdgeHandler("Me siento muy frustrado con estos errores.");

//04-tool-node
// toolNodeHandler([
//   {
//     role: "user",
//     content: "Cual es el clima en San Francisco?",
//   },
// ]);
