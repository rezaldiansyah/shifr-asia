<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BusinessCardController extends Controller
{
    /**
     * List all business cards for authenticated user
     */
    public function index()
    {
        $cards = BusinessCard::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cards,
        ]);
    }

    /**
     * Create a new business card
     */
    public function store(Request $request)
    {
        $request->validate([
            'data' => 'required|array',
            'data.name' => 'required|string|max:255',
            'data.title' => 'nullable|string|max:255',
            'data.company' => 'nullable|string|max:255',
            'data.bio' => 'nullable|string|max:1000',
            'data.photo' => 'nullable|string',
            'data.email' => 'nullable|email|max:255',
            'data.phone' => 'nullable|string|max:50',
            'data.website' => 'nullable|url|max:255',
            'data.social_links' => 'nullable|array',
            'data.custom_links' => 'nullable|array',
            'data.theme' => 'nullable|string|max:50',
            'slug' => 'nullable|string|max:100|unique:business_cards,slug',
        ]);

        $card = BusinessCard::create([
            'user_id' => Auth::id(),
            'slug' => $request->slug ?: null,
            'data' => $request->data,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Business card created successfully',
            'data' => $card,
        ], 201);
    }

    /**
     * Get a specific business card
     */
    public function show(BusinessCard $businessCard)
    {
        // Ensure user owns this card
        if ($businessCard->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $businessCard,
        ]);
    }

    /**
     * Update a business card
     */
    public function update(Request $request, BusinessCard $businessCard)
    {
        // Ensure user owns this card
        if ($businessCard->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'data' => 'sometimes|array',
            'data.name' => 'sometimes|string|max:255',
            'data.title' => 'nullable|string|max:255',
            'data.company' => 'nullable|string|max:255',
            'data.bio' => 'nullable|string|max:1000',
            'data.photo' => 'nullable|string',
            'data.email' => 'nullable|email|max:255',
            'data.phone' => 'nullable|string|max:50',
            'data.website' => 'nullable|url|max:255',
            'data.social_links' => 'nullable|array',
            'data.custom_links' => 'nullable|array',
            'data.theme' => 'nullable|string|max:50',
            'slug' => 'nullable|string|max:100|unique:business_cards,slug,' . $businessCard->id,
            'is_active' => 'sometimes|boolean',
        ]);

        // Merge data if partial update
        if ($request->has('data')) {
            $currentData = $businessCard->data ?? [];
            $newData = array_merge($currentData, $request->data);
            $businessCard->data = $newData;
        }

        if ($request->has('slug')) {
            $businessCard->slug = $request->slug;
        }

        if ($request->has('is_active')) {
            $businessCard->is_active = $request->is_active;
        }

        $businessCard->save();

        return response()->json([
            'success' => true,
            'message' => 'Business card updated successfully',
            'data' => $businessCard,
        ]);
    }

    /**
     * Delete a business card
     */
    public function destroy(BusinessCard $businessCard)
    {
        // Ensure user owns this card
        if ($businessCard->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $businessCard->delete();

        return response()->json([
            'success' => true,
            'message' => 'Business card deleted successfully',
        ]);
    }

    /**
     * Upload photo for business card
     */
    public function uploadPhoto(Request $request, BusinessCard $businessCard)
    {
        // Ensure user owns this card
        if ($businessCard->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'photo' => 'required|image|max:2048', // Max 2MB
        ]);

        $path = $request->file('photo')->store('cards/photos', 'public');

        // Update card data with photo path
        $data = $businessCard->data ?? [];
        $data['photo'] = '/storage/' . $path;
        $businessCard->data = $data;
        $businessCard->save();

        return response()->json([
            'success' => true,
            'message' => 'Photo uploaded successfully',
            'data' => [
                'photo_url' => asset('storage/' . $path),
            ],
        ]);
    }

    /**
     * Generate QR code URL for card
     */
    public function qrCode(BusinessCard $businessCard)
    {
        // Ensure user owns this card
        if ($businessCard->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Use QR code API (Google Charts or similar)
        $cardUrl = config('app.bizup_url', 'https://bizup.id') . '/' . $businessCard->slug;
        $qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($cardUrl);

        return response()->json([
            'success' => true,
            'data' => [
                'card_url' => $cardUrl,
                'qr_url' => $qrUrl,
            ],
        ]);
    }
}
