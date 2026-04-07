"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Copy, Check, Search, Crown, Sparkles, Diamond } from 'lucide-react';

export default function DesignResourcePage() {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [materialResources, setMaterialResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 从API获取设计素材数据
  useEffect(() => {
    fetch('/api/design-resources').then(res => res.json()).then(data => {
      setMaterialResources(data);
      setLoading(false);
    });
  }, []);

  // 提取所有不重复的标签
  const allTags = Array.from(new Set(materialResources.flatMap(r => r.tags || [])));

  // 核心过滤逻辑：同时过滤搜索词和选中的标签
  const filteredResources = materialResources.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0C0A09] p-4 md:p-8 relative overflow-hidden">
      {/* 奢华背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#CA8A04]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#D4AF37]/5 to-transparent rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto">
        {/* 导航栏 */}
        <header className="flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center text-[#44403C] hover:text-[#CA8A04] transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
            <span className="ml-2 font-medium tracking-wide">返回主页</span>
          </Link>
        </header>

        {/* 搜索与标签筛选区 */}
        <div className="space-y-6 mb-12">
          {/* 搜索框 */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#44403C]/50" size={18} />
            <input 
              className="w-full bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-[#D4AF37] focus:shadow-lg focus:shadow-[#D4AF37]/10 transition-all"
              placeholder="搜索标题、描述或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 标签栏 */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${!selectedTag ? 'bg-gradient-to-r from-[#D4AF37] to-[#CA8A04] text-white shadow-md' : 'bg-white/80 text-[#44403C] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/20'}`}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${selectedTag === tag ? 'bg-gradient-to-r from-[#D4AF37] to-[#CA8A04] text-white shadow-md' : 'bg-white/80 text-[#44403C] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/20'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Diamond className="w-6 h-6 text-[#D4AF37]" />
            <span className="text-sm font-medium tracking-[0.3em] uppercase text-[#D4AF37]">Premium Design</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1C1917] mb-4 uppercase tracking-tight">
            Design <span className="bg-gradient-to-r from-[#D4AF37] to-[#CA8A04] bg-clip-text text-transparent">Materials</span>
          </h1>
          <p className="text-[#44403C] max-w-2xl mx-auto leading-relaxed">
            发现并下载海量设计素材，包括图标、字体、模板等
          </p>
        </div>

        {/* 素材资源小卡片 */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
            <h2 className="text-2xl font-serif font-semibold text-[#1C1917]">精选素材</h2>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                  <p className="text-[#44403C]">加载中...</p>
                </div>
              </div>
            ) : filteredResources.length > 0 ? (
              filteredResources.map((item) => (
                <div key={item.id} className="group relative backdrop-blur-sm bg-white/80 rounded-3xl border border-[#D4AF37]/10 p-6 hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#CA8A04]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags?.map((tag: string) => (
                        <span key={tag} className="text-xs text-[#D4AF37] font-medium uppercase tracking-wider bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-[#1C1917] mb-3 group-hover:text-[#D4AF37] transition-colors">{item.name}</h3>
                    <p className="text-[#44403C] text-sm mb-5 leading-relaxed">{item.desc}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {/* 夸克网盘按钮 */}
                      {(item.quarkLink && item.netdisk?.showQuark !== false) && (
                        <a 
                          href={item.quarkLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#CA8A04] text-white hover:shadow-lg hover:shadow-[#D4AF37]/25 transition-all duration-300 text-sm font-medium"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          夸克网盘
                        </a>
                      )}
                      {/* 百度网盘按钮 */}
                      {(item.baiduLink && item.netdisk?.showBaidu !== false) && (
                        <a 
                          href={item.baiduLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1C1917] to-[#44403C] text-white hover:shadow-lg hover:shadow-[#1C1917]/25 transition-all duration-300 text-sm font-medium"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          百度网盘
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-[#44403C]">未找到匹配的素材资源</p>
              </div>
            )}
          </div>
        </div>

        {/* 页脚 */}
        <footer className="text-center text-[#44403C]/60 text-sm mt-16">
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full glass-card">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
            <span>© 2026 峻峻尼设计素材 | 所有素材仅供个人学习使用</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
          </div>
        </footer>
      </main>
    </div>
  );
}
