
import React, { useState } from 'react';
import { TalentProfile, SynergyAnalysis, TraitType, TeamRecommendation, Language } from '../types';
import { Users, Zap, BrainCircuit, Sparkles, ArrowLeft, RefreshCw, CheckCircle2, Crosshair, Bot } from 'lucide-react';
import { analyzeTeamSynergy, recommendBestTeam } from '../services/geminiService';
import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { ROLE_TRANSLATIONS } from '../data/mockData';

interface Props {
  roster: TalentProfile[];
  language: Language;
}

interface AutoTeamData {
    ids: string[];
    analysis: SynergyAnalysis | null;
    recommendation: TeamRecommendation;
}

const SynergyLab: React.FC<Props> = ({ roster, language }) => {
  // State for Manual Selection (User Playground)
  const [manualIds, setManualIds] = useState<string[]>([]);
  const [manualAnalysis, setManualAnalysis] = useState<SynergyAnalysis | null>(null);
  const [isSimulatingManual, setIsSimulatingManual] = useState(false);

  // State for AI Auto-Assembly
  const [autoTeamData, setAutoTeamData] = useState<AutoTeamData | null>(null);
  const [isAutoAssembling, setIsAutoAssembling] = useState(false);

  // Shared State
  const [mission, setMission] = useState(
      language === 'en' 
      ? "Build a Generative AI Customer Support Agent" 
      : "构建一个生成式 AI 客户支持智能体"
  );

  // Derived state for rendering overlays
  const manualProfiles = roster.filter(p => manualIds.includes(p.id));
  const autoProfiles = autoTeamData ? roster.filter(p => autoTeamData.ids.includes(p.id)) : [];

  // --- Handlers ---

  const toggleManualSelection = (id: string) => {
    setManualIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const runManualSimulation = async () => {
    if (manualIds.length === 0) return;
    setIsSimulatingManual(true);
    const selectedProfiles = roster.filter(p => manualIds.includes(p.id));
    const result = await analyzeTeamSynergy(selectedProfiles, mission, language);
    setManualAnalysis(result);
    setIsSimulatingManual(false);
  };

  const runAutoAssemble = async () => {
      if (!mission.trim()) return;
      setIsAutoAssembling(true);
      
      // 1. Get Recommendation (IDs + Text)
      const rec = await recommendBestTeam(roster, mission, language);
      
      // 2. Automatically analyze the synergy of this recommended team for the chart data
      const selectedProfiles = roster.filter(p => rec.recommendedIds.includes(p.id));
      let synergyResult: SynergyAnalysis | null = null;
      
      if (selectedProfiles.length > 0) {
          synergyResult = await analyzeTeamSynergy(selectedProfiles, mission, language);
      }

      setAutoTeamData({
          ids: rec.recommendedIds,
          recommendation: rec,
          analysis: synergyResult
      });

      setIsAutoAssembling(false);
  };

  const copyAiToManual = () => {
      if (autoTeamData) {
          setManualIds(autoTeamData.ids);
          setManualAnalysis(autoTeamData.analysis);
      }
  };

  // --- Chart Data Helper ---

  const getChartData = (profileIds: string[]) => {
      // Mapping for chart labels
      const labelMap: Record<string, string> = {
          [TraitType.SYNERGY]: language === 'en' ? 'Synergy' : '协同',
          [TraitType.ITERATION]: language === 'en' ? 'Iteration' : '迭代', 
          [TraitType.JUDGMENT]: language === 'en' ? 'Judgment' : '判断',
          [TraitType.SYSTEM]: language === 'en' ? 'System' : '架构', 
          [TraitType.INNOVATION]: language === 'en' ? 'Innovation' : '创新',
          [TraitType.EMPATHY]: language === 'en' ? 'Empathy' : '共情'
      };

      const subjects = [
        { key: TraitType.SYNERGY, label: labelMap[TraitType.SYNERGY] },
        { key: TraitType.ITERATION, label: labelMap[TraitType.ITERATION] },
        { key: TraitType.JUDGMENT, label: labelMap[TraitType.JUDGMENT] },
        { key: TraitType.SYSTEM, label: labelMap[TraitType.SYSTEM] },
        { key: TraitType.INNOVATION, label: labelMap[TraitType.INNOVATION] },
        { key: TraitType.EMPATHY, label: labelMap[TraitType.EMPATHY] },
      ];

      const profiles = roster.filter(p => profileIds.includes(p.id));

      return subjects.map(subj => {
          const point: any = { subject: subj.label, fullMark: 100 };
          
          let sum = 0;
          if (profiles.length > 0) {
              profiles.forEach(p => {
                  point[p.id] = p.metrics[subj.key as TraitType]; 
                  sum += p.metrics[subj.key as TraitType];
              });
              point.average = Math.round(sum / profiles.length); 
          } else {
              point.average = 0;
          }
          return point;
      });
  };

  return (
    <div className="h-full flex flex-col gap-6">
        
        {/* 1. Mission Control Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-lg shrink-0">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                {language === 'en' ? 'Mission Objective' : '任务目标'}
            </label>
            <input 
                type="text" 
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full bg-black/40 border border-slate-700 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
                placeholder={language === 'en' ? "Describe the project goal..." : "描述项目目标..."}
            />
        </div>

        {/* 2. Main Workspace */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            
            {/* Left Column: Roster Selection */}
            <div className="lg:col-span-3 flex flex-col min-h-0 bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-slate-900 border-b border-slate-800">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4" /> 
                        {language === 'en' ? 'Roster' : '花名册'}
                    </h3>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {roster.map(profile => {
                        const isSelected = manualIds.includes(profile.id);
                        const displayRole = language === 'zh' ? (ROLE_TRANSLATIONS[profile.role] || profile.role) : profile.role;
                        
                        return (
                            <div 
                                key={profile.id}
                                onClick={() => toggleManualSelection(profile.id)}
                                className={`p-2 rounded border cursor-pointer transition-all hover:bg-slate-800/80 group ${
                                    isSelected 
                                    ? 'bg-cyan-900/20 border-cyan-500/50' 
                                    : 'bg-transparent border-transparent hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors border ${isSelected ? 'bg-cyan-500 border-cyan-400 text-black' : (profile.isAgent ? 'bg-indigo-900 border-indigo-700 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-500 group-hover:bg-slate-700')}`}>
                                        {profile.isAgent ? <Bot className="w-4 h-4" /> : profile.name.charAt(0)}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-1">
                                            <div className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-200' : 'text-slate-400 group-hover:text-slate-200'}`}>{profile.name}</div>
                                            {profile.isAgent && <span className="text-[8px] bg-indigo-900/50 text-indigo-400 px-1 rounded border border-indigo-500/30">AI</span>}
                                        </div>
                                        <div className="text-[9px] text-slate-600 truncate uppercase">{displayRole}</div>
                                    </div>
                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Area: Comparisons */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                
                {/* --- HUMAN PANEL --- */}
                <div className="bg-cyan-950/10 border border-cyan-900/30 rounded-xl flex flex-col overflow-hidden h-full">
                     {/* Header */}
                     <div className="px-4 py-3 border-b border-cyan-900/30 bg-cyan-900/20 flex justify-between items-center shrink-0">
                        <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                           <Zap className="w-4 h-4" /> 
                           {language === 'en' ? 'Human Squad' : '人工小队'}
                        </h4>
                        
                        <div className="flex items-center gap-3">
                            {manualAnalysis && (
                                <span className={`text-sm font-bold tech-font ${manualAnalysis.score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {manualAnalysis.score} SYN
                                </span>
                            )}
                            <button 
                                onClick={runManualSimulation}
                                disabled={manualIds.length === 0 || isSimulatingManual}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500/50 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg"
                            >
                                {isSimulatingManual ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                {language === 'en' ? 'HUMAN' : '人工模拟'}
                            </button>
                        </div>
                     </div>

                     <div className="flex-grow overflow-y-auto custom-scrollbar p-4 relative">
                        {manualIds.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-3 z-10 p-6 text-center">
                                <Crosshair className="w-10 h-10 opacity-20" />
                                <p className="text-xs uppercase tracking-widest">
                                    {language === 'en' ? 'Select agents from roster to visualize' : '从名册选择成员以可视化'}
                                </p>
                                <div className="mt-4 px-4 py-2 border border-dashed border-slate-700 rounded text-[10px] text-slate-500">
                                    {language === 'en' ? 'Click' : '点击'} <span className="text-cyan-500 font-bold">{language === 'en' ? 'HUMAN' : '人工模拟'}</span> {language === 'en' ? 'to simulate synergy' : '以计算协同评分'}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Radar Chart Block */}
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-cyan-900/20">
                                    <div className="h-48 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={getChartData(manualIds)}>
                                                <PolarGrid stroke="#1e293b" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                
                                                {/* Render Individual Layers */}
                                                {manualProfiles.map((p) => (
                                                    <Radar
                                                        key={p.id}
                                                        name={p.name}
                                                        dataKey={p.id}
                                                        stroke="#22d3ee"
                                                        strokeWidth={1}
                                                        strokeOpacity={0.3}
                                                        fill="#22d3ee"
                                                        fillOpacity={0.05}
                                                    />
                                                ))}
                                                
                                                {/* Render Team Average Layer (Distinct) */}
                                                <Radar
                                                    name="Team Avg"
                                                    dataKey="average"
                                                    stroke="#cffafe"
                                                    strokeWidth={3}
                                                    fill="transparent"
                                                />
                                                
                                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} itemStyle={{ fontSize: '12px' }} />
                                            </RechartsRadar>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Text Analysis Block */}
                                {manualAnalysis && (
                                    <div className="animate-fade-in space-y-4">
                                        <div className="p-3 bg-cyan-900/10 border-l-2 border-cyan-500 rounded-r">
                                            <h5 className="text-[10px] uppercase text-cyan-400 font-bold mb-1">
                                                {language === 'en' ? 'Chemistry Report' : '化学反应报告'}
                                            </h5>
                                            <p className="text-xs text-slate-300 leading-relaxed">{manualAnalysis.chemistryReport}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-red-900/10 border-l-2 border-red-500 rounded-r">
                                                <h5 className="text-[10px] uppercase text-red-400 font-bold mb-1">
                                                    {language === 'en' ? 'Risk Factor' : '风险因素'}
                                                </h5>
                                                <p className="text-xs text-slate-300 leading-relaxed">{manualAnalysis.riskFactor}</p>
                                            </div>
                                            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded">
                                                <h5 className="text-[10px] uppercase text-slate-400 font-bold mb-1">
                                                    {language === 'en' ? 'Missing Elements' : '缺失元素'}
                                                </h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {manualAnalysis.missingElements.map((m, i) => (
                                                        <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-400">{m}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                     </div>
                </div>

                {/* --- AI AGENT PANEL --- */}
                <div className="bg-purple-950/10 border border-purple-900/30 rounded-xl flex flex-col overflow-hidden h-full">
                     {/* Header */}
                     <div className="px-4 py-3 border-b border-purple-900/30 bg-purple-900/20 flex justify-between items-center shrink-0">
                        <h4 className="text-purple-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                           <BrainCircuit className="w-4 h-4" /> 
                           {language === 'en' ? 'AI Assembly' : '智能编队'}
                        </h4>
                        
                        <div className="flex items-center gap-3">
                            {autoTeamData?.analysis && (
                                <span className={`text-sm font-bold tech-font ${autoTeamData.analysis.score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {autoTeamData.analysis.score} SYN
                                </span>
                            )}
                            <button 
                                onClick={runAutoAssemble}
                                disabled={isAutoAssembling || !mission.trim()}
                                className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/50 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg"
                            >
                                {isAutoAssembling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                {language === 'en' ? 'AUTO-ASSEMBLE' : '自动编队'}
                            </button>
                        </div>
                     </div>

                     <div className="flex-grow overflow-y-auto custom-scrollbar p-4 relative">
                        {!autoTeamData ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-3 z-10 p-6 text-center">
                                <BrainCircuit className="w-10 h-10 opacity-20" />
                                <p className="text-xs uppercase tracking-widest">
                                    {language === 'en' ? 'AI will select the optimal squad' : 'AI 将选择最佳小队'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                {/* Selected Agents Strip */}
                                <div className="flex flex-wrap gap-2">
                                    {autoProfiles.map(p => (
                                        <div key={p.id} className="flex items-center gap-2 px-2 py-1 bg-purple-900/20 border border-purple-500/30 rounded-full">
                                            <div className="w-4 h-4 rounded-full bg-purple-500 text-[8px] text-white flex items-center justify-center font-bold">
                                                {p.isAgent ? <Bot className="w-2.5 h-2.5" /> : p.name.charAt(0)}
                                            </div>
                                            <span className="text-[10px] text-purple-200 font-bold">{p.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Radar Chart Block */}
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-900/20">
                                    <div className="h-48 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={getChartData(autoTeamData.ids)}>
                                                <PolarGrid stroke="#1e293b" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar
                                                    name="AI Selection"
                                                    dataKey="average"
                                                    stroke="#a855f7"
                                                    strokeWidth={3}
                                                    fill="#a855f7"
                                                    fillOpacity={0.2}
                                                />
                                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} itemStyle={{ fontSize: '12px', color: '#a855f7' }} />
                                            </RechartsRadar>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Strategy Rationale */}
                                <div className="p-3 bg-purple-900/10 border-l-2 border-purple-500 rounded-r">
                                    <h5 className="text-[10px] uppercase text-purple-400 font-bold mb-1">
                                        {language === 'en' ? 'Strategy Rationale' : '策略理由'}
                                    </h5>
                                    <p className="text-xs text-slate-300 leading-relaxed italic">
                                        "{autoTeamData.recommendation.strategyRationale}"
                                    </p>
                                </div>

                                {/* Role Assignments */}
                                <div className="bg-slate-800/30 rounded border border-slate-700/50 p-3">
                                    <h5 className="text-[10px] uppercase text-slate-500 font-bold mb-2">
                                        {language === 'en' ? 'Tactical Assignments' : '战术分配'}
                                    </h5>
                                    <ul className="space-y-2">
                                        {autoTeamData.recommendation.keyRoles.map((role, idx) => (
                                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                                <span className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                                                {role}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action: Copy to Human */}
                                <button 
                                    onClick={copyAiToManual}
                                    className="w-full py-2 border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 text-slate-500 text-xs uppercase font-bold tracking-wider rounded transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    {language === 'en' ? 'Load to Human Simulator' : '加载到人工模拟器'}
                                </button>
                            </div>
                        )}
                     </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default SynergyLab;
