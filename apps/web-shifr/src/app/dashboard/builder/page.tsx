'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAuth } from '@/contexts/AuthContext';
import { api, Section, SectionType, Product } from '@/lib/api';
import SortableSectionItem from '@/components/editor/SortableSectionItem';
import SectionSettingsPanel from '@/components/editor/SectionSettingsPanel';
import SectionPreview from '@/components/editor/SectionPreview';

export default function WebsiteBuilderPage() {
    const router = useRouter();
    const { isLoading: authLoading, isAuthenticated } = useAuth();

    const [sections, setSections] = useState<Section[]>([]);
    const [sectionTypes, setSectionTypes] = useState<SectionType[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [storeName, setStoreName] = useState('');
    const [storeSlug, setStoreSlug] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');

    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const loadData = async () => {
        try {
            // First, check if section types exist (this should always work)
            let typesRes;
            try {
                typesRes = await api.getSectionTypes();
                setSectionTypes(typesRes.types || []);
            } catch {
                console.warn('Failed to load section types');
                setSectionTypes([]);
            }

            // Then check if store exists
            let sectionsRes;
            try {
                sectionsRes = await api.getStoreSections();
                if (!sectionsRes.store) {
                    setError('Anda belum membuat toko. Silakan buat toko terlebih dahulu.');
                    setIsLoading(false);
                    return;
                }
                setSections(sectionsRes.sections || []);
                setStoreName(sectionsRes.store.name || '');
                setStoreSlug(sectionsRes.store.slug || '');
            } catch (err: unknown) {
                const error = err as { status?: number; message?: string };
                if (error.status === 404 || error.message?.includes('Toko belum')) {
                    setError('Anda belum membuat toko. Silakan buat toko terlebih dahulu.');
                } else {
                    setError('Gagal memuat data sections.');
                }
                setIsLoading(false);
                return;
            }

            // Load products for preview
            try {
                const productsRes = await api.getProducts();
                setProducts(productsRes.products || []);
            } catch {
                console.warn('Failed to load products');
                setProducts([]);
            }

            // Load store preview for additional data
            try {
                const previewRes = await api.getStorePreview();
                if (previewRes.store) {
                    setStoreDescription(previewRes.store.description || '');
                    setWhatsappNumber(previewRes.store.settings?.whatsapp_number || '');
                }
            } catch {
                console.warn('Failed to load store preview');
            }

        } catch (err) {
            console.error('Error loading data:', err);
            setError('Gagal memuat data. Pastikan Anda sudah membuat toko.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);

                const reordered = arrayMove(items, oldIndex, newIndex);
                // Update order numbers
                return reordered.map((item, index) => ({ ...item, order: index }));
            });
            setHasUnsavedChanges(true);
        }
    };

    const handleSectionUpdate = useCallback((updatedSection: Section) => {
        setSections((prev) =>
            prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
        );
        setHasUnsavedChanges(true);
    }, []);

    const handleToggleSection = (sectionId: string) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId ? { ...s, enabled: !s.enabled } : s
            )
        );
        setHasUnsavedChanges(true);
    };

    const handleDeleteSection = async (sectionId: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus section ini?')) return;

        setSections((prev) => prev.filter((s) => s.id !== sectionId));
        if (selectedSectionId === sectionId) {
            setSelectedSectionId(null);
        }
        setHasUnsavedChanges(true);
    };

    const handleAddSection = async (type: string) => {
        try {
            const res = await api.addSection(type);
            setSections(res.sections);
            setShowAddModal(false);
            setSelectedSectionId(res.section.id);
        } catch (err) {
            console.error('Error adding section:', err);
            setError('Gagal menambah section');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await api.updateStoreSections(sections);
            setSuccess('Perubahan berhasil disimpan!');
            setHasUnsavedChanges(false);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error saving:', err);
            setError('Gagal menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    const selectedSection = sections.find((s) => s.id === selectedSectionId);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Memuat Website Builder...</p>
                </div>
            </div>
        );
    }

    // Show error screen if no store or loading failed
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Tidak Dapat Memuat Builder</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/dashboard/store"
                            className="bg-main hover:bg-main-hover text-white px-6 py-3 rounded-lg font-medium transition"
                        >
                            Buat Toko Sekarang
                        </Link>
                        <Link
                            href="/dashboard"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition"
                        >
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-fourth flex flex-col">
            {/* Top Bar */}
            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">
                        Website Builder
                    </h1>
                    {hasUnsavedChanges && (
                        <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded">
                            Belum disimpan
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Preview Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`px-3 py-1 rounded text-sm ${previewMode === 'desktop'
                                ? 'bg-white shadow text-gray-800'
                                : 'text-gray-500'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`px-3 py-1 rounded text-sm ${previewMode === 'mobile'
                                ? 'bg-white shadow text-gray-800'
                                : 'text-gray-500'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>

                    {/* View Live */}
                    <a
                        href={`/store/${storeSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Lihat Toko
                    </a>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasUnsavedChanges}
                        className="bg-main hover:bg-main-hover disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Simpan
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border-b border-green-200 text-green-700 px-4 py-2 text-sm">
                    {success}
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Section List */}
                <aside className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-semibold text-gray-800">Sections</h2>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-8 h-8 bg-main hover:bg-main-hover text-white rounded-lg flex items-center justify-center transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Drag untuk reorder, klik untuk edit</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sections.map((s) => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {sections.map((section) => (
                                    <SortableSectionItem
                                        key={section.id}
                                        section={section}
                                        isSelected={selectedSectionId === section.id}
                                        onSelect={() => setSelectedSectionId(section.id)}
                                        onToggle={() => handleToggleSection(section.id)}
                                        onDelete={() => handleDeleteSection(section.id)}
                                        sectionTypes={sectionTypes}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {sections.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                <p className="mb-2">Belum ada section</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="text-main hover:text-main-hover text-sm"
                                >
                                    + Tambah Section
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Center - Preview */}
                <main className="flex-1 bg-gray-100 overflow-auto p-6">
                    <div
                        className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all ${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
                            }`}
                        style={{ minHeight: 600 }}
                    >
                        <SectionPreview
                            sections={sections}
                            products={products}
                            storeName={storeName}
                            storeDescription={storeDescription}
                            whatsappNumber={whatsappNumber}
                        />
                    </div>
                </main>

                {/* Right Panel - Settings */}
                <aside className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-800">Pengaturan Section</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {selectedSection ? (
                            <SectionSettingsPanel
                                section={selectedSection}
                                sectionTypes={sectionTypes}
                                onUpdate={handleSectionUpdate}
                            />
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                                <p>Pilih section untuk mengedit</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Add Section Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowAddModal(false)}
                >
                    <div
                        className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-gray-800">Tambah Section</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-2 gap-3">
                                {sectionTypes.map((type) => (
                                    <button
                                        key={type.type}
                                        onClick={() => handleAddSection(type.type)}
                                        className="p-4 border border-gray-200 rounded-xl hover:border-main hover:bg-main/5 transition text-left"
                                    >
                                        <h4 className="font-semibold text-gray-800 mb-1">{type.name}</h4>
                                        <p className="text-sm text-gray-500">{type.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
