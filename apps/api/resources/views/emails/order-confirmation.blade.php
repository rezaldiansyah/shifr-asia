<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Pesanan - {{ $store_name ?? 'Toko' }}</title>
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
        .store-name {
            font-size: 24px;
            font-weight: bold;
            color: #7c3aed;
        }
        .order-badge {
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-top: 10px;
        }
        h1 {
            color: #1f2937;
            font-size: 22px;
            margin-bottom: 20px;
        }
        .emoji {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .order-details {
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
        .product-box {
            background-color: #f3e8ff;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        .product-name {
            font-size: 18px;
            font-weight: bold;
            color: #7c3aed;
        }
        .total-box {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            color: white;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .total-box h3 {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .total-box .amount {
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
        }
        .info-box {
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
        .powered-by {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="store-name">{{ $store_name ?? 'Toko Online' }}</div>
            <div class="order-badge">📦 Pesanan #{{ $order_number }}</div>
        </div>
        
        <div class="emoji" style="text-align: center;">🛍️</div>
        
        <h1>Terima Kasih, {{ $customer_name }}!</h1>
        
        <p>Pesanan Anda telah kami terima. Penjual akan segera memproses dan menghubungi Anda.</p>
        
        <div class="order-details">
            <h3 style="margin-top: 0;">Detail Pesanan</h3>
            
            <div class="product-box">
                <div class="product-name">{{ $product_name }}</div>
                @if(isset($quantity) && $quantity > 1)
                <div style="color: #6b7280; font-size: 14px;">Qty: {{ $quantity }}</div>
                @endif
            </div>
            
            <div class="detail-row">
                <span class="detail-label">No. Pesanan</span>
                <span class="detail-value">#{{ $order_number }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Nama</span>
                <span class="detail-value">{{ $customer_name }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Telepon</span>
                <span class="detail-value">{{ $customer_phone }}</span>
            </div>
            @if(!empty($customer_address))
            <div class="detail-row">
                <span class="detail-label">Alamat</span>
                <span class="detail-value">{{ $customer_address }}</span>
            </div>
            @endif
            @if(!empty($notes))
            <div class="detail-row">
                <span class="detail-label">Catatan</span>
                <span class="detail-value">{{ $notes }}</span>
            </div>
            @endif
        </div>
        
        <div class="total-box">
            <h3>TOTAL PEMBAYARAN</h3>
            <div class="amount">{{ $total }}</div>
        </div>
        
        <div class="info-box">
            <strong>📱 Apa selanjutnya?</strong><br>
            Penjual akan menghubungi Anda melalui WhatsApp untuk konfirmasi dan detail pembayaran.
        </div>
        
        <div class="footer">
            <p>Ada pertanyaan? Hubungi penjual langsung via WhatsApp.</p>
            <div class="powered-by">
                Powered by <strong>Shifr Asia</strong>
            </div>
        </div>
    </div>
</body>
</html>
