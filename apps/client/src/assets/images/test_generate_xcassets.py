import contextlib
import io
import json
import runpy
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import generate_xcassets as generator


class ParseFileTests(unittest.TestCase):
    def test_accepts_png_names_with_supported_scales(self):
        self.assertEqual(generator.parse_file(Path("85@2x.png")), ("85", "2x"))
        self.assertEqual(generator.parse_file(Path("Team_1@3x.PNG")), ("Team_1", "3x"))

    def test_rejects_non_png_and_unsupported_scale_names(self):
        self.assertIsNone(generator.parse_file(Path("85@1x.jpg")))
        self.assertIsNone(generator.parse_file(Path("85@4x.png")))
        self.assertIsNone(generator.parse_file(Path("85.png")))


class GenerateAssetsTests(unittest.TestCase):
    def test_generates_sorted_imagesets_and_marks_missing_scales(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            input_dir = root / "input"
            output_dir = root / "output"
            nested_dir = input_dir / "nested"
            nested_dir.mkdir(parents=True)

            for filename in [
                "10@1x.png",
                "10@2x.png",
                "10@3x.png",
                "2@1x.png",
                "2@2x.png",
                "club@1x.png",
                "bad name@1x.png",
                "invalid.png",
            ]:
                (nested_dir / filename).write_bytes(b"image")

            output = io.StringIO()
            with patch("generate_xcassets.Path.cwd", return_value=root):
                with contextlib.redirect_stdout(output):
                    generator.generate_assets(input_dir, output_dir, "team")

            self.assertTrue((output_dir / "team_2.imageset" / "team_2.png").exists())
            self.assertTrue((output_dir / "team_2.imageset" / "team_2@2x.png").exists())
            self.assertTrue((output_dir / "team_10.imageset" / "Contents.json").exists())
            self.assertTrue((output_dir / "team_club.imageset" / "Contents.json").exists())
            self.assertIn("Gefundene Teams: 3", output.getvalue())
            self.assertIn("✅ team_10", output.getvalue())
            self.assertIn("fehlt 3x", output.getvalue())
            self.assertIn("Ungültige Asset-ID", output.getvalue())
            self.assertIn("Übersprungen: invalid.png", output.getvalue())

            contents_path = output_dir / "team_2.imageset" / "Contents.json"
            contents = json.loads(contents_path.read_text(encoding="utf-8"))
            self.assertEqual(contents["images"][0]["filename"], "team_2.png")
            self.assertEqual(contents["images"][1]["filename"], "team_2@2x.png")
            self.assertNotIn("filename", contents["images"][2])

    def test_replaces_existing_imageset(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            input_dir = root / "input"
            output_dir = root / "output"
            input_dir.mkdir()
            (input_dir / "7@1x.png").write_bytes(b"new")

            old_imageset = output_dir / "team_7.imageset"
            old_imageset.mkdir(parents=True)
            (old_imageset / "stale.txt").write_text("old", encoding="utf-8")

            with patch("generate_xcassets.Path.cwd", return_value=root):
                generator.generate_assets(input_dir, output_dir, "team")

            self.assertFalse((old_imageset / "stale.txt").exists())
            self.assertEqual((old_imageset / "team_7.png").read_bytes(), b"new")

    def test_rejects_missing_input_and_invalid_prefix(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)

            with self.assertRaises(FileNotFoundError):
                generator.generate_assets(root / "missing", root / "output", "team")

            input_dir = root / "input"
            input_dir.mkdir()
            with self.assertRaises(ValueError):
                generator.generate_assets(input_dir, root / "output", "bad prefix")

    def test_rejects_output_directory_outside_working_directory(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            input_dir = root / "input"
            input_dir.mkdir()

            with patch("generate_xcassets.Path.cwd", return_value=root / "working"):
                with self.assertRaisesRegex(ValueError, "innerhalb des aktuellen Ordners"):
                    generator.prepare_output_directory(root / "outside")

    def test_cli_requires_input_and_output_arguments(self):
        with patch("generate_xcassets.sys.argv", ["generate_xcassets.py"]):
            with self.assertRaises(SystemExit) as error:
                generator.main()

        self.assertEqual(error.exception.code, 1)

    def test_cli_uses_default_prefix_when_no_prefix_is_provided(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            input_dir = root / "input"
            input_dir.mkdir()
            (input_dir / "9@1x.png").write_bytes(b"image")

            arguments = [
                "generate_xcassets.py",
                str(input_dir),
                str(root / "output"),
            ]
            with patch("generate_xcassets.sys.argv", arguments):
                with patch("generate_xcassets.Path.cwd", return_value=root):
                    generator.main()

            default_imageset = root / "output" / "team_9.imageset" / "Contents.json"
            self.assertTrue(default_imageset.exists())

    def test_cli_uses_custom_prefix_when_provided(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            input_dir = root / "input"
            input_dir.mkdir()
            (input_dir / "9@1x.png").write_bytes(b"image")

            with patch(
                "generate_xcassets.sys.argv",
                ["generate_xcassets.py", str(input_dir), str(root / "output"), "club"],
            ):
                with patch("generate_xcassets.Path.cwd", return_value=root):
                    generator.main()

            custom_imageset = root / "output" / "club_9.imageset" / "Contents.json"
            self.assertTrue(custom_imageset.exists())

    def test_running_script_executes_cli_entry_point(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            input_dir = root / "input"
            input_dir.mkdir()
            (input_dir / "9@1x.png").write_bytes(b"image")

            arguments = [
                str(generator.__file__),
                str(input_dir),
                str(root / "output"),
            ]
            with patch("generate_xcassets.sys.argv", arguments):
                with patch("generate_xcassets.Path.cwd", return_value=root):
                    runpy.run_path(str(generator.__file__), run_name="__main__")

            imageset_path = root / "output" / "team_9.imageset" / "Contents.json"
            self.assertTrue(imageset_path.exists())


if __name__ == "__main__":
    unittest.main()
