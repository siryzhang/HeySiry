
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { TalentMetrics, TraitType, Language } from '../types';

interface Props {
  metrics: TalentMetrics;
  language: Language;
}

// Full Definitions
const TRAIT_DEFINITIONS = {
  [TraitType.SYNERGY]: {
    en: {
      title: "Human-AI Synergy",
      def: "Treating AI as a 'co-pilot' to achieve >2x efficiency.",
      indicators: ["Prompt Mastery", "Tool Combinatorics", "Hallucination Intervention"]
    },
    zh: {
      title: "人机协同力",
      def: "将 AI 视为“副驾驶”，实现 1+1>2 的效能倍增。",
      indicators: ["Prompt 驾驭", "工具组合", "幻觉干预"]
    }
  },
  [TraitType.JUDGMENT]: {
    en: {
      title: "Value Judgment",
      def: "Filtering noise and making ethical, business-aligned decisions.",
      indicators: ["Fact Checking", "Decision Accountability", "Quality Control"]
    },
    zh: {
      title: "价值判断力",
      def: "在海量信息中去伪存真，基于商业与伦理做决策。",
      indicators: ["事实核查", "决策担当", "品味把控"]
    }
  },
  [TraitType.SYSTEM]: {
    en: {
      title: "System Architecture",
      def: "Redesigning workflows for 'AI + Human' collaboration.",
      indicators: ["SOP Reconstruction", "Agent Orchestration", "Global Optimization"]
    },
    zh: {
      title: "系统架构力",
      def: "重构“AI+人”的协作工作流，具备流程设计思维。",
      indicators: ["SOP 重构", "Agent 编排", "全局优化"]
    }
  },
  [TraitType.INNOVATION]: {
    en: {
      title: "Cross-Domain Innovation",
      def: "Connecting knowledge silos to generate novel ideas via AI.",
      indicators: ["Knowledge Transfer", "Concept Recombination", "Aesthetics"]
    },
    zh: {
      title: "跨界创新力",
      def: "连接领域孤岛，涌现出传统经验中不存在的新创意。",
      indicators: ["知识迁移", "概念重组", "美学与通识"]
    }
  },
  [TraitType.EMPATHY]: {
    en: {
      title: "Human-Centric Empathy",
      def: "Focusing on the 'human' aspects AI cannot simulate.",
      indicators: ["Subtext Insight", "Complex Persuasion", "Ethics"]
    },
    zh: {
      title: "人本共情力",
      def: "深耕 AI 无法模拟的“人性”领域，提供情绪价值。",
      indicators: ["潜台词洞察", "复杂说服", "伦理底线"]
    }
  },
  [TraitType.ITERATION]: {
    en: {
      title: "Cognitive Iteration",
      def: "Rapidly unlearning old methods and relearning with AI.",
      indicators: ["Unlearning Mindset", "AI-Assisted Learning", "Adaptive Resilience"]
    },
    zh: {
      title: "认知迭代力",
      def: "极速遗忘旧经验并利用 AI 极速掌握新知。",
      indicators: ["清零心态", "AI 辅助学习", "适应性抗压"]
    }
  }
};

// Extracted Tick Component for stability
const CustomTick = ({ x, y, payload, hoveredTrait, setHoveredTrait, labelMap }: any) => {
    // Reverse lookup to get TraitType from the label string
    const traitKey = Object.keys(labelMap).find(k => labelMap[k] === payload.value) as TraitType;
    const isHovered = hoveredTrait === traitKey;

    return (
        <g transform={`translate(${x},${y})`}>
            {/* Invisible Hitbox to make hovering reliable */}
            <rect 
                x={-40} 
                y={-15} 
                width={80} 
                height={30} 
                fill="transparent" 
                className="cursor-help"
                onMouseEnter={() => setHoveredTrait(traitKey)}
                onMouseLeave={() => setHoveredTrait(null)}
            />
            <text 
                x={0} 
                y={0} 
                dy={4} 
                textAnchor="middle" 
                fill={isHovered ? '#22d3ee' : '#94a3b8'}
                className="text-[10px] md:text-xs font-bold pointer-events-none transition-colors duration-200"
                style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12 }}
            >
                {payload.value}
            </text>
        </g>
    );
};

const RadarChart: React.FC<Props> = ({ metrics, language }) => {
  const [hoveredTrait, setHoveredTrait] = useState<TraitType | null>(null);

  // Mapping for chart labels
  const labelMap: Record<string, string> = {
      [TraitType.SYNERGY]: language === 'en' ? 'Synergy' : '协同',
      [TraitType.ITERATION]: language === 'en' ? 'Iteration' : '迭代', 
      [TraitType.JUDGMENT]: language === 'en' ? 'Judgment' : '判断',
      [TraitType.SYSTEM]: language === 'en' ? 'System' : '架构', 
      [TraitType.INNOVATION]: language === 'en' ? 'Innovation' : '创新',
      [TraitType.EMPATHY]: language === 'en' ? 'Empathy' : '共情'
  };

  const data = [
    { subject: labelMap[TraitType.SYNERGY], key: TraitType.SYNERGY, A: metrics[TraitType.SYNERGY], fullMark: 100 },
    { subject: labelMap[TraitType.ITERATION], key: TraitType.ITERATION, A: metrics[TraitType.ITERATION], fullMark: 100 },
    { subject: labelMap[TraitType.JUDGMENT], key: TraitType.JUDGMENT, A: metrics[TraitType.JUDGMENT], fullMark: 100 },
    { subject: labelMap[TraitType.SYSTEM], key: TraitType.SYSTEM, A: metrics[TraitType.SYSTEM], fullMark: 100 },
    { subject: labelMap[TraitType.INNOVATION], key: TraitType.INNOVATION, A: metrics[TraitType.INNOVATION], fullMark: 100 },
    { subject: labelMap[TraitType.EMPATHY], key: TraitType.EMPATHY, A: metrics[TraitType.EMPATHY], fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full relative group" onMouseLeave={() => setHoveredTrait(null)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={(props) => (
                <CustomTick 
                    {...props} 
                    hoveredTrait={hoveredTrait} 
                    setHoveredTrait={setHoveredTrait} 
                    labelMap={labelMap} 
                />
            )}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={language === 'en' ? 'Capability' : '能力'}
            dataKey="A"
            stroke="#22d3ee"
            strokeWidth={3}
            fill="#22d3ee"
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#22d3ee' }}
          />
        </RechartsRadar>
      </ResponsiveContainer>
      
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Trait Definition Tooltip */}
      {hoveredTrait && TRAIT_DEFINITIONS[hoveredTrait] && (
          <div 
            className="absolute z-50 w-64 bg-slate-900/95 backdrop-blur border border-cyan-900/50 rounded-lg p-3 shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-200"
            style={{ 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', // Center it
            }}
          >
              <h4 className="text-cyan-400 font-bold uppercase text-xs mb-1">
                  {TRAIT_DEFINITIONS[hoveredTrait][language].title}
              </h4>
              <p className="text-slate-300 text-[10px] leading-snug mb-2">
                  {TRAIT_DEFINITIONS[hoveredTrait][language].def}
              </p>
              <div className="space-y-1">
                  {TRAIT_DEFINITIONS[hoveredTrait][language].indicators.map((ind: string, i: number) => (
                      <div key={i} className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-cyan-500"></div>
                          <span className="text-[9px] text-slate-400">{ind}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default RadarChart;
