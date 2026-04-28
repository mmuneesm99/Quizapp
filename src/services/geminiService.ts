/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateQuizQuestions(subject: Subject): Promise<Question[]> {
  const prompt = `Generate a 10-question multiple-choice quiz for 7th-grade students on the subject of ${subject}. 
  Each question must have exactly 4 options.
  Provide a detailed explanation for the correct answer.
  The questions should be age-appropriate and educational.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                minItems: 4,
                maxItems: 4,
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ["id", "text", "options", "correctIndex", "explanation"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback or rethrow
    throw error;
  }
}
