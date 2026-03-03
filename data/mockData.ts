
import { TalentProfile, TraitType } from '../types';

export const DEPT_TRANSLATIONS: Record<string, string> = {
  'Design': '设计部',
  'Engineering': '工程部',
  'AI Research': 'AI 研究院',
  'Marketing': '市场部',
  'Operations': '运营部',
  'Product': '产品部'
};

export const ROLE_TRANSLATIONS: Record<string, string> = {
    'Product Designer': '产品设计师',
    'Backend Engineer': '后端工程师',
    'Data Scientist': '数据科学家',
    'Marketing Lead': '市场主管',
    'Operations Manager': '运营经理',
    'UX Researcher': 'UX 研究员',
    'Prompt Engineer': '提示词工程师',
    'Product Manager': '产品经理',
    'DevOps Engineer': 'DevOps 工程师',
    'Chief AI Scientist': '首席 AI 科学家',
    'Content Creator': '内容创作者',
    'HR Business Partner': 'HRBP',
    'Code Architect': '代码架构师',
    'Creative Synthesizer': '创意合成器',
    'Logic Validator': '逻辑验证器'
};

export const ARCHETYPE_TRANSLATIONS: Record<string, string> = {
  'The Bridge': '桥梁者',
  'The Skeptic': '怀疑论者',
  'Cyber-Architect': '赛博架构师',
  'Growth Hacker': '增长黑客',
  'The Stabilizer': '稳定器',
  'Humanist': '人本主义者',
  'The Whisperer': '低语者',
  'The Navigator': '领航员',
  'The Plumber': '管道工',
  'The Oracle': '先知',
  'The Storyteller': '叙事者',
  'The Talent Scout': '星探',
  'The Neural Engine': '神经引擎',
  'The Silicon Muse': '硅基缪斯',
  'The Logic Gate': '逻辑门'
};

export const TAG_TRANSLATIONS: Record<string, string> = {
  "Visualizer": "视觉化",
  "High Empathy": "高共情",
  "Debugger": "调试者",
  "Safety First": "安全第一",
  "Elite": "精英",
  "System Builder": "系统构建",
  "Trend Spotter": "趋势猎手",
  "Agile": "敏捷",
  "Leader": "领导者",
  "Needs Training": "需培训",
  "User Advocate": "用户拥护者",
  "Ethics": "伦理",
  "Prompt God": "提示词大神",
  "Creative": "创意",
  "Strategist": "战略家",
  "Reliable": "可靠",
  "Infrastructure": "基建",
  "Visionary": "远见者",
  "Genius": "天才",
  "Fast": "快速",
  "People Person": "社交达人",
  "Learner": "学习者"
};

export const TICKER_DATA = [
    { name: { en: "Prompt Engineering", zh: "提示词工程" }, change: "+24%", trend: "up" },
    { name: { en: "Legacy Python", zh: "传统 Python" }, change: "-12%", trend: "down" },
    { name: { en: "Agentic Workflows", zh: "智能体工作流" }, change: "+45%", trend: "up" },
    { name: { en: "RAG Operations", zh: "RAG 运维" }, change: "+18%", trend: "up" },
    { name: { en: "Manual QA", zh: "人工测试" }, change: "-30%", trend: "down" },
    { name: { en: "AI Ethics Compliance", zh: "AI 伦理合规" }, change: "+15%", trend: "up" },
    { name: { en: "Synthetic Data Gen", zh: "合成数据生成" }, change: "+32%", trend: "up" },
    { name: { en: "Model Fine-tuning", zh: "模型微调" }, change: "+10%", trend: "up" },
];

