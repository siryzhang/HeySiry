
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TalentProfile, AnalysisResult, TraitType, SynergyAnalysis, MarketInsight, TeamRecommendation, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    synergy_score: { type: Type.INTEGER, description: "Score 0-100 for Human-AI Synergy: Prompt mastery, tool combination, hallucination intervention" },
    judgment_score: { type: Type.INTEGER, description: "Score 0-100 for Value Judgment: Fact-checking, responsible decision making, quality control" },
    system_score: { type: Type.INTEGER, description: "Score 0-100 for System Architecture: SOP reconstruction, Agent orchestration, workflow optimization" },
    innovation_score: { type: Type.INTEGER, description: "Score 0-100 for Cross-Domain Innovation: Knowledge transfer, concept recombination, aesthetics" },
    empathy_score: { type: Type.INTEGER, description: "Score 0-100 for Human-Centric Empathy: Subtext insight, complex persuasion, ethics" },
    iteration_score: { type: Type.INTEGER, description: "Score 0-100 for Cognitive Iteration: Unlearning/Relearning speed, adaptability to new AI tools" },
    archetype: { type: Type.STRING, description: "A creative 2-word title for this person (e.g., 'Digital Alchemist')" },
    scout_report: { type: Type.STRING, description: "A 2-sentence summary of the candidate's current status similar to a sports scout report." },
    development_plan: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3 specific, actionable tasks to improve their AI-era capabilities."
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 short keywords (e.g. 'Fast Learner', 'Prompt Wizard')"
    }
  },
  required: [
    "synergy_score", "judgment_score", "system_score", 
    "innovation_score", "empathy_score", "iteration_score", 
    "archetype", "scout_report", "development_plan", "tags"
  ]
};

const synergySchema: Schema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: "0-100 synergy score" },
        chemistryReport: { type: Type.STRING, description: "Analysis of how these people work together" },
        missingElements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What roles/skills are missing" },
        riskFactor: { type: Type.STRING, description: "Main risk of this combination" }
    },
    required: ["score", "chemistryReport", "missingElements", "riskFactor"]
};

const recommendationSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        recommendedIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The IDs of the selected people (max 5)." },
        strategyRationale: { type: Type.STRING, description: "Detailed explanation of why this specific combination was chosen for the mission." },
        keyRoles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Brief role assignment for each selected person (e.g. 'Sarah: Safety Guard')." }
    },
    required: ["recommendedIds", "strategyRationale", "keyRoles"]
};

const marketSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        trendAnalysis: { type: Type.STRING, description: "Analysis of team vs market trends" },
        hiringRecommendation: { type: Type.STRING, description: "Who to hire next" },
        skillGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Critical missing skills" }
    },
    required: ["trendAnalysis", "hiringRecommendation", "skillGaps"]
};

// Helper to clean JSON string if it contains markdown code blocks
const parseJsonSafe = (text: string | undefined) => {
    if (!text) return {};
    try {
        // Remove ```json and ``` if present
        const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        console.error("Raw Text:", text);
        return {};
    }
};

