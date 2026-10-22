from PIL import Image
import os

root = r"C:\Users\ffavo\Desktop\new portfolio vercel,google\public\picture slide"

for index in range(1, 21):
    name = f"slide{index}"
    source_path = None

    for ext in (".jpg", ".jpeg", ".png"):
        candidate = os.path.join(root, name + ext)
        if os.path.exists(candidate):
            source_path = candidate
            break

    if source_path is None:
        continue

    image = Image.open(source_path).convert("RGB")
    output_path = os.path.join(root, name + ".webp")
    image.save(output_path, "WEBP", quality=72, method=6, optimize=True)
    print(f"converted {os.path.basename(source_path)} -> {os.path.basename(output_path)}")

    for ext in (".jpg", ".jpeg", ".png"):
        legacy_path = os.path.join(root, name + ext)
        if os.path.exists(legacy_path):
            os.remove(legacy_path)
            print(f"removed legacy {os.path.basename(legacy_path)}")
