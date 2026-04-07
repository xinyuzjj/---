import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { resourceId } = await request.json();
    
    if (!resourceId) {
      return NextResponse.json({ error: '资源ID不能为空' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'resource_clicks.json');
    
    // 如果文件不存在，创建一个空对象
    let clicksData: Record<string, number> = {};
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      clicksData = JSON.parse(fileData);
    }

    // 增加点击数
    if (!clicksData[resourceId]) {
      clicksData[resourceId] = 0;
    }
    clicksData[resourceId] += 1;

    // 保存到文件
    fs.writeFileSync(filePath, JSON.stringify(clicksData, null, 2));

    return NextResponse.json({ clicks: clicksData[resourceId] });
  } catch (error) {
    return NextResponse.json({ error: '处理失败' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');
    
    const filePath = path.join(process.cwd(), 'resource_clicks.json');
    
    // 如果文件不存在，返回空对象
    let clicksData: Record<string, number> = {};
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      clicksData = JSON.parse(fileData);
    }

    if (resourceId) {
      // 返回特定资源的点击数
      return NextResponse.json({ clicks: clicksData[resourceId] || 0 });
    } else {
      // 返回所有资源的点击数
      return NextResponse.json(clicksData);
    }
  } catch (error) {
    return NextResponse.json({ error: '处理失败' }, { status: 500 });
  }
}
