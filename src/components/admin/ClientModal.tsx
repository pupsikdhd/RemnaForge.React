import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Client, Subscription } from '../../services/api';

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingClient: Client | null;
    subscriptions: Subscription[];
    onSave: (payload: {
        name: string | null;
        subscriptionId: string;
        expireAt: string;
        deviceLimit: number;
    }) => Promise<void>;
    actionLoading: boolean;
}

export const ClientModal: React.FC<ClientModalProps> = ({
    isOpen,
    onClose,
    editingClient,
    subscriptions,
    onSave,
    actionLoading,
}) => {
    const { t } = useTranslation();

    const calculateExpireDate = (preset: string) => {
        const now = new Date();
        switch (preset) {
            case '1m':
                now.setMonth(now.getMonth() + 1);
                return now.toISOString().slice(0, 16);
            case '3m':
                now.setMonth(now.getMonth() + 3);
                return now.toISOString().slice(0, 16);
            case '1y':
                now.setFullYear(now.getFullYear() + 1);
                return now.toISOString().slice(0, 16);
            case 'unlimited':
                return '2099-12-31T23:59';
            default:
                return '';
        }
    };

    const [form, setForm] = useState({
        name: '',
        subscriptionId: '',
        expireAt: '',
        deviceLimit: 3,
        expirePreset: '1m',
    });

    useEffect(() => {
        if (isOpen) {
            if (editingClient) {
                let expireVal = '';
                if (editingClient.expireAt) {
                    expireVal = new Date(editingClient.expireAt).toISOString().slice(0, 16);
                }
                setForm({
                    name: editingClient.name || '',
                    subscriptionId: editingClient.subscriptionId || '',
                    expireAt: expireVal,
                    deviceLimit: editingClient.deviceLimit,
                    expirePreset: 'custom',
                });
            } else {
                setForm({
                    name: '',
                    subscriptionId: subscriptions[0]?.subscriptionId || '',
                    expireAt: calculateExpireDate('1m'),
                    deviceLimit: 3,
                    expirePreset: '1m',
                });
            }
        }
    }, [isOpen, editingClient, subscriptions]);

    if (!isOpen) return null;

    const handleFormChange = (key: string, value: any) => {
        setForm((prev) => {
            const updated = { ...prev, [key]: value };
            if (key === 'expirePreset' && value !== 'custom') {
                updated.expireAt = calculateExpireDate(value);
            }
            return updated;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: form.name || null,
            subscriptionId: form.subscriptionId,
            expireAt: new Date(form.expireAt).toISOString(),
            deviceLimit: Number(form.deviceLimit),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {editingClient
                            ? t('admin.clients.modal.editTitle')
                            : t('admin.clients.modal.addTitle')}
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
                            {t('admin.clients.modal.nameLabel')}
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100"
                        />
                    </div>

                    {/* Upstream Subscription */}
                    {!editingClient && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {t('admin.clients.modal.subLabel')}
                            </label>
                            <select
                                value={form.subscriptionId}
                                onChange={(e) => handleFormChange('subscriptionId', e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100"
                            >
                                <option value="" disabled>
                                    Select Upstream...
                                </option>
                                {subscriptions.map((sub) => (
                                    <option key={sub.subscriptionId} value={sub.subscriptionId}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Expiration Preset & Date */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t('admin.clients.modal.expireLabel')}
                        </label>

                        <div className="grid grid-cols-4 gap-1.5 mb-1">
                            {['1m', '3m', '1y', 'unlimited'].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => handleFormChange('expirePreset', preset)}
                                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                                        form.expirePreset === preset
                                            ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {preset === 'unlimited'
                                        ? t('admin.clients.modal.expireUnlimited')
                                        : `+${preset.toUpperCase()}`}
                                </button>
                            ))}
                        </div>

                        <input
                            type="datetime-local"
                            value={form.expireAt}
                            onChange={(e) => {
                                handleFormChange('expirePreset', 'custom');
                                handleFormChange('expireAt', e.target.value);
                            }}
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100"
                        />
                    </div>

                    {/* Device Limit */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t('admin.clients.modal.limitLabel')}
                        </label>
                        <input
                            type="number"
                            value={form.deviceLimit}
                            onChange={(e) => handleFormChange('deviceLimit', e.target.value)}
                            min="0"
                            placeholder="3"
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={actionLoading}
                        className="mt-4 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-400/10 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {actionLoading
                            ? 'Saving...'
                            : editingClient
                            ? t('admin.clients.modal.saveBtn')
                            : t('admin.clients.modal.createBtn')}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
