import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'game-resources.json');
    
    // 如果文件不存在，返回默认数据
    if (!fs.existsSync(filePath)) {
      const defaultData = [
        { id: 1, name: "经典游戏合集", category: "经典", desc: "包含多款经典单机游戏，一键安装", code: "GAME", tags: ["经典"] },
        { id: 2, name: "单机游戏合集", category: "单机", desc: "精选单机游戏，无需联网", code: "SINGLE", tags: ["单机"] },
        { id: 3, name: "独立游戏合集", category: "独立", desc: "精选独立游戏，创意无限", code: "INDIE", tags: ["独立"] },
        { id: 4, name: "怀旧游戏合集", category: "怀旧", desc: "童年回忆，经典重现", code: "NOSTALGIA", tags: ["怀旧"] },
        { id: 5, name: "冒险游戏合集", category: "冒险", desc: "探索未知，挑战自我", code: "ADVENTURE", tags: ["冒险"] },
        { id: 6, name: "策略游戏合集", category: "策略", desc: "运筹帷幄，决胜千里", code: "STRATEGY", tags: ["策略"] }
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
