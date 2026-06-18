#!/usr/bin/env python3
"""
python3 generate_xcassets.py \
  ./team-logo-responsive/14x14 \
  ./output \
  team_logo_14x14;
"""

import json
import re
import shutil
import sys
from pathlib import Path


def parse_file(file_path: Path):
    """
    Erwartet Dateinamen wie:
      1@1x.png
      1@2x.png
      1@3x.png

    Rückgabe:
      team_id = "1"
      scale = "1x" / "2x" / "3x"
    """
    if file_path.suffix.lower() != ".png":
        return None

    match = re.match(r"^(.+)@(1x|2x|3x)$", file_path.stem)

    if not match:
        return None

    team_id = match.group(1)
    scale = match.group(2)

    return team_id, scale


def create_contents_json(images):
    result = {
        "images": [],
        "info": {
            "author": "xcode",
            "version": 1
        }
    }

    for scale in ["1x", "2x", "3x"]:
        if scale in images:
            result["images"].append({
                "idiom": "universal",
                "filename": images[scale],
                "scale": scale
            })
        else:
            result["images"].append({
                "idiom": "universal",
                "scale": scale
            })

    return result


def generate_assets(input_dir: Path, output_group_dir: Path, prefix: str):
    if not input_dir.exists():
        raise FileNotFoundError(f"Input-Ordner existiert nicht: {input_dir}")

    output_group_dir.mkdir(parents=True, exist_ok=True)

    grouped = {}

    # rglob, damit es auch funktioniert, falls Unterordner existieren
    for file_path in input_dir.rglob("*.png"):
        parsed = parse_file(file_path)

        if not parsed:
            print(f"Übersprungen: {file_path.name}")
            continue

        team_id, scale = parsed
        grouped.setdefault(team_id, {})[scale] = file_path

    print(f"Gefundene Teams: {len(grouped)}")

    for team_id, scale_files in sorted(grouped.items(), key=lambda item: int(item[0]) if item[0].isdigit() else item[0]):
        asset_name = f"{prefix}_{team_id}"

        imageset_dir = output_group_dir / f"{asset_name}.imageset"

        if imageset_dir.exists():
            shutil.rmtree(imageset_dir)

        imageset_dir.mkdir(parents=True, exist_ok=True)

        images_for_json = {}

        for scale, source_file in scale_files.items():
            if scale == "1x":
                target_filename = f"{asset_name}.png"
            else:
                target_filename = f"{asset_name}@{scale}.png"

            target_file = imageset_dir / target_filename
            shutil.copy2(source_file, target_file)

            images_for_json[scale] = target_filename

        contents = create_contents_json(images_for_json)

        with open(imageset_dir / "Contents.json", "w", encoding="utf-8") as f:
            json.dump(contents, f, indent=2, ensure_ascii=False)

        missing = [scale for scale in ["1x", "2x", "3x"] if scale not in scale_files]

        if missing:
            print(f"⚠️  {asset_name}: fehlt {', '.join(missing)}")
        else:
            print(f"✅ {asset_name}")


def main():
    if len(sys.argv) < 3:
        print("Usage:")
        print("  python3 generate_team_logo_assets.py <input_dir> <output_group_dir> [prefix]")
        print("")
        print("Example:")
        print("  python3 generate_team_logo_assets.py ./team-logo-responsive/14x14 ./MyApp/Assets.xcassets/TeamLogos team")
        sys.exit(1)

    input_dir = Path(sys.argv[1])
    output_group_dir = Path(sys.argv[2])
    prefix = sys.argv[3] if len(sys.argv) >= 4 else "team"

    generate_assets(input_dir, output_group_dir, prefix)


if __name__ == "__main__":
    main()
