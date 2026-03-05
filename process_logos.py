from PIL import Image
import os

def process_a3(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for item in data:
        # If dark and not transparent, make it white
        if item[0] < 50 and item[1] < 50 and item[2] < 50 and item[3] > 0:
            new_data.append((255, 255, 255, item[3]))
        else:
            new_data.append(item)
    img.putdata(new_data)
    img.save(output_path, "PNG")

def process_hsbc(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for item in data:
        # Only target the black text: low R, G, B
        if item[0] < 50 and item[1] < 50 and item[2] < 50 and item[3] > 10:
            new_data.append((255, 255, 255, item[3]))
        else:
            new_data.append(item)
    img.putdata(new_data)
    img.save(output_path, "PNG")

def process_aig(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    # User mentioned a grey/white attached background. We want to remove it.
    # And we also want to turn the black text to white.
    new_data = []
    for item in data:
        # Check for white/grey background
        # If it's bright and neutral, make it transparent
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            new_data.append((255, 255, 255, 0))
        # Check for black text
        elif item[0] < 50 and item[1] < 50 and item[2] < 50 and item[3] > 10:
            new_data.append((255, 255, 255, item[3]))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Auto-crop the transparent regions
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")

if __name__ == "__main__":
    input_dir = "Logos"
    # Overwrite the source files with the processed transparent white-text ones
    
    a3_file = os.path.join(input_dir, "Logo_A3_Capitals.png")
    hsbc_file = os.path.join(input_dir, "HSBC-Innovation-logo.png")
    aig_file = os.path.join(input_dir, "India_AI_Grants_Logo.png")
    
    process_a3(a3_file, a3_file)
    process_hsbc(hsbc_file, hsbc_file)
    process_aig(aig_file, aig_file)
    
    print("Images processed successfully.")
