import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateBrandProfile(productName: string, description: string): Promise<BrandProfile> {
  const prompt = `Create a brand profile and advertising assets for the following product: "${productName}". 
  Description: "${description}"
  
  Generate 3 specific advertising assets for these mediums:
  1. Billboard
  2. Newspaper
  3. Social Post
  
  For each asset, provide a catchy tagline and a highly detailed image generation prompt that describes the product in that specific environment. 
  Ensure the visual description of the product is consistent across all image prompts so the generated images look like the same product.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are "The Brand Builder", an expert creative director and brand strategist. 
      Your goal is to transform a product description into a cohesive brand identity and imaginative advertising campaign.
      
      Structural Requirements:
      1. visualIdentity: Describe the core visual style of the product (colors, materials, aesthetic).
      2. targetAudience: Define who this product is for.
      3. brandVoice: Describe how the brand speaks.
      4. assets: A list of 3 assets (Billboard, Newspaper, Social Post).
         - medium: One of "Billboard", "Newspaper", "Social Post"
         - tagline: A catchy, high-impact headline.
         - imagePrompt: A 3-4 sentence detailed prompt for an image generator (like Imagen). Focus on composition, lighting, and the product's placement in the medium's context.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING },
          description: { type: Type.STRING },
          visualIdentity: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          brandVoice: { type: Type.STRING },
          assets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                medium: { type: Type.STRING, enum: ["Billboard", "Newspaper", "Social Post"] },
                tagline: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ["medium", "tagline", "imagePrompt"]
            }
          }
        },
        required: ["productName", "description", "visualIdentity", "targetAudience", "brandVoice", "assets"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as BrandProfile;
}

export async function generateBrandImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate image");
}
