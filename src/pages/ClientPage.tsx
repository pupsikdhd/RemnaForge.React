import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService, type Device } from '../services/api';

// Extracted Subcomponents
import { ClientHeader } from '../components/client/ClientHeader';
import { ClientAuthCard } from '../components/client/ClientAuthCard';
import { ClientPortal } from '../components/client/ClientPortal';
import { ClientQrModal } from '../components/client/ClientQrModal';

export default function ClientPage() {
    const { slug: urlSlug } = useParams<{ slug?: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Slug management
    const [slug, setSlug] = useState(urlSlug || '');
    const [inputSlug, setInputSlug] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(!!urlSlug);

    // Data states
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // QR & Guide states
    const [showQrModal, setShowQrModal] = useState(false);
    const [guideTab, setGuideTab] = useState<'android' | 'ios' | 'desktop'>('android');

    // Helper: show toast notification
    const showStatus = (text: string, type: 'success' | 'error') => {
        setStatusMessage({ text, type });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    // Helper: format active date
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Just now';
        const date = new Date(dateString);
        return date.toLocaleDateString(navigator.language, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper: get subscription link
    const getSubscriptionLink = () => {
        const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
        return `${baseUrl.replace(/\/$/, '')}/sub/${slug}`;
    };

    // Helper: copy to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showStatus(t('client.copiedSub'), 'success');
    };

    // Main action: load devices from API
    const loadClientDevices = async () => {
        setLoading(true);
        try {
            const data = await apiService.getPublicDevices(slug);
            setDevices(Array.isArray(data) ? data : (data.devices || []));
        } catch (err: any) {
            console.error('Error loading devices:', err);
            showStatus(t('client.notFoundDesc'), 'error');
            if (err.response?.status === 404) {
                setIsAuthorized(false);
                if (urlSlug) {
                    navigate('/client');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // Main action: login submit
    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputSlug.trim()) return;

        let parsedSlug = inputSlug.trim();
        if (parsedSlug.includes('/sub/')) {
            parsedSlug = parsedSlug.substring(parsedSlug.lastIndexOf('/sub/') + 5);
        } else if (parsedSlug.includes('/client/')) {
            parsedSlug = parsedSlug.substring(parsedSlug.lastIndexOf('/client/') + 8);
        }

        if (parsedSlug.includes('?')) {
            parsedSlug = parsedSlug.split('?')[0];
        }

        setSlug(parsedSlug);
        setIsAuthorized(true);
        navigate(`/client/${parsedSlug}`);
    };

    // Main action: revoke device
    const handleRevokeDevice = async (deviceId: string) => {
        if (!window.confirm(t('client.revokeConfirm'))) return;

        setActionLoading(true);
        try {
            await apiService.deletePublicDevice(slug, deviceId);
            showStatus(t('client.revokeSuccess'), 'success');
            const data = await apiService.getPublicDevices(slug);
            setDevices(Array.isArray(data) ? data : (data.devices || []));
        } catch (err) {
            showStatus('Failed to revoke device connection', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Trigger load on slug authorize
    useEffect(() => {
        if (isAuthorized && slug) {
            loadClientDevices();
        }
    }, [isAuthorized, slug]);

    // Handle URL change directly
    useEffect(() => {
        if (urlSlug) {
            setSlug(urlSlug);
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false);
            setSlug('');
        }
    }, [urlSlug]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/3 dark:bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-blue-500/3 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <ClientHeader
                isAuthorized={isAuthorized}
                onReset={() => {
                    setIsAuthorized(false);
                    setSlug('');
                    navigate('/client');
                }}
                onNavigateHome={() => navigate('/')}
            />

            {/* Notifications */}
            <AnimatePresence>
                {statusMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border ${
                            statusMessage.type === 'success'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-900/50 dark:text-emerald-300'
                                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/90 dark:border-red-900/50 dark:text-red-300'
                        }`}
                    >
                        {statusMessage.type === 'success' ? (
                            <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{statusMessage.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-4 py-12 z-10">
                {!isAuthorized ? (
                    <ClientAuthCard
                        inputSlug={inputSlug}
                        setInputSlug={setInputSlug}
                        onSubmit={handleLoginSubmit}
                    />
                ) : loading ? (
                    <div className="flex flex-col justify-center items-center py-20 text-slate-400">
                        <RefreshCw className="w-10 h-10 animate-spin text-emerald-500 mb-2" />
                        <p className="text-sm font-medium">{t('common.loading')}</p>
                    </div>
                ) : (
                    <ClientPortal
                        slug={slug}
                        devices={devices}
                        actionLoading={actionLoading}
                        getSubscriptionLink={getSubscriptionLink}
                        onCopySubscriptionLink={() => copyToClipboard(getSubscriptionLink())}
                        onOpenQrModal={() => setShowQrModal(true)}
                        onRevokeDevice={handleRevokeDevice}
                        formatDate={formatDate}
                        guideTab={guideTab}
                        setGuideTab={setGuideTab}
                    />
                )}
            </main>

            <AnimatePresence>
                {showQrModal && slug && (
                    <ClientQrModal
                        isOpen={showQrModal}
                        onClose={() => setShowQrModal(false)}
                        subscriptionLink={getSubscriptionLink()}
                        onCopy={() => copyToClipboard(getSubscriptionLink())}
                    />
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="text-center py-6 text-xs text-slate-400 dark:text-slate-600 mt-auto border-t border-slate-200 dark:border-slate-900/50 bg-white/20 dark:bg-slate-950/20 backdrop-blur-sm">
                <p>&copy; {new Date().getFullYear()} {t('common.brand')}. {t('common.copyright')}</p>
            </footer>
        </div>
    );
}
