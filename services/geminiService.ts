
import { GoogleGenAI } from "@google/genai";
import { Message, GroundingLink } from "../types.ts";

const BASE_SYSTEM_INSTRUCTION = `You are a world-class senior professor and researcher in Photonics, specializing in Waveguide Design and Grating Writing. 
When explaining physical or optical concepts, you are encouraged to generate high-quality, clean, and responsive SVG diagrams. 
Always wrap SVG code in code blocks with the "svg" language tag.`;

const DEFAULT_MODEL = "gemini-3-flash-preview";

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

export const searchGlobalMarket = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
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
    model: DEFAULT_MODEL,
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

export const getProcurementAdvice = async (requirement: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Based on this requirement: "${requirement}", provide a detailed technical procurement guide for an optical lab. Recommend specific specs (power, wavelength, stability, materials). Respond in Persian.`,
    config: {
      systemInstruction: "You are an expert in optical laboratory instrumentation and procurement for high-end photonics research."
    }
  });
  return response.text || '';
};

export const generateLesson = async (topicTitle: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Write a detailed academic lesson note in Persian about "${topicTitle}". Include SVG diagrams where helpful.`,
    config: { systemInstruction: BASE_SYSTEM_INSTRUCTION }
  });
  return response.text || '';
};

export const generatePythonTutorial = async (topicTitle: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Create a comprehensive Python & AI tutorial for: "${topicTitle}".`,
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
