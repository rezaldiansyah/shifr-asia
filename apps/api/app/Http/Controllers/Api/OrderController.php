<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Create new order (public - for buyers)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
            'customer_name' => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'customer_address' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
        ]);

        // Get product and store
        $product = Product::findOrFail($validated['product_id']);
        $store = Store::with('user')->findOrFail($validated['store_id']);

        // Verify product belongs to store
        if ($product->store_id !== $store->id) {
            return response()->json([
                'message' => 'Produk tidak ditemukan di toko ini',
            ], 422);
        }

        $quantity = $validated['quantity'] ?? 1;
        $subtotal = $product->price * $quantity;

        // Create order
        $order = Order::create([
            'store_id' => $store->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'] ?? null,
            'customer_address' => $validated['customer_address'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'subtotal' => $subtotal,
            'discount' => 0,
            'total' => $subtotal,
            'status' => 'pending',
        ]);

        // Send notifications (WhatsApp + Email) via NotificationService
        $notificationResults = $this->notificationService->notifyNewOrder($order);

        $order->load(['product', 'store']);

        return response()->json([
            'message' => 'Pesanan berhasil dibuat',
            'order' => $order,
            'notification_status' => $notificationResults,
        ], 201);
    }

    /**
     * List orders for seller's store
     */
    public function index(Request $request): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())->first();

        if (!$store) {
            return response()->json([
                'orders' => [],
                'message' => 'Toko belum dibuat',
            ]);
        }

        $query = Order::where('store_id', $store->id)
            ->with(['product:id,name,price,images'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(20);

        return response()->json([
            'orders' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Get order detail
     */
    public function show(int $id): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        $order = Order::where('store_id', $store->id)
            ->with(['product', 'store'])
            ->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'order' => $order,
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        $order = Order::where('store_id', $store->id)->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,paid,shipped,completed,cancelled',
        ]);

        $order->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Status pesanan diperbarui',
            'order' => $order,
        ]);
    }

    /**
     * Get order by order number (public - for buyers to check status)
     */
    public function showByOrderNumber(string $orderNumber): JsonResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['product:id,name,price,images', 'store:id,name'])
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'order' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'status_label' => $order->status_label,
                'product' => $order->product,
                'store_name' => $order->store->name,
                'total' => $order->formatted_total,
                'created_at' => $order->created_at,
            ],
        ]);
    }
}
