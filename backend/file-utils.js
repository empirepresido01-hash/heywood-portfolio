const path = require("path");

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

module.exports = {
  allowedCategories,
  allowedMimeTypes,
  safeCategory,
  safeBaseName
};
