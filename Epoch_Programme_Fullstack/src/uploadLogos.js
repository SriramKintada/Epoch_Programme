import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Get local .env variables
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing config");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFile(fileName) {
    const filePath = path.join(process.cwd(), '../Logos', fileName);
    const fileContent = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, fileContent, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'image/png' // Assuming all are PNGs from the list_dir
        });

    if (error) {
        console.error(`Error uploading ${fileName}:`, error.message);
    } else {
        console.log(`Successfully uploaded ${fileName}`);
    }
}

async function run() {
    await uploadFile('Logo_A3_Capitals.png');
    await uploadFile('HSBC_Fixed.png');
    await uploadFile('Pure_Flag.png');
}

run();
