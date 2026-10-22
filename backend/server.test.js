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

test("gallery references every slide image with its actual file extension", () => {
  const fs = require("node:fs");
  const path = require("node:path");

  const script = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  const actualSlides = fs.readdirSync(path.join(__dirname, "..", "public", "picture slide"));

  const expectedNames = actualSlides.filter((name) => /\.(?:webp|jpe?g|png)$/i.test(name));
  const scriptMatches = [
    ...script.matchAll(/\/public\/picture slide\/([^"')\s]+)/g)
  ].map((match) => match[1]);

  assert.equal(expectedNames.length, 20);
  assert.equal(scriptMatches.length, expectedNames.length);
  for (const file of expectedNames) {
    assert.ok(scriptMatches.includes(file), `Missing gallery reference for ${file}`);
  }
});
