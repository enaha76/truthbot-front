

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const register = async (username: string, password: string, fullName: string) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, full_name: fullName }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
    }
    return response.json();
};

export const login = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
    });
    if (!response.ok) {
        throw new Error("Login failed");
    }
    return response.json();
};

export const getProfile = async (token: string) => {
    const response = await fetch(`${API_URL}/users/me`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
}

export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
    try {
        const token = localStorage.getItem('token');
        const headers: any = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ history: history, message: newMessage }),
        });
        if (!response.ok) { throw new Error(`API Error: ${response.statusText}`); }
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Error sending chat message:", error);
        return "Désolé, j'ai eu un bug dans mes circuits !";
    }
};

export const generateQuiz = async (): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/quiz`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) { throw new Error(`API Error: ${response.statusText}`); }
        return await response.json();
    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
};
