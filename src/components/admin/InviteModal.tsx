import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: { description: string; expireDays: number }) => Promise<void>;
    actionLoading: boolean;
}

export const InviteModal: React.FC<InviteModalProps> = ({
    isOpen,
    onClose,
    onSave,
    actionLoading,
}) => {
    const { t } = useTranslation();

    const [form, setForm] = useState({
        description: '',
        expireDays: 7,
    });

    useEffect(() => {
        if (isOpen) {
            setForm({
                description: '',
                expireDays: 7,
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
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
                        {t('admin.invites.modal.title')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t('admin.invites.modal.descLabel')}
                        </label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="e.g. Invite for support admin team"
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100"
                        />
                    </div>

                    {/* Validity days */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t('admin.invites.modal.daysLabel')}
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={form.expireDays}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, expireDays: Number(e.target.value) }))
                            }
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={actionLoading}
                        className="mt-4 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-350 rounded-xl shadow-lg shadow-emerald-400/10 active:scale-98 transition-all cursor-pointer"
                    >
                        {actionLoading ? 'Creating...' : t('admin.invites.modal.createBtn')}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
