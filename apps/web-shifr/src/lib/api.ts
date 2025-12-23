// API Client for Shifr Asia

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

    async updateProfile(data: { name?: string; phone?: string; locale?: string }) {
        return this.request<{ message: string; user: User }>('/user', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Template endpoints
    async getTemplates() {
        return this.request<{ templates: Template[] }>('/templates');
    }

    async getTemplate(id: number) {
        return this.request<{ template: Template }>(`/templates/${id}`);
    }

    // Public store endpoint
    async getPublicStore(slug: string) {
        return this.request<{ store: Store & { products: Product[] } }>(`/stores/${slug}`);
    }

    // Store endpoints
    async getStore() {
        return this.request<{ store: Store | null; message?: string }>('/store');
    }

    async createStore(data: CreateStoreData) {
        return this.request<{ message: string; store: Store }>('/store', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateStore(data: UpdateStoreData) {
        return this.request<{ message: string; store: Store }>('/store', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Product endpoints
    async getProducts(filters?: { search?: string; status?: string; category?: string }) {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.category) params.append('category', filters.category);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request<{ products: Product[]; total: number; limit: number }>(`/products${query}`);
    }

    async getProduct(id: number) {
        return this.request<{ product: Product }>(`/products/${id}`);
    }

    async createProduct(data: CreateProductData) {
        return this.request<{ message: string; product: Product }>('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProduct(id: number, data: UpdateProductData) {
        return this.request<{ message: string; product: Product }>(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProduct(id: number) {
        return this.request<{ message: string }>(`/products/${id}`, {
            method: 'DELETE',
        });
    }

    async uploadProductImages(productId: number, images: File[]) {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images[]', image);
        });
        return this.uploadRequest<{ message: string; images: string[] }>(
            `/products/${productId}/images`,
            formData
        );
    }

    async removeProductImage(productId: number, imageUrl: string) {
        return this.request<{ message: string; images: string[] }>(`/products/${productId}/images`, {
            method: 'DELETE',
            body: JSON.stringify({ image_url: imageUrl }),
        });
    }

    // Order endpoints (public)
    async createOrder(data: CreateOrderData) {
        return this.request<{ message: string; order: Order; wa_status: { buyer: boolean; seller: boolean } }>('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async trackOrder(orderNumber: string) {
        return this.request<{ order: OrderTrackInfo }>(`/orders/track/${orderNumber}`);
    }

    // Order endpoints (seller)
    async getOrders(filters?: { status?: string }) {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request<{ orders: Order[]; pagination: { current_page: number; last_page: number; total: number } }>(`/orders${query}`);
    }

    async getOrder(id: number) {
        return this.request<{ order: Order }>(`/orders/${id}`);
    }

    async updateOrderStatus(id: number, status: string) {
        return this.request<{ message: string; order: Order }>(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Website Builder - Section endpoints
    async getSectionTypes() {
        return this.request<{ types: SectionType[] }>('/section-types');
    }

    async getStoreSections() {
        return this.request<{ sections: Section[]; store: { id: number; name: string; slug: string } }>('/store/sections');
    }

    async updateStoreSections(sections: Section[]) {
        return this.request<{ message: string; sections: Section[] }>('/store/sections', {
            method: 'PUT',
            body: JSON.stringify({ sections }),
        });
    }

    async addSection(type: string, position?: number) {
        return this.request<{ message: string; section: Section; sections: Section[] }>('/store/sections', {
            method: 'POST',
            body: JSON.stringify({ type, position }),
        });
    }

    async deleteSection(sectionId: string) {
        return this.request<{ message: string; sections: Section[] }>(`/store/sections/${sectionId}`, {
            method: 'DELETE',
        });
    }

    async reorderSections(order: string[]) {
        return this.request<{ message: string; sections: Section[] }>('/store/sections/reorder', {
            method: 'POST',
            body: JSON.stringify({ order }),
        });
    }

    async getStorePreview() {
        return this.request<{ store: StorePreview }>('/store/preview');
    }

    // Subscription endpoints
    async getSubscription() {
        return this.request<{ subscription: Subscription | null; message?: string }>('/subscription');
    }

    async getTiers() {
        return this.request<{ tiers: Tier[] }>('/subscription/tiers');
    }

    async getSubscriptionUsage() {
        return this.request<{
            usage: {
                products: {
                    used: number;
                    limit: number;
                    percentage: number;
                    remaining: number;
                };
            };
            tier: string;
        }>('/subscription/usage');
    }

    async startTrial() {
        return this.request<{ message: string; subscription: Subscription }>('/subscription/trial', {
            method: 'POST',
        });
    }

    async changeTier(tier: string) {
        return this.request<{
            message: string;
            subscription?: Subscription;
            redirect_to?: string;
            tier?: string;
            price?: string;
        }>('/subscription/tier', {
            method: 'PUT',
            body: JSON.stringify({ tier }),
        });
    }

    // Domain Management endpoints
    async getDomainSettings() {
        return this.request<{ domain: DomainSettings }>('/domain');
    }

    async updateSubdomain(subdomain: string) {
        return this.request<{ message: string; subdomain: string; subdomain_url: string; primary_url: string }>('/domain/subdomain', {
            method: 'PUT',
            body: JSON.stringify({ subdomain }),
        });
    }

    async setCustomDomain(customDomain: string) {
        return this.request<{ message: string; custom_domain: string; domain_verified: boolean; dns_instructions: DnsInstructions }>('/domain/custom', {
            method: 'PUT',
            body: JSON.stringify({ custom_domain: customDomain }),
        });
    }

    async verifyCustomDomain() {
        return this.request<{ message: string; domain_verified: boolean; ssl_status?: string; primary_url?: string; dns_instructions?: DnsInstructions }>('/domain/verify', {
            method: 'POST',
        });
    }

    async removeCustomDomain() {
        return this.request<{ message: string; primary_url: string }>('/domain/custom', {
            method: 'DELETE',
        });
    }

    // Payment endpoints
    async createCheckout(tier: string, period: string = 'monthly') {
        return this.request<{
            message: string;
            payment: {
                id: number;
                checkout_url: string;
                amount: number;
                formatted_amount: string;
                tier: string;
                tier_name: string;
                expires_at: string;
            };
        }>('/payment/checkout', {
            method: 'POST',
            body: JSON.stringify({ tier, period }),
        });
    }

    async getPaymentCallback(paymentId: string) {
        return this.request<{
            payment: {
                id: number;
                status: string;
                is_paid: boolean;
                tier: string;
                tier_name: string;
                amount: number;
                formatted_amount: string;
                paid_at: string | null;
            };
        }>(`/payment/callback?payment_id=${paymentId}`);
    }

    async getPaymentHistory() {
        return this.request<{
            payments: Array<{
                id: number;
                tier: string;
                tier_name: string;
                amount: number;
                formatted_amount: string;
                status: string;
                is_paid: boolean;
                paid_at: string | null;
                created_at: string;
            }>;
        }>('/payment/history');
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

export interface Template {
    id: number;
    name: string;
    slug: string;
    description: string;
    preview_url: string;
    thumbnail: string;
    is_premium: boolean;
}

export interface Store {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    domain?: string;
    template_id: number;
    template?: Template;
    tier: 'free' | 'starter' | 'growth' | 'pro';
    description?: string;
    settings: {
        whatsapp_number?: string;
        logo?: string;
        theme_color?: string;
    };
    is_active: boolean;
    created_at: string;
}

export interface Product {
    id: number;
    store_id: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    compare_price?: number;
    images: string[];
    variants: ProductVariant[];
    category?: string;
    stock?: number;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

export interface ProductVariant {
    name: string;
    options: string[];
    price_modifier?: number;
}

interface CreateStoreData {
    name: string;
    description?: string;
    template_id?: number;
    whatsapp_number?: string;
    logo?: string;
    theme_color?: string;
}

interface UpdateStoreData {
    name?: string;
    description?: string;
    template_id?: number;
    whatsapp_number?: string;
    logo?: string;
    theme_color?: string;
}

interface CreateProductData {
    name: string;
    description?: string;
    price: number;
    compare_price?: number;
    images?: string[];
    variants?: ProductVariant[];
    category?: string;
    stock?: number;
    is_active?: boolean;
}

interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    compare_price?: number;
    images?: string[];
    variants?: ProductVariant[];
    category?: string;
    stock?: number;
    is_active?: boolean;
    sort_order?: number;
}

export interface Order {
    id: number;
    order_number: string;
    store_id: number;
    product_id: number;
    quantity: number;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    customer_address?: string;
    notes?: string;
    subtotal: number;
    discount: number;
    total: number;
    status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'completed' | 'cancelled';
    status_label: string;
    formatted_total: string;
    wa_sent_buyer: boolean;
    wa_sent_seller: boolean;
    product?: Product;
    store?: Store;
    created_at: string;
}

interface OrderTrackInfo {
    order_number: string;
    status: string;
    status_label: string;
    product: Product;
    store_name: string;
    total: string;
    created_at: string;
}

interface CreateOrderData {
    store_id: number;
    product_id: number;
    quantity?: number;
    customer_name: string;
    customer_phone: string;
    customer_address?: string;
    notes?: string;
}

// Website Builder Types
export interface SectionType {
    type: string;
    name: string;
    description: string;
    icon: string;
}

export interface SectionStyles {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
}

export interface Section {
    id: string;
    type: string;
    order: number;
    enabled: boolean;
    content: Record<string, unknown>;
    styles?: SectionStyles;
}

export interface StorePreview {
    id: number;
    name: string;
    slug: string;
    description?: string;
    settings: {
        whatsapp_number?: string;
        logo?: string;
        theme_color?: string;
    };
    sections: Section[];
    products: Product[];
}

// Subscription Types
export interface TierConfig {
    name: string;
    price: number;
    price_formatted: string;
    period: string;
    product_limit: number;
    popular?: boolean;
    features: string[];
    not_included: string[];
}

export interface Tier extends TierConfig {
    key: string;
}

export interface Subscription {
    id: number;
    tier: 'free' | 'starter' | 'growth' | 'pro';
    tier_name: string;
    tier_config: TierConfig;
    status: 'active' | 'expired' | 'cancelled' | 'pending' | 'trial';
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    is_expired: boolean;
    days_remaining: number | null;
    auto_renew: boolean;
    product_limit: number;
}

// Domain Types
export interface DnsInstructions {
    type: string;
    name: string;
    value: string;
    verification: {
        type: string;
        name: string;
        value: string;
    };
}

export interface DomainSettings {
    subdomain: string | null;
    subdomain_url: string | null;
    custom_domain: string | null;
    custom_domain_url: string | null;
    domain_verified: boolean;
    ssl_status: 'none' | 'pending' | 'active';
    ssl_expires_at: string | null;
    verification_token: string | null;
    primary_url: string;
    can_use_custom_domain: boolean;
    dns_instructions: DnsInstructions | null;
}

// Export singleton instance
export const api = new ApiClient();
export type { ApiError, CreateOrderData };

