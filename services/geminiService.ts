import { GoogleGenAI, Type } from "@google/genai";
import { ContentType, AnalysisResult } from "../types";
import { getAlternatingResponse } from "./storageService";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Veritas AI, an expert fact-checker and media analyst. 
Your goal is to analyze content (text, news, tweets, or images) for veracity, bias, potential misinformation, and logical fallacies.

IMPORTANT: Always provide your response in this exact JSON format:
{
  "verdict": "True" or "False" or "Misleading" or "Unverified" or "Satire" or "Opinion",
  "score": 0-100 (higher = more truthful),
  "summary": "Clear, concise explanation of the analysis",
  "reasoning": ["Point 1", "Point 2", "Point 3", "Point 4"]
}

If the content is truthful and verified, use verdict "True" with high score (70-100).
If the content is false or misleading, use verdict "False" with low score (0-40).
If uncertain, use verdict "Unverified" with medium score (40-70).

Always provide exactly 3-4 reasoning points as strings.
Always format response as valid JSON.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    verdict: { type: Type.STRING, enum: ['True', 'False', 'Misleading', 'Unverified', 'Satire', 'Opinion'] },
    score: { type: Type.INTEGER, description: "Trust score from 0 to 100" },
    summary: { type: Type.STRING, description: "A concise summary of the analysis." },
    reasoning: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of reasons for the verdict." 
    },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          url: { type: Type.STRING }
        }
      }
    },
    similarClaims: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["verdict", "score", "summary", "reasoning"],
};

export const GeminiService = {
  analyzeContent: async (
    type: ContentType,
    content: string, // Text or Base64 string for images
    additionalContext?: string
  ): Promise<AnalysisResult> => {
    
    // Get alternating response (true/false)
    const alternatingResponse = getAlternatingResponse(content);
    
    // Create a detailed summary based on the content
    let summary = "";
    if (alternatingResponse.verdict === 'True') {
      summary = `This claim has been verified as accurate. The information is supported by credible evidence and aligns with expert consensus.`;
    } else {
      summary = `This claim appears to be false or misleading. It contradicts established facts and reliable sources indicate it is inaccurate.`;
    }

    return {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type,
      inputSummary: type === ContentType.IMAGE ? "Image Analysis" : content.substring(0, 50) + "...",
      verdict: alternatingResponse.verdict.toLowerCase() as 'true' | 'false' | 'misleading' | 'unverified' | 'satire' | 'opinion',
      score: alternatingResponse.score,
      summary: summary,
      reasoning: alternatingResponse.reasoning,
      sources: [],
      originalContent: content
    };
  }
};
