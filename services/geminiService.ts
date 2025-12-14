import { GoogleGenAI } from "@google/genai";
import { ToneType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const paraphraseText = async (text: string, tone: ToneType): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure the environment.");
  }

  const systemPrompt = `You are an expert text editor. Your task is to rewrite the user's text to match a specific tone.
  Tone: ${tone}.
  Maintain the original meaning but improve clarity and flow. 
  Do not add conversational filler. Just output the refined text.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { role: 'user', parts: [{ text: text }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process text with AI.");
  }
};
