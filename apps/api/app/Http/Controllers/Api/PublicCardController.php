<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessCard;
use Illuminate\Http\Request;

class PublicCardController extends Controller
{
    /**
     * Get public card by slug
     */
    public function show(string $slug)
    {
        $card = BusinessCard::where('slug', $slug)->first();

        if (!$card) {
            return response()->json([
                'success' => false,
                'message' => 'Card not found',
            ], 404);
        }

        if (!$card->isViewable()) {
            return response()->json([
                'success' => false,
                'message' => 'Card is not available',
            ], 404);
        }

        // Increment view count
        $card->incrementViews();

        return response()->json([
            'success' => true,
            'data' => [
                'slug' => $card->slug,
                'name' => $card->name,
                'title' => $card->title,
                'company' => $card->company,
                'bio' => $card->bio,
                'photo' => $card->photo,
                'email' => $card->email,
                'phone' => $card->phone,
                'website' => $card->website,
                'social_links' => $card->social_links,
                'custom_links' => $card->custom_links,
                'theme' => $card->theme,
                'background_color' => $card->data['background_color'] ?? null,
                'about' => $card->data['about'] ?? null,
                'achievements' => $card->data['achievements'] ?? [],
                'experience' => $card->data['experience'] ?? [],
                'education' => $card->data['education'] ?? [],
                'skills' => $card->data['skills'] ?? [],
                'languages' => $card->data['languages'] ?? [],
                'views' => $card->views,
            ],
        ]);
    }

    /**
     * Download vCard file
     */
    public function vcard(string $slug)
    {
        $card = BusinessCard::where('slug', $slug)->first();

        if (!$card) {
            return response()->json([
                'success' => false,
                'message' => 'Card not found',
            ], 404);
        }

        if (!$card->isViewable()) {
            return response()->json([
                'success' => false,
                'message' => 'Card is not available',
            ], 404);
        }

        $vcardContent = $card->toVCard();
        $filename = $card->slug . '.vcf';

        return response($vcardContent)
            ->header('Content-Type', 'text/vcard')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Get QR code for card
     */
    public function qrCode(string $slug)
    {
        $card = BusinessCard::where('slug', $slug)->first();

        if (!$card) {
            return response()->json([
                'success' => false,
                'message' => 'Card not found',
            ], 404);
        }

        $cardUrl = config('app.bizup_url', 'https://bizup.id') . '/' . $card->slug;
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
