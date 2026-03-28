import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const artist = formData.get('artist');
    const audioFile = formData.get('audio');
    const imageFile = formData.get('image');

    if (!audioFile || !title) {
      return NextResponse.json({ error: 'Title and Audio file are required' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Save audio file
    const audioExt = path.extname(audioFile.name) || '.mp3';
    const audioFilename = `${uuidv4()}${audioExt}`;
    const audioPath = path.join(uploadDir, audioFilename);
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    await fs.writeFile(audioPath, audioBuffer);

    // Save image file if exists
    let imageFilename = 'default_cover.jpg';
    if (imageFile && imageFile.size > 0) {
      const imageExt = path.extname(imageFile.name) || '.jpg';
      imageFilename = `${uuidv4()}${imageExt}`;
      const imagePath = path.join(uploadDir, imageFilename);
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(imagePath, imageBuffer);
    }

    // Create track metadata
    const newTrack = {
      id: uuidv4(),
      title,
      artist: artist || 'Unknown Artist',
      thumbnail: `/uploads/${imageFilename}`,
      url: `/uploads/${audioFilename}`,
      type: 'local',
      createdAt: new Date().toISOString()
    };

    // Update JSON database
    const dbPath = path.join(process.cwd(), 'public', 'data', 'my_music.json');
    let dbData = [];
    try {
      const dbContent = await fs.readFile(dbPath, 'utf8');
      dbData = JSON.parse(dbContent);
    } catch {
      // If file doesn't exist or is invalid, start with empty array
    }

    dbData.unshift(newTrack);
    await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2));

    return NextResponse.json({ success: true, track: newTrack });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload song: ' + error.message }, { status: 500 });
  }
}
