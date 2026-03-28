import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'public', 'data', 'my_music.json');
    let dbData = [];
    try {
      const dbContent = await fs.readFile(dbPath, 'utf8');
      dbData = JSON.parse(dbContent);
    } catch {
      // If file doesn't exist or is invalid, return empty array
    }
    return NextResponse.json(dbData);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch music' }, { status: 500 });
  }
}
