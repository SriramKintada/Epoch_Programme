from PIL import Image, ImageDraw

def flood_fill_transparency():
    img_path = "Logos/India_AI_Grants_Logo.png"
    img = Image.open(img_path).convert("RGBA")
    
    # 1. First, make black text turn white
    pixels = img.load()
    width, height = img.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a > 0:
                if max(r,g,b) < 120 and max(r,g,b) - min(r,g,b) < 30:
                    pixels[x, y] = (255, 255, 255, a) # text to white
    
    # 2. Flood fill from corners to make the checkerboard transparent
    # The fake checkerboard usually touches the edges. We can floodfill using color tolerance.
    # Pillow doesn't have a soft-tolerance floodfill that makes things transparent natively on RGBA tuples easily, 
    # so we'll do a simple BFS flood fill from the 4 corners.
    
    def is_checkerboard(c):
        r, g, b, a = c
        # Checkerboard is light greys/whites: R,G,B > 180 and R~G~B
        if a == 0: return False
        if r > 180 and g > 180 and b > 180 and max(r,g,b) - min(r,g,b) < 20:
            return True
        return False

    visited = set()
    queue = [(0,0), (width-1,0), (0,height-1), (width-1,height-1)]
    
    while queue:
        x, y = queue.pop(0)
        if (x, y) in visited:
            continue
            
        if x < 0 or x >= width or y < 0 or y >= height:
            continue
            
        visited.add((x, y))
        
        if is_checkerboard(pixels[x, y]):
            pixels[x, y] = (255, 255, 255, 0) # Make transparent
            queue.append((x+1, y))
            queue.append((x-1, y))
            queue.append((x, y+1))
            queue.append((x, y-1))

    img.save("Logos/India_AI_Grants_Logo_Perfect.png")
    print("Saved India_AI_Grants_Logo_Perfect.png with corner floodfill transparency and white text.")

if __name__ == "__main__":
    flood_fill_transparency()
