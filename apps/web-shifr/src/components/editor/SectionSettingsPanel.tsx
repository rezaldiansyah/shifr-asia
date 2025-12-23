'use client';

import { Section, SectionType } from '@/lib/api';
import { useState, useEffect } from 'react';

interface SectionSettingsPanelProps {
    section: Section;
    sectionTypes: SectionType[];
    onUpdate: (section: Section) => void;
}

export default function SectionSettingsPanel({
    section,
    sectionTypes,
    onUpdate,
}: SectionSettingsPanelProps) {
    const [localContent, setLocalContent] = useState(section.content);
    const [localStyles, setLocalStyles] = useState(section.styles || {});

    useEffect(() => {
        setLocalContent(section.content);
        setLocalStyles(section.styles || {});
    }, [section.id]);

    const sectionType = sectionTypes.find((t) => t.type === section.type);

    const handleContentChange = (key: string, value: unknown) => {
        const newContent = { ...localContent, [key]: value };
        setLocalContent(newContent);
        onUpdate({ ...section, content: newContent });
    };

    const handleStyleChange = (key: string, value: string) => {
        const newStyles = { ...localStyles, [key]: value };
        setLocalStyles(newStyles);
        onUpdate({ ...section, styles: newStyles });
    };

    const renderContentFields = () => {
        switch (section.type) {
            case 'hero':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input
                                type="text"
                                value={(localContent.title as string) || ''}
                                onChange={(e) => handleContentChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul</label>
                            <textarea
                                value={(localContent.subtitle as string) || ''}
                                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teks Tombol</label>
                                <input
                                    type="text"
                                    value={(localContent.buttonText as string) || ''}
                                    onChange={(e) => handleContentChange('buttonText', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link Tombol</label>
                                <input
                                    type="text"
                                    value={(localContent.buttonLink as string) || ''}
                                    onChange={(e) => handleContentChange('buttonLink', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                />
                            </div>
                        </div>
                    </>
                );

            case 'about':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input
                                type="text"
                                value={(localContent.title as string) || ''}
                                onChange={(e) => handleContentChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                value={(localContent.description as string) || ''}
                                onChange={(e) => handleContentChange('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                    </>
                );

            case 'products':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input
                                type="text"
                                value={(localContent.title as string) || ''}
                                onChange={(e) => handleContentChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul</label>
                            <input
                                type="text"
                                value={(localContent.subtitle as string) || ''}
                                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Produk</label>
                                <input
                                    type="number"
                                    value={(localContent.limit as number) || 6}
                                    onChange={(e) => handleContentChange('limit', parseInt(e.target.value) || 6)}
                                    min={1}
                                    max={12}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kolom</label>
                                <select
                                    value={(localContent.columns as number) || 3}
                                    onChange={(e) => handleContentChange('columns', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                >
                                    <option value={2}>2 Kolom</option>
                                    <option value={3}>3 Kolom</option>
                                    <option value={4}>4 Kolom</option>
                                </select>
                            </div>
                        </div>
                    </>
                );

            case 'cta':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input
                                type="text"
                                value={(localContent.title as string) || ''}
                                onChange={(e) => handleContentChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul</label>
                            <textarea
                                value={(localContent.subtitle as string) || ''}
                                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teks Tombol</label>
                                <input
                                    type="text"
                                    value={(localContent.buttonText as string) || ''}
                                    onChange={(e) => handleContentChange('buttonText', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link Tombol</label>
                                <input
                                    type="text"
                                    value={(localContent.buttonLink as string) || ''}
                                    onChange={(e) => handleContentChange('buttonLink', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                />
                            </div>
                        </div>
                    </>
                );

            case 'contact':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input
                                type="text"
                                value={(localContent.title as string) || ''}
                                onChange={(e) => handleContentChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul</label>
                            <input
                                type="text"
                                value={(localContent.subtitle as string) || ''}
                                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={(localContent.showWhatsApp as boolean) || false}
                                    onChange={(e) => handleContentChange('showWhatsApp', e.target.checked)}
                                    className="rounded border-gray-300 text-main focus:ring-main"
                                />
                                <span className="text-sm text-gray-700">Tampilkan WhatsApp</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={(localContent.showEmail as boolean) || false}
                                    onChange={(e) => handleContentChange('showEmail', e.target.checked)}
                                    className="rounded border-gray-300 text-main focus:ring-main"
                                />
                                <span className="text-sm text-gray-700">Tampilkan Email</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={(localContent.showAddress as boolean) || false}
                                    onChange={(e) => handleContentChange('showAddress', e.target.checked)}
                                    className="rounded border-gray-300 text-main focus:ring-main"
                                />
                                <span className="text-sm text-gray-700">Tampilkan Alamat</span>
                            </label>
                        </div>
                    </>
                );

            case 'features':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input
                                type="text"
                                value={(localContent.title as string) || ''}
                                onChange={(e) => handleContentChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                            <p>Fitur items dapat diedit melalui panel advanced (coming soon)</p>
                        </div>
                    </>
                );

            case 'gallery':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input
                                type="text"
                                value={(localContent.title as string) || ''}
                                onChange={(e) => handleContentChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kolom</label>
                            <select
                                value={(localContent.columns as number) || 3}
                                onChange={(e) => handleContentChange('columns', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            >
                                <option value={2}>2 Kolom</option>
                                <option value={3}>3 Kolom</option>
                                <option value={4}>4 Kolom</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                            <p>Upload gambar akan tersedia di versi berikutnya</p>
                        </div>
                    </>
                );

            case 'testimonial':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                            <input
                                type="text"
                                value={(localContent.title as string) || ''}
                                onChange={(e) => handleContentChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                        </div>
                        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                            <p>Testimoni items dapat diedit melalui panel advanced (coming soon)</p>
                        </div>
                    </>
                );

            default:
                return (
                    <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                        <p>Editor untuk section type &quot;{section.type}&quot; belum tersedia</p>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {sectionType?.name || section.type}
                </h3>
                <p className="text-sm text-gray-500">{sectionType?.description}</p>
            </div>

            {/* Content Fields */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Konten</h4>
                {renderContentFields()}
            </div>

            {/* Style Fields */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-700">Gaya</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warna Background</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={localStyles.backgroundColor || '#ffffff'}
                                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={localStyles.backgroundColor || '#ffffff'}
                                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warna Teks</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={localStyles.textColor || '#1f2937'}
                                onChange={(e) => handleStyleChange('textColor', e.target.value)}
                                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={localStyles.textColor || '#1f2937'}
                                onChange={(e) => handleStyleChange('textColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
