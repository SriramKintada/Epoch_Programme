from PIL import Image

def fix_flag():
    img_path = "Logos/India_AI_Grants_Logo.png"
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print("Error opening image:", e)
        return

    pixels = img.load()
    width, height = img.size

    # Find bounding box of non-greyish "checkerboard" pixels.
    # The flag has distinct orange (R>200, G>100, B<100) or green (R<50, G>100, B<50).
    # Instead of guessing colors perfectly, let's just find the first and last rows/cols 
    # that don't match typical greys (where R~G~B).
    min_x, min_y = width, height
    max_x, max_y = 0, 0

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # typical greys have max(rgb) - min(rgb) < 15
            diff = max(r,g,b) - min(r,g,b)
            if diff > 15 and a > 0: # It has some color
                if x < min_x: min_x = x
                if y < min_y: min_y = y
                if x > max_x: max_x = x
                if y > max_y: max_y = y

    print(f"Detected flag bounds: {min_x}, {min_y}, {max_x}, {max_y}")

    if min_x < max_x and min_y < max_y:
        # Pad slightly just in case
        min_x = max(0, min_x - 2)
        min_y = max(0, min_y - 2)
        max_x = min(width, max_x + 2)
        max_y = min(height, max_y + 2)
        
        cropped_img = img.crop((min_x, min_y, max_x, max_y))
        
        # Now make any remaining "white/grey" background inside this box transparent, if it's on the edge?
        # Not needed if we crop it down to just the flag+text.
        # Wait, the user said "India AI Grants" logo. Is there text next to the flag?
        # Let's save the cropped image back
        cropped_img.save("Logos/India_AI_Grants_Logo_Cropped.png")
        print("Cropped successfully!")
    else:
        print("Could not detect colorful bounds. Making greys transparent instead.")
        # Fallback: Make all greys transparent
        new_data = []
        for item in img.getdata():
            r, g, b, a = item
            if max(r,g,b) - min(r,g,b) < 15 and r > 150: # Light grey / white
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        img.save("Logos/India_AI_Grants_Logo_Cropped.png")

if __name__ == "__main__":
    fix_flag()
