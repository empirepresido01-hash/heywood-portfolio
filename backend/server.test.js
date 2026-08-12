const test = require("node:test");
const assert = require("node:assert/strict");
const { safeCategory, safeBaseName, allowedMimeTypes } = require("./file-utils");

test("safeCategory falls back to gallery for unknown categories", () => {
  assert.equal(safeCategory("unknown"), "gallery");
  assert.equal(safeCategory("projects"), "projects");
});

test("safeBaseName sanitizes filenames", () => {
  assert.equal(safeBaseName("My Image.png"), "my-image");
  assert.equal(safeBaseName("!!!"), "upload");
});

test("supported MIME types remain explicit", () => {
  assert.ok(allowedMimeTypes.has("image/webp"));
  assert.ok(allowedMimeTypes.has("application/pdf"));
  assert.equal(allowedMimeTypes.has("text/plain"), false);
});
