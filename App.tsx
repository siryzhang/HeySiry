
import React, { useState, useEffect } from 'react';
import { TalentProfile, ViewMode, Language } from './types';
import TalentCard from './components/TalentCard';
import SynergyLab from './components/SynergyLab';
import HorizonScanner from './components/HorizonScanner';
import GalaxyView from './components/GalaxyView';
import { analyzeTalentData } from './services/geminiService';
import { Activity, Users, Globe, LayoutDashboard, Languages } from 'lucide-react';
import { MOCK_ROSTER } from './data/mockData';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewMode>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [roster, setRoster] = useState<TalentProfile[]>(MOCK_ROSTER);
  
  // Selected Profile for Slide-over
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  
  const activeProfile = roster.find(p => p.id === selectedProfileId);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyError(true);
    }
  }, []);

  const handleAnalysis = async (data: string) => {
    if (!activeProfile) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeTalentData(data, activeProfile, language);
      
      // Calculate overall rating
      const values = Object.values(result.metrics);
      const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

      const newHistoryPoint = {
        timestamp: new Date().toISOString(),
        overallRating: avg
      };

      // Update the specific profile in the roster
      const updatedProfile = {
        ...activeProfile,
        archetype: result.archetype,
        overallRating: avg,
        metrics: result.metrics,
        scoutReport: result.scoutReport,
        developmentPlan: result.developmentPlan,
        tags: result.tags,
        history: [...activeProfile.history, newHistoryPoint]
      };

      setRoster(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setRoster(MOCK_ROSTER);
    setSelectedProfileId(null);
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  if (apiKeyError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center border border-red-900 bg-red-950/20 p-8 rounded-xl">
          <h1 className="text-2xl font-bold mb-4 text-red-500">System Error</h1>
          <p className="mb-4">API Key is missing. Please configure your environment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] text-slate-200 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-100 font-sans flex flex-col">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-900/10 to-transparent"></div>
      </div>

      {/* Header Navigation - Fixed Top */}
      <header className="relative z-20 flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-slate-800 bg-[#050505]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
               <Activity className="text-black w-5 h-5" />
            </div>
            <div>
               <h1 className="text-xl font-bold tracking-widest text-white tech-font">HeySiry</h1>
               <p className="text-[10px] text-cyan-500 uppercase tracking-[0.3em]">
                   {language === 'en' ? 'AI Talent Logistics' : 'AI 人才决策系统'}
               </p>
            </div>
          </div>
          
          <nav className="flex gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-lg">
             <button 
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${view === 'dashboard' ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50 shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <LayoutDashboard className="w-3 h-3" /> 
                {language === 'en' ? 'Galaxy View' : '神经星云'}
             </button>
             <button 
                onClick={() => setView('synergy')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${view === 'synergy' ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50 shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <Users className="w-3 h-3" /> 
                {language === 'en' ? 'Synergy Lab' : '协同实验室'}
             </button>
             <button 
                onClick={() => setView('horizon')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${view === 'horizon' ? 'bg-green-900/30 text-green-400 border border-green-800/50 shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <Globe className="w-3 h-3" /> 
                {language === 'en' ? 'Horizon Scanner' : '地平线扫描'}
             </button>
          </nav>

          <div className="flex items-center gap-4">
             <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-500 transition-all"
             >
                <Languages className="w-3 h-3" />
                {language === 'en' ? 'EN' : '中文'}
             </button>
             <button onClick={handleReset} className="text-xs text-slate-500 hover:text-red-400 transition-colors uppercase tracking-wider">
               {language === 'en' ? 'Reset' : '重置'}
             </button>
          </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-grow z-10 overflow-hidden">
            
            {view === 'dashboard' && (
                <div className="w-full h-full relative">
                    <GalaxyView roster={roster} onSelectProfile={setSelectedProfileId} language={language} />
                    
                    {/* Floating Instruction */}
                    {!selectedProfileId && (
                        <div className="absolute bottom-10 left-10 pointer-events-none bg-black/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm max-w-xs animate-fade-in">
                            <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-1">
                                {language === 'en' ? 'System Ready' : '系统就绪'}
                            </h3>
                            <p className="text-slate-400 text-sm">
                                {language === 'en' 
                                    ? 'Navigate the Neural Constellation. Hover over nodes to identify agents. Click to initiate deep scan analysis.' 
                                    : '探索人才神经星云。悬停节点识别人员，点击以启动深度扫描分析。'
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}

            {view === 'synergy' && (
                <div className="h-full overflow-auto p-6">
                    <div className="mb-6">
                        <h2 className="text-xl text-white tech-font">
                            {language === 'en' ? 'Squad Simulator' : '小队模拟器'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {language === 'en' ? 'Analyze team topology and predict mission outcomes.' : '分析团队拓扑结构并预测任务结果。'}
                        </p>
                    </div>
                    <SynergyLab roster={roster} language={language} />
                </div>
            )}

            {view === 'horizon' && (
                <div className="h-full overflow-auto p-6">
                    <div className="mb-6">
                        <h2 className="text-xl text-white tech-font">
                            {language === 'en' ? 'Market Intelligence' : '市场情报'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {language === 'en' ? 'Real-time skill trends and competitive benchmarking.' : '实时技能趋势与竞争力基准分析。'}
                        </p>
                    </div>
                    <HorizonScanner roster={roster} language={language} />
                </div>
            )}

            {/* Backdrop for Overlay */}
            {selectedProfileId && (
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500"
                    onClick={() => setSelectedProfileId(null)}
                ></div>
            )}

            {/* Slide-over Overlay for Profile Details */}
            <div 
                className={`absolute top-0 right-0 h-full w-full md:w-[700px] lg:w-[800px] bg-[#0a0a0a] border-l border-slate-800 shadow-2xl transform transition-transform duration-500 ease-in-out z-50 flex flex-col ${
                    selectedProfileId ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {activeProfile && (
                     <TalentCard 
                        profile={activeProfile} 
                        onClose={() => setSelectedProfileId(null)} 
                        onAnalyze={handleAnalysis}
                        isAnalyzing={isAnalyzing}
                        language={language}
                    />
                )}
            </div>

      </main>
      
      <style>{`
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
