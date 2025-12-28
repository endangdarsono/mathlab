
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeometryHelp = async (query: string, context?: any): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: Anda adalah guru matematika yang ramah di laboratorium geometri. 
      Data saat ini: ${JSON.stringify(context)}. 
      Pertanyaan: ${query}`,
      config: {
        systemInstruction: "Berikan penjelasan matematika yang jelas, edukatif, dan mudah dimengerti tentang geometri. Gunakan format Markdown untuk rumus. Gunakan bahasa Indonesia yang baik.",
        temperature: 0.7,
      }
    });
    // Extract text from the response using the .text property as per guidelines
    return response.text || "Maaf, saya tidak bisa memberikan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
};
