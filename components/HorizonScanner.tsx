
import React, { useEffect, useState } from 'react';
import { TalentProfile, MarketInsight, TraitType, Language } from '../types';
import { TrendingUp, TrendingDown, Globe, Target, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { analyzeMarketGap } from '../services/geminiService';
import { TICKER_DATA } from '../data/mockData';

interface Props {
  roster: TalentProfile[];
  language: Language;
}

const HorizonScanner: React.FC<Props> = ({ roster, language }) => {
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculate Team Average
  const calculateAverage = () => {
    const sums = {
      [TraitType.SYNERGY]: 0,
      [TraitType.ITERATION]: 0,
      [TraitType.JUDGMENT]: 0,
      [TraitType.INNOVATION]: 0,
      [TraitType.SYSTEM]: 0,
      [TraitType.EMPATHY]: 0,
    };
    
    if (roster.length === 0) return sums;

    roster.forEach(p => {
        Object.keys(sums).forEach(key => {
            sums[key as TraitType] += p.metrics[key as TraitType];
        });
    });
    const avg: any = {};
    Object.keys(sums).forEach(key => {
        avg[key] = Math.round(sums[key] / roster.length);
    });
    return avg;
  };

  const teamAvg = calculateAverage();

  // Industry Benchmark (Static Mock for visual, but can be AI enhanced)
  const industryBenchmark = {
      [TraitType.SYNERGY]: 85, 
      [TraitType.ITERATION]: 75,
      [TraitType.JUDGMENT]: 60, 
      [TraitType.INNOVATION]: 70,
      [TraitType.SYSTEM]: 65,
      [TraitType.EMPATHY]: 70,
  };

  // Mapping for chart labels
  const labelMap: Record<string, string> = {
      [TraitType.SYNERGY]: language === 'en' ? 'Synergy' : '协同',
      [TraitType.ITERATION]: language === 'en' ? 'Iteration' : '迭代', 
      [TraitType.JUDGMENT]: language === 'en' ? 'Judgment' : '判断',
      [TraitType.SYSTEM]: language === 'en' ? 'System' : '架构', 
      [TraitType.INNOVATION]: language === 'en' ? 'Innovation' : '创新',
      [TraitType.EMPATHY]: language === 'en' ? 'Empathy' : '共情'
  };

  const chartData = [
    { subject: labelMap[TraitType.SYNERGY], Team: teamAvg[TraitType.SYNERGY], Industry: industryBenchmark[TraitType.SYNERGY], fullMark: 100 },
    { subject: labelMap[TraitType.ITERATION], Team: teamAvg[TraitType.ITERATION], Industry: industryBenchmark[TraitType.ITERATION], fullMark: 100 },
    { subject: labelMap[TraitType.JUDGMENT], Team: teamAvg[TraitType.JUDGMENT], Industry: industryBenchmark[TraitType.JUDGMENT], fullMark: 100 },
    { subject: labelMap[TraitType.SYSTEM], Team: teamAvg[TraitType.SYSTEM], Industry: industryBenchmark[TraitType.SYSTEM], fullMark: 100 },
    { subject: labelMap[TraitType.INNOVATION], Team: teamAvg[TraitType.INNOVATION], Industry: industryBenchmark[TraitType.INNOVATION], fullMark: 100 },
    { subject: labelMap[TraitType.EMPATHY], Team: teamAvg[TraitType.EMPATHY], Industry: industryBenchmark[TraitType.EMPATHY], fullMark: 100 },
  ];

  useEffect(() => {
    const fetchInsight = async () => {
        setLoading(true);
        const result = await analyzeMarketGap(teamAvg, language);
        setInsight(result);
        setLoading(false);
    };
    fetchInsight();
  }, [language]); // Re-fetch if language changes

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
        
        {/* CSS for Seamless Marquee */}
        <style>{`
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.33%); }
            }
            .animate-marquee {
                display: flex;
                width: fit-content;
                animation: marquee 40s linear infinite;
            }
            .animate-marquee:hover {
                animation-play-state: paused;
            }
        `}</style>

        {/* Top Ticker */}
        <div className="w-full bg-slate-900 border-y border-slate-800 overflow-hidden py-3 relative shrink-0">
            <div className="flex gap-12 whitespace-nowrap animate-marquee px-4">
                {/* Triple the items to ensure seamless loop regardless of screen width */}
                {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-mono shrink-0">
                        <span className="text-slate-400 uppercase tracking-wider text-xs">
                            {language === 'en' ? item.name.en : item.name.zh}
                        </span>
                        <span className={`font-bold ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {item.trend === 'up' ? <TrendingUp className="inline w-3 h-3 mr-1"/> : <TrendingDown className="inline w-3 h-3 mr-1"/>}
                            {item.change}
                        </span>
                    </div>
                ))}
            </div>
            
            {/* Gradient masks for ticker fade effect - matching bg-slate-900 */}
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-slate-900 to-transparent pointer-events-none z-10"></div>
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-0">
            
            {/* Left: Comparison Chart */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 relative flex flex-col h-full overflow-hidden">
                 <h3 className="text-slate-300 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
                    <Target className="w-4 h-4 text-cyan-400" /> 
                    {language === 'en' ? 'Competitive Landscape' : '竞争格局'}
                </h3>
                <div className="flex-grow w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar 
                                name={language === 'en' ? 'My Team' : '我的团队'} 
                                dataKey="Team" 
                                stroke="#22d3ee" 
                                strokeWidth={3} 
                                fill="#22d3ee" 
                                fillOpacity={0.4} 
                            />
                            <Radar 
                                name={language === 'en' ? 'Industry 2025' : '2025行业基准'} 
                                dataKey="Industry" 
                                stroke="#64748b" 
                                strokeWidth={2} 
                                strokeDasharray="5 5" 
                                fill="#64748b" 
                                fillOpacity={0.1} 
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}/>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Right: AI Insight */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden">
                 <div className="p-6 border-b border-slate-800/50 bg-slate-900/20 shrink-0">
                    <h3 className="text-slate-300 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-400" /> 
                        {language === 'en' ? 'Horizon Intelligence' : '地平线情报'}
                    </h3>
                 </div>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                    {loading || !insight ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3 text-slate-500 animate-pulse">
                                <Globe className="w-10 h-10 opacity-50" />
                                <span className="text-xs font-mono tracking-wider">
                                    {language === 'en' ? 'SCANNING GLOBAL MARKETS...' : '扫描全球市场...'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in pb-4">
                            <div className="bg-black/40 border-l-2 border-purple-500 p-4 rounded-r">
                                <h4 className="text-purple-400 text-xs font-bold uppercase mb-2">
                                    {language === 'en' ? 'Trend Analysis' : '趋势分析'}
                                </h4>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {insight.trendAnalysis}
                                </p>
                            </div>

                            <div className="bg-black/40 border-l-2 border-green-500 p-4 rounded-r">
                                <h4 className="text-green-400 text-xs font-bold uppercase mb-2">
                                    {language === 'en' ? 'Hiring Recommendation' : '招聘建议'}
                                </h4>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {insight.hiringRecommendation}
                                </p>
                            </div>

                            <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
                                <h4 className="text-slate-500 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" /> 
                                    {language === 'en' ? 'Critical Skill Gaps' : '关键技能缺口'}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {insight.skillGaps.map((gap, i) => (
                                        <span key={i} className="px-3 py-1 bg-red-900/20 border border-red-900/50 text-red-300 text-xs rounded-full">
                                            {gap}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    </div>
  );
};

export default HorizonScanner;
