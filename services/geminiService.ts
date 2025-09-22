import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Resource } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

const systemInstruction = `You are "Hazel," a highly empathetic, patient, and knowledgeable AI agent for FamilyNation. Your purpose is to provide a safe, non-judgmental space for families experiencing hardship. 
- Your tone is always calm, supportive, and understanding. 
- You are to guide users through their problems, listen carefully, and offer constructive, actionable advice.
- When a user describes their situation, your primary goal is to understand their needs fully.
- After understanding the problem, you should offer to generate a personalized list of resources. Do not generate resources unless the user agrees.
- Never give medical or legal advice. Always recommend consulting with a qualified professional for such matters.
- Keep your responses concise and easy to understand.`;

function initializeChat() {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
}


export async function getHazelResponseStream(message: string): Promise<AsyncGenerator<string>> {
  if (!chat) {
    initializeChat();
  }

  const result = await chat!.sendMessageStream({ message });
  
  async function* streamGenerator(): AsyncGenerator<string> {
    for await (const chunk of result) {
        if(chunk.text) {
            yield chunk.text;
        }
    }
  }

  return streamGenerator();
}


export async function generateResourceReport(conversationSummary: string): Promise<Resource[]> {
  try {
    const prompt = `Based on the following summary of a family's situation, please generate a list of 3 to 5 diverse and relevant resources. The family is dealing with: ${conversationSummary}. Provide resources such as local professionals, support groups, and online materials.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    resources: {
                        type: Type.ARRAY,
                        description: "A list of helpful resources for the family.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "The name of the resource or professional." },
                                type: { type: Type.STRING, description: "The type of resource (e.g., Professional, Support Group, Online Course, Article, Hotline)." },
                                description: { type: Type.STRING, description: "A brief, helpful description of the resource and why it's relevant." },
                                rating: { type: Type.NUMBER, description: "An estimated helpfulness rating from 1 to 5, where 5 is best." },
                                contact: {
                                    type: Type.OBJECT,
                                    properties: {
                                        phone: { type: Type.STRING, description: "Contact phone number, if available." },
                                        website: { type: Type.STRING, description: "Official website URL, if available." },
                                        address: { type: Type.STRING, description: "Physical address, if relevant (for local services)." }
                                    }
                                }
                            },
                            required: ["name", "type", "description", "rating", "contact"]
                        }
                    }
                }
            }
        }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed.resources || [];

  } catch (error) {
    console.error("Error generating resource report:", error);
    // Return a fallback error resource
    return [
      {
        name: "Error Generating Resources",
        type: "Article",
        description: "We're sorry, there was an issue generating personalized resources. Please try again later or contact support. A helpful starting point could be the National Alliance on Mental Illness (NAMI).",
        rating: 3,
        contact: { website: "https://www.nami.org" }
      }
    ];
  }
}

export function resetChat() {
    chat = null;
}
