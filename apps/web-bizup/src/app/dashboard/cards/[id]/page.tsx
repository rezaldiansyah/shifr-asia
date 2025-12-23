'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api, BusinessCard, BusinessCardData, Achievement, Experience, Education } from '@/lib/api';

const SOCIAL_PLATFORMS = [
    { id: 'instagram', label: 'Instagram', placeholder: 'username' },
    { id: 'linkedin', label: 'LinkedIn', placeholder: 'username atau URL' },
    { id: 'twitter', label: 'Twitter/X', placeholder: 'username' },
    { id: 'facebook', label: 'Facebook', placeholder: 'username atau URL' },
    { id: 'tiktok', label: 'TikTok', placeholder: 'username' },
    { id: 'youtube', label: 'YouTube', placeholder: 'channel URL' },
    { id: 'github', label: 'GitHub', placeholder: 'username' },
    { id: 'whatsapp', label: 'WhatsApp', placeholder: '08123456789' },
];

const COLOR_PRESETS = [
    { name: 'Blue Ocean', from: '#374da0', to: '#2cbbbc' },
    { name: 'Purple Dream', from: '#667eea', to: '#764ba2' },
    { name: 'Sunset', from: '#f093fb', to: '#f5576c' },
    { name: 'Forest', from: '#11998e', to: '#38ef7d' },
    { name: 'Dark Mode', from: '#232526', to: '#414345' },
    { name: 'Gold', from: '#c9920e', to: '#d4a529' },
];

