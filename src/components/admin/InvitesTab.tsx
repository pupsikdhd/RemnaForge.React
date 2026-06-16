import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Key, Copy, Trash2 } from 'lucide-react';
import type { Invite } from '../../services/api';

interface InvitesTabProps {
    invites: Invite[];
    onAddInviteClick: () => void;
    onDeleteInvite: (invite: Invite) => void;
    onCopyLink: (text: string, msg: string) => void;
    getInviteRegisterLink: (id: string) => string;
    formatDate: (d: string | null) => string;
    isExpired: (d: string | null) => boolean;
}

export const InvitesTab: React.FC<InvitesTabProps> = ({
    invites,
    onAddInviteClick,
    onDeleteInvite,
    onCopyLink,
    getInviteRegisterLink,
    formatDate,
    isExpired,
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t('admin.invites.title')}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Generate invite codes to allow new admin registrations when public sign-ups are disabled
                    </p>
                </div>
                <button
                    onClick={onAddInviteClick}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-xl hover:bg-emerald-300 shadow-md shadow-emerald-400/10 active:scale-98 transition-all cursor-pointer"
                >
                    <Plus className="w-4.5 h-4.5" />
                    <span>{t('admin.invites.addBtn')}</span>
                </button>
            </div>

            {invites.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Key className="w-10 h-10 text-slate-400/50 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No invite codes generated yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <table className="w-full min-w-[800px] text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                <th className="px-4 py-3.5">{t('admin.invites.table.code')}</th>
                                <th className="px-4 py-3.5">{t('admin.invites.table.description')}</th>
                                <th className="px-4 py-3.5">{t('admin.invites.table.created')}</th>
                                <th className="px-4 py-3.5">{t('admin.invites.table.expires')}</th>
                                <th className="px-4 py-3.5 text-right">{t('admin.invites.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {invites.map((invite) => {
                                const isInvExpired = isExpired(invite.expireAt);
                                return (
                                    <tr
                                        key={invite.id}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                                    >
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-slate-900 dark:text-white select-all">
                                                    {invite.id}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        onCopyLink(
                                                            getInviteRegisterLink(invite.id),
                                                            t('admin.invites.copied')
                                                        )
                                                    }
                                                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 cursor-pointer"
                                                    title="Copy registration link"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                                            {invite.description || <span className="text-slate-400">—</span>}
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-500 text-xs">
                                            {formatDate(invite.createdAt)}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs">
                                            <span
                                                className={`px-2 py-0.5 rounded-full font-medium ${
                                                    isInvExpired
                                                        ? 'bg-red-500/10 text-red-500 border border-red-500/10'
                                                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                                                }`}
                                            >
                                                {formatDate(invite.expireAt)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <button
                                                onClick={() => onDeleteInvite(invite)}
                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-red-500 hover:text-red-600 cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
