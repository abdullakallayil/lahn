
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const relativePath = `/music/${filename}`;
        const path = join(process.cwd(), 'public', relativePath);

        await writeFile(path, buffer);

        return NextResponse.json({
            success: true,
            url: relativePath,
            filename: file.name
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
