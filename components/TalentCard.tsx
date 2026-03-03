
import React from 'react';
import { TalentProfile, TraitType, Language } from '../types';
import RadarChart from './RadarChart';
import InputConsole from './InputConsole';
import { Shield, Target, X, Zap, Info, Calculator, Database, Bot, Cpu } from 'lucide-react';
import { DEPT_TRANSLATIONS, ROLE_TRANSLATIONS, ARCHETYPE_TRANSLATIONS, TAG_TRANSLATIONS, PROFILE_TRANSLATIONS } from '../data/mockData';

interface Props {
  profile: TalentProfile;
  onClose?: () => void;
  onAnalyze: (data: string) => Promise<void>;
  isAnalyzing: boolean;
  language: Language;
}

const TalentCard: React.FC<Props> = ({ profile, onClose, onAnalyze, isAnalyzing, language }) => {
  
  // Dynamic Calculation
  const metricsValues = Object.values(profile.metrics) as number[];
  const sumMetrics = metricsValues.reduce((a, b) => a + b, 0);
  const calculatedOvr = Math.round(sumMetrics / 6);

  // Translations for Static Labels and Fields
  const displayDept = language === 'zh' ? (DEPT_TRANSLATIONS[profile.department] || profile.department) : profile.department;
  const displayRole = language === 'zh' ? (ROLE_TRANSLATIONS[profile.role] || profile.role) : profile.role;
  const displayArchetype = language === 'zh' ? (ARCHETYPE_TRANSLATIONS[profile.archetype] || profile.archetype) : profile.archetype;
  
  const displayTags = profile.tags.map(tag => 
    language === 'zh' ? (TAG_TRANSLATIONS[tag] || tag) : tag
  );

  // Translation Logic for Mock Content (Scout Report & Dev Plan)
  // If the profile matches a known mock ID, AND the content matches the original English mock content,
  // we render the translation. Otherwise (if user updated it via AI), we render the profile content directly.
  const mockTranslations = PROFILE_TRANSLATIONS[profile.id];
  
  const displayReport = (
      language === 'zh' && 
      mockTranslations && 
      profile.scoutReport === mockTranslations.report.en
  ) ? mockTranslations.report.zh : profile.scoutReport;

  const displayPlan = (
      language === 'zh' && 
      mockTranslations && 
      JSON.stringify(profile.developmentPlan) === JSON.stringify(mockTranslations.plan.en)
  ) ? mockTranslations.plan.zh : profile.developmentPlan;

  const formulaText = language === 'en' 
    ? '(Synergy + Judgment + System + Innovation + Empathy + Iteration) / 6'
    : '(协同 + 判断 + 架构 + 创新 + 共情 + 迭代) / 6';
  const sumLabel = language === 'en' ? 'Sum' : '总和';

  const getRatingColor = (rating: number) => {
    if (profile.isAgent) return 'text-indigo-400';
    if (rating >= 90) return 'text-yellow-400';
    if (rating >= 80) return 'text-cyan-400';
    if (rating >= 60) return 'text-emerald-400';
    return 'text-slate-400';
  };

  return (
    <div className={`relative bg-slate-900/90 h-full flex flex-col`}>
      
      {/* Header / ID Strip */}
      <div className="flex justify-between items-center px-6 py-5 bg-black/40 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          {profile.isAgent && (
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Bot className="text-white w-8 h-8" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-white tracking-wider tech-font uppercase">{profile.name}</h2>
              {profile.isAgent && (
                <span className="px-2 py-0.5 bg-indigo-900/50 border border-indigo-500/50 rounded text-[10px] text-indigo-300 font-bold uppercase tracking-widest">
                  Digital Agent
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full animate-pulse ${profile.isAgent ? 'bg-indigo-500' : 'bg-green-500'}`}></span>
              {displayRole} <span className="text-slate-600">|</span> {profile.isAgent ? (language === 'en' ? 'Digital Entity' : '数字实体') : displayDept}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end group relative cursor-help">
            <div className="flex items-center gap-1 text-xs text-slate-500 uppercase tracking-widest mb-1">
                {language === 'en' ? 'OVR RATING' : '综合评分'} <Info className="w-3 h-3" />
            </div>
            <span className={`text-5xl font-bold tech-font ${getRatingColor(calculatedOvr)}`}>
              {calculatedOvr}
            </span>
            
            {/* Enhanced Tooltip for OVR - BILINGUAL */}
            <div className="absolute top-full right-0 mt-4 w-96 p-4 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0 translate-y-2 pointer-events-none z-50">
                <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold uppercase tracking-widest border-b border-slate-800 pb-2">
                    <Calculator className="w-3 h-3" /> {language === 'en' ? 'Calculation Logic' : '计算逻辑'}
                </div>
                
                <div className="space-y-3">
                    {/* Formula Section */}
                    <div className="font-mono text-[10px] space-y-1 pb-2 border-b border-slate-800">
                        <div className="flex justify-between text-slate-500">
                             <span>{sumLabel} ({sumMetrics}) / 6</span>
                             <span className="text-cyan-400 font-bold text-sm">{calculatedOvr}</span>
                        </div>
                        <div className="text-[9px] text-slate-600 break-words leading-tight">
                            {formulaText}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2 text-[10px] leading-relaxed">
                         <p className="text-slate-400 mb-2 font-medium">
                            {language === 'en' 
                                ? "The system uses a 6-dimension average method." 
                                : "目前系统采用的是六维平均法。"
                            }
                         </p>
                         
                         <div className="grid grid-cols-[35px_1fr] gap-x-2 gap-y-2">
                            <span className="text-yellow-400 font-bold">90-99</span>
                            <span className="text-slate-300">
                                {language === 'en' 
                                    ? "Visionary leader defining company AI strategy." 
                                    : "行业领军人物，能定义公司 AI 战略。"
                                }
                            </span>
                            
                            <span className="text-cyan-400 font-bold">80-89</span>
                            <span className="text-slate-300">
                                {language === 'en' 
                                    ? "Core talent, highly proficient in AI efficiency." 
                                    : "核心骨干，能极其熟练地运用 AI 提升效率。"
                                }
                            </span>
                            
                            <span className="text-emerald-400 font-bold">60-79</span>
                            <span className="text-slate-300">
                                {language === 'en' 
                                    ? "Competent tool user, but may lack depth/innovation." 
                                    : "合格，能使用工具，但可能缺乏深度思考或创新。"
                                }
                            </span>
                            
                            <span className="text-slate-500 font-bold">&lt; 60</span>
                            <span className="text-slate-300">
                                {language === 'en' 
                                    ? "At risk. Urgent upskilling required." 
                                    : "风险区，需要急迫的转型培训。"
                                }
                            </span>
                         </div>
                    </div>
                </div>
            </div>
          </div>
          
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white border border-transparent hover:border-slate-700">
                <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid - Scrollable */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 gap-6 p-6">
            
            {/* Top Section: Archetype & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex flex-col justify-center space-y-6">
                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                            {profile.isAgent ? (language === 'en' ? 'Agent Architecture' : '智能体架构') : (language === 'en' ? 'Archetype' : '原型')}
                        </div>
                        <div className="text-2xl text-white font-medium tech-font flex items-center gap-2">
                            {profile.isAgent ? <Cpu className="w-5 h-5 text-indigo-400" /> : <Zap className="w-5 h-5 text-cyan-400" />}
                            {displayArchetype}
                        </div>
                        {profile.isAgent && profile.agentModel && (
                          <div className="mt-2 text-[10px] text-indigo-400/80 font-mono uppercase tracking-widest">
                            Model: {profile.agentModel}
                          </div>
                        )}
                    </div>
                    <div>
                         <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                            {language === 'en' ? 'Key Tags' : '关键标签'}
                         </div>
                        <div className="flex gap-2 flex-wrap">
                            {displayTags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-cyan-300 font-medium uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/20 rounded-xl p-2 border border-slate-800/50">
                     <RadarChart metrics={profile.metrics} language={language} />
                </div>
            </div>

            {/* Middle Section: Report & Plan */}
            <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800/50 p-5 rounded-lg border border-slate-700/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Shield className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold uppercase text-xs tracking-wider relative z-10">
                        <Shield className="w-4 h-4" /> 
                        {language === 'en' ? 'Scout Report' : '星探报告'}
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed italic relative z-10 font-medium">
                        "{displayReport}"
                    </p>
                </div>

                <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-4 text-red-400 font-bold uppercase text-xs tracking-wider">
                        <Target className="w-4 h-4" /> 
                        {profile.isAgent ? (language === 'en' ? 'Optimization Protocols' : '优化协议') : (language === 'en' ? 'Development Protocols' : '发展协议')}
                    </div>
                    <ul className="space-y-4">
                        {displayPlan.map((plan, idx) => (
                            <li key={idx} className="flex gap-4 text-sm text-slate-300 group">
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-slate-800 text-slate-500 text-xs font-mono border border-slate-700 group-hover:border-cyan-500 group-hover:text-cyan-500 transition-colors">
                                    {idx + 1}
                                </span>
                                <span className="leading-snug pt-0.5">{plan}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Section: Input Console (Contextual) */}
            <div className="mt-4 pt-6 border-t border-slate-800/50">
                <div className="flex items-center gap-2 mb-4 text-cyan-500 font-bold uppercase text-xs tracking-wider">
                    <Database className="w-4 h-4" /> 
                    {language === 'en' ? 'Update Neural Profile' : '更新神经档案'}
                </div>
                <div className="bg-[#050505] rounded-xl border border-slate-800/80 p-1">
                    <InputConsole onAnalyze={onAnalyze} isAnalyzing={isAnalyzing} language={language} />
                </div>
            </div>

        </div>
      </div>

    </div>
  );
};

export default TalentCard;
