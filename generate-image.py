#!/usr/bin/env python3
"""
Generate images using Google Gemini (Nano Banana).

Usage:
    python3 generate-image.py "<prompt>" [output_name] [--model MODEL]

Examples:
    python3 generate-image.py "a sunny kitchen with fresh vegetables" hero
    python3 generate-image.py "minimalist yoga scene" yoga --model pro
"""
import base64
import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

MODELS = {
    "flash": "gemini-2.5-flash-image",
    "flash2": "gemini-3.1-flash-image-preview",
    "pro": "gemini-3-pro-image-preview",
}
DEFAULT_MODEL = "flash2"

def load_env():
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

def generate(prompt: str, output_name: str, model_key: str) -> None:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit("ERROR: GEMINI_API_KEY missing in .env")

    model = MODELS.get(model_key, MODELS[DEFAULT_MODEL])
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }).encode()

    print(f"→ Model: {model}")
    print(f"→ Prompt: {prompt}")
    req = urllib.request.Request(
        url, data=payload, headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:500]}")

    out_dir = Path(__file__).parent / "generated-images"
    out_dir.mkdir(exist_ok=True)

    count = 0
    for cand in data.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                count += 1
                suffix = f"-{count}" if count > 1 else ""
                out_path = out_dir / f"{output_name}{suffix}.png"
                out_path.write_bytes(base64.b64decode(inline["data"]))
                print(f"✓ Saved: {out_path.relative_to(Path(__file__).parent)}")

    if count == 0:
        sys.exit(f"No image in response: {json.dumps(data)[:500]}")

def main():
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        sys.exit(0)

    model_key = DEFAULT_MODEL
    if "--model" in args:
        i = args.index("--model")
        model_key = args[i + 1]
        args = args[:i] + args[i + 2 :]

    prompt = args[0]
    output_name = args[1] if len(args) > 1 else "image"

    load_env()
    generate(prompt, output_name, model_key)

if __name__ == "__main__":
    main()
