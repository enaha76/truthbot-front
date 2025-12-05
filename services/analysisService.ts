import api from './api';
import { ContentType, AnalysisResult } from "../types";

interface AnalysisResponse {
    id: number;
    reliability_score: number;
    explanation: string;
    created_at: string;
}

export const AnalysisService = {
    analyzeContent: async (
        type: ContentType,
        content: string, // Text or Base64 string for images
        discussionId: string
    ): Promise<AnalysisResult> => {

        // 1. Create Analysis via Backend
        const response = await api.post<AnalysisResponse>(`/store/discussions/${discussionId}/analyses/`, {
            content: content,
            content_type: type.toUpperCase(), // Ensure matches backend choices (TEXT, IMAGE, etc.)
        });

        const data = response.data;

        // 2. Map Backend Response to Frontend Type
        return {
            id: data.id.toString(),
            date: data.created_at,
            type,
            inputSummary: type === ContentType.IMAGE ? "Image Analysis" : content.substring(0, 50) + "...",
            verdict: data.reliability_score > 70 ? 'True' : (data.reliability_score < 40 ? 'False' : 'Unverified'), // Simple mapping
            score: data.reliability_score,
            summary: data.explanation,
            reasoning: [], // Backend doesn't return structured reasoning list yet, just one explanation string
            sources: [],
            originalContent: content
        };
    },

    createDiscussion: async (): Promise<string> => {
        // Generate a default title with timestamp
        const now = new Date();
        const defaultTitle = `Chat ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        
        const response = await api.post<{ id: number }>('/store/discussions/', {
            title: defaultTitle
        });
        return response.data.id.toString();
    },

    getDiscussions: async (): Promise<any[]> => {
        const response = await api.get('/store/discussions/');
        return response.data.results.map((d: any) => ({
            id: d.id.toString(),
            messages: [], // List view doesn't return messages usually, or we need to fetch them
            // We might need to adjust the type or fetch details
            createdAt: d.created_at,
            updatedAt: d.updated_at,
            title: d.title
        }));
    },

    getDiscussion: async (id: string): Promise<any> => {
        const response = await api.get(`/store/discussions/${id}/`);
        const data = response.data;

        // Map analyses to messages - create both user message and AI response for each analysis
        const messages: any[] = [];
        data.analyses.forEach((a: any) => {
            // Add user message first
            messages.push({
                id: `user-${a.id}`,
                date: a.created_at,
                type: a.content_type.toLowerCase(),
                inputSummary: a.content.substring(0, 100),
                originalContent: a.content,
                verdict: 'user' as any,
                score: 0,
                summary: '',
                reasoning: [],
                sources: []
            });
            
            // Then add AI response
            messages.push({
                id: a.id.toString(),
                date: a.created_at,
                type: a.content_type.toLowerCase(),
                inputSummary: a.content.substring(0, 50) + "...",
                originalContent: a.content,
                verdict: a.reliability_score > 70 ? 'True' : (a.reliability_score < 40 ? 'False' : 'Unverified'),
                score: a.reliability_score,
                summary: a.explanation,
                reasoning: [],
                sources: []
            });
        });

        return {
            id: data.id.toString(),
            messages: messages,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            title: data.title
        };
    },

    updateDiscussionTitle: async (id: string, title: string): Promise<void> => {
        await api.patch(`/store/discussions/${id}/`, {
            title: title
        });
    },

    generateDiscussionTitle: async (id: string): Promise<any> => {
        const response = await api.post(`/store/discussions/${id}/generate-title/`);
        return response.data;
    }
};