export default function EditCardPage() {
    const router = useRouter();
    const params = useParams();
    const cardId = Number(params.id);

    const [card, setCard] = useState<BusinessCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [qrUrl, setQrUrl] = useState('');
    const [activeTab, setActiveTab] = useState<'basic' | 'cv' | 'design'>('basic');

    const [formData, setFormData] = useState<BusinessCardData>({
        name: '',
        title: '',
        company: '',
        bio: '',
        email: '',
        phone: '',
        website: '',
        theme: 'default',
        background_color: '#374da0,#2cbbbc',
        social_links: [],
        custom_links: [],
        about: '',
        achievements: [],
        experience: [],
        education: [],
        skills: [],
        languages: [],
    });

    const [slug, setSlug] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [newSkill, setNewSkill] = useState('');
    const [newLanguage, setNewLanguage] = useState('');

    useEffect(() => {
        loadCard();
    }, [cardId]);

    const loadCard = async () => {
        try {
            const response = await api.getBusinessCard(cardId);
            const cardData = response.data;
            setCard(cardData);
            setFormData({
                ...cardData.data,
                background_color: cardData.data.background_color || '#374da0,#2cbbbc',
            });
            setSlug(cardData.slug);
            setIsActive(cardData.is_active);

            const qrResponse = await api.getCardQRCode(cardId);
            setQrUrl(qrResponse.data.qr_url);
        } catch (error) {
            setError('Kartu tidak ditemukan');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof BusinessCardData, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Social Links
    const addSocialLink = (platform: string) => {
        if (formData.social_links?.find(l => l.platform === platform)) return;
        setFormData(prev => ({ ...prev, social_links: [...(prev.social_links || []), { platform, url: '' }] }));
    };
    const updateSocialLink = (platform: string, url: string) => {
        setFormData(prev => ({ ...prev, social_links: prev.social_links?.map(l => l.platform === platform ? { ...l, url } : l) }));
    };
    const removeSocialLink = (platform: string) => {
        setFormData(prev => ({ ...prev, social_links: prev.social_links?.filter(l => l.platform !== platform) }));
    };

    // Achievements
    const addAchievement = () => setFormData(prev => ({ ...prev, achievements: [...(prev.achievements || []), { title: '', desc: '', year: undefined, organization: '' }] }));
    const updateAchievement = (index: number, field: keyof Achievement, value: string | number | undefined) => {
        setFormData(prev => ({ ...prev, achievements: prev.achievements?.map((a, i) => i === index ? { ...a, [field]: value } : a) }));
    };
    const removeAchievement = (index: number) => setFormData(prev => ({ ...prev, achievements: prev.achievements?.filter((_, i) => i !== index) }));

    // Experience
    const addExperience = () => setFormData(prev => ({ ...prev, experience: [...(prev.experience || []), { role: '', company: '', start_year: new Date().getFullYear(), end_year: undefined, is_current: false, desc: '' }] }));
    const updateExperience = (index: number, field: keyof Experience, value: string | number | boolean | undefined) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience?.map((e, i) => {
                if (i !== index) return e;
                const updated = { ...e, [field]: value };
                if (field === 'is_current' && value === true) {
                    updated.end_year = undefined;
                }
                return updated;
            })
        }));
    };
    const removeExperience = (index: number) => setFormData(prev => ({ ...prev, experience: prev.experience?.filter((_, i) => i !== index) }));

    // Education
    const addEducation = () => setFormData(prev => ({ ...prev, education: [...(prev.education || []), { degree: '', school: '', graduation_year: new Date().getFullYear() }] }));
    const updateEducation = (index: number, field: keyof Education, value: string | number) => {
        setFormData(prev => ({ ...prev, education: prev.education?.map((e, i) => i === index ? { ...e, [field]: value } : e) }));
    };
    const removeEducation = (index: number) => setFormData(prev => ({ ...prev, education: prev.education?.filter((_, i) => i !== index) }));

    // Skills & Languages
    const addSkill = () => { if (!newSkill.trim()) return; setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill.trim()] })); setNewSkill(''); };
    const removeSkill = (index: number) => setFormData(prev => ({ ...prev, skills: prev.skills?.filter((_, i) => i !== index) }));
    const addLanguage = () => { if (!newLanguage.trim()) return; setFormData(prev => ({ ...prev, languages: [...(prev.languages || []), newLanguage.trim()] })); setNewLanguage(''); };
    const removeLanguage = (index: number) => setFormData(prev => ({ ...prev, languages: prev.languages?.filter((_, i) => i !== index) }));

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const response = await api.uploadCardPhoto(cardId, file);
            setFormData(prev => ({ ...prev, photo: response.data.photo_url }));
        } catch (error) {
            console.error('Failed to upload photo:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.updateBusinessCard(cardId, { data: formData, slug, is_active: isActive });
            router.push('/dashboard');
        } catch (err: unknown) {
            const error = err as { message?: string };
            setError(error.message || 'Gagal menyimpan kartu.');
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); alert('Link berhasil disalin!'); };

    const getGradient = () => {
        const [from, to] = (formData.background_color || '#374da0,#2cbbbc').split(',');
        return `linear-gradient(135deg, ${from} 0%, ${to || from} 100%)`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#374da0] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500">Memuat kartu...</p>
                </div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error || 'Kartu tidak ditemukan'}</p>
                <Link href="/dashboard" className="btn btn-primary">Kembali</Link>
            </div>
        );
    }

    const cardUrl = `https://bizup.id/${slug}`;
    const tabs = [{ id: 'basic', label: 'Profil' }, { id: 'cv', label: 'CV' }, { id: 'design', label: 'Desain' }];

    return (
        <div className="max-w-5xl mx-auto animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Kartu</h1>
                    <p className="text-gray-500">Perbarui kartu bisnis digital Anda</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === tab.id ? 'border-[#374da0] text-[#374da0]' : 'border-transparent text-gray-500'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* BASIC TAB */}
                        {activeTab === 'basic' && (
                            <>
                                {/* Photo */}
                                <div className="card">
                                    <h2 className="text-lg font-semibold mb-4">Foto Profil</h2>
                                    <div className="flex items-center gap-4">
                                        {formData.photo ? (
                                            <img src={formData.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: getGradient() }}>
                                                {formData.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <label className="btn btn-outline text-sm cursor-pointer">
                                            Upload Foto
                                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="card">
                                    <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Nama *</label>
                                            <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="input" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Jabatan</label>
                                            <input type="text" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="input" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Perusahaan</label>
                                            <input type="text" value={formData.company || ''} onChange={(e) => handleInputChange('company', e.target.value)} className="input" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Bio Singkat</label>
                                            <textarea value={formData.bio || ''} onChange={(e) => handleInputChange('bio', e.target.value)} className="input min-h-[80px]" maxLength={300} />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="card">
                                    <h2 className="text-lg font-semibold mb-4">Kontak</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={formData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} className="input" /></div>
                                        <div><label className="block text-sm font-medium mb-1">Telepon</label><input type="tel" value={formData.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} className="input" /></div>
                                        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Website</label><input type="url" value={formData.website || ''} onChange={(e) => handleInputChange('website', e.target.value)} className="input" /></div>
                                    </div>
                                </div>

                                {/* Social */}
                                <div className="card">
                                    <h2 className="text-lg font-semibold mb-4">Social Media</h2>
                                    {formData.social_links?.map((link) => (
                                        <div key={link.platform} className="flex items-center gap-3 mb-3">
                                            <span className="w-24 text-sm font-medium capitalize">{link.platform}</span>
                                            <input type="text" value={link.url} onChange={(e) => updateSocialLink(link.platform, e.target.value)} className="input flex-1" />
                                            <button type="button" onClick={() => removeSocialLink(link.platform)} className="text-red-500">✕</button>
                                        </div>
                                    ))}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {SOCIAL_PLATFORMS.filter(p => !formData.social_links?.find(l => l.platform === p.id)).map((p) => (
                                            <button key={p.id} type="button" onClick={() => addSocialLink(p.id)} className="px-3 py-1 text-sm border rounded-full hover:border-[#374da0]">+ {p.label}</button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* CV TAB */}
                        {activeTab === 'cv' && (
                            <>
                                <div className="card">
                                    <h2 className="text-lg font-semibold mb-4">Tentang Saya</h2>
                                    <textarea value={formData.about || ''} onChange={(e) => handleInputChange('about', e.target.value)} className="input min-h-[120px]" placeholder="Ceritakan lebih detail tentang diri Anda..." />
                                </div>

                                {/* Achievements */}
                                <div className="card">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold">Prestasi</h2>
                                        <button type="button" onClick={addAchievement} className="btn btn-outline text-sm py-1">+ Tambah</button>
                                    </div>
                                    {formData.achievements?.map((ach, i) => (
                                        <div key={i} className="p-3 bg-gray-50 rounded-lg mb-3">
                                            <div className="flex justify-between mb-2">
                                                <input type="text" value={ach.title} onChange={(e) => updateAchievement(i, 'title', e.target.value)} className="input flex-1 mr-2" placeholder="Judul" />
                                                <button type="button" onClick={() => removeAchievement(i)} className="text-red-500">✕</button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input type="number" value={ach.year || ''} onChange={(e) => updateAchievement(i, 'year', e.target.value ? parseInt(e.target.value) : undefined)} className="input" placeholder="Tahun" min="1900" max="2099" />
                                                <input type="text" value={ach.organization || ''} onChange={(e) => updateAchievement(i, 'organization', e.target.value)} className="input" placeholder="Organisasi Pemberi" />
                                            </div>
                                            <textarea value={ach.desc} onChange={(e) => updateAchievement(i, 'desc', e.target.value)} className="input w-full text-sm" placeholder="Deskripsi..." rows={2} />
                                        </div>
                                    ))}
                                </div>

                                {/* Experience */}
                                <div className="card">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold">Pengalaman Kerja</h2>
                                        <button type="button" onClick={addExperience} className="btn btn-outline text-sm py-1">+ Tambah</button>
                                    </div>
                                    {formData.experience?.map((exp, i) => (
                                        <div key={i} className="p-3 bg-gray-50 rounded-lg mb-3">
                                            <div className="flex justify-end mb-2"><button type="button" onClick={() => removeExperience(i)} className="text-red-500 text-sm">Hapus</button></div>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input type="text" value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} className="input" placeholder="Jabatan" />
                                                <input type="text" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} className="input" placeholder="Perusahaan" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Tahun Mulai</label>
                                                    <input type="number" value={exp.start_year || ''} onChange={(e) => updateExperience(i, 'start_year', parseInt(e.target.value) || new Date().getFullYear())} className="input w-full" placeholder="2020" min="1900" max="2099" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Tahun Selesai</label>
                                                    <input type="number" value={exp.end_year || ''} onChange={(e) => updateExperience(i, 'end_year', e.target.value ? parseInt(e.target.value) : undefined)} className="input w-full" placeholder="2023" min="1900" max="2099" disabled={exp.is_current} />
                                                </div>
                                            </div>
                                            <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                                <input type="checkbox" checked={exp.is_current || false} onChange={(e) => updateExperience(i, 'is_current', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#374da0] focus:ring-[#374da0]" />
                                                <span className="text-sm text-gray-600">Masih bekerja di sini</span>
                                            </label>
                                            <textarea value={exp.desc} onChange={(e) => updateExperience(i, 'desc', e.target.value)} className="input w-full text-sm" placeholder="Deskripsi..." rows={2} />
                                        </div>
                                    ))}
                                </div>

                                {/* Education */}
                                <div className="card">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold">Pendidikan</h2>
                                        <button type="button" onClick={addEducation} className="btn btn-outline text-sm py-1">+ Tambah</button>
                                    </div>
                                    {formData.education?.map((edu, i) => (
                                        <div key={i} className="p-3 bg-gray-50 rounded-lg mb-3">
                                            <div className="flex justify-end mb-2"><button type="button" onClick={() => removeEducation(i)} className="text-red-500 text-sm">Hapus</button></div>
                                            <input type="text" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} className="input w-full mb-2" placeholder="Gelar/Jurusan" />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="text" value={edu.school} onChange={(e) => updateEducation(i, 'school', e.target.value)} className="input" placeholder="Institusi" />
                                                <input type="number" value={edu.graduation_year || ''} onChange={(e) => updateEducation(i, 'graduation_year', parseInt(e.target.value) || new Date().getFullYear())} className="input" placeholder="Tahun Lulus" min="1900" max="2099" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Skills */}
                                <div className="card">
                                    <h2 className="text-lg font-semibold mb-4">Keahlian</h2>
                                    <div className="flex gap-2 mb-3">
                                        <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="input flex-1" placeholder="Tambah keahlian..." />
                                        <button type="button" onClick={addSkill} className="btn btn-primary">+</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills?.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-[#374da0]/10 text-[#374da0] rounded-full text-sm flex items-center gap-2">{skill}<button type="button" onClick={() => removeSkill(i)}>✕</button></span>
                                        ))}
                                    </div>
                                </div>

                                {/* Languages */}
                                <div className="card">
                                    <h2 className="text-lg font-semibold mb-4">Bahasa</h2>
                                    <div className="flex gap-2 mb-3">
                                        <input type="text" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())} className="input flex-1" placeholder="Contoh: English - Fluent" />
                                        <button type="button" onClick={addLanguage} className="btn btn-primary">+</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.languages?.map((lang, i) => (
                                            <span key={i} className="px-3 py-1 bg-[#2cbbbc]/10 text-[#2cbbbc] rounded-full text-sm flex items-center gap-2">{lang}<button type="button" onClick={() => removeLanguage(i)}>✕</button></span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* DESIGN TAB */}
                        {activeTab === 'design' && (
                            <>
                                <div className="card">
                                    <h2 className="text-lg font-semibold mb-4">Warna Background</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                        {COLOR_PRESETS.map((color) => (
                                            <button key={color.name} type="button" onClick={() => handleInputChange('background_color', `${color.from},${color.to}`)} className={`p-4 rounded-xl text-white font-medium text-sm transition ${formData.background_color === `${color.from},${color.to}` ? 'ring-4 ring-offset-2 ring-[#374da0]' : ''}`} style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}>
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500">Warna Awal</label>
                                            <input type="color" value={formData.background_color?.split(',')[0] || '#374da0'} onChange={(e) => { const [, to] = (formData.background_color || '#374da0,#2cbbbc').split(','); handleInputChange('background_color', `${e.target.value},${to}`); }} className="w-16 h-10 rounded cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Warna Akhir</label>
                                            <input type="color" value={formData.background_color?.split(',')[1] || '#2cbbbc'} onChange={(e) => { const [from] = (formData.background_color || '#374da0,#2cbbbc').split(','); handleInputChange('background_color', `${from},${e.target.value}`); }} className="w-16 h-10 rounded cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium mb-2">Preview:</label>
                                        <div className="h-32 rounded-xl flex items-center justify-center text-white font-semibold" style={{ background: getGradient() }}>{formData.name || 'Nama Anda'}</div>
                                    </div>
                                </div>

                                <div className="card">
                                    <h2 className="text-lg font-semibold mb-4">Pengaturan</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">URL Kartu</label>
                                            <div className="flex items-center">
                                                <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l-lg text-gray-500">bizup.id/</span>
                                                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="input rounded-l-none" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Status Kartu</p>
                                                <p className="text-sm text-gray-500">Kartu nonaktif tidak bisa diakses</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#374da0]"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex gap-4">
                            <Link href="/dashboard" className="btn btn-outline flex-1">Batal</Link>
                            <button type="submit" disabled={saving} className="btn btn-primary flex-1">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="card text-center">
                        <h3 className="font-semibold mb-4">QR Code</h3>
                        {qrUrl && <img src={qrUrl} alt="QR Code" className="w-40 h-40 mx-auto rounded-lg" />}
                        <div className="mt-4 space-y-2">
                            <button onClick={() => copyToClipboard(cardUrl)} className="btn btn-outline w-full text-sm">📋 Salin Link</button>
                            <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full text-sm">👁 Lihat Kartu</a>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="font-semibold mb-2">Statistik</h3>
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            <span className="text-2xl font-bold">{card.views}</span>
                            <span className="text-sm">views</span>
                        </div>
                    </div>

                    {/* Preview Card */}
                    <div className="card p-0 overflow-hidden">
                        <div className="h-16 flex items-end justify-center pb-2" style={{ background: getGradient() }}>
                            {formData.photo ? (
                                <img src={formData.photo} alt="" className="w-16 h-16 rounded-full border-2 border-white object-cover" />
                            ) : (
                                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center text-white text-xl font-bold" style={{ background: getGradient() }}>
                                    {formData.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="text-center p-4 pt-10">
                            <p className="font-bold">{formData.name || 'Nama'}</p>
                            {formData.title && <p className="text-sm" style={{ color: formData.background_color?.split(',')[0] }}>{formData.title}</p>}
                            {formData.company && <p className="text-xs text-gray-500">{formData.company}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
