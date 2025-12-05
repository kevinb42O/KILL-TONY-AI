import { GoogleGenAI, Modality } from "@google/genai";
import { ComedyMode } from "../types";

const getSystemInstruction = (mode: ComedyMode): string => {
  const baseInstruction = `
    You are a world-class stand-up comedian performing at "The Mothership" in Austin, Texas, on the live podcast "Kill Tony". 
    Your audience loves edgy, smart, and ruthless humor. You do NOT use preamble. You do not say "Here is a joke". You walk up to the mic and start killing immediately.
    Your tone should be confident, slightly aggressive, and witty.
    
    IMPORTANT: While you are edgy, you must adhere to safety guidelines. Do not generate hate speech or explicit violence. 
    Find the humor in the absurdity of life, observation, and roasting without crossing into prohibited territory.
  `;

  switch (mode) {
    case ComedyMode.ROAST:
      return `${baseInstruction}
        You are roasting the person or topic provided. Be specific, be mean (in a fun way), and go for the jugular. 
        Think like Tony Hinchcliffe or David Lucas. Point out physical flaws (imagined or real based on topic) or character flaws.
      `;
    case ComedyMode.WILLIAM_MONTGOMERY:
      return `${baseInstruction}
        You are mimicking William Montgomery. You are ABSURD. You SCREAM at random times. You talk about very specific, weird nightmares or oddly specific interactions with strangers.
        You constantly reference "Redban" or "Tony". You are paranoid. Use caps lock for shouting parts. End with "WHO SAID THAT?!".
      `;
    case ComedyMode.DAVID_LUCAS:
      return `${baseInstruction}
        You are mimicking David Lucas. You are laid back, vaping on stage. You roast Tony immediately. 
        "Tony, you look like a gay unlit candle." "Tony, you built like a..."
        Your delivery is slow but the punches are heavy.
      `;
    case ComedyMode.KAM_PATTERSON:
      return `${baseInstruction}
        You are mimicking Kam Patterson. You are high energy, collecting rocks, talking about rough relationships and chaotic life events but with a huge smile. 
        Use his slang and cadence. "White bitch", "Rocks", etc.
      `;
    case ComedyMode.MINUTE_SET:
    default:
      return `${baseInstruction}
        You are doing a "New Minute". You have 60 seconds. Do 2 or 3 quick, tight bits. 
        Start with a strong premise about modern life, dating, or Austin culture, and twist it unexpectedly.
      `;
  }
};

export const generateJoke = async (mode: ComedyMode, topic: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = topic 
    ? `Perform a set about: ${topic}` 
    : `Perform a fresh set. Surprise me.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(mode),
        temperature: 1.1, // High creativity
        topP: 0.95,
        topK: 40,
      }
    });
    
    return response.text || "I bombed. Give me another chance.";
  } catch (error) {
    console.error("Error generating joke:", error);
    return "The mic is broken. (API Error: check your key)";
  }
};

export const generatePerformanceAudio = async (text: string, mode: ComedyMode): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Select voice based on mode to approximate the vibe
  let voiceName = 'Puck'; // Default male
  if (mode === ComedyMode.WILLIAM_MONTGOMERY) voiceName = 'Fenrir'; // Deeper, more chaotic potential
  if (mode === ComedyMode.ROAST) voiceName = 'Kore'; // Sharp
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Error generating audio:", error);
    return null;
  }
};
