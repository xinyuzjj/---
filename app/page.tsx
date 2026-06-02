"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Resource {
  id: string;
  title: string;
  desc: string;
  quarkLink?: string;
  baiduLink?: string;
  tags?: string[];
}

export default function HomePage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetch('/resources.json')
      .then(res => res.json())
      .then(data => {
        setResources(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
        setLoading(false);
      });
  }, []);

  const filteredResources = resources.filter(item => {
    if (!searchTerm) return true;
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }).sort((a, b) => {
    return sortOrder === 'asc' ? parseInt(a.id) - parseInt(b.id) : parseInt(b.id) - parseInt(a.id);
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative font-sans">
      {/* 顶部导航 */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-xl font-bold text-red-600 flex items-center gap-2">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">峻</span>
                峻峻尼分享
                <span className="text-xs text-gray-400 font-normal ml-2">ARCHIVE</span>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 min-w-0 md:w-80">
                <input
                  type="text"
                  placeholder="搜索关键词、链接或ID..."
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-gray-50 hover:bg-white transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all duration-200 whitespace-nowrap text-sm font-medium">
                  筛选
                </button>
                <Link href="/share" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 whitespace-nowrap text-sm font-medium shadow-md hover:shadow-lg">
                  资源分享
                </Link>
                <a href="/jiaoyi.html" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 whitespace-nowrap text-sm font-medium shadow-md hover:shadow-lg">
                  📈 交易回放
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-start gap-3 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">排序方式：</span>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1 rounded-md text-xs bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                上传顺序 {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">最新资源</h2>
            <span className="text-sm text-gray-500">共 {filteredResources.length} 条记录</span>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={`skeleton-${i}`} className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredResources.map(resource => (
                <div key={resource.id} className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium mt-0.5">
                      峻
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors mb-2">
                        {resource.title}
                      </h3>
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {resource.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-base text-gray-700 mb-4">
                        {resource.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 border-t border-gray-100 pt-4 justify-end">
                    {resource.quarkLink && (
                      <a 
                        href={resource.quarkLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        🔴 夸克
                      </a>
                    )}
                    {resource.baiduLink && (
                      <a 
                        href={resource.baiduLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        🔵 百度
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-gray-200 py-8 px-6 md:px-8 bg-white mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2026 峻峻尼分享 | 优质资源分享平台
          </p>
        </div>
      </footer>
    </div>
  );
}
