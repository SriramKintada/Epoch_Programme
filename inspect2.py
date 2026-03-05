from PIL import Image

img = Image.open("Logos/India_AI_Grants_Logo.png").convert("RGBA")
pixels = img.load()
width, height = img.size

print(f"Image size is {width}x{height}")

# Let's see if there is any text (dark pixels) at the bottom or sides
dark_count = 0
for y in range(height):
    for x in range(width):
        r,g,b,a = pixels[x,y]
        if a > 0 and max(r,g,b) < 100:
            dark_count += 1
            
print(f"Total dark pixels: {dark_count}")

# Print colors of the 4 extreme corners
print("Corners:", pixels[0,0], pixels[width-1, 0], pixels[0, height-1], pixels[width-1, height-1])

# Is it a checkerboard grid? Let's check a horizontal line
colors_on_top = set()
for x in range(width):
    colors_on_top.add(pixels[x,0])
print(f"Top row unique colors: {len(colors_on_top)}")

