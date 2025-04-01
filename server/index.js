require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { z } = require("zod");

const app = express();
app.use(express.json());
app.use(cors());

// Validate .env variable
console.log("MONGODB_URI:", process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined. Check your .env file.");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// Define Mongoose Schema & Model
const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean
});
const Todo = mongoose.model("Todo", todoSchema);

// Define Zod Validation Schema
const createTodo = z.object({
    title: z.string().min(1),
    description: z.string().min(1)
});

const updateTodo = z.object({
    id: z.string()
});

// ✅ Corrected: POST Route should match frontend request
app.post("/todos", async function (req, res) {
    const parsedPayload = createTodo.safeParse(req.body);

    if (!parsedPayload.success) {
        return res.status(400).json({ msg: "Invalid input" });
    }

    const todo = await Todo.create({
        title: req.body.title,
        description: req.body.description,
        completed: false
    });

    res.status(201).json({ msg: "Todo created", todo });
});

// ✅ Corrected: GET route for fetching todos
app.get("/todos", async function (req, res) {
    const todos = await Todo.find({});
    res.json({ todos });
});

// ✅ Corrected: PUT request to mark todo as completed
app.put("/completed", async function (req, res) {
    const parsedPayload = updateTodo.safeParse(req.body);

    if (!parsedPayload.success) {
        return res.status(400).json({ msg: "Invalid input" });
    }

    await Todo.updateOne({ _id: req.body.id }, { completed: true });
    res.json({ msg: "Todo marked as completed!" });
});

// Start server on correct port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
