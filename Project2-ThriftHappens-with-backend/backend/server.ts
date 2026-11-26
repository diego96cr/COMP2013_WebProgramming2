import express, { type Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import ClothesItem from "./models/clothesItem";
import { request } from "node:http";

//constant variables
const server: Express = express();
const port: Number = 3000;
const { MONGO_URI } = process.env;

//Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

//Connect to DB and Start the erver

if (!MONGO_URI) {
  throw new Error("Mongo URI is not found in .env file");
}
mongoose
  .connect(MONGO_URI)
  .then(() =>
    server.listen(port, () => {
      console.log(`Connected to DB\n Server is listening on port ${port}`);
    }),
  )
  .catch((error) => console.log(error));

//routes
server.get("/", (request, response) => {
  response.send("Server is live");
});

//GET data api route

server.get("/data", async (request, response) => {
  try {
    const data = await ClothesItem.find();
    response.status(200).send(data);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//POST Route to add a clothing item to the DB

server.post("/data", async (request, response) => {
  const {
    id,
    name,
    image,
    fit,
    category,
    size,
    color,
    description,
    price,
    quantity,
    itemQuantity,
  } = request.body;
  const newArticle = new ClothesItem({
    id,
    name,
    image,
    fit,
    category,
    size,
    color,
    description,
    price,
    quantity,
    itemQuantity,
  });
  try {
    await newArticle.save();
    response.status(200).send({
      message: `The new item with id ${id} has been added successfully`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//Delete Route to delete one clothe Article by id

server.delete("/data/:id", async (request, response) => {
  const id = Number(request.params.id); //Params convert id to string, we have to convert it back to a number, to match the model Schema
  try {
    await ClothesItem.findOneAndDelete({ id });
    response
      .status(201)
      .send({ message: `Item with id ${id} has been successfully deleted` });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//PATCH route to edit one clothes article by id

server.patch("/data/:id", async (request, response) => {
  const id = Number(request.params.id);
  const clothesArticle = request.body;
  try {
    await ClothesItem.findOneAndUpdate({ id }, { ...clothesArticle });
    response
      .status(201)
      .send({ message: `Item with id ${id} has been updated successfully` });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});
