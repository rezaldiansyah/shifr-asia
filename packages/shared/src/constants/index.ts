// App constants

export const APP_CONFIG = {
    name: 'Shifr Asia',
    tagline: 'Jualan lebih mudah, lebih profesional, penuh amanah.',
    supportEmail: 'support@shifr.asia',
};

export const PRICING = {
    ecommerce: {
        free: { products: 9, price: 0, duration: 3 }, // 3 months trial
        starter: { products: 5, price: 35000 },
        growth: { products: 50, price: 89000 },
        pro: { products: 499, price: 199000 },
    },
    webProfile: {
        subdomain: 50000, // per month
        customDomainSetup: 59000, // one-time
    },
    businessCard: {
        standard: 89000, // per year
    },
};

export const TIER_LIMITS = {
    free: 9,
    starter: 5,
    growth: 50,
    pro: 499,
};

// Blacklist categories for Syariah compliance
export const BLACKLISTED_CATEGORIES = [
    'rokok',
    'cigarettes',
    'tobacco',
    'alkohol',
    'alcohol',
    'minuman-keras',
    'liquor',
    'wine',
    'beer',
];
