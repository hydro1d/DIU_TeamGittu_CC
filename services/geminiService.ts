
import { GoogleGenAI, Type } from "@google/genai";
import { User, Resource } from '../types';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("Gemini AI API key not found. The AI roadmap feature will be disabled. Please create a .env file in the project root and add API_KEY='your_key'.");
}

export const generateCareerRoadmap = async (user: User, resources: Resource[], targetRole: string, timeframe: string): Promise<string> => {
  if (!ai) {
    throw new Error("AI feature not configured. Please ensure a Google Gemini API key is provided in the root .env file and that you have restarted the server.");
  }
  
  const userProfileSummary = `
- Current Career Track: ${user.careerTrack}
- Experience Level: ${user.experienceLevel}
- Current Skills: ${user.skills.join(', ')}
  `;

  const availableResources = resources.map(r => `- "${r.title}" from ${r.platform}. It covers skills like: ${r.relatedSkills.join(', ')}.`).join('\n');

  const prompt = `
You are a world-class career coach and mentor specializing in creating hyper-optimized, accelerated learning paths.

A user wants to achieve the **Target Role** of **"${targetRole}"** within a **Timeframe** of **"${timeframe}"**.

Here is the user's current profile:
---
**USER'S CURRENT PROFILE:**
${userProfileSummary}
---

Here are some learning resources available to them:
---
**AVAILABLE RESOURCES:**
${availableResources}
---

Your task is to generate the **shortest and most optimized career roadmap** possible for this user to achieve their target role within the specified timeframe.

The roadmap MUST:
1.  Be extremely focused. Prioritize only the absolute most critical skills needed to get a job as a ${targetRole}.
2.  Be structured into a clear, time-based plan (e.g., Month 1, Months 2-3) that respects the total timeframe of ${timeframe}.
3.  Identify the key skill gaps between the user's current skills and what's required for a ${targetRole}.
4.  For each step, recommend the most relevant resources from the provided list. Be direct, like "Complete the 'React - The Complete Guide' course to learn React."
5.  Include one or two highly impactful portfolio projects that directly demonstrate the required skills for the target role.
6.  Conclude with a brief, motivational summary emphasizing the focused nature of this accelerated plan.

Format the entire output in simple Markdown. Use headings for time-based phases and bullet points for action items. Be concise and actionable.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating career roadmap:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided Google Gemini API key is invalid. Please check your .env file.");
    }
    throw new Error("Failed to generate career roadmap. There might be an issue with the AI service or your API key.");
  }
};

export const extractSkillsFromCV = async (cvText: string): Promise<string[]> => {
    if (!ai) {
        throw new Error("AI feature not configured. Please ensure a Google Gemini API key is provided in the root .env file.");
    }
    if (!cvText.trim()) {
        throw new Error("CV/Resume text cannot be empty.");
    }

    const prompt = `
    As an expert technical recruiter, analyze the following CV/Resume text.
    Extract a comprehensive list of key skills, programming languages, frameworks, tools, and technologies.
    Consolidate related skills (e.g., "Javascript" and "JS" should just be "JavaScript").
    Return the result as a JSON object with a single key "skills", which is an array of unique strings.

    CV Text:
    ---
    ${cvText}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        skills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: "A skill, tool, or technology."
                            }
                        }
                    },
                    required: ["skills"]
                }
            }
        });
        const jsonStr = response.text.trim();
        const jsonResponse = JSON.parse(jsonStr);
        if (jsonResponse && Array.isArray(jsonResponse.skills)) {
            return jsonResponse.skills;
        }
        return [];
    } catch (error) {
        console.error("Error extracting skills from CV:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
            throw new Error("The provided Google Gemini API key is invalid. Please check your .env file.");
        }
        throw new Error("Failed to analyze CV. There might be an issue with the AI service or the provided text format.");
    }
};

export const getCareerBotAnswer = async (question: string, user: User): Promise<string> => {
  if (!ai) {
    throw new Error("AI feature not configured. Please ensure a Google Gemini API key is provided in the root .env file.");
  }

  const userProfileSummary = `
- Career Track: ${user.careerTrack}
- Experience Level: ${user.experienceLevel}
- Current Skills: ${user.skills.join(', ')}
- Stated Career Interests: ${user.careerInterests}
  `;

  const prompt = `
You are CareerBot, a friendly and helpful AI career advisor.
A user with the following profile is asking you a question.
---
**USER PROFILE:**
${userProfileSummary}
---
**USER QUESTION:**
"${question}"
---
Please provide a concise, helpful, and encouraging answer to the user's question based on their profile.
Keep your response to a few sentences, maximum 2-3 short paragraphs.
Format your answer in simple markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting career bot answer:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
      throw new Error("The provided Google Gemini API key is invalid. Please check your .env file.");
    }
    throw new Error("I'm having trouble connecting to my brain right now. Please try again in a moment.");
  }
};
