import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FoodAnalysis {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  suggestions: string[];
}

export async function analyzeFood(base64Image: string): Promise<FoodAnalysis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            text: "Analyze this food image. Identify the food items, estimate their total calories, protein (g), carbs (g), and fat (g). Also provide 2-3 healthy suggestions or diet tips based on this meal. Return the result in JSON format.",
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["name", "calories", "protein", "carbs", "fat", "suggestions"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as FoodAnalysis;
  } catch (error) {
    console.error("Food analysis error:", error);
    throw new Error("Failed to analyze food. Please try again.");
  }
}

export async function getDietSuggestions(goal: string, preferences: string = "No specific preferences") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a list of 5 healthy diet suggestions for someone whose goal is "${goal}". Consider these preferences: "${preferences}". Keep it concise and practical.`,
      config: {
        systemInstruction: "You are a professional sports nutritionist for GYMLINK. Provide practical, science-based diet advice.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Diet suggestion error:", error);
    return "Could not load diet suggestions. Focus on whole foods, lean proteins, and staying hydrated!";
  }
}
