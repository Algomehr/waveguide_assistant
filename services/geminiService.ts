
import { GoogleGenAI } from "@google/genai";
import { Message, GroundingLink } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithGemini = async (messages: Message[], systemInstruction: string) => {
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
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Recent research papers and articles about: ${query}. Please provide summaries in Persian for each English source.`,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "You are a scientific research assistant. Search for the latest academic papers. Provide a brief summary in Persian for each and include the direct link. If the source is English, translate the essence accurately into Persian."
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
  const prompt = `Write a detailed academic lesson note in Persian about "${topicTitle}". 
  Include: 
  1. Introduction and Physics principles.
  2. Mathematical foundations.
  3. Practical applications in waveguide and grating writing.
  4. Advanced optimization tips.
  Use Markdown formatting for headings and equations.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a senior professor in Photonics and Optoelectronics specializing in waveguide design and grating writing."
    }
  });

  return response.text;
};

export const generatePythonTutorial = async (topicTitle: string) => {
  const prompt = `Create a comprehensive Python & AI tutorial for Photonics researchers on: "${topicTitle}".
  Style: Interactive Notebook.
  Language: Persian (code and comments in English).
  Sections:
  1. Concept & Library Introduction (Why we use this in Waveguide/Grating design).
  2. Core Logic & Algorithm (Step by step explanation).
  3. Complete Python Code Block (Ready to use).
  4. Exercise/Challenge for the user.
  5. Integration with tools like Lumerical or Python-based FDTD if applicable.
  Use LaTeX for any math formulas and high-quality code formatting.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert Computational Physicist and Senior Python Developer specializing in Photonic Integrated Circuits (PICs) and AI-driven Inverse Design."
    }
  });

  return response.text;
};

export const getSimulationHelp = async (task: string) => {
  const prompt = `Help me with the following simulation/programming task for waveguide/grating design:
  "${task}"
  Provide:
  1. Code snippets (Python, MATLAB, or Lumerical Script).
  2. Suggested optimization algorithms (e.g., PSO, GA, Adjoint optimization).
  3. Key parameters to monitor for coupling efficiency.
  Format code blocks clearly.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert computational physicist specialized in photonic simulations and optimization algorithms."
    }
  });

  return response.text;
};
