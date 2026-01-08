<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Pembayaran - Shifr Asia</title>
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
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #7c3aed;
        }
        .invoice-badge {
            display: inline-block;
            background-color: #dcfce7;
            color: #166534;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-top: 10px;
        }
        h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .invoice-details {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #6b7280;
        }
        .detail-value {
            font-weight: 600;
            text-align: right;
        }
        .total-row {
            background-color: #7c3aed;
            color: white;
            margin: -20px -20px -20px -20px;
            margin-top: 20px;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .company-info {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Shifr Asia</div>
            <div class="invoice-badge">✅ LUNAS</div>
        </div>
        
        <h1>Invoice Pembayaran</h1>
        
        <p>Hai <strong>{{ $user->name }}</strong>,</p>
        <p>Terima kasih atas pembayaran Anda. Berikut adalah detail invoice:</p>
        
        <div class="invoice-details">
            <div class="detail-row">
                <span class="detail-label">Invoice ID</span>
                <span class="detail-value">#{{ $payment->id }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Tanggal</span>
                <span class="detail-value">{{ $payment->paid_at?->format('d M Y, H:i') ?? now()->format('d M Y, H:i') }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Paket</span>
                <span class="detail-value">{{ $payment->tier_name ?? 'Premium' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Periode</span>
                <span class="detail-value">{{ $payment->period === 'yearly' ? 'Tahunan' : 'Bulanan' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Metode Pembayaran</span>
                <span class="detail-value">{{ $payment->metadata['payment_method'] ?? 'Online Payment' }}</span>
            </div>
            
            <div class="total-row">
                <div class="detail-row" style="border-bottom: none; color: white;">
                    <span style="font-size: 18px;">TOTAL</span>
                    <span class="detail-value" style="font-size: 24px;">{{ $payment->formatted_amount }}</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Invoice ini adalah bukti pembayaran yang sah.</p>
            <div class="company-info">
                <p>
                    <strong>Shifr Asia</strong><br>
                    Email: support@shifr.asia<br>
                    Website: https://shifr.asia
                </p>
            </div>
            <p>&copy; {{ date('Y') }} Shifr Asia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
