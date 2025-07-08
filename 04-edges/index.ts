import { handler as basicHandler } from "./01-basic";
import { handler as aiTextProcessorHandler } from "./02-textProcessor";

// Basic example
basicHandler();

// AI-Powered Content Enhancement Pipeline
aiTextProcessorHandler(
  "Ayer fuimos a la plalla aver si encontrabamos algun lugar donde comieramos algo rico. No abia muchas personas por que estaba nublado, pero iguál nos divertimos mucho. Mi ermano jugo con la pelota mientras yo leia un libro que me prestaron en la viclioteca. Al final del día, nos regresamos cansados pero felis."
);
