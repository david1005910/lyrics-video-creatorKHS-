import os
import sys
import platform
from pathlib import Path


def get_font_path(font_name: str) -> Path | None:
    """
    Finds the absolute path of a font file given its name.
    Supports Windows and macOS.

    Args:
        font_name: The name of the font to search for (e.g., "Arial", "Meiryo UI").
                   The search is case-insensitive.

    Returns:
        The absolute path to the font file if found, otherwise None.
    """
    system = platform.system()

    if system == "Darwin":  # macOS
        return _get_font_path_macos(font_name)
    elif system == "Windows":
        return _get_font_path_windows(font_name)
    else:
        print(f"Unsupported platform: {system}")
        return None


def _get_font_path_macos(font_name: str) -> Path | None:
    """Find font path on macOS."""
    font_dirs = [
        Path("/System/Library/Fonts"),
        Path("/Library/Fonts"),
        Path.home() / "Library/Fonts",
    ]

    search_font_name = font_name.lower().replace(" ", "")
    font_extensions = [".ttf", ".otf", ".ttc"]

    for font_dir in font_dirs:
        if not font_dir.exists():
            continue
        for font_file in font_dir.iterdir():
            if font_file.suffix.lower() in font_extensions:
                file_name_lower = font_file.stem.lower().replace(" ", "").replace("-", "")
                if search_font_name in file_name_lower or file_name_lower in search_font_name:
                    return font_file

    return None


def _get_font_path_windows(font_name: str) -> Path | None:
    """Find font path on Windows using registry."""
    try:
        import winreg
    except ImportError:
        print("winreg module not available (not on Windows)")
        return None

    font_registry_key_path = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts"
    fonts_dir = os.path.join(os.environ["SystemRoot"], "Fonts")
    search_font_name = font_name.lower()

    try:
        with winreg.OpenKey(
            winreg.HKEY_LOCAL_MACHINE, font_registry_key_path, 0, winreg.KEY_READ
        ) as key:
            i = 0
            while True:
                try:
                    value_name, file_name, value_type = winreg.EnumValue(key, i)
                    if search_font_name in value_name.lower():
                        font_path = os.path.join(fonts_dir, file_name)
                        if os.path.exists(font_path):
                            return Path(font_path)
                    i += 1
                except OSError:
                    break
    except FileNotFoundError:
        print(f"Error: Font registry key not found at '{font_registry_key_path}'")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

    return None


if __name__ == "__main__":
    # --- Example Usage ---

    font_to_find = sys.argv[1]
    path = get_font_path(font_to_find)
    if path:
        print(f"Font '{font_to_find}' found at: {path}")
    else:
        print(f"Font '{font_to_find}' not found.")
