import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'resources.json');
    
    // 如果文件不存在，返回空数组
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "读取失败" }, { status: 500 });
  }
}