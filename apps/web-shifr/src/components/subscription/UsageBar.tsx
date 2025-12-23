'use client';

interface UsageBarProps {
    used: number;
    limit: number;
    label?: string;
    showPercentage?: boolean;
}

export default function UsageBar({
    used,
    limit,
    label = 'Produk',
    showPercentage = true,
}: UsageBarProps) {
    const percentage = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
    const remaining = Math.max(0, limit - used);
    const isNearLimit = percentage >= 80;
    const isAtLimit = percentage >= 100;

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">{label}</span>
                    <span className={`text-sm font-semibold ${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-gray-800'}`}>
                        {used} / {limit}
                    </span>
                </div>
            )}

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${isAtLimit
                            ? 'bg-red-500'
                            : isNearLimit
                                ? 'bg-orange-400'
                                : 'bg-green-500'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex justify-between items-center mt-1">
                {showPercentage && (
                    <span className={`text-xs ${isAtLimit ? 'text-red-500' : 'text-gray-500'}`}>
                        {percentage.toFixed(0)}% terpakai
                    </span>
                )}
                <span className={`text-xs ${isAtLimit ? 'text-red-500' : 'text-gray-500'}`}>
                    {isAtLimit ? 'Limit tercapai' : `${remaining} tersisa`}
                </span>
            </div>
        </div>
    );
}
