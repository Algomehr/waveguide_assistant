
import { GoogleGenAI, Type } from "@google/genai";
import { Message, GroundingLink } from "../types.ts";

const BASE_SYSTEM_INSTRUCTION = `You are a world-class senior professor and researcher in Photonics, specializing in Waveguide Design and Grating Writing. 
When explaining physical or optical concepts, you are encouraged to generate high-quality, clean, and responsive SVG diagrams. 
Always wrap SVG code in code blocks with the "svg" language tag.`;

// Using gemini-3-pro-preview for complex scientific/STEM tasks
const DEFAULT_MODEL = "gemini-3-pro-preview";

export const chatWithGemini = async (messages: Message[], systemInstruction: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: messages.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    })),
    config: {
      systemInstruction: BASE_SYSTEM_INSTRUCTION + "\n" + systemInstruction
    }
  });
  return response.text || '';
};

export const generateSyllabus = async (topicTitle: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Create a professional 5-7 step syllabus for deep learning about: "${topicTitle}". Each step should be a specific sub-topic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subTopics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of specific sub-topics in Persian."
          }
        },
        required: ["subTopics"]
      },
      systemInstruction: "You are an academic curriculum designer in Photonics. Provide sub-topics in Persian (Farsi)."
    }
  });
  
  try {
    const data = JSON.parse(response.text);
    return data.subTopics as string[];
  } catch (e) {
    return ["مبانی و مقدمات", "تئوری پیشرفته", "شبیه‌سازی و مدل‌سازی", "چالش‌های ساخت", "کاربردهای صنعتی"];
  }
};

export const searchGlobalMarket = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Find real commercial photonic products and equipment from international suppliers (like Thorlabs, Newport, Edmund Optics, Hamamatsu, etc.) for: "${query}". 
    Provide a list of 3-5 specific products with their manufacturer name, key specs, and why they fit this requirement. Respond in Persian.`,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "You are a technical procurement specialist for photonics labs. Search the web for real, currently available products and provide their direct source links."
    },
  });

  const text = response.text || '';
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  const links: GroundingLink[] = [];
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri && chunk.web?.title) {
        links.push({ title: chunk.web.title, uri: chunk.web.uri });
      }
    });
  }

  return { text, links };
};

export const searchGrounding = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Recent research papers and articles about: ${query}. Please provide summaries in Persian for each English source.`,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: BASE_SYSTEM_INSTRUCTION + "\nYou are a scientific research assistant. Search for the latest academic papers."
    },
  });

  const text = response.text || '';
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  const links: GroundingLink[] = [];
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri && chunk.web?.title) {
        links.push({ title: chunk.web.title, uri: chunk.web.uri });
      }
    });
  }

  return { text, links };
};

export const generateLesson = async (mainTopic: string, subTopic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Write an extremely detailed academic lesson note in Persian about the sub-topic "${subTopic}" within the context of "${mainTopic}". 
    Use advanced physical formulas (LaTeX), deep technical analysis, and SVG diagrams. This is for a senior PhD level researcher.`,
    config: { systemInstruction: BASE_SYSTEM_INSTRUCTION }
  });
  return response.text || '';
};

export const generatePythonTutorial = async (mainTopic: string, subTopic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Create a comprehensive, production-ready Python & AI tutorial for: "${subTopic}" (Part of ${mainTopic}). 
    Include complex code examples, library integrations (NumPy/SciPy/Jax), and detailed comments.`,
    config: { systemInstruction: BASE_SYSTEM_INSTRUCTION }
  });
  return response.text || '';
};

export const getSimulationHelp = async (task: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: task,
    config: { systemInstruction: BASE_SYSTEM_INSTRUCTION + "\nYou are an expert computational physicist." }
  });
  return response.text || '';
};

// Fix: Implement missing getProcurementAdvice function exported for MaterialsView
export const getProcurementAdvice = async (requirement: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Based on the following requirement, provide detailed procurement advice, including recommended technical specifications, key features to look for, and quality considerations. Respond in Persian: "${requirement}"`,
    config: {
      systemInstruction: "You are a senior technical procurement advisor specializing in high-end photonics equipment and optical materials."
    }
  });
  return response.text || '';
};
