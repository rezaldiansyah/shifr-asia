<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Langganan Aktif - Shifr Asia</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #7c3aed;
        }
        h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .emoji {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            color: #ffffff !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        .subscription-card {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            color: white;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .subscription-card h2 {
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .subscription-card p {
            margin: 5px 0;
            opacity: 0.9;
        }
        .features {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .feature-item {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .feature-item:last-child {
            border-bottom: none;
        }
        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Shifr Asia</div>
        </div>
        
        <div class="emoji" style="text-align: center;">🚀</div>
        
        <h1>Langganan Anda Aktif!</h1>
        
        <div class="content">
            <p>Hai <strong>{{ $user->name }}</strong>,</p>
            
            <p>Selamat! Pembayaran Anda berhasil dan langganan premium Anda sekarang aktif.</p>
            
            <div class="subscription-card">
                <h2>{{ $subscription->tier_config['name'] ?? 'Premium' }}</h2>
                @if($payment)
                <p>💰 {{ $payment->formatted_amount ?? 'Rp 0' }}</p>
                @endif
                <p>📅 Aktif hingga: {{ $subscription->expires_at?->format('d M Y') ?? '-' }}</p>
            </div>
            
            <div class="features">
                <p><strong>Fitur yang Anda dapatkan:</strong></p>
                <div class="feature-item">✅ Produk tak terbatas (sesuai tier)</div>
                <div class="feature-item">✅ Akses semua template</div>
                <div class="feature-item">✅ Custom domain</div>
                <div class="feature-item">✅ Analytics lengkap</div>
                <div class="feature-item">✅ Prioritas support</div>
            </div>
            
            <p style="text-align: center;">
                <a href="{{ $dashboardUrl }}" class="button">Kelola Langganan →</a>
            </p>
        </div>
        
        <div class="footer">
            <p>Terima kasih atas kepercayaan Anda!</p>
            <p>&copy; {{ date('Y') }} Shifr Asia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
