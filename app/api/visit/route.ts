import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'visits.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileData);
  
  // 访问量 +1
  data.count += 1;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json(data);
}