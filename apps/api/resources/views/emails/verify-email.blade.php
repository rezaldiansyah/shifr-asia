<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email - Shifr Asia</title>
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
        .note {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            border-radius: 0 8px 8px 0;
            margin: 20px 0;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .link-text {
            word-break: break-all;
            color: #7c3aed;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Shifr Asia</div>
        </div>
        
        <div class="emoji" style="text-align: center;">✉️</div>
        
        <h1>Verifikasi Email Anda</h1>
        
        <div class="content">
            <p>Hai <strong>{{ $user->name }}</strong>,</p>
            
            <p>Silakan klik tombol di bawah untuk memverifikasi alamat email Anda:</p>
            
            <p style="text-align: center;">
                <a href="{{ $verifyUrl }}" class="button">Verifikasi Email →</a>
            </p>
            
            <div class="note">
                <strong>⏰ Link ini akan kadaluarsa dalam 24 jam.</strong><br>
                Jika Anda tidak membuat akun di Shifr Asia, abaikan email ini.
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
                Jika tombol tidak berfungsi, copy dan paste link berikut ke browser Anda:<br>
                <span class="link-text">{{ $verifyUrl }}</span>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Shifr Asia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
