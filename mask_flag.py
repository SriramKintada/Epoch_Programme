from PIL import Image

def extract_flag():
    img = Image.open("Logos/India_AI_Grants_Logo.png").convert("RGBA")
    pixels = img.load()
    width, height = img.size

    # The fake checkerboard is usually exactly (204,204,204) and (255,255,255)
    # Let's just find the bounding box of pixels that are NOT those two exact colors.
    # Wait, the checkerboard might have JPEG artifacts if it's a downloaded PNG converted from JPEG.
    
    # Alternatively, the Indian flag has Saffron (orange) on top, White in middle, Green at bottom.
    # We can just make any pixel transparent if it is grey-ish and outside the middle Y region?
    # No, let's just do a strict transparency mask on anything that is light grey/white that IS NOT the middle 1/3rd of the flag.
    # Actually, a simple background removal:
    
    new_data = []
    for y in range(height):
        for x in range(width):
            r,g,b,a = pixels[x,y]
            
            # Is it checkerboard?
            # Checkerboard consists of light greys where r~g~b > 180
            if r > 180 and g > 180 and b > 180 and max(r,g,b) - min(r,g,b) < 15:
                # If it's in the middle 3rd of the image height vertically, it might be the white band!
                if height * 0.3 < y < height * 0.7:
                    # Keep it as white! The white band of the flag!
                    new_data.append((255, 255, 255, 255))
                else:
                    # Top third or bottom third = definitely not the white band. Make transparent.
                    new_data.append((255, 255, 255, 0))
            else:
                new_data.append((r,g,b,a))
                
    img.putdata(new_data)
    
    # Auto crop transparent edges
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save("Logos/Pure_Flag.png")
    print("Saved Pure_Flag.png")

if __name__ == "__main__":
    extract_flag()
