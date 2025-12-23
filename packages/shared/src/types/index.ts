// Shared TypeScript types

export interface User {
    id: string;
    email: string;
    name: string;
    locale: 'id' | 'en';
    created_at: string;
}

export interface Store {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    domain?: string;
    template_id: string;
    tier: 'free' | 'starter' | 'growth' | 'pro';
    settings: StoreSettings;
    created_at: string;
}

export interface StoreSettings {
    logo?: string;
    primary_color?: string;
    whatsapp?: string;
    instagram?: string;
}

export interface Product {
    id: string;
    store_id: string;
    name: string;
    description?: string;
    price: number;
    images: string[];
    variants?: ProductVariant[];
    is_active: boolean;
}

export interface ProductVariant {
    id: string;
    name: string;
    options: string[];
    price_modifier?: number;
}

export interface Order {
    id: string;
    store_id: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
    payment_method?: string;
    payment_status: 'unpaid' | 'paid' | 'refunded';
    created_at: string;
}

export interface OrderItem {
    product_id: string;
    product_name: string;
    variant?: string;
    quantity: number;
    price: number;
}

export interface BusinessCard {
    id: string;
    user_id: string;
    slug: string;
    data: BusinessCardData;
    views: number;
    expires_at?: string;
}

export interface BusinessCardData {
    name: string;
    title?: string;
    company?: string;
    bio?: string;
    photo?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
}
