import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, apiService } from '../services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => Promise<void>;
    setIsAuthenticated: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    const setIsAuthenticated = (val: boolean) => {
        setIsAuthenticatedState(val);
        if (val) {
            localStorage.setItem('isAuthenticated', 'true');
        } else {
            localStorage.removeItem('isAuthenticated');
        }
    };

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await apiService.logout();
        } catch (err) {
            console.error('Logout API failed:', err);
        } finally {
            setIsAuthenticated(false);
            window.location.href = '/login';
        }
    };

    // Add Axios interceptor to handle 401 Unauthorized globally
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    setIsAuthenticated(false);
                    // Only redirect if we are on an admin page
                    if (window.location.pathname.startsWith('/admin')) {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