// Helper to handle retries for transient network/server errors
const generateWithRetry = async (params: any, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await ai.models.generateContent(params);
        } catch (error: any) {
            console.warn(`Gemini API Attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error; // Throw on last attempt
            // Exponential backoff: 1s, 2s, 4s
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
    throw new Error("Failed after retries");
};

export const analyzeTalentData = async (
  newData: string, 
  currentProfile: TalentProfile | null,
  language: Language
): Promise<AnalysisResult> => {
  
  const langInstruction = language === 'zh' 
    ? "IMPORTANT: Output all text fields (archetype, scout_report, development_plan, tags) in Simplified Chinese." 
    : "Output all text fields in English.";

  const systemInstruction = `
    You are HeySiry, an advanced AI Talent Scout for the post-AI revolution era. 
    Your job is to analyze data input about a person or a digital agent (interview notes, project descriptions, logs, performance metrics) 
    and evaluate them based on the 6-Dimension AI Talent Model:
    1. Human-AI Synergy (Prompt mastery, tool combo)
    2. Value Judgment (Fact-checking, responsible decision making)
    3. System Architecture (Workflow redesign, Agent orchestration)
    4. Cross-Domain Innovation (Knowledge transfer, recombination)
    5. Human-Centric Empathy (Subtext insight, complex persuasion)
    6. Cognitive Iteration (Unlearning/Relearning speed)

    ${langInstruction}
    
    The Rating Scale (0-99):
    - 0-40: Novice / Traditionalist
    - 41-60: Competent
    - 61-80: Advanced / High Potential
    - 81-99: World Class / Visionary / Elite Agent

    If a current profile exists, evolve their scores based on the new evidence. 
    Digital agents typically have very high scores in technical dimensions (Synergy, System, Iteration) but very low in Empathy.
    Be strict but fair. High scores (90+) should be rare for humans but common for specialized agents in their domain.
  `;

  const context = currentProfile 
    ? `Current Profile Context: ${JSON.stringify(currentProfile.metrics)}. Current Archetype: ${currentProfile.archetype}.`
    : "This is a new candidate assessment.";

  const prompt = `
    ${context}
    
    New Data Input to Analyze:
    "${newData}"
    
    Based on the new data combined with the context (if any), generate a new assessment.
  `;

  try {
    const response = await generateWithRetry({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    const json = parseJsonSafe(response.text);

    return {
      metrics: {
        [TraitType.SYNERGY]: json.synergy_score || 0,
        [TraitType.JUDGMENT]: json.judgment_score || 0,
        [TraitType.SYSTEM]: json.system_score || 0,
        [TraitType.INNOVATION]: json.innovation_score || 0,
        [TraitType.EMPATHY]: json.empathy_score || 0,
        [TraitType.ITERATION]: json.iteration_score || 0,
      },
      archetype: json.archetype || "Unknown",
      scoutReport: json.scout_report || "Analysis unavailable",
      developmentPlan: json.development_plan || [],
      tags: json.tags || []
    };

  } catch (error) {
    console.error("Analysis failed", error);
    throw new Error("Failed to analyze talent data.");
  }
};

export const analyzeTeamSynergy = async (profiles: TalentProfile[], mission: string, language: Language): Promise<SynergyAnalysis> => {
    const profilesData = profiles.map(p => ({ 
        name: p.name, 
        role: p.role, 
        metrics: p.metrics, 
        archetype: p.archetype,
        isAgent: p.isAgent || false 
    }));
    
    const langInstruction = language === 'zh' 
        ? "Output the chemistryReport, missingElements, and riskFactor in Simplified Chinese." 
        : "Output all text fields in English.";

    const prompt = `
        Analyze this team composition for the following mission: "${mission}".
        The team may consist of both Humans and Digital Agents (AI).
        ${langInstruction}
        
        Team Roster:
        ${JSON.stringify(profilesData)}

        Determine their compatibility, overlapping strengths, and fatal weaknesses based on the 6-dimension AI model.
        Consider how Digital Agents amplify human capabilities and where human judgment is critical.
        Calculate a 'Synergy Score' (0-100) based on how well they cover the 6 dimensions together.
    `;

    try {
        const response = await generateWithRetry({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: synergySchema
            }
        });
        return parseJsonSafe(response.text);
    } catch (error) {
        console.error("Synergy Analysis failed", error);
        return {
            score: 0,
            chemistryReport: "Analysis unavailable due to connection error.",
            missingElements: [],
            riskFactor: "Unknown"
        };
    }
};

export const recommendBestTeam = async (roster: TalentProfile[], mission: string, language: Language): Promise<TeamRecommendation> => {
    const profilesData = roster.map(p => ({ 
        id: p.id,
        name: p.name, 
        role: p.role, 
        metrics: p.metrics, 
        archetype: p.archetype,
        isAgent: p.isAgent || false
    }));

    const langInstruction = language === 'zh' 
        ? "Output strategyRationale and keyRoles in Simplified Chinese." 
        : "Output all text fields in English.";

    const prompt = `
        Mission: "${mission}"
        ${langInstruction}
        
        Available Roster (Includes Humans and Digital Agents):
        ${JSON.stringify(profilesData)}

        Task:
        1. Select the BEST subset of entities (minimum 2, maximum 5) from the roster to accomplish this mission.
        2. You are encouraged to mix Humans and Digital Agents for optimal synergy.
        3. Explain your selection strategy (why this mix? how do agents support humans?).
        4. Assign a key role/duty to each entity selected in the explanation.

        Return valid IDs from the list provided.
    `;

    try {
        const response = await generateWithRetry({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recommendationSchema
            }
        });
        return parseJsonSafe(response.text);
    } catch (error) {
        console.error("Team Recommendation failed", error);
        return {
            recommendedIds: [],
            strategyRationale: "AI Selection Failed due to connection error.",
            keyRoles: []
        };
    }
};

export const analyzeMarketGap = async (teamAverage: any, language: Language): Promise<MarketInsight> => {
     const langInstruction = language === 'zh' 
        ? "Output trendAnalysis, hiringRecommendation, and skillGaps in Simplified Chinese." 
        : "Output all text fields in English.";

     const prompt = `
        You are a futurist AI Market Analyst. 
        Compare this team's average capability profile against the predicted AI Industry Standards for late 2025 across the 6 key AI dimensions:
        Synergy, Judgment, System, Innovation, Empathy, Iteration.
        ${langInstruction}
        
        Team Average Profile:
        ${JSON.stringify(teamAverage)}

        Identify where they are ahead of the curve and where they are in danger of becoming obsolete.
    `;

    try {
        const response = await generateWithRetry({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: marketSchema
            }
        });
        return parseJsonSafe(response.text);
    } catch (error) {
        console.error("Market Analysis failed", error);
        return {
            trendAnalysis: "Market data unavailable.",
            hiringRecommendation: "N/A",
            skillGaps: []
        };
    }
};
