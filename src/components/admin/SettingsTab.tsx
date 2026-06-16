import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleRight, ToggleLeft } from 'lucide-react';
import type { SystemSettings } from '../../services/api';

interface SettingsTabProps {
    settingsForm: SystemSettings;
    setSettingsForm: React.Dispatch<React.SetStateAction<SystemSettings>>;
    onSaveSettings: (e: React.FormEvent) => Promise<void>;
    actionLoading: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
    settingsForm,
    setSettingsForm,
    onSaveSettings,
    actionLoading,
}) => {
    const { t } = useTranslation();

    return (
        <form onSubmit={onSaveSettings} className="flex flex-col gap-8 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t('admin.settings.title')}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Configure proxy routing cache thresholds and account registration restrictions
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {/* Toggle Registration */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {t('admin.settings.allowReg')}
                        </span>
                        <span className="text-xs text-slate-500">
                            Allow new users to sign up as administrators without an invite code
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            setSettingsForm((prev) => ({
                                ...prev,
                                allowRegistration: !prev.allowRegistration,
                            }))
                        }
                        className="text-emerald-500 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                        {settingsForm.allowRegistration ? (
                            <ToggleRight className="w-12 h-12" />
                        ) : (
                            <ToggleLeft className="w-12 h-12 text-slate-400" />
                        )}
                    </button>
                </div>

                {/* Toggle Caching */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {t('admin.settings.useCaching')}
                        </span>
                        <span className="text-xs text-slate-500">
                            Enable caching for upstream VLESS subscription configs to minimize load
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            setSettingsForm((prev) => ({
                                ...prev,
                                useCaching: !prev.useCaching,
                            }))
                        }
                        className="text-emerald-500 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                        {settingsForm.useCaching ? (
                            <ToggleRight className="w-12 h-12" />
                        ) : (
                            <ToggleLeft className="w-12 h-12 text-slate-400" />
                        )}
                    </button>
                </div>

                {/* Cache duration */}
                <AnimatePresence>
                    {settingsForm.useCaching && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
                        >
                            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {t('admin.settings.cacheDuration')}
                            </label>
                            <input
                                type="number"
                                value={settingsForm.cacheDurationInMinutes}
                                onChange={(e) =>
                                    setSettingsForm((prev) => ({
                                        ...prev,
                                        cacheDurationInMinutes: Number(e.target.value),
                                    }))
                                }
                                min="1"
                                className="w-full max-w-[200px] px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button
                type="submit"
                disabled={actionLoading}
                className="self-start px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-400/15 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
                {actionLoading ? 'Saving...' : t('admin.settings.saveBtn')}
            </button>
        </form>
    );
};
