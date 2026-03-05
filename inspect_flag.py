from PIL import Image
import collections

img = Image.open("Logos/India_AI_Grants_Logo.png").convert("RGBA")
pixels = img.load()
width, height = img.size

colors = collections.Counter()
for x in range(10):
    for y in range(10):
        colors[pixels[x, y]] += 1
print("Top left 10x10 corner colors:", colors)
