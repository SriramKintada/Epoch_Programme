from PIL import Image

def process_aig():
    img_path = "Logos/India_AI_Grants_Logo.png"
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print("Error opening image:", e)
        return

    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            
            # 1. Remove checkerboard background (typically white and light grey)
            # A common checkerboard has very specific greys, like (204, 204, 204) or (192, 192, 192) and (255, 255, 255)
            # Let's say if it's perfectly neutral light grey/white that is NOT part of the flag's white band.
            # But wait, the flag's white band IS white. How to distinguish?
            # Checkerboard often covers the entire background.
            # If r>200, g>200, b>200 and it's practically grayscale (max-min < 10):
            # We can't easily distinguish from the flag's white band just by pixel value.
            # However, maybe the background isn't a fake checkerboard in this specific file, maybe the user meant "white background"?
            # If we just invert black text to white, and leave the rest alone?
            
            # Let's first invert black text to white
            if max(r,g,b) < 100 and max(r,g,b) - min(r,g,b) < 30:
                pixels[x, y] = (255, 255, 255, a)
                
    img.save("Logos/India_AI_Grants_Logo_Fixed.png")
    print("Saved India_AI_Grants_Logo_Fixed.png")

if __name__ == "__main__":
    process_aig()
