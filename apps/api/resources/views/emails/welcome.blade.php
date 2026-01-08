<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selamat Datang di Shifr Asia</title>
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
        
        <div class="emoji" style="text-align: center;">🎉</div>
        
        <h1>Selamat Datang, {{ $user->name }}!</h1>
        
        <div class="content">
            <p>Terima kasih telah bergabung dengan <strong>Shifr Asia</strong>! Anda sekarang siap untuk membangun bisnis online Anda dengan mudah.</p>
            
            <div class="features">
                <p><strong>Yang bisa Anda lakukan:</strong></p>
                <div class="feature-item">🏪 Buat toko online dalam hitungan menit</div>
                <div class="feature-item">💳 Digital Business Card profesional</div>
                <div class="feature-item">🔗 Link-in-Bio untuk semua sosial media</div>
                <div class="feature-item">📊 Analytics untuk tracking performa</div>
                <div class="feature-item">🎁 Sistem promo dan diskon</div>
            </div>
            
            <p style="text-align: center;">
                <a href="{{ $dashboardUrl }}" class="button">Mulai Sekarang →</a>
            </p>
        </div>
        
        <div class="footer">
            <p>Ada pertanyaan? Balas email ini atau hubungi kami.</p>
            <p>&copy; {{ date('Y') }} Shifr Asia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
