from PIL import Image

def fix_hsbc():
    try:
        img = Image.open("Logos/HSBC-Innovation-logo.png").convert("RGBA")
        width, height = img.size
        pixels = img.load()
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                if a > 0:
                    # If it's a neutral/dark color (black text and its grey anti-aliasing)
                    # The Red polygon has r > 200, g < 50, b < 50
                    # Black text has R,G,B all similar and relatively low.
                    # Even anti-aliased dark grey edges will have max(r,g,b) < 180 and max-min < 30
                    if max(r,g,b) < 180 and max(r,g,b) - min(r,g,b) < 40:
                        # Change it to white, keeping the original alpha to preserve smooth edges
                        pixels[x, y] = (255, 255, 255, a)
        img.save("Logos/HSBC_Fixed.png")
        print("HSBC text made white successfully.")
    except Exception as e:
        print("Error fixing HSBC:", e)

if __name__ == "__main__":
    fix_hsbc()
