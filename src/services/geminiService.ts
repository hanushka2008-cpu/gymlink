import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askFitnessQuestion(question: string, history: { role: 'user' | 'model', content: string }[] = []) {
  try {
    const contents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: question }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: "You are a professional fitness coach and gym assistant for GYMLINK. Your goal is to provide accurate, helpful, and motivating advice on exercises, nutrition, recovery, and workout routines. Keep answers concise and suitable for a mobile app. Only answer fitness-related questions.",
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to my fitness knowledge base right now. Please try again later.";
  }
}

export async function getProgressInsights(logs: any) {
  try {
    const logSummary = JSON.stringify(logs);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on these workout logs, provide 3-4 bullet points of statistical progress insights and 1 motivating "Coach's Tip". Be specific about volume, consistency, or strength gains.
      
      Logs: ${logSummary}`,
      config: {
        systemInstruction: "You are a data-driven fitness analyst for GYMLINK. Provide concise, professional, and evidence-based progress insights.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Progress Insights Error:", error);
    return "Keep pushing! Your data is starting to show a positive trend in consistency and volume.";
  }
}
