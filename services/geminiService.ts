
import { GoogleGenAI } from "@google/genai";
import { Message, GroundingLink } from "../types.ts";

export const chatWithGemini = async (messages: Message[], systemInstruction: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: messages.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    })),
    config: {
      systemInstruction
    }
  });
  return response.text;
};

export const searchGrounding = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Recent research papers and articles about: ${query}. Please provide summaries in Persian for each English source.`,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "You are a scientific research assistant. Search for the latest academic papers. Provide a brief summary in Persian for each and include the direct link."
    },
  });

  const text = response.text;
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

export const generateLesson = async (topicTitle: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Write a detailed academic lesson note in Persian about "${topicTitle}".`,
    config: {
      systemInstruction: "You are a senior professor in Photonics specializing in waveguide design."
    }
  });
  return response.text;
};

export const generatePythonTutorial = async (topicTitle: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Create a comprehensive Python & AI tutorial for: "${topicTitle}".`,
    config: {
      systemInstruction: "You are an expert Computational Physicist and Senior Python Developer."
    }
  });
  return response.text;
};

export const getSimulationHelp = async (task: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: task,
    config: {
      systemInstruction: "You are an expert computational physicist specialized in photonic simulations."
    }
  });
  return response.text;
};
