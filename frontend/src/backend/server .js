import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

const PORT = process.env.PORT || 5000;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    content: {
      type: String,
      required: true,
      maxlength: 10000
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
  res.send("Developer Blogging Platform API is running!");
});

// Display approved blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "approved" })
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch {
    res.status(500).json({ message: "Unable to load blogs" });
  }
});

// Submit a blog for moderation
app.post("/api/blogs", async (req, res) => {
  try {
    const { title, author, content } = req.body;

    if (
      typeof title !== "string" ||
      typeof author !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !author.trim() ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Please provide a title, author, and content."
      });
    }

    const blog = await Blog.create({
      title: title.trim(),
      author: author.trim(),
      content: content.trim(),
      status: "pending"
    });

    res.status(201).json({
      message: "Blog submitted for moderation.",
      blog
    });
  } catch {
    res.status(500).json({ message: "Unable to submit blog" });
  }
});

// DEMO ONLY: Protect this route with admin authentication
// before deploying the application publicly.
app.get("/api/admin/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch {
    res.status(500).json({ message: "Unable to load pending blogs" });
  }
});

// DEMO ONLY: Protect this route with admin authentication
// before deploying the application publicly.
app.patch("/api/admin/blogs/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Choose approved or rejected."
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Moderation updated", blog });
  } catch {
    res.status(500).json({ message: "Moderation failed" });
  }
});

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error("Please configure MONGO_URI in your environment.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
