import { GoogleGenAI, Type } from "@google/genai";
import { User, Resource } from '../types';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("Gemini AI API key not found. The AI roadmap feature will be disabled. Please create a .env file in the project root and add API_KEY='your_key'.");
}

export const generateCareerRoadmap = async (user: User, resources: Resource[]): Promise<string> => {
  if (!ai) {
    throw new Error("AI feature not configured. Please ensure a Google Gemini API key is provided in the root .env file and that you have restarted the server.");
  }
  
  const userProfileSummary = `
- Career Track: ${user.careerTrack}
- Experience Level: ${user.experienceLevel}
- Current Skills: ${user.skills.join(', ')}
- Stated Career Interests: ${user.careerInterests}
  `;

  const availableResources = resources.map(r => `- "${r.title}" from ${r.platform}. It covers skills like: ${r.relatedSkills.join(', ')}.`).join('\n');

  const prompt = `
You are a world-class career coach and mentor. A user with the following profile is looking for a personalized career roadmap to achieve their goals:
---
**USER PROFILE:**
${userProfileSummary}
---
They have been recommended the following learning resources to get started:
---
**RECOMMENDED RESOURCES:**
${availableResources}
---
Based on their profile and the available resources, create a clear, actionable, and encouraging step-by-step career roadmap.

The roadmap MUST:
1.  Be structured into logical phases or steps (e.g., "Phase 1: Strengthen Your Foundation", "Phase 2: Advanced Topics & Specialization", "Phase 3: Build & Showcase Your Portfolio").
2.  Within each phase, provide specific, actionable tasks.
3.  **Crucially, you must recommend specific resources from the provided list** for relevant tasks. For example, "To master the fundamentals of React, complete the *'React - The Complete Guide'* course on Udemy."
4.  Include a step about practical application, like building projects. Suggest 1-2 specific project ideas that are relevant to their career track and can be built using their new skills.
5.  Conclude with a short, motivational summary to inspire them.

Format the entire output in simple Markdown. Use headings for phases and bullet points for action items. Do not use complex markdown syntax like tables. Ensure the tone is professional, encouraging, and highly personalized.
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
