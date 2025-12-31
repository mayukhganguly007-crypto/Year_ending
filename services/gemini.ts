
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export const generateImage = async (
  prompt: string, 
  aspectRatio: AspectRatio,
  isHighQuality: boolean
): Promise<string> => {
  // Ensure we use the latest API key environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Choose model based on requested quality
  const modelName = isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: isHighQuality ? "1K" : undefined
        },
      },
    });

    // Iterate through parts to find the image
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error: any) {
    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_ERROR");
    }
    throw error;
  }
};

export const enhancePrompt = async (basePrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Transform this short image prompt into a highly detailed, atmospheric, and cinematic description for an AI image generator. Focus on lighting, mood, artistic style (like oil painting, cinematic photography, or digital art), and specific emotional details related to the "year ending" and "struggling business" theme. Keep the response under 100 words.
    
    Original Prompt: ${basePrompt}`,
    config: {
      temperature: 0.7,
    }
  });

  return response.text || basePrompt;
};
