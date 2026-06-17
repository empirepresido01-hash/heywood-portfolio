const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const cors = require("cors");
const express = require("express");
const multer = require("multer");

const app = express();
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const uploadRoot = path.join(publicDir, "uploads");
const dataDir = path.join(rootDir, "backend", "data");
const metadataPath = path.join(dataDir, "uploads.json");
const port = Number(process.env.PORT || 5500);

const allowedCategories = new Set(["gallery", "tools", "projects", "portrait", "documents"]);
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "application/pdf"
]);

function ensureDirectories() {
  fs.mkdirSync(uploadRoot, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });

  for (const category of allowedCategories) {
    fs.mkdirSync(path.join(uploadRoot, category), { recursive: true });
  }

  if (!fs.existsSync(metadataPath)) {
    fs.writeFileSync(metadataPath, "[]\n");
  }
}

function readUploads() {
  return JSON.parse(fs.readFileSync(metadataPath, "utf8"));
}

function writeUploads(uploads) {
  fs.writeFileSync(metadataPath, `${JSON.stringify(uploads, null, 2)}\n`);
}

function safeCategory(value) {
  return allowedCategories.has(value) ? value : "gallery";
}

function safeBaseName(fileName) {
  const parsed = path.parse(fileName);
  return parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "upload";
}

ensureDirectories();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(uploadRoot, safeCategory(req.body.category)));
  },
  filename(req, file, cb) {
    const id = crypto.randomUUID();
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${safeBaseName(file.originalname)}-${id}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error("Unsupported file type."));
      return;
    }

    cb(null, true);
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(rootDir));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "heywood-david-portfolio-backend" });
});

app.get("/api/uploads", (req, res) => {
  const uploads = readUploads();
  const category = req.query.category;

  if (category) {
    res.json(uploads.filter((item) => item.category === category));
    return;
  }

  res.json(uploads);
});

app.post("/api/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file was uploaded." });
    return;
  }

  const category = safeCategory(req.body.category);
  const record = {
    id: crypto.randomUUID(),
    title: req.body.title || path.parse(req.file.originalname).name,
    category,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url: `/public/uploads/${category}/${req.file.filename}`,
    createdAt: new Date().toISOString()
  };

  const uploads = readUploads();
  uploads.unshift(record);
  writeUploads(uploads);

  res.status(201).json(record);
});

app.delete("/api/uploads/:id", (req, res) => {
  const uploads = readUploads();
  const record = uploads.find((item) => item.id === req.params.id);

  if (!record) {
    res.status(404).json({ error: "Upload not found." });
    return;
  }

  const filePath = path.join(rootDir, record.url);
  if (filePath.startsWith(uploadRoot) && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  writeUploads(uploads.filter((item) => item.id !== req.params.id));
  res.status(204).end();
});

app.use((error, req, res, next) => {
  res.status(400).json({ error: error.message || "Upload failed." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio backend running at http://localhost:${port}`);
});
