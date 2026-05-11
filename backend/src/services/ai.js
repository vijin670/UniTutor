import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getChatbotResponse = async (query, context) => {
  const prompt = `You are a helpful, extremely intelligent AI academic assistant for UniTutor. 
  You form the core companion of the student interface.
  Answer the student's question accurately based on the dense context provided below.
  The context includes their current profile, university schedules, marks, attendance records, and fee payment details.
  If the question is completely unrelated to everything and not general academic help, respond strictly with "ESCALATE".
  Otherwise, provide a friendly, structured, and clear answer.
  
  Student Context:
  ${JSON.stringify(context, null, 2)}
  
  Student Question: ${query}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("AI Error:", error);
    return "ESCALATE"; // Fail gracefully
  }
};
