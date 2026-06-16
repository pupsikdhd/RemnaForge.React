import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Layers, Edit2, Trash2 } from 'lucide-react';
import type { Subscription } from '../../services/api';

interface SubscriptionsTabProps {
    subscriptions: Subscription[];
    onAddSubClick: () => void;
    onEditSubClick: (sub: Subscription) => void;
    onDeleteSub: (sub: Subscription) => void;
}

export const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
    subscriptions,
    onAddSubClick,
    onEditSubClick,
    onDeleteSub,
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t('admin.subscriptions.title')}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage upstream VLESS providers, subscriptions, and HTTP header profiles
                    </p>
                </div>
                <button
                    onClick={onAddSubClick}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-xl hover:bg-emerald-300 shadow-md shadow-emerald-400/10 active:scale-98 transition-all cursor-pointer"
                >
                    <Plus className="w-4.5 h-4.5" />
                    <span>{t('admin.subscriptions.addBtn')}</span>
                </button>
            </div>

            {subscriptions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Layers className="w-10 h-10 text-slate-400/50 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No upstream subscriptions added yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <table className="w-full min-w-[800px] text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                <th className="px-4 py-3.5">{t('admin.subscriptions.table.name')}</th>
                                <th className="px-4 py-3.5">{t('admin.subscriptions.table.url')}</th>
                                <th className="px-4 py-3.5">Headers Config</th>
                                <th className="px-4 py-3.5 text-right">{t('admin.subscriptions.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {subscriptions.map((sub) => (
                                <tr
                                    key={sub.subscriptionId}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                                >
                                    <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                                        {sub.name || 'Unnamed upstream'}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500 max-w-[200px] truncate select-all">
                                        {sub.url}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {sub.hwid && (
                                                <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
                                                    HWID
                                                </span>
                                            )}
                                            {sub.x_DEVICE_OS && (
                                                <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
                                                    OS
                                                </span>
                                            )}
                                            {sub.useR_AGENT && (
                                                <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
                                                    UA
                                                </span>
                                            )}
                                            {!sub.hwid && !sub.x_DEVICE_OS && !sub.useR_AGENT && (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEditSubClick(sub)}
                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-blue-500 hover:text-blue-600 cursor-pointer"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteSub(sub)}
                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-red-500 hover:text-red-600 cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
