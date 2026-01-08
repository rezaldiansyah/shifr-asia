<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Langganan Akan Berakhir - Shifr Asia</title>
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
        .urgency-urgent {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
            color: white;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .urgency-warning {
            background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
            color: white;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .urgency-info {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .urgency-card h2 {
            margin: 0 0 10px 0;
            font-size: 48px;
        }
        .urgency-card p {
            margin: 5px 0;
            font-size: 18px;
        }
        .warning-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            border-radius: 0 8px 8px 0;
            margin: 20px 0;
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
        
        <h1>⏰ Langganan Anda Akan Berakhir</h1>
        
        <div class="content">
            <p>Hai <strong>{{ $user->name }}</strong>,</p>
            
            <p>Langganan <strong>{{ $subscription->tier_config['name'] ?? 'Premium' }}</strong> Anda akan berakhir dalam:</p>
            
            <div class="urgency-{{ $urgency }} urgency-card">
                <h2>{{ $daysRemaining }}</h2>
                <p>{{ $daysRemaining == 1 ? 'Hari Lagi' : 'Hari Lagi' }}</p>
            </div>
            
            @if($urgency === 'urgent')
            <div class="warning-box">
                <strong>⚠️ Perhatian!</strong><br>
                Jika tidak diperpanjang, akses ke fitur premium akan terhenti dan beberapa data mungkin dibatasi.
            </div>
            @endif
            
            <p>Perpanjang sekarang untuk tetap menikmati semua fitur premium:</p>
            
            <ul>
                <li>Produk tak terbatas</li>
                <li>Custom domain</li>
                <li>Analytics lengkap</li>
                <li>Prioritas support</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="{{ $renewUrl }}" class="button">Perpanjang Sekarang →</a>
            </p>
        </div>
        
        <div class="footer">
            <p>Butuh bantuan? Balas email ini.</p>
            <p>&copy; {{ date('Y') }} Shifr Asia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
