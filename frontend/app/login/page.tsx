"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";


const API_BASE_URL = "http://localhost:3001"; 

type NotificationType = 'success' | 'error' | 'info';

function Notification({ message, type }: { message: string, type: NotificationType }) {
    if (!message) return null;
    
    const baseClasses = "p-3 rounded-xl text-sm mb-6 font-semibold shadow-lg transition-all duration-300 transform";
    
    const colorClasses = 
        type === 'success' ? "bg-green-50 text-green-800 border-l-4 border-green-400" :
        type === 'error'   ? "bg-red-50 text-red-800 border-l-4 border-red-400" :
        "bg-blue-50 text-blue-800 border-l-4 border-blue-400";
    
    return (
        <div className={`${baseClasses} ${colorClasses} animate-fadeIn`}>
            {message}
        </div>
    );
}

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<NotificationType>('info');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const isLoginMode = mode === "login";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
        const payload = isLoginMode 
            ? { email, password }
            : { username, email, password };
        
        const maxRetries = 3;
        let lastError = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `API error (${response.status})`);
                }

                if (isLoginMode) {
                    if (typeof data.token === 'string') {
                        localStorage.setItem("token", data.token); 
                        localStorage.setItem("userId", data.user.id);
                        setMessage("Login successful! Redirecting to dashboard...");
                        setMessageType('success');
                        setTimeout(() => router.push("/"), 1000);
                    } else {
                        throw new Error("Login failed: Token not received from server.");
                    }
                } else {
                    setMessage("Account created successfully! You can now log in.");
                    setMessageType('success');
                    setUsername("");
                    setEmail("");
                    setPassword("");
                    setMode("login");
                }
                setIsLoading(false);
                return;

            } catch (err: any) {
                lastError = err.message || `A network or server error occurred on attempt ${attempt + 1}.`;
                if (attempt < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
                } else {
                    setMessage(`Action failed: ${lastError}`);
                    setMessageType('error');
                    setIsLoading(false);
                }
            }
        }
    };

    const toggleMode = () => {
        setMode(isLoginMode ? "register" : "login");
        setMessage("");
        setUsername("");
        setEmail("");
        setPassword("");
    }

    const inputStyle = "w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-red-500 focus:border-red-500 transition duration-200 shadow-inner";
    
    return (
        <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50 font-inter">
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
            
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-500 border border-gray-100"
            >
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        {isLoginMode ? "Welcome Back" : "Join I FOUND"}
                    </h1>
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-sm text-gray-500 hover:text-red-600 font-semibold transition duration-300 hover:underline"
                    >
                        {isLoginMode ? "Need an account?" : "Already registered?"}
                    </button>
                </div>

                <Notification message={message} type={messageType} />

                <div className="space-y-5">
                    {!isLoginMode && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            className={inputStyle}
                            onChange={(e) => setUsername(e.target.value)}
                            required={!isLoginMode}
                        />
                    )}
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        className={inputStyle}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        className={inputStyle}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full p-4 mt-6 text-white rounded-xl font-bold text-lg 
                            shadow-xl transition-all duration-300 transform 
                            flex justify-center items-center
                            ${isLoading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : isLoginMode
                                    ? "bg-red-600 hover:bg-red-700 shadow-red-500/50 hover:scale-[1.02]" 
                                    : "bg-green-600 hover:bg-green-700 shadow-green-500/50 hover:scale-[1.02]"
                            }`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            isLoginMode ? "Login to LOFO" : "Register and Join"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}