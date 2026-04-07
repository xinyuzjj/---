import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'design-resources.json');
    
    // 如果文件不存在，返回默认数据
    if (!fs.existsSync(filePath)) {
      const defaultData = [
        { id: 1, name: "图标素材", category: "图标", desc: "包含1000+精美的矢量图标", code: "ICON", tags: ["图标"] },
        { id: 2, name: "字体合集", category: "字体", desc: "包含500+商用免费字体", code: "FONT", tags: ["字体"] },
        { id: 3, name: "海报模板", category: "海报", desc: "包含200+专业海报模板", code: "POSTER", tags: ["海报"] },
        { id: 4, name: "UI设计组件", category: "UI", desc: "包含300+UI设计组件", code: "UI", tags: ["UI"] },
        { id: 5, name: "背景图片", category: "背景", desc: "包含800+高清背景图片", code: "BG", tags: ["背景"] },
        { id: 6, name: "PPT模板", category: "PPT", desc: "包含150+专业PPT模板", code: "PPT", tags: ["PPT"] }
      ];
      return NextResponse.json(defaultData);
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "读取失败" }, { status: 500 });
  }
}
