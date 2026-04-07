import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';

export default async function ResourceDetail({ params }: { params: { id: string } }) {
  // 服务端读取资源数据
  const filePath = path.join(process.cwd(), 'resources.json');
  const resources = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const item = resources.find((r: any) => r.id === params.id);

  if (!item) notFound();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/resources" className="flex items-center text-cyan-400 mb-12 hover:text-cyan-300 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回列表
        </Link>

        <div className="border border-slate-800 bg-slate-900/30 p-8 rounded-3xl backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">{item.title}</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 mb-8"></div>
          
          <p className="text-lg leading-relaxed mb-10 text-slate-400">
            {item.desc || "暂无详细描述。这个资源是经过系统筛选的高质量工具，旨在提升开发与创作效率。"}
          </p>

          <a 
            href={item.url} 
            target="_blank" 
            className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all transform hover:scale-105"
          >
            <Globe className="mr-2 h-5 w-5" /> 访问资源原站
          </a>
        </div>
      </div>
    </div>
  );
}