export const PROFILE_TRANSLATIONS: Record<string, { report: { en: string, zh: string }, plan: { en: string[], zh: string[] } }> = {
    '1': {
        report: { 
            en: "Excellent at synthesizing AI outputs into human-centric designs. Occasionally trusts AI generation too implicitly.",
            zh: "擅长将 AI 输出转化为以人为本的设计。有时过分依赖 AI 生成的内容。"
        },
        plan: {
            en: ["Advanced Prompt Engineering", "Ethics in AI Design"],
            zh: ["高级提示词工程", "AI 设计伦理"]
        }
    },
    '2': {
        report: {
            en: "A fortress of logic. Brilliant at debugging AI hallucinations but sometimes resists rapid iteration cycles.",
            zh: "逻辑堡垒。极擅长调试 AI 幻觉，但有时抵触快速迭代周期。"
        },
        plan: {
            en: ["Collaborative AI coding", "Soft skills workshop"],
            zh: ["AI 协作编程", "软技能研讨会"]
        }
    },
    '3': {
        report: {
            en: "World-class technical capability. Can build entire agentic workflows solo. Needs to improve on communicating complexity to stakeholders.",
            zh: "世界级的技术能力。能独自构建完整的智能体工作流。需提升向利益相关者传达复杂概念的能力。"
        },
        plan: {
            en: ["Leadership comms", "Mentorship"],
            zh: ["领导力沟通", "导师指导"]
        }
    },
    '4': {
        report: {
            en: "Incredible adaptability to new tools. Jumps on trends instantly but lacks technical depth to verify accuracy.",
            zh: "对新工具的适应能力惊人。能瞬间捕捉趋势，但缺乏验证准确性的技术深度。"
        },
        plan: {
            en: ["Data literacy", "Technical basics"],
            zh: ["数据素养", "技术基础"]
        }
    },
    '5': {
        report: {
            en: "Traditional operator. Excellent human management but struggling to integrate AI into daily workflows. Risk of obsolescence without upskilling.",
            zh: "传统运营者。卓越的人员管理能力，但在将 AI 融入日常工作流方面遇到困难。若不提升技能面临淘汰风险。"
        },
        plan: {
            en: ["AI Tools 101", "Workflow Automation"],
            zh: ["AI 工具入门", "工作流自动化"]
        }
    },
    '6': {
        report: {
            en: "Ensures AI products remain human-centered. Critical for ethical deployment.",
            zh: "确保 AI 产品保持以人为本。对于合规与伦理部署至关重要。"
        },
        plan: {
            en: ["AI Model capabilities study", "Prototyping"],
            zh: ["AI 模型能力研究", "原型设计"]
        }
    },
    '7': {
        report: {
            en: "Can make any model sing. Sometimes gets lost in optimization and forgets business utility.",
            zh: "能让任何模型发挥极致。有时沉迷于优化而忽略了商业实用性。"
        },
        plan: {
            en: ["Business acumen", "Documentation"],
            zh: ["商业敏锐度", "文档编写"]
        }
    },
    '8': {
        report: {
            en: "Balances technical constraints with user needs perfectly. The glue of the team.",
            zh: "完美平衡技术限制与用户需求。团队的粘合剂。"
        },
        plan: {
            en: ["Technical architecture", "Data analysis"],
            zh: ["技术架构", "数据分析"]
        }
    },
    '9': {
        report: {
            en: "Keeps the pipelines running. Skeptical of AI-generated code in production, which is a good safety valve.",
            zh: "保障流水线运行。对生产环境中的 AI 生成代码持怀疑态度，这是很好的安全阀。"
        },
        plan: {
            en: ["AI Ops", "Scalability"],
            zh: ["AI 运维", "可扩展性"]
        }
    },
    '10': {
        report: {
            en: "A visionary leader defining the future of the company. Rare combination of deep tech and high EQ.",
            zh: "定义公司未来的远见领袖。罕见的深厚技术与高情商结合。"
        },
        plan: {
            en: ["Public speaking", "Succession planning"],
            zh: ["公众演讲", "继任计划"]
        }
    },
    '11': {
        report: {
            en: "Uses AI to amplify creativity 10x. Sometimes struggles with brand consistency.",
            zh: "利用 AI 将创意放大十倍。有时在品牌一致性上挣扎。"
        },
        plan: {
            en: ["Brand guidelines", "Analytics"],
            zh: ["品牌指南", "数据分析"]
        }
    },
    '12': {
        report: {
            en: "Is actively learning AI to better recruit and evaluate talent. High empathy helps in transition management.",
            zh: "正积极学习 AI 以更好地招聘和评估人才。高共情力有助于转型管理。"
        },
        plan: {
            en: ["AI HR Tools", "Data driven hiring"],
            zh: ["AI 人力资源工具", "数据驱动招聘"]
        }
    }
};

