// API Client for Bizup.id (Digital Business Card)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

class ApiClient {
    private token: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }
        }
    }

    getToken(): string | null {
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...options.headers,
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_URL}/api${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw data as ApiError;
        }

        return data as T;
    }

    private async uploadRequest<T>(
        endpoint: string,
        formData: FormData
    ): Promise<T> {
        const headers: HeadersInit = {
            Accept: 'application/json',
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_URL}/api${endpoint}`, {
            method: 'POST',
            headers,
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw data as ApiError;
        }

        return data as T;
    }

    // Auth endpoints
    async register(data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        phone?: string;
    }) {
        return this.request<{ message: string; user: User; token: string }>(
            '/register',
            { method: 'POST', body: JSON.stringify(data) }
        );
    }

    async login(email: string, password: string) {
        return this.request<{ message: string; user: User; token: string }>(
            '/login',
            { method: 'POST', body: JSON.stringify({ email, password }) }
        );
    }

    async logout() {
        const result = await this.request<{ message: string }>('/logout', {
            method: 'POST',
        });
        this.setToken(null);
        return result;
    }

    async getUser() {
        return this.request<{ user: User }>('/user');
    }

    // Business Card endpoints
    async getBusinessCards() {
        return this.request<{ success: boolean; data: BusinessCard[] }>('/business-cards');
    }

    async getBusinessCard(id: number) {
        return this.request<{ success: boolean; data: BusinessCard }>(`/business-cards/${id}`);
    }

    async createBusinessCard(data: CreateBusinessCardData) {
        return this.request<{ success: boolean; message: string; data: BusinessCard }>('/business-cards', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateBusinessCard(id: number, data: UpdateBusinessCardData) {
        return this.request<{ success: boolean; message: string; data: BusinessCard }>(`/business-cards/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteBusinessCard(id: number) {
        return this.request<{ success: boolean; message: string }>(`/business-cards/${id}`, {
            method: 'DELETE',
        });
    }

    async uploadCardPhoto(cardId: number, photo: File) {
        const formData = new FormData();
        formData.append('photo', photo);
        return this.uploadRequest<{ success: boolean; message: string; data: { photo_url: string } }>(
            `/business-cards/${cardId}/photo`,
            formData
        );
    }

    async getCardQRCode(cardId: number) {
        return this.request<{ success: boolean; data: { card_url: string; qr_url: string } }>(
            `/business-cards/${cardId}/qr`
        );
    }

    // Public card endpoints
    async getPublicCard(slug: string) {
        return this.request<{ success: boolean; data: PublicCardData }>(`/cards/${slug}`);
    }
}

// Types
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'merchant' | 'admin';
    locale: 'id' | 'en';
    phone?: string;
    created_at: string;
}

// CV Section Types
export interface Achievement {
    title: string;
    desc: string;
    year?: number;         // Tahun perolehan
    organization?: string; // Organisasi pemberi
}

export interface Experience {
    role: string;
    company: string;
    start_year: number;    // Tahun mulai
    end_year?: number;     // Tahun selesai (optional jika masih bekerja)
    is_current?: boolean;  // Flag "Masih Disini"
    desc: string;
}

export interface Education {
    degree: string;
    school: string;
    graduation_year: number; // Tahun lulus (integer 4 digit)
}

export interface BusinessCardData {
    name: string;
    title?: string;
    company?: string;
    bio?: string;
    photo?: string;
    email?: string;
    phone?: string;
    website?: string;
    social_links?: SocialLink[];
    custom_links?: CustomLink[];
    theme?: string;
    background_color?: string;
    // CV Sections
    about?: string;
    achievements?: Achievement[];
    experience?: Experience[];
    education?: Education[];
    skills?: string[];
    languages?: string[];
}

export interface BusinessCard {
    id: number;
    user_id: number;
    slug: string;
    data: BusinessCardData;
    views: number;
    is_active: boolean;
    expires_at?: string;
    created_at: string;
    updated_at: string;
}

export interface PublicCardData {
    slug: string;
    name: string;
    title?: string;
    company?: string;
    bio?: string;
    photo?: string;
    email?: string;
    phone?: string;
    website?: string;
    social_links: SocialLink[];
    custom_links: CustomLink[];
    theme: string;
    background_color?: string;
    about?: string;
    achievements?: Achievement[];
    experience?: Experience[];
    education?: Education[];
    skills?: string[];
    languages?: string[];
    views: number;
}

export interface SocialLink {
    platform: string;
    url: string;
}

export interface CustomLink {
    label: string;
    url: string;
    icon?: string;
}

interface CreateBusinessCardData {
    data: BusinessCardData;
    slug?: string;
}

interface UpdateBusinessCardData {
    data?: BusinessCardData;
    slug?: string;
    is_active?: boolean;
}

// Export singleton instance
export const api = new ApiClient();
export type { ApiError, CreateBusinessCardData, UpdateBusinessCardData };
