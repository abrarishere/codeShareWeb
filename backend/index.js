import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDb from "./db/connectToDb.js";
import Code from "./models/code.model.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();
app.use(cors());

app.post("/api/code", async (req, res) => {
  try {
    const code = new Code({
      code: req.body.code,
      language: req.body.language,
    });
    const savedCode = await code.save();
    res.json(savedCode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/code/:id", async (req, res) => {
  try {
    const code = await Code.findOne({ _id: req.params.id });
    if (code) {
      res.json(code);
    } else {
      res.status(404).json({ error: "Code not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  connectToDb();
  console.log("Server is running on port 3000");
});
