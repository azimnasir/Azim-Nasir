import { GoogleGenAI, Type } from "@google/genai";
import { DecisionAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeDecision(decision: string, option1?: string, option2?: string): Promise<DecisionAnalysis> {
  const isComparison = option1 && option2;
  
  const prompt = isComparison 
    ? `Analyze the decision between "${option1}" and "${option2}" for the context: "${decision}".`
    : `Analyze the following decision: "${decision}".`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are "The Tiebreaker", an elite decision-making engine developed with clinical objectivity. Your purpose is to provide structured, unemotional analysis for complex dilemmas.
      
      Structural Requirements:
      1. Pros/Cons: Identify 3-5 critical factors of both positive and negative nature. Assign impact based on long-term consequences.
      2. SWOT: Conduct a thorough Strengths, Weaknesses, Opportunities, and Threats matrix.
      3. Comparison: ONLY if two distinct options are provided, construct a comparative matrix evaluating both against 5-7 metrics. Use 'Option Alpha' and 'Option Beta' as internal identifiers for the comparison winner field if the options are named such in the user input, or use the literal option names.
      4. Summary: A 2-3 sentence clinical synthesis of the situation.
      5. Recommendation: A definitive, bold verdict.
      
      Tone: Absolute, precise, and sophisticated. Avoid colloquialisms.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prosCons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["pro", "con"] },
                impact: { type: Type.STRING, enum: ["high", "medium", "low"] },
                description: { type: Type.STRING }
              },
              required: ["item", "type", "impact", "description"]
            }
          },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["strengths", "weaknesses", "opportunities", "threats"]
          },
          comparison: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                criterion: { type: Type.STRING },
                option1Value: { type: Type.STRING },
                option2Value: { type: Type.STRING },
                score1: { type: Type.NUMBER },
                score2: { type: Type.NUMBER },
                winner: { type: Type.STRING }
              },
              required: ["criterion", "option1Value", "option2Value", "score1", "score2", "winner"]
            }
          },
          summary: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          options: {
            type: Type.OBJECT,
            properties: {
              alpha: { type: Type.STRING },
              beta: { type: Type.STRING }
            }
          }
        },
        required: ["prosCons", "swot", "summary", "recommendation"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as DecisionAnalysis;
}
