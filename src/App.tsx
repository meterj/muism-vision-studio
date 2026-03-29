/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Info, 
  RefreshCw, 
  Download, 
  Share2, 
  Layers, 
  Palette, 
  Wind,
  Loader2,
  ChevronRight,
  History,
  ThumbsUp,
  ThumbsDown,
  Key,
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Zap,
  BookOpen
} from 'lucide-react';
import { interpretUserIntent, generateShamanicImage, InterpretationResult } from './lib/gemini';
import { SHAMANIC_KNOWLEDGE, INTENT_CATEGORIES } from './constants';
import { generateShamanicHtml } from './lib/export';

export default function App() {
  const [input, setInput] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<InterpretationResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [resolution, setResolution] = useState<'512px' | '1K' | '2K' | '4K'>('2K');
  const [genMode, setGenMode] = useState<'vision' | 'talisman'>('vision');
  const [selectedDeity, setSelectedDeity] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('');
  const [intensity, setIntensity] = useState(50); // 0: Modern, 100: Traditional
  const [visualStyle, setVisualStyle] = useState<'human' | 'symbol' | 'space'>('symbol');
  const [artStyle, setArtStyle] = useState<'musindo' | 'minhwa' | 'bulhwa' | 'modern'>('musindo');
  const [history, setHistory] = useState<{
    input: string, 
    imageUrl: string, 
    result: InterpretationResult,
    rating?: 'up' | 'down'
  }[]>(() => {
    try {
      const saved = localStorage.getItem('shamanic_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
      return [];
    }
  });

  useEffect(() => {
    const saveHistory = (data: typeof history) => {
      try {
        localStorage.setItem('shamanic_history', JSON.stringify(data));
      } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          console.warn("LocalStorage quota exceeded, pruning history...");
          if (data.length > 1) {
            // Remove the oldest entry and try again
            saveHistory(data.slice(0, -1));
          }
        } else {
          console.error("Failed to save history to localStorage:", e);
        }
      }
    };
    saveHistory(history);
  }, [history]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('GEMINI_API_KEY') || '';
    }
    return '';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [keySaved, setKeySaved] = useState(false);

  const hasApiKey = !!apiKey;

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      sessionStorage.setItem('GEMINI_API_KEY', tempKey.trim());
      setApiKey(tempKey.trim());
      setKeySaved(true);
      setTimeout(() => {
        setShowKeyModal(false);
        setKeySaved(false);
      }, 1000);
    }
  };
  const [activeGenImage, setActiveGenImage] = useState(true);
  const [activeGenPrompt, setActiveGenPrompt] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleImage = () => {
    if (!activeGenPrompt && activeGenImage) return; // Prevent both off
    setActiveGenImage(!activeGenImage);
  };

  const handleTogglePrompt = () => {
    if (!activeGenImage && activeGenPrompt) return; // Prevent both off
    setActiveGenPrompt(!activeGenPrompt);
  };

  const handleCopyPrompt = () => {
    if (!result?.englishPrompt) return;
    navigator.clipboard.writeText(result.englishPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearKey = () => {
    sessionStorage.removeItem('GEMINI_API_KEY');
    setApiKey('');
    setTempKey('');
    setShowKeyModal(false);
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsInterpreting(true);
    setImageUrl(null);
    setError(null);
    
    try {
      if (!hasApiKey) {
        setShowKeyModal(true);
        return;
      }

      const fullInput = [
        input,
        selectedDeity ? `신격: ${selectedDeity}` : '',
        selectedPurpose ? `제의 목적: ${selectedPurpose}` : '',
        selectedSpace ? `제의 공간: ${selectedSpace}` : '',
        `강도: ${intensity}% 전통 고증`,
        `시각 스타일: ${visualStyle === 'human' ? '인간형' : visualStyle === 'symbol' ? '상징형' : '공간형'}`,
        `예술 양식: ${artStyle === 'musindo' ? '무신도' : artStyle === 'minhwa' ? '민화' : artStyle === 'bulhwa' ? '불화' : '현대적'}`
      ].filter(Boolean).join(', ');

      let interpretation: InterpretationResult;
      
      if (activeGenPrompt) {
        setIsInterpreting(true);
        interpretation = await interpretUserIntent(fullInput);
        setResult(interpretation);
        setIsInterpreting(false);
      } else {
        // Use a dummy interpretation result with the raw input as prompt if prompt gen is off
        interpretation = {
          intent: "사용자 직접 입력",
          selectedSymbols: [],
          selectedColors: [],
          deity: "직접 설계",
          ritualPurpose: "직접 설계",
          ritualSpace: "직접 설계",
          composition: "직접 입력한 텍스트 기반 시각화",
          explanation: "AI 해석 없이 입력한 텍스트로 직접 이미지를 생성합니다.",
          englishPrompt: input
        };
        setResult(interpretation);
      }
      
      if (activeGenImage) {
        setIsGenerating(true);
        const promptToUse = activeGenPrompt ? interpretation.englishPrompt : input;
        const generatedImage = await generateShamanicImage(promptToUse, aspectRatio, genMode, artStyle, resolution);
        setImageUrl(generatedImage);
        setHistory(prev => [{ input, imageUrl: generatedImage, result: interpretation }, ...prev].slice(0, 15));
      }
    } catch (error: any) {
      console.error("Generation failed:", error);
      let errorMsg = "알 수 없는 오류가 발생했습니다.";
      
      if (error.message?.includes("API_KEY_NOT_FOUND")) errorMsg = "API 키가 설정되지 않았습니다.";
      else if (error.message?.includes("SAFETY_BLOCK")) errorMsg = error.message.split(": ")[1];
      else if (error.message?.includes("quota")) errorMsg = "API 사용량이 초과되었습니다. 잠시 후 다시 시도해 주세요.";
      else if (error.message?.includes("invalid")) errorMsg = "유효하지 않은 API 키이거나 설정 오류입니다.";
      else if (error.message?.includes("404")) errorMsg = "선택한 모델을 사용할 수 없는 계정입니다. (404 Not Found)";
      
      setError(errorMsg);
    } finally {
      setIsInterpreting(false);
      setIsGenerating(false);
    }
  };

  const handleDownloadHtml = () => {
    if (!imageUrl || !result) return;
    
    const html = generateShamanicHtml(input, imageUrl, result, { artStyle, intensity, visualStyle });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shamanic_report_${result.intent.replace('/', '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRate = (rating: 'up' | 'down') => {
    if (!imageUrl) return;
    setHistory(prev => prev.map(item => 
      item.imageUrl === imageUrl ? { ...item, rating } : item
    ));
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `shamanic_vision_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getSymbolName = (id: string) => {
    const flattenedDeities = SHAMANIC_KNOWLEDGE.deities.flatMap(d => d.items);
    const symbol = [
      ...SHAMANIC_KNOWLEDGE.patterns, 
      ...SHAMANIC_KNOWLEDGE.mugu, 
      ...flattenedDeities,
      ...SHAMANIC_KNOWLEDGE.ritual_purposes,
      ...SHAMANIC_KNOWLEDGE.ritual_spaces
    ].find(s => s.id === id);
    return symbol ? symbol.name : id;
  };

  const getColorHex = (id: string) => {
    const color = SHAMANIC_KNOWLEDGE.colors.find(c => c.id === id);
    return color ? color.hex : '#ffffff';
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="shamanic-bg" />
      
      {/* Shamanic Animations (Floating Spirits/Embers) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 0.3, 0],
              scale: [0.5, 1.2, 0.8],
              x: [null, (Math.random() - 0.5) * 100]
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 10
            }}
            className="absolute w-1 h-1 bg-orange-500 rounded-full blur-[2px]"
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`spirit-${i}`}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 100,
              opacity: 0
            }}
            animate={{ 
              y: -200,
              opacity: [0, 0.15, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 20 + Math.random() * 30, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 20
            }}
            className="absolute flex items-center justify-center"
          >
            <Sparkles className="text-blue-400/20 w-8 h-8" />
          </motion.div>
        ))}
      </div>
      
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10 sticky top-0 z-50 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight shamanic-gradient-text">MUISM VISION V1.0</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">의도기원 (意圖祈願)</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowKeyModal(true)}
            className={`p-2 rounded-full transition-colors ${hasApiKey ? 'text-green-400/60 hover:text-green-400' : 'text-orange-400/60 hover:text-orange-400'} hover:bg-white/10`}
            title="API 키 설정"
          >
            <Key className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <History className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all">
            상징 사전
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12">
        
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <section className="glass-panel p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-400">
                <Wind className="w-4 h-4" />
                <h2 className="text-sm uppercase tracking-widest font-bold">제의 설계 (Ritual Design)</h2>
              </div>
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                <button 
                  onClick={() => setGenMode('vision')}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                    genMode === 'vision' 
                      ? 'bg-orange-600 text-white shadow-lg' 
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  신화적 장면
                </button>
                <button 
                  onClick={() => setGenMode('talisman')}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                    genMode === 'talisman' 
                      ? 'bg-orange-600 text-white shadow-lg' 
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  영험한 부적
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/30 font-mono">Deity</label>
                <select 
                  value={selectedDeity}
                  onChange={(e) => setSelectedDeity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                >
                  <option value="" className="bg-[#151619]">신격 선택 (선택 안함)</option>
                  {SHAMANIC_KNOWLEDGE.deities.map(cat => (
                    <optgroup key={cat.category} label={cat.category} className="bg-[#151619]">
                      {cat.items.map(d => (
                        <option key={d.id} value={d.name} className="bg-[#151619]">{d.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/30 font-mono">Purpose</label>
                <select 
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                >
                  <option value="" className="bg-[#151619]">제의 목적 (선택 안함)</option>
                  {SHAMANIC_KNOWLEDGE.ritual_purposes.map(p => (
                    <option key={p.id} value={p.name} className="bg-[#151619]">{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/30 font-mono">Space</label>
                <select 
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                >
                  <option value="" className="bg-[#151619]">제의 공간 (선택 안함)</option>
                  {SHAMANIC_KNOWLEDGE.ritual_spaces.map(s => (
                    <option key={s.id} value={s.name} className="bg-[#151619]">{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-white/30 font-mono">Ritual Intensity (전통 고증 vs 현대 재해석)</label>
                <span className="text-sm text-orange-400 font-bold">{intensity}% 전통</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={intensity} 
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-[8px] text-white/20 uppercase tracking-tighter">
                <span>Modern Reinterpretation</span>
                <span>Traditional Authenticity</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-white/30 mr-2 font-mono">Art Style</span>
              {[
                { id: 'musindo', name: '무신도' },
                { id: 'minhwa', name: '민화' },
                { id: 'bulhwa', name: '불화' },
                { id: 'modern', name: '현대적' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setArtStyle(style.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${
                    artStyle === style.id 
                      ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-white/30 mr-2 font-mono">Visual Style</span>
              {[
                { id: 'human', name: '인간형' },
                { id: 'symbol', name: '상징형' },
                { id: 'space', name: '공간형' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setVisualStyle(style.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${
                    visualStyle === style.id 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-center justify-between">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest font-serif">시각적 작업 설정</span>
              <div className="flex gap-3">
                <button 
                  onClick={handleTogglePrompt}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    activeGenPrompt 
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-900/10' 
                      : 'bg-white/5 border-white/10 text-white/20'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-bold">상징/프롬프트 해석</span>
                </button>
                <button 
                  onClick={handleToggleImage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    activeGenImage 
                      ? 'bg-orange-600/20 border-orange-500/50 text-orange-300 shadow-lg shadow-orange-900/10' 
                      : 'bg-white/5 border-white/10 text-white/20'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">이미지 비전 생성</span>
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 flex items-start gap-3"
              >
                <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-red-200">생성 중 오류 발생</p>
                  <p className="text-xs text-red-100/60 leading-relaxed">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-200 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
            
            <div className="relative">
              {!hasApiKey && (
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center gap-4">
                  <p className="text-sm text-white/80">이미지 생성을 위해 API 키 설정이 필요합니다.</p>
                  <button 
                    onClick={() => setShowKeyModal(true)}
                    className="px-6 py-2 rounded-full bg-orange-600 hover:bg-orange-500 text-sm font-bold uppercase tracking-widest transition-all"
                  >
                    API 키 설정하기
                  </button>
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-white/40 underline"
                  >
                    설정 방법 안내
                  </a>
                </div>
              )}
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="당신의 바람이나 의도를 입력하세요... (예: 우리 가족의 평안과 복을 지켜주는 장면)"
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none placeholder:text-white/20"
              />
              <button 
                onClick={handleGenerate}
                disabled={isInterpreting || isGenerating || !input.trim()}
                className="absolute bottom-4 right-4 p-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-white/10 disabled:text-white/20 transition-all shadow-lg shadow-orange-900/20"
              >
                {isInterpreting || isGenerating ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-white/30 mr-2 font-mono">Aspect Ratio</span>
              {['1:1', '16:9', '9:16', '2:3', '3:2'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${
                    aspectRatio === ratio 
                      ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {ratio}
                </button>
              ))}
              
              <div className="w-px h-4 bg-white/10 mx-2" />
              
              <span className="text-sm text-white/30 mr-2 font-mono">Quality</span>
              {['512px', '1K', '2K', '4K'].map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res as any)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${
                    resolution === res 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {res === '512px' ? '512' : res}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {Object.keys(INTENT_CATEGORIES).map((intent) => (
                <button 
                  key={intent}
                  onClick={() => setInput(intent + "를 위한 이미지를 만들어줘")}
                  className="px-2 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[9px] text-white/60 hover:text-white hover:bg-white/10 transition-all text-center whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {intent}
                </button>
              ))}
            </div>
          </section>

          <AnimatePresence>
            {result && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Layers className="w-4 h-4" />
                    <h2 className="text-sm uppercase tracking-widest font-bold">상징 해석 (Interpretation)</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider border border-blue-500/30">
                    {result.intent}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-[9px] uppercase tracking-widest text-white/30 mb-1 font-mono">Deity</h4>
                      <p className="text-xs text-orange-200 font-bold">{result.deity}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-[9px] uppercase tracking-widest text-white/30 mb-1 font-mono">Ritual Purpose</h4>
                      <p className="text-xs text-blue-200 font-bold">{result.ritualPurpose}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-[9px] uppercase tracking-widest text-white/30 mb-1 font-mono">Ritual Space</h4>
                      <p className="text-xs text-purple-200 font-bold">{result.ritualSpace}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-white/40 mb-3 font-mono">Selected Symbols</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.selectedSymbols.map(sym => (
                        <span key={sym} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/80">
                          {getSymbolName(sym)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-white/40 mb-3 font-mono">Color Palette</h3>
                    <div className="flex gap-3">
                      {result.selectedColors.map(color => (
                        <div key={color} className="group relative">
                          <div 
                            className="w-8 h-8 rounded-full border border-white/20 shadow-inner"
                            style={{ backgroundColor: getColorHex(color) }}
                          />
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 italic text-base text-white/70 leading-relaxed">
                    "{result.explanation}"
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Result Display */}
        <div className="lg:col-span-7">
          <section className="glass-panel aspect-square relative overflow-hidden group">
            <AnimatePresence mode="wait">
              {imageUrl ? (
                <motion.div 
                  key="image"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full"
                >
                  <img 
                    src={imageUrl} 
                    alt="Generated Shamanic Vision" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <button 
                          onClick={handleDownloadImage}
                          className="flex-1 py-3 rounded-xl bg-orange-600/80 backdrop-blur-md border border-orange-500/30 flex items-center justify-center gap-2 hover:bg-orange-500 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">이미지 저장</span>
                        </button>
                        <button 
                          onClick={handleDownloadHtml}
                          className="flex-1 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                        >
                          <Layers className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">리포트 (HTML)</span>
                        </button>
                      </div>
                      <button className="w-full py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">공유하기</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full flex flex-col items-center justify-center p-12 text-center gap-6"
                >
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-8">
                      <div className="relative w-32 h-32">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-2 border-dashed border-orange-500/30 rounded-full"
                        />
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-4 border border-blue-500/20 rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif italic text-orange-200">신의 공간을 구성하는 중...</h3>
                        <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Generating Sacred Space</p>
                      </div>
                      <div className="flex gap-2">
                        {['상징 조합', '제의적 리듬', '영적 파동'].map((step, i) => (
                          <motion.span 
                            key={step}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.5 }}
                            className="text-[10px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40"
                          >
                            {step}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  ) : isInterpreting ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                      <h3 className="text-lg font-serif italic text-blue-200">의도를 상징으로 번역하는 중...</h3>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="w-24 h-24 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-white/20" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-base font-serif italic text-white/60">당신의 기원을 시각화하세요</h3>
                        <p className="text-sm text-white/30 max-w-xs mx-auto">
                          입력한 문장을 바탕으로 한국 전통 무속의 상징 체계를 결합한 신화적 이미지를 생성합니다.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {imageUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-6 p-4 glass-panel"
            >
              <span className="text-sm uppercase tracking-widest text-white/40 font-mono">Rate this image</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleRate('up')}
                  className={`p-2 rounded-full transition-all ${
                    history.find(h => h.imageUrl === imageUrl)?.rating === 'up'
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/40'
                      : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleRate('down')}
                  className={`p-2 rounded-full transition-all ${
                    history.find(h => h.imageUrl === imageUrl)?.rating === 'down'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-900/40'
                      : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* New Prompt Display Card */}
          {result?.englishPrompt && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 glass-panel p-6 border-dashed border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white/40">
                  <BookOpen className="w-4 h-4" />
                  <h3 className="text-xs uppercase tracking-widest font-bold">생성된 프롬프트 (Visual Prompt)</h3>
                </div>
                <button 
                  onClick={handleCopyPrompt}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-xs font-bold uppercase">{copied ? '복사 완료' : '프롬프트 복사'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <p className="text-sm text-blue-200/90 font-mono leading-relaxed italic break-words">
                  {result.englishPrompt}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-white/20 uppercase tracking-tighter">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                This prompt was optimized for high-fidelity shamanic visual fidelity
              </div>
            </motion.div>
          )}

          {/* Detailed Explanation Panel */}
          {imageUrl && result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 glass-panel p-8"
            >
              <div className="flex items-center gap-2 text-yellow-400 mb-6">
                <Info className="w-4 h-4" />
                <h2 className="text-sm uppercase tracking-widest font-bold">상징 리포트 (Symbol Report)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-base font-bold text-white/80 border-l-2 border-orange-500 pl-3">의례적 구성 및 신격</p>
                  <div className="space-y-2">
                    <p className="text-base text-white/60 leading-relaxed">
                      {result.composition}
                    </p>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/40 leading-relaxed">
                      <div className="flex items-center justify-between">
                        <span className="text-orange-400 font-bold">선정 신격: {result.deity}</span>
                      </div>
                      {(() => {
                        const flattenedDeities = SHAMANIC_KNOWLEDGE.deities.flatMap(d => d.items);
                        const deityInfo = flattenedDeities.find(d => result.deity.includes(d.name));
                        return deityInfo?.detailedDescription ? (
                          <p className="text-sm text-white/80 border-t border-white/5 pt-2">
                            {deityInfo.detailedDescription}
                          </p>
                        ) : null;
                      })()}
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50">
                      <span className="text-blue-400 font-bold mr-2">제의 목적:</span> {result.ritualPurpose}
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50">
                      <span className="text-purple-400 font-bold mr-2">제의 공간:</span> {result.ritualSpace}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-base font-bold text-white/80 border-l-2 border-blue-500 pl-3">무구 및 문양의 의미</p>
                  <div className="space-y-3">
                    {result.selectedSymbols.map(sym => {
                      const flattenedDeities = SHAMANIC_KNOWLEDGE.deities.flatMap(d => d.items);
                      const s = [
                        ...SHAMANIC_KNOWLEDGE.patterns, 
                        ...SHAMANIC_KNOWLEDGE.mugu,
                        ...flattenedDeities,
                        ...SHAMANIC_KNOWLEDGE.ritual_purposes,
                        ...SHAMANIC_KNOWLEDGE.ritual_spaces
                      ].find(item => item.id === sym);
                      return s ? (
                        <div key={sym} className="text-xs p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white/90 font-bold">{s.name}</span>
                            <span className="text-white/30 text-[10px]">{s.meaning}</span>
                          </div>
                          {(s as any).visualCharacteristics && (
                            <p className="text-sm text-white/80 border-t border-white/5 pt-2">
                              { (s as any).visualCharacteristics }
                            </p>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-80 bg-[#151619] border-l border-white/10 z-[70] p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest">기록 (History)</h2>
                <div className="flex items-center gap-4">
                  {history.length > 0 && (
                    <div className="flex items-center gap-2">
                      {showClearConfirm ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setHistory([]);
                              localStorage.removeItem('shamanic_history');
                              setShowClearConfirm(false);
                            }}
                            className="text-[10px] text-red-400 font-bold hover:underline"
                          >
                            YES
                          </button>
                          <button 
                            onClick={() => setShowClearConfirm(false)}
                            className="text-[10px] text-white/40 hover:text-white"
                          >
                            NO
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowClearConfirm(true)}
                          className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-tighter"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                  <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-6">
                {history.length === 0 ? (
                  <p className="text-xs text-white/20 text-center py-12 italic">생성된 기록이 없습니다.</p>
                ) : (
                  history.map((item, i) => (
                    <div 
                      key={i} 
                      className="group cursor-pointer relative"
                      onClick={() => {
                        setImageUrl(item.imageUrl);
                        setResult(item.result);
                        setInput(item.input);
                        setShowHistory(false);
                      }}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden border border-white/10 mb-2 group-hover:border-orange-500/50 transition-all relative">
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {item.rating && (
                          <div className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md border ${
                            item.rating === 'up' ? 'bg-orange-500/80 border-orange-400' : 'bg-red-500/80 border-red-400'
                          }`}>
                            {item.rating === 'up' ? <ThumbsUp className="w-3 h-3 text-white" /> : <ThumbsDown className="w-3 h-3 text-white" />}
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-white/40 line-clamp-2 italic leading-tight">"{item.input}"</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-panel p-8 bg-zinc-900/50 border border-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setShowKeyModal(false)}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center gap-6 text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${hasApiKey ? 'border-green-500/30 bg-green-500/10' : 'border-orange-500/30 bg-orange-500/10'}`}>
                  <Key className={`w-8 h-8 ${hasApiKey ? 'text-green-400' : 'text-orange-400'}`} />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-bold shamanic-gradient-text">Google Gemini API 키 설정</h2>
                  <p className="text-sm text-white/40 leading-relaxed">
                    이 키는 브라우저 세션에만 임시 저장되며,<br /> 
                    창을 닫으면 완전히 소멸됩니다.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <div className="relative">
                    <input 
                      type="password"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder="AI Studio에서 발급받은 API 키를 입력하세요"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/50 focus:outline-none transition-all placeholder:text-white/20"
                    />
                    {hasApiKey && tempKey === apiKey && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-500/20 border border-green-500/30">
                        <ShieldCheck className="w-3 h-3 text-green-400" />
                        <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Active</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={handleClearKey}
                      className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all uppercase tracking-widest"
                    >
                      초기화
                    </button>
                    <button 
                      onClick={handleSaveKey}
                      disabled={keySaved || !tempKey.trim()}
                      className={`flex-[2] py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                        keySaved 
                        ? 'bg-green-600 text-white' 
                        : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20'
                      }`}
                    >
                      {keySaved ? '저장 완료' : '설정 저장'}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
                  >
                    Google AI Studio에서 키 발급받기
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="p-12 text-center border-t border-white/5 mt-12">
        <p className="text-sm text-white/20 uppercase tracking-[0.3em] font-mono">
          © 2026 MUISM VISION V1.0 · 의도기원 (意圖祈願)
        </p>
      </footer>
    </div>
  );
}
