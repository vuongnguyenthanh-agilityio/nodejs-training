import express from "express";
import consign from "consign";

const PORT = 3000;
const app = express();

app.set("json spaces", 4)

consign()
  .include("./src/routes")
  .into(app)

app.listen(PORT, () => console.log(`Products API - Port ${PORT}`))