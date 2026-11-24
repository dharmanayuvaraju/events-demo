import os
from PIL import Image

PORTFOLIO_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'portfolio')
TARGET_WIDTHS = [320, 480, 768, 1200]

def generate_variants():
    files = [f for f in os.listdir(PORTFOLIO_DIR) if f.endswith('.jpg')]
    print(f"Processing {len(files)} images in {PORTFOLIO_DIR}...")
    
    total_orig = 0
    total_webp = 0
    generated_count = 0

    for filename in sorted(files):
        orig_path = os.path.join(PORTFOLIO_DIR, filename)
        orig_size = os.path.getsize(orig_path)
        total_orig += orig_size
        base_name = os.path.splitext(filename)[0]

        with Image.open(orig_path) as img:
            orig_w, orig_h = img.size
            aspect = orig_h / orig_w

            for w in TARGET_WIDTHS:
                # If target width is greater than original, cap at original width
                eff_w = min(w, orig_w)
                eff_h = round(eff_w * aspect)

                out_filename = f"{base_name}-{w}w.webp"
                out_path = os.path.join(PORTFOLIO_DIR, out_filename)

                # Resize with high quality Lanczos filter
                resized = img.resize((eff_w, eff_h), Image.Resampling.LANCZOS)
                resized.save(out_path, 'WEBP', quality=82, method=6)
                
                out_size = os.path.getsize(out_path)
                total_webp += out_size
                generated_count += 1
                
        print(f"Generated {base_name}: 320w, 480w, 768w, 1200w (orig: {orig_size//1024}KB, 320w: {os.path.getsize(os.path.join(PORTFOLIO_DIR, f'{base_name}-320w.webp'))//1024}KB)")

    print(f"\nDone! Generated {generated_count} WebP variants.")

if __name__ == '__main__':
    generate_variants()
