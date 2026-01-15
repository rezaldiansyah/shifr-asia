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

    async forgotPassword(email: string) {
        return this.request<{ message: string }>('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(data: { email: string; token: string; password: string; password_confirmation: string }) {
        return this.request<{ message: string }>('/reset-password', {
            method: 'POST',
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

    // ==================== LINK-IN-BIO ENDPOINTS ====================

    async getLinks() {
        return this.request<{ links: Link[] }>('/links');
    }

    async getPublicLinks(storeSlug: string) {
        return this.request<{
            store: {
                id: number;
                name: string;
                slug: string;
                description?: string;
                logo?: string;
                theme_color?: string;
            };
            links: Link[];
        }>(`/links/${storeSlug}`);
    }

    async createLink(data: CreateLinkData) {
        return this.request<{ message: string; link: Link }>('/links', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateLink(id: number, data: UpdateLinkData) {
        return this.request<{ message: string; link: Link }>(`/links/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteLink(id: number) {
        return this.request<{ message: string }>(`/links/${id}`, {
            method: 'DELETE',
        });
    }

    async reorderLinks(order: number[]) {
        return this.request<{ message: string; links: Link[] }>('/links/reorder', {
            method: 'POST',
            body: JSON.stringify({ order }),
        });
    }

    async trackLinkClick(linkId: number) {
        return this.request<{ success: boolean; url: string }>(`/links/${linkId}/click`, {
            method: 'POST',
        });
    }

    // ==================== PROMO CODE ENDPOINTS ====================

    async getPromos() {
        return this.request<{ promos: Promo[] }>('/promos');
    }

    async getPromo(id: number) {
        return this.request<{ promo: Promo }>(`/promos/${id}`);
    }

    async createPromo(data: CreatePromoData) {
        return this.request<{ message: string; promo: Promo }>('/promos', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updatePromo(id: number, data: UpdatePromoData) {
        return this.request<{ message: string; promo: Promo }>(`/promos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deletePromo(id: number) {
        return this.request<{ message: string }>(`/promos/${id}`, {
            method: 'DELETE',
        });
    }

    async validatePromo(storeId: number, code: string, orderAmount?: number) {
        return this.request<PromoValidationResult>('/promos/validate', {
            method: 'POST',
            body: JSON.stringify({
                store_id: storeId,
                code,
                order_amount: orderAmount,
            }),
        });
    }

    // ==================== ANALYTICS ENDPOINTS ====================

    async trackEvent(data: {
        store_id: number;
        event_type: 'view' | 'click' | 'order' | 'bio_view' | 'link_click' | 'product_view';
        page?: string;
        target_type?: string;
        target_id?: number;
        metadata?: Record<string, unknown>;
    }) {
        return this.request<{ success: boolean; event_id: number }>('/analytics/track', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getAnalyticsSummary(period: '24h' | '7d' | '30d' | '90d' = '7d') {
        return this.request<{
            summary: AnalyticsSummary;
            period: string;
            start_date: string;
            end_date: string;
        }>(`/analytics/summary?period=${period}`);
    }

    async getAnalyticsCharts(period: '24h' | '7d' | '30d' | '90d' = '7d') {
        return this.request<AnalyticsCharts>(`/analytics/charts?period=${period}`);
    }

    async getAnalyticsEvents(filters?: { event_type?: string; per_page?: number }) {
        const params = new URLSearchParams();
        if (filters?.event_type) params.append('event_type', filters.event_type);
        if (filters?.per_page) params.append('per_page', filters.per_page.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request<{
            events: AnalyticsEvent[];
            pagination: {
                current_page: number;
                last_page: number;
                per_page: number;
                total: number;
            };
        }>(`/analytics${query}`);
    }

    // ==================== ADMIN ENDPOINTS ====================

    async getAdminDashboard() {
        return this.request<{
            overview: {
                total_users: number;
                active_subscriptions: number;
                pending_payments: number;
                total_revenue: number;
                total_revenue_formatted: string;
                this_month_revenue: number;
                this_month_revenue_formatted: string;
            };
            alerts: {
                expiring_in_3_days: number;
                expiring_in_7_days: number;
            };
            revenue_by_tier: Array<{
                tier: string;
                total: number;
                total_formatted: string;
                count: number;
            }>;
        }>('/admin/dashboard');
    }

    async getAdminPayments(filters?: {
        status?: string;
        gateway?: string;
        from?: string;
        to?: string;
        per_page?: number;
        page?: number;
    }) {
        const params = new URLSearchParams();
        if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters?.gateway && filters.gateway !== 'all') params.append('gateway', filters.gateway);
        if (filters?.from) params.append('from', filters.from);
        if (filters?.to) params.append('to', filters.to);
        if (filters?.per_page) params.append('per_page', filters.per_page.toString());
        if (filters?.page) params.append('page', filters.page.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request<{
            payments: AdminPayment[];
            pagination: {
                current_page: number;
                last_page: number;
                per_page: number;
                total: number;
            };
        }>(`/admin/payments${query}`);
    }

    async getAdminPaymentSummary() {
        return this.request<{
            stats: {
                total_paid: number;
                total_pending: number;
                total_revenue: number;
                total_revenue_formatted: string;
                today_revenue: number;
                today_revenue_formatted: string;
                monthly_revenue: number;
                monthly_revenue_formatted: string;
            };
            recent_payments: Array<{
                id: number;
                user_name: string;
                tier_name: string;
                formatted_amount: string;
                status: string;
                created_at: string;
            }>;
        }>('/admin/payments/summary');
    }

    async getAdminExpiring(days: number = 7) {
        return this.request<{
            expiring_soon: {
                count: number;
                subscriptions: AdminSubscription[];
            };
            expired: {
                count: number;
                subscriptions: AdminSubscription[];
            };
        }>(`/admin/payments/expiring?days=${days}`);
    }

    async getAdminPaymentDetail(id: number) {
        return this.request<{ payment: AdminPaymentDetail }>(`/admin/payments/${id}`);
    }

    // ==================== ADMIN SUBSCRIPTION ENDPOINTS ====================

    async getAdminSubscriptions(filters?: { status?: string; tier?: string; search?: string }) {
        const params = new URLSearchParams();
        if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters?.tier && filters.tier !== 'all') params.append('tier', filters.tier);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request<{
            subscriptions: AdminSubscriptionFull[];
            pagination: {
                current_page: number;
                last_page: number;
                per_page: number;
                total: number;
            };
        }>(`/admin/subscriptions${query}`);
    }

    async getAdminReminderStats() {
        return this.request<{
            stats: {
                total_reminders: number;
                sent_today: number;
                pending: number;
                by_checkpoint: Record<string, number>;
            };
        }>('/admin/subscriptions/reminder-stats');
    }

    async getAdminReminderHistory(subscriptionId: number) {
        return this.request<{
            reminders: AdminReminder[];
        }>(`/admin/subscriptions/${subscriptionId}/reminders`);
    }

    async triggerAdminReminder(subscriptionId: number, channel: 'email' | 'whatsapp' | 'both' = 'email') {
        return this.request<{
            message: string;
            reminder: AdminReminder;
        }>(`/admin/subscriptions/${subscriptionId}/trigger-reminder`, {
            method: 'POST',
            body: JSON.stringify({ channel }),
        });
    }

    async runAdminReminderCheck() {
        return this.request<{
            message: string;
            processed: number;
            sent: { email: number; whatsapp: number };
        }>('/admin/subscriptions/run-check', {
            method: 'POST',
        });
    }

    // ==================== AFFILIATE ENDPOINTS (User) ====================

    async getAffiliateStatus() {
        return this.request<AffiliateStatus>('/affiliate/status');
    }

    async applyAffiliate(data: { motivation: string; payout_info?: PayoutInfo }) {
        return this.request<{ message: string; affiliate: AffiliateBasic }>('/affiliate/apply', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getAffiliateDashboard() {
        return this.request<AffiliateDashboard>('/affiliate/dashboard');
    }

    async updateAffiliatePayoutInfo(data: PayoutInfo) {
        return this.request<{ message: string }>('/affiliate/payout-info', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async trackAffiliateClick(code: string) {
        return this.request<{ success: boolean }>('/affiliate/track-click', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    }

    // ==================== ADMIN AFFILIATE ENDPOINTS ====================

    async getAdminAffiliates(filters?: { status?: string; search?: string }) {
        const params = new URLSearchParams();
        if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request<{
            affiliates: AdminAffiliate[];
            pagination: { current_page: number; last_page: number; per_page: number; total: number };
        }>(`/admin/affiliates${query}`);
    }

    async getAdminAffiliateStats() {
        return this.request<{ stats: AffiliateStats }>('/admin/affiliates/stats');
    }

    async getAdminAffiliateDetail(id: number) {
        return this.request<{ affiliate: AdminAffiliateDetail; referrals: AffiliateReferralItem[] }>(`/admin/affiliates/${id}`);
    }

    async approveAffiliate(id: number, data?: { commission_rate?: number; admin_notes?: string }) {
        return this.request<{ message: string; affiliate: AffiliateBasic }>(`/admin/affiliates/${id}/approve`, {
            method: 'POST',
            body: JSON.stringify(data || {}),
        });
    }

    async rejectAffiliate(id: number, reason: string) {
        return this.request<{ message: string }>(`/admin/affiliates/${id}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    }

    async suspendAffiliate(id: number, reason: string) {
        return this.request<{ message: string }>(`/admin/affiliates/${id}/suspend`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    }

    async reactivateAffiliate(id: number) {
        return this.request<{ message: string }>(`/admin/affiliates/${id}/reactivate`, {
            method: 'POST',
        });
    }

    async updateAffiliateCommission(id: number, commission_rate: number) {
        return this.request<{ message: string }>(`/admin/affiliates/${id}/commission`, {
            method: 'PUT',
            body: JSON.stringify({ commission_rate }),
        });
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
        banner_url?: string;
        social_links?: {
            instagram?: string;
            tiktok?: string;
            facebook?: string;
            shopee?: string;
            tokopedia?: string;
        };
        working_hours?: {
            [key: string]: {
                is_open: boolean;
                open: string;
                close: string;
            };
        };
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

// Link Types (Link-in-Bio)
export interface Link {
    id: number;
    store_id: number;
    title: string;
    url: string;
    icon?: string;
    thumbnail?: string;
    description?: string;
    sort_order: number;
    is_active: boolean;
    click_count: number;
    created_at: string;
}

export interface CreateLinkData {
    title: string;
    url: string;
    icon?: string;
    thumbnail?: string;
    description?: string;
    is_active?: boolean;
}

export interface UpdateLinkData {
    title?: string;
    url?: string;
    icon?: string;
    thumbnail?: string;
    description?: string;
    is_active?: boolean;
}

// Promo Types (Discount Codes)
export interface Promo {
    id: number;
    code: string;
    name: string;
    description?: string;
    type: 'percentage' | 'fixed';
    value: number;
    formatted_value: string;
    min_order?: number;
    max_discount?: number;
    max_uses?: number;
    used_count: number;
    starts_at?: string;
    expires_at?: string;
    is_active: boolean;
    is_valid: boolean;
    is_expired: boolean;
    created_at: string;
}

export interface CreatePromoData {
    code: string;
    name: string;
    description?: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_order?: number;
    max_discount?: number;
    max_uses?: number;
    starts_at?: string;
    expires_at?: string;
    is_active?: boolean;
}

export interface UpdatePromoData {
    code?: string;
    name?: string;
    description?: string;
    type?: 'percentage' | 'fixed';
    value?: number;
    min_order?: number;
    max_discount?: number;
    max_uses?: number;
    starts_at?: string;
    expires_at?: string;
    is_active?: boolean;
}

export interface PromoValidationResult {
    valid: boolean;
    message?: string;
    promo?: {
        code: string;
        name: string;
        type: 'percentage' | 'fixed';
        value: number;
        formatted_value: string;
    };
    discount?: number;
    formatted_discount?: string;
}

// Analytics Types
export interface AnalyticsSummary {
    total_views: number;
    unique_visitors: number;
    total_clicks: number;
    total_orders: number;
    bio_views: number;
    link_clicks: number;
    conversion_rate: number;
}

export interface DailyStats {
    date: string;
    views: number;
    clicks: number;
    orders: number;
}

export interface TopPage {
    page: string;
    count: number;
}

export interface TopProduct {
    product_id: number;
    product_name: string;
    views: number;
}

export interface AnalyticsCharts {
    daily: DailyStats[];
    top_pages: TopPage[];
    top_products: TopProduct[];
    period: string;
}

export interface AnalyticsEvent {
    id: number;
    store_id: number;
    event_type: string;
    page?: string;
    target_type?: string;
    target_id?: number;
    metadata?: Record<string, unknown>;
    ip_address?: string;
    created_at: string;
}

// Admin Types
export interface AdminPayment {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
    tier: string;
    tier_name: string;
    amount: number;
    formatted_amount: string;
    status: string;
    is_paid: boolean;
    payment_gateway: string;
    payment_method: string | null;
    duitku_reference: string | null;
    duitku_va_number: string | null;
    paid_at: string | null;
    expires_at: string | null;
    created_at: string;
}

export interface AdminPaymentDetail extends AdminPayment {
    period: string | null;
    customer_name: string | null;
    customer_email: string | null;
    customer_phone: string | null;
    duitku_merchant_order_id: string | null;
    duitku_payment_url: string | null;
    mayar_payment_id: string | null;
    mayar_link_url: string | null;
    updated_at: string;
    metadata: Record<string, unknown> | null;
    webhook_data: Record<string, unknown> | null;
}

export interface AdminSubscription {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    } | null;
    tier: string;
    tier_name: string;
    status: string;
    expires_at: string | null;
    days_remaining: number | null;
    days_overdue?: number;
    auto_renew: boolean;
}

export interface AdminSubscriptionFull extends AdminSubscription {
    is_trial: boolean;
    starts_at: string | null;
    created_at: string;
    store?: {
        id: number;
        name: string;
        slug: string;
    } | null;
    reminders_count?: number;
    last_reminder_at?: string | null;
}

export interface AdminReminder {
    id: number;
    subscription_id: number;
    days_before_expiration: number;
    channel: 'email' | 'whatsapp' | 'both';
    email_sent_at: string | null;
    whatsapp_sent_at: string | null;
    sent: boolean;
    created_at: string;
    email_response?: Record<string, unknown>;
    whatsapp_response?: Record<string, unknown>;
}

// Affiliate Types
export interface PayoutInfo {
    bank_name?: string;
    bank_account?: string;
    account_name?: string;
}

export interface AffiliateBasic {
    id: number;
    code: string;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    status_label: string;
    commission_rate?: number;
}

export interface AffiliateStatus {
    is_affiliate: boolean;
    can_apply?: boolean;
    message?: string;
    affiliate?: {
        id: number;
        code: string;
        status: string;
        status_label: string;
        commission_rate: number;
        total_clicks: number;
        total_referrals: number;
        total_earnings: number;
        pending_payout: number;
        total_paid: number;
        referral_url: string | null;
        created_at: string;
        approved_at: string | null;
    };
}

export interface AffiliateDashboard {
    affiliate: {
        id: number;
        code: string;
        referral_url: string;
        commission_rate: number;
        total_clicks: number;
        total_referrals: number;
        total_earnings: number;
        pending_payout: number;
        total_paid: number;
        formatted_earnings: string;
        formatted_pending: string;
    };
    recent_referrals: AffiliateReferralItem[];
    monthly_stats: { month: string; count: number; total: number }[];
}

export interface AffiliateReferralItem {
    id: number;
    user_name?: string;
    user?: { name: string; email: string };
    tier: string | null;
    commission_amount: number;
    formatted_commission: string;
    status: string;
    created_at: string;
}

export interface AdminAffiliate {
    id: number;
    user: { id: number; name: string; email: string; phone: string | null } | null;
    code: string;
    status: string;
    status_label: string;
    commission_rate: number;
    motivation: string | null;
    total_clicks: number;
    total_referrals: number;
    total_earnings: number;
    pending_payout: number;
    created_at: string;
    approved_at: string | null;
}

export interface AdminAffiliateDetail extends AdminAffiliate {
    admin_notes: string | null;
    payout_info: PayoutInfo | null;
    total_paid: number;
    approver: string | null;
}

export interface AffiliateStats {
    total_affiliates: number;
    pending_applications: number;
    approved_affiliates: number;
    total_clicks: number;
    total_referrals: number;
    total_earnings: number;
    total_pending_payouts: number;
    total_paid: number;
    formatted_total_earnings: string;
    formatted_pending_payouts: string;
}

// Export singleton instance
export const api = new ApiClient();
export type { ApiError, CreateOrderData };



