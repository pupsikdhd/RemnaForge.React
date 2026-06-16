import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Subscription } from '../../services/api';

interface SubModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingSub: Subscription | null;
    onSave: (payload: {
        name: string;
        url: string;
        hwid: string | null;
        x_DEVICE_OS: string | null;
        x_VER_OS: string | null;
        useR_AGENT: string | null;
        x_APP_VERSION: string | null;
        accepT_ENCODING: string | null;
    }) => Promise<void>;
    actionLoading: boolean;
}

export const SubModal: React.FC<SubModalProps> = ({
    isOpen,
    onClose,
    editingSub,
    onSave,
    actionLoading,
}) => {
    const { t } = useTranslation();

    const [form, setForm] = useState({
        name: '',
        url: '',
        hwid: '',
        x_DEVICE_OS: '',
        x_VER_OS: '',
        useR_AGENT: '',
        x_APP_VERSION: '',
        accepT_ENCODING: '',
    });
    const [showAdvancedHeaders, setShowAdvancedHeaders] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (editingSub) {
                setForm({
                    name: editingSub.name || '',
                    url: editingSub.url || '',
                    hwid: editingSub.hwid || '',
                    x_DEVICE_OS: editingSub.x_DEVICE_OS || '',
                    x_VER_OS: editingSub.x_VER_OS || '',
                    useR_AGENT: editingSub.useR_AGENT || '',
                    x_APP_VERSION: editingSub.x_APP_VERSION || '',
                    accepT_ENCODING: editingSub.accepT_ENCODING || '',
                });
                setShowAdvancedHeaders(
                    !!(
                        editingSub.hwid ||
                        editingSub.x_DEVICE_OS ||
                        editingSub.x_VER_OS ||
                        editingSub.useR_AGENT ||
                        editingSub.x_APP_VERSION ||
                        editingSub.accepT_ENCODING
                    )
                );
            } else {
                setForm({
                    name: '',
                    url: '',
                    hwid: '',
                    x_DEVICE_OS: '',
                    x_VER_OS: '',
                    useR_AGENT: '',
                    x_APP_VERSION: '',
                    accepT_ENCODING: '',
                });
                setShowAdvancedHeaders(false);
            }
        }
    }, [isOpen, editingSub]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: form.name,
            url: form.url,
            hwid: form.hwid || null,
            x_DEVICE_OS: form.x_DEVICE_OS || null,
            x_VER_OS: form.x_VER_OS || null,
            useR_AGENT: form.useR_AGENT || null,
            x_APP_VERSION: form.x_APP_VERSION || null,
            accepT_ENCODING: form.accepT_ENCODING || null,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {editingSub
                            ? t('admin.subscriptions.modal.editTitle')
                            : t('admin.subscriptions.modal.addTitle')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t('admin.subscriptions.modal.nameLabel')}
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. Netherlands Premium Server"
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100"
                        />
                    </div>

                    {/* Upstream Subscription URL */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t('admin.subscriptions.modal.urlLabel')}
                        </label>
                        <input
                            type="url"
                            required
                            value={form.url}
                            onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                            placeholder="e.g. https://your-original-vless-panel/sub/xxx"
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100 font-mono text-xs"
                        />
                    </div>

                    {/* Expandable Headers customization */}
                    <div className="border border-slate-150 dark:border-slate-800 rounded-2xl p-4 mt-2">
                        <button
                            type="button"
                            onClick={() => setShowAdvancedHeaders(!showAdvancedHeaders)}
                            className="flex items-center justify-between w-full text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                            <span>{t('admin.subscriptions.modal.headersSection')}</span>
                            <span className="text-emerald-500 text-xs font-bold">
                                {showAdvancedHeaders ? 'Hide' : 'Customize'}
                            </span>
                        </button>

                        <AnimatePresence>
                            {showAdvancedHeaders && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-150 dark:border-slate-850 overflow-hidden"
                                >
                                    {/* HWID */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-slate-500">
                                            {t('admin.subscriptions.modal.hwidLabel')}
                                        </span>
                                        <input
                                            type="text"
                                            value={form.hwid}
                                            onChange={(e) =>
                                                setForm((prev) => ({ ...prev, hwid: e.target.value }))
                                            }
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none text-slate-800 dark:text-slate-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Device OS */}
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-slate-500">
                                                {t('admin.subscriptions.modal.deviceOsLabel')}
                                            </span>
                                            <input
                                                type="text"
                                                value={form.x_DEVICE_OS}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        x_DEVICE_OS: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g. android"
                                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none text-slate-800 dark:text-slate-200"
                                            />
                                        </div>

                                        {/* Ver OS */}
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-slate-500">
                                                {t('admin.subscriptions.modal.verOsLabel')}
                                            </span>
                                            <input
                                                type="text"
                                                value={form.x_VER_OS}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        x_VER_OS: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g. 13"
                                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none text-slate-800 dark:text-slate-200"
                                            />
                                        </div>
                                    </div>

                                    {/* User Agent */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-slate-500">
                                            {t('admin.subscriptions.modal.userAgentLabel')}
                                        </span>
                                        <input
                                            type="text"
                                            value={form.useR_AGENT}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    useR_AGENT: e.target.value,
                                                }))
                                            }
                                            placeholder="e.g. v2rayNG/1.8.5"
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none text-slate-850 dark:text-slate-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* App Version */}
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-slate-500">
                                                {t('admin.subscriptions.modal.appVerLabel')}
                                            </span>
                                            <input
                                                type="text"
                                                value={form.x_APP_VERSION}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        x_APP_VERSION: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g. 1.8.5"
                                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none text-slate-800 dark:text-slate-200"
                                            />
                                        </div>

                                        {/* Accept Encoding */}
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-slate-500">
                                                {t('admin.subscriptions.modal.acceptEncLabel')}
                                            </span>
                                            <input
                                                type="text"
                                                value={form.accepT_ENCODING}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        accepT_ENCODING: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g. gzip"
                                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none text-slate-800 dark:text-slate-200"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="submit"
                        disabled={actionLoading}
                        className="mt-4 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-350 rounded-xl shadow-lg shadow-emerald-400/10 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {actionLoading
                            ? 'Saving...'
                            : editingSub
                            ? t('admin.subscriptions.modal.saveBtn')
                            : t('admin.subscriptions.modal.createBtn')}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
