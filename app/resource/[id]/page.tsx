import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';

// 为静态导出生成所有可能的路径参数
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'resources.json');
  const resources = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return resources.map((resource: any) => ({
    id: resource.id
  }));
}

export default async function ResourceDetail({ params }: { params: { id: string } }) {
  // 读取资源数据
  const filePath = path.join(process.cwd(), 'resources.json');
  const resources = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const item = resources.find((r: any) => r.id === params.id);

  if (!item) notFound();

  return (
    <div className="min-h-screen bg-white text-gray-800 p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/resources" className="flex items-center text-red-600 mb-12 hover:text-red-700 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回列表
        </Link>

        <div className="border border-gray-200 bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">{item.title}</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mb-8"></div>
          
          <p className="text-lg leading-relaxed mb-10 text-gray-700">
            {item.desc || "暂无详细描述。这个资源是经过系统筛选的高质量工具，旨在提升开发与创作效率。"}
          </p>

          {(item.url || item.quarkLink || item.baiduLink) && (
            <div className="flex flex-wrap gap-4">
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-all"
                >
                  <Globe className="mr-2 h-5 w-5" /> 访问资源原站
                </a>
              )}
              {item.quarkLink && (
                <a 
                  href={item.quarkLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
                >
                  🔴 夸克网盘
                </a>
              )}
              {item.baiduLink && (
                <a 
                  href={item.baiduLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
                >
                  🔵 百度网盘
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}