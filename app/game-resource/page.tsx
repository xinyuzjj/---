"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Copy, Check, Search } from 'lucide-react';

export default function GameResourcePage() {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [gameResources, setGameResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 从API获取游戏资源数据
  useEffect(() => {
    fetch('/api/game-resources').then(res => res.json()).then(data => {
      setGameResources(data);
      setLoading(false);
    });
  }, []);

  // 提取所有不重复的标签
  const allTags = Array.from(new Set(gameResources.flatMap(r => r.tags || [])));

  // 核心过滤逻辑：同时过滤搜索词和选中的标签
  const filteredResources = gameResources.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#cbd5e1] text-slate-800 p-4 md:p-8 relative overflow-hidden">
      {/* 动态科技感背景 */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#cbd5e1_30%,transparent_100%)] opacity-20 animate-pulse"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-green-50/50 via-cyan-50/30 to-green-50/50 animate-gradient-x opacity-30"></div>
      <main className="relative z-10 max-w-7xl mx-auto">
        {/* 导航栏 */}
        <header className="flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center text-cyan-600 hover:opacity-70 transition-opacity">
            <ArrowLeft size={16}/>
            <span className="ml-2">返回主页</span>
          </Link>
        </header>
        
        {/* 搜索与标签筛选区 */}
        <div className="space-y-6 mb-12">
          {/* 搜索框 */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-green-600 transition-all shadow-sm"
              placeholder="搜索标题、描述或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 标签栏 */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!selectedTag ? 'bg-green-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedTag === tag ? 'bg-green-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 uppercase tracking-tight">
            Game <span className="text-green-600">Collection</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            发现并下载经典游戏合集，一键安装，无需激活
          </p>
        </div>

        {/* 游戏资源小卡片 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">游戏资源</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600">加载中...</p>
              </div>
            ) : filteredResources.length > 0 ? (
              filteredResources.map((item) => (
                <div key={item.id} className="backdrop-blur-sm bg-white rounded-2xl border border-slate-200 p-5 hover:border-green-500/50 shadow-sm transition-all">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags?.map((tag: string) => (
                      <span key={tag} className="text-xs text-green-600 font-mono uppercase bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{item.desc}</p>
                  
                  <div className="space-y-3">
                    {(item.code || item.quarkLink) && (
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-600 font-mono">提取码</span>
                        <span className="text-sm font-semibold text-green-600">
                          {item.quarkLink ? (new URL(item.quarkLink).searchParams.get('pwd') || item.code) : item.code}
                        </span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      {/* 夸克网盘按钮 */}
                      {((item.quarkLink || item.code) && (item.netdisk?.showQuark !== false)) && (
                        <a 
                          href={item.quarkLink || `https://pan.quark.cn/s/${item.category.toLowerCase()}-game?pwd=${item.code}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-xs"
                        >
                          夸克
                        </a>
                      )}
                      {/* 百度网盘按钮 */}
                      {((item.baiduLink || (item.quarkLink && new URL(item.quarkLink).searchParams.get('pwd')) || item.code) && (item.netdisk?.showBaidu !== false)) && (
                        <a 
                          href={item.baiduLink || `https://pan.baidu.com/s/${item.category.toLowerCase()}-game?pwd=${item.quarkLink ? (new URL(item.quarkLink).searchParams.get('pwd') || item.code) : item.code}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-xs"
                        >
                          百度
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600">未找到匹配的游戏资源</p>
              </div>
            )}
          </div>
        </div>




        {/* 页脚 */}
        <footer className="text-center text-slate-600 text-sm mt-16">
          <p>© 2026 峻峻尼游戏资源 | 所有游戏资源仅供个人学习使用</p>
        </footer>
      </main>
    </div>
  );
}
