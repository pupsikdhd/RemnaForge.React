import axios from 'axios';

// Create AXIOS instance
export const api = axios.create({
    baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || ''),
    withCredentials: true,
});

// Interfaces matching backend models from OpenAPI spec
export interface Client {
    id: string;
    name: string | null;
    subscriptionId: string;
    expireAt: string;
    deviceLimit: number;
    slug: string;
    devicesActiveCount?: number; // Optional count helper
}

export interface CreateClientRequest {
    name?: string | null;
    subscriptionId: string;
    expireAt: string;
    deviceLimit: number;
}

export interface PatchClientRequest {
    id: string;
    name?: string | null;
    expireAt?: string | null;
    deviceLimit?: number | null;
}

export interface Subscription {
    subscriptionId: string;
    name: string | null;
    url: string | null;
    hwid: string | null;
    x_DEVICE_OS: string | null;
    x_VER_OS: string | null;
    useR_AGENT: string | null;
    x_APP_VERSION: string | null;
    accepT_ENCODING: string | null;
}

export interface CreateSubscriptionRequest {
    name?: string | null;
    url?: string | null;
    hwid?: string | null;
    x_DEVICE_OS?: string | null;
    x_VER_OS?: string | null;
    useR_AGENT?: string | null;
    x_APP_VERSION?: string | null;
    accepT_ENCODING?: string | null;
}

export interface PatchSubscriptionRequest {
    subscriptionId: string;
    name?: string | null;
    url?: string | null;
    hwid?: string | null;
    x_DEVICE_OS?: string | null;
    x_VER_OS?: string | null;
    useR_AGENT?: string | null;
    x_APP_VERSION?: string | null;
    accepT_ENCODING?: string | null;
}

export interface Invite {
    id: string;
    description: string | null;
    expireDays: number;
    createdAt: string;
    expireAt: string;
}

export interface CreateInviteRequest {
    description?: string | null;
    expireDays: number;
}

export interface SystemSettings {
    allowRegistration: boolean;
    useCaching: boolean;
    cacheDurationInMinutes: number;
}

export interface PatchSystemSettingsRequest {
    allowRegistration?: boolean | null;
    useCaching?: boolean | null;
    cacheDurationInMinutes?: number | null;
}

export interface Device {
    id?: string;
    deviceId?: string;
    hwid?: string;
    ip?: string;
    ipAddress?: string;
    lastActive?: string;
    lastActiveAt?: string;
    createdAt?: string;
    userAgent?: string;
}

// API Functions
export const apiService = {
    // Auth
    logout: () => api.post('/api/auth/logout'),

    // Clients
    getClients: async (): Promise<Client[]> => {
        const res = await api.get<Client[]>('/api/clients');
        return res.data;
    },
    createClient: async (data: CreateClientRequest): Promise<void> => {
        await api.post('/api/clients', data);
    },
    patchClient: async (data: PatchClientRequest): Promise<void> => {
        await api.patch('/api/clients', data);
    },
    deleteClient: async (id: string): Promise<void> => {
        await api.delete(`/api/clients/${id}`);
    },
    getClientDevices: async (clientId: string): Promise<Device[]> => {
        const res = await api.get<Device[]>(`/api/clients/${clientId}/devices`);
        return res.data;
    },
    deleteClientDevice: async (clientId: string, deviceId: string): Promise<void> => {
        await api.delete(`/api/clients/${clientId}/devices/${deviceId}`);
    },

    // Subscriptions
    getSubscriptions: async (): Promise<Subscription[]> => {
        const res = await api.get<Subscription[]>('/api/subscriptions');
        return res.data;
    },
    createSubscription: async (data: CreateSubscriptionRequest): Promise<void> => {
        await api.post('/api/subscriptions', data);
    },
    patchSubscription: async (data: PatchSubscriptionRequest): Promise<void> => {
        await api.patch('/api/subscriptions', data);
    },
    deleteSubscription: async (id: string): Promise<void> => {
        await api.delete(`/api/subscriptions/${id}`);
    },

    // Invites
    getInvites: async (): Promise<Invite[]> => {
        const res = await api.get<Invite[]>('/api/invites');
        return res.data;
    },
    createInvite: async (data: CreateInviteRequest): Promise<void> => {
        await api.post('/api/invites', data);
    },
    deleteInvite: async (id: string): Promise<void> => {
        await api.delete(`/api/invites/${id}`);
    },

    // System Settings
    getSettings: async (): Promise<SystemSettings> => {
        const res = await api.get<SystemSettings>('/api/settings');
        return res.data;
    },
    patchSettings: async (data: PatchSystemSettingsRequest): Promise<void> => {
        await api.patch('/api/settings', data);
    },

    // Public Client Endpoints
    getPublicDevices: async (slug: string): Promise<any> => {
        const res = await api.get<any>(`/api/public/clients/${slug}/devices`);
        return res.data;
    },
    deletePublicDevice: async (slug: string, deviceId: string): Promise<void> => {
        await api.delete(`/api/public/clients/${slug}/devices/${deviceId}`);
    }
};
