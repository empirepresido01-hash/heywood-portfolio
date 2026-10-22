from pathlib import Path
from PIL import Image

root = Path(r"c:\Users\ffavo\Desktop\new portfolio vercel,google\public\picture slide")

for source in sorted(root.iterdir()):
    if not source.is_file():
        continue
    if source.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        continue
    target = root / f"{source.stem}.webp"
    if source.suffix.lower() == ".webp" or target.exists():
        continue

    image = Image.open(source)
    if image.mode in ("RGBA", "LA"):
        image = image.convert("RGBA")
    else:
        image = image.convert("RGB")

    image.save(target, format="WEBP", quality=72, method=6, optimize=True)
    print(f"Converted {source.name} -> {target.name}")