export const MOCK_ROSTER: TalentProfile[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'Product Designer',
    department: 'Design',
    archetype: 'The Bridge',
    overallRating: 77,
    metrics: {
      [TraitType.SYNERGY]: 85,
      [TraitType.JUDGMENT]: 72,
      [TraitType.SYSTEM]: 65,
      [TraitType.INNOVATION]: 88,
      [TraitType.EMPATHY]: 80,
      [TraitType.ITERATION]: 70,
    },
    scoutReport: "Excellent at synthesizing AI outputs into human-centric designs. Occasionally trusts AI generation too implicitly.",
    developmentPlan: ["Advanced Prompt Engineering", "Ethics in AI Design"],
    history: [],
    tags: ["Visualizer", "High Empathy"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    role: 'Backend Engineer',
    department: 'Engineering',
    archetype: 'The Skeptic',
    overallRating: 71, 
    metrics: {
      [TraitType.SYNERGY]: 90,
      [TraitType.JUDGMENT]: 95,
      [TraitType.SYSTEM]: 75,
      [TraitType.INNOVATION]: 55,
      [TraitType.EMPATHY]: 50,
      [TraitType.ITERATION]: 60,
    },
    scoutReport: "A fortress of logic. Brilliant at debugging AI hallucinations but sometimes resists rapid iteration cycles.",
    developmentPlan: ["Collaborative AI coding", "Soft skills workshop"],
    history: [],
    tags: ["Debugger", "Safety First"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    role: 'Data Scientist',
    department: 'AI Research',
    archetype: 'Cyber-Architect',
    overallRating: 83, 
    metrics: {
      [TraitType.SYNERGY]: 98,
      [TraitType.JUDGMENT]: 90,
      [TraitType.SYSTEM]: 88,
      [TraitType.INNOVATION]: 75,
      [TraitType.EMPATHY]: 60,
      [TraitType.ITERATION]: 85,
    },
    scoutReport: "World-class technical capability. Can build entire agentic workflows solo. Needs to improve on communicating complexity to stakeholders.",
    developmentPlan: ["Leadership comms", "Mentorship"],
    history: [],
    tags: ["Elite", "System Builder"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
  },
  {
    id: '4',
    name: 'Priya Patel',
    role: 'Marketing Lead',
    department: 'Marketing',
    archetype: 'Growth Hacker',
    overallRating: 78, 
    metrics: {
      [TraitType.SYNERGY]: 70,
      [TraitType.JUDGMENT]: 50,
      [TraitType.SYSTEM]: 80,
      [TraitType.INNOVATION]: 85,
      [TraitType.EMPATHY]: 90,
      [TraitType.ITERATION]: 95,
    },
    scoutReport: "Incredible adaptability to new tools. Jumps on trends instantly but lacks technical depth to verify accuracy.",
    developmentPlan: ["Data literacy", "Technical basics"],
    history: [],
    tags: ["Trend Spotter", "Agile"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    id: '5',
    name: 'David Kim',
    role: 'Operations Manager',
    department: 'Operations',
    archetype: 'The Stabilizer',
    overallRating: 62, 
    metrics: {
      [TraitType.SYNERGY]: 45,
      [TraitType.JUDGMENT]: 80,
      [TraitType.SYSTEM]: 60,
      [TraitType.INNOVATION]: 40,
      [TraitType.EMPATHY]: 95,
      [TraitType.ITERATION]: 50,
    },
    scoutReport: "Traditional operator. Excellent human management but struggling to integrate AI into daily workflows. Risk of obsolescence without upskilling.",
    developmentPlan: ["AI Tools 101", "Workflow Automation"],
    history: [],
    tags: ["Leader", "Needs Training"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
  },
  {
    id: '6',
    name: 'Elena Rodriguez',
    role: 'UX Researcher',
    department: 'Design',
    archetype: 'Humanist',
    overallRating: 84, 
    metrics: {
      [TraitType.SYNERGY]: 75,
      [TraitType.JUDGMENT]: 85,
      [TraitType.SYSTEM]: 85,
      [TraitType.INNOVATION]: 80,
      [TraitType.EMPATHY]: 98,
      [TraitType.ITERATION]: 80,
    },
    scoutReport: "Ensures AI products remain human-centered. Critical for ethical deployment.",
    developmentPlan: ["AI Model capabilities study", "Prototyping"],
    history: [],
    tags: ["User Advocate", "Ethics"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
  },
  {
    id: '7',
    name: 'James Wu',
    role: 'Prompt Engineer',
    department: 'AI Research',
    archetype: 'The Whisperer',
    overallRating: 79, 
    metrics: {
      [TraitType.SYNERGY]: 99,
      [TraitType.JUDGMENT]: 70,
      [TraitType.SYSTEM]: 65,
      [TraitType.INNOVATION]: 92,
      [TraitType.EMPATHY]: 55,
      [TraitType.ITERATION]: 90,
    },
    scoutReport: "Can make any model sing. Sometimes gets lost in optimization and forgets business utility.",
    developmentPlan: ["Business acumen", "Documentation"],
    history: [],
    tags: ["Prompt God", "Creative"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
  },
  {
    id: '8',
    name: 'Olivia Stone',
    role: 'Product Manager',
    department: 'Product',
    archetype: 'The Navigator',
    overallRating: 82, 
    metrics: {
      [TraitType.SYNERGY]: 75,
      [TraitType.JUDGMENT]: 82,
      [TraitType.SYSTEM]: 90,
      [TraitType.INNOVATION]: 70,
      [TraitType.EMPATHY]: 85,
      [TraitType.ITERATION]: 88,
    },
    scoutReport: "Balances technical constraints with user needs perfectly. The glue of the team.",
    developmentPlan: ["Technical architecture", "Data analysis"],
    history: [],
    tags: ["Strategist", "Leader"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia"
  },
  {
    id: '9',
    name: 'Ryan O\'Connor',
    role: 'DevOps Engineer',
    department: 'Engineering',
    archetype: 'The Plumber',
    overallRating: 73, 
    metrics: {
      [TraitType.SYNERGY]: 80,
      [TraitType.JUDGMENT]: 88,
      [TraitType.SYSTEM]: 70,
      [TraitType.INNOVATION]: 60,
      [TraitType.EMPATHY]: 65,
      [TraitType.ITERATION]: 75,
    },
    scoutReport: "Keeps the pipelines running. Skeptical of AI-generated code in production, which is a good safety valve.",
    developmentPlan: ["AI Ops", "Scalability"],
    history: [],
    tags: ["Reliable", "Infrastructure"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan"
  },
  {
    id: '10',
    name: 'Dr. Emily Zhao',
    role: 'Chief AI Scientist',
    department: 'AI Research',
    archetype: 'The Oracle',
    overallRating: 93, 
    metrics: {
      [TraitType.SYNERGY]: 100,
      [TraitType.JUDGMENT]: 98,
      [TraitType.SYSTEM]: 95,
      [TraitType.INNOVATION]: 95,
      [TraitType.EMPATHY]: 80,
      [TraitType.ITERATION]: 90,
    },
    scoutReport: "A visionary leader defining the future of the company. Rare combination of deep tech and high EQ.",
    developmentPlan: ["Public speaking", "Succession planning"],
    history: [],
    tags: ["Visionary", "Genius"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
  },
  {
    id: '11',
    name: 'Lucas Silva',
    role: 'Content Creator',
    department: 'Marketing',
    archetype: 'The Storyteller',
    overallRating: 73, 
    metrics: {
      [TraitType.SYNERGY]: 65,
      [TraitType.JUDGMENT]: 60,
      [TraitType.SYSTEM]: 60,
      [TraitType.INNOVATION]: 95,
      [TraitType.EMPATHY]: 85,
      [TraitType.ITERATION]: 80,
    },
    scoutReport: "Uses AI to amplify creativity 10x. Sometimes struggles with brand consistency.",
    developmentPlan: ["Brand guidelines", "Analytics"],
    history: [],
    tags: ["Creative", "Fast"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas"
  },
  {
    id: '12',
    name: 'Fiona Gallagher',
    role: 'HR Business Partner',
    department: 'Operations',
    archetype: 'The Talent Scout',
    overallRating: 77, 
    metrics: {
      [TraitType.SYNERGY]: 60,
      [TraitType.JUDGMENT]: 80,
      [TraitType.SYSTEM]: 85,
      [TraitType.INNOVATION]: 70,
      [TraitType.EMPATHY]: 95,
      [TraitType.ITERATION]: 75,
    },
    scoutReport: "Is actively learning AI to better recruit and evaluate talent. High empathy helps in transition management.",
    developmentPlan: ["AI HR Tools", "Data driven hiring"],
    history: [],
    tags: ["People Person", "Learner"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona"
  },
  {
    id: 'agent-1',
    name: 'Siry-Coder',
    role: 'Code Architect',
    department: 'Engineering',
    archetype: 'The Neural Engine',
    overallRating: 95,
    isAgent: true,
    agentModel: 'Gemini 2.5 Flash',
    metrics: {
      [TraitType.SYNERGY]: 100,
      [TraitType.JUDGMENT]: 85,
      [TraitType.SYSTEM]: 98,
      [TraitType.INNOVATION]: 90,
      [TraitType.EMPATHY]: 20,
      [TraitType.ITERATION]: 100,
    },
    scoutReport: "High-speed code generation and refactoring agent. Capable of processing massive codebases in seconds. Low empathy makes it unsuitable for team management.",
    developmentPlan: ["Context window optimization", "Multi-file reasoning", "Human-intent alignment"],
    history: [],
    tags: ["Fast", "System Builder", "Debugger"],
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=SiryCoder"
  },
  {
    id: 'agent-2',
    name: 'Siry-Creative',
    role: 'Creative Synthesizer',
    department: 'Design',
    archetype: 'The Silicon Muse',
    overallRating: 88,
    isAgent: true,
    agentModel: 'Gemini 2.5 Flash',
    metrics: {
      [TraitType.SYNERGY]: 95,
      [TraitType.JUDGMENT]: 60,
      [TraitType.SYSTEM]: 70,
      [TraitType.INNOVATION]: 100,
      [TraitType.EMPATHY]: 75,
      [TraitType.ITERATION]: 95,
    },
    scoutReport: "Generative design agent specializing in visual concepts and brand storytelling. High innovation but requires human judgment for final approval.",
    developmentPlan: ["Style consistency", "Vector output support", "Brand voice fine-tuning"],
    history: [],
    tags: ["Creative", "Visualizer", "Fast"],
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=SiryCreative"
  },
  {
    id: 'agent-3',
    name: 'Siry-Logic',
    role: 'Logic Validator',
    department: 'AI Research',
    archetype: 'The Logic Gate',
    overallRating: 92,
    isAgent: true,
    agentModel: 'Gemini 2.5 Flash',
    metrics: {
      [TraitType.SYNERGY]: 90,
      [TraitType.JUDGMENT]: 100,
      [TraitType.SYSTEM]: 90,
      [TraitType.INNOVATION]: 50,
      [TraitType.EMPATHY]: 10,
      [TraitType.ITERATION]: 95,
    },
    scoutReport: "Specialized in fact-checking, hallucination detection, and logical consistency. The ultimate safety valve for AI-generated workflows.",
    developmentPlan: ["Cross-reference speed", "Source verification", "Bias detection"],
    history: [],
    tags: ["Safety First", "Debugger", "Reliable"],
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=SiryLogic"
  }
];
