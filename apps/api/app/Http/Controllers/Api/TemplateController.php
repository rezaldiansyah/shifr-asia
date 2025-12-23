<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\JsonResponse;

class TemplateController extends Controller
{
    /**
     * Get all active store templates.
     */
    public function index(): JsonResponse
    {
        $templates = Template::active()
            ->storeTemplates()
            ->orderBy('sort_order')
            ->get([
                'id',
                'name',
                'slug',
                'description',
                'preview_url',
                'thumbnail',
                'is_premium',
            ]);

        return response()->json([
            'templates' => $templates,
        ]);
    }

    /**
     * Get template detail.
     */
    public function show(Template $template): JsonResponse
    {
        return response()->json([
            'template' => $template,
        ]);
    }
}
