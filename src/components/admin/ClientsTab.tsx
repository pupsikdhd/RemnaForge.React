import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Users, Tv, Copy, QrCode, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import type { Client, Subscription } from '../../services/api';

interface ClientsTabProps {
    clients: Client[];
    subscriptions: Subscription[];
    searchQuery: string;
    onSearchQueryChange: (q: string) => void;
    onAddClientClick: () => void;
    onEditClientClick: (client: Client) => void;
    onDeleteClient: (client: Client) => void;
    onOpenDevices: (client: Client) => void;
    onOpenQr: (client: Client) => void;
    onCopyLink: (text: string, msg: string) => void;
    getSubscriptionLink: (slug: string) => string;
    getClientPortalLink: (slug: string) => string;
    formatDate: (d: string | null) => string;
    isExpired: (d: string | null) => boolean;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({
    clients,
    subscriptions,
    searchQuery,
    onSearchQueryChange,
    onAddClientClick,
    onEditClientClick,
    onDeleteClient,
    onOpenDevices,
    onOpenQr,
    onCopyLink,
    getSubscriptionLink,
    getClientPortalLink,
    formatDate,
    isExpired,
}) => {
    const { t } = useTranslation();

    const filteredClients = clients.filter((c) => {
        const nameMatch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const subName = subscriptions.find((s) => s.subscriptionId === c.subscriptionId)?.name || '';
        const subMatch = subName.toLowerCase().includes(searchQuery.toLowerCase());
        const slugMatch = c.slug.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || subMatch || slugMatch;
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t('admin.clients.title')}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage client keys, access durations, and device profiles
                    </p>
                </div>
                <button
                    onClick={onAddClientClick}
                    disabled={subscriptions.length === 0}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-xl hover:bg-emerald-300 shadow-md shadow-emerald-400/10 active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4.5 h-4.5" />
                    <span>{t('admin.clients.addBtn')}</span>
                </button>
            </div>

            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    placeholder={t('admin.clients.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-950 dark:focus:bg-slate-950 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-slate-100"
                />
            </div>

            {/* Clients Table */}
            {filteredClients.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Users className="w-10 h-10 text-slate-400/50 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">
                        {subscriptions.length === 0
                            ? 'First add a Subscription Upstream'
                            : 'No clients found'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <table className="w-full min-w-[950px] text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                <th className="px-4 py-3.5">{t('admin.clients.table.name')}</th>
                                <th className="px-4 py-3.5">{t('admin.clients.table.subscription')}</th>
                                <th className="px-4 py-3.5">{t('admin.clients.table.expireAt')}</th>
                                <th className="px-4 py-3.5 text-center">{t('admin.clients.table.deviceLimit')}</th>
                                <th className="px-4 py-3.5 text-right">{t('admin.clients.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {filteredClients.map((client) => {
                                const isClientExp = isExpired(client.expireAt);
                                const clientSubName =
                                    subscriptions.find((s) => s.subscriptionId === client.subscriptionId)?.name || 'N/A';

                                return (
                                    <tr
                                        key={client.id}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                                    >
                                        <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                                            <div className="flex flex-col">
                                                <span>{client.name || 'Unnamed Client'}</span>
                                                <span className="text-[10px] font-mono text-slate-400 select-all">
                                                    {client.slug}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/5 text-blue-500 border border-blue-500/10">
                                                {clientSubName}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    isClientExp
                                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                }`}
                                            >
                                                {isClientExp ? t('admin.clients.expired') : t('admin.clients.active')}{' '}
                                                • {formatDate(client.expireAt)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center text-slate-700 dark:text-slate-300 font-medium">
                                            {client.deviceLimit === 0 ? (
                                                <span className="text-emerald-500">{t('admin.clients.unlimited')}</span>
                                            ) : (
                                                client.deviceLimit
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                {/* Active Devices */}
                                                <button
                                                    onClick={() => onOpenDevices(client)}
                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                                                    title="View devices"
                                                >
                                                    <Tv className="w-4 h-4" />
                                                </button>

                                                {/* Copy Config Link */}
                                                <button
                                                    onClick={() =>
                                                        onCopyLink(
                                                            getSubscriptionLink(client.slug),
                                                            t('admin.clients.subLinkCopied')
                                                        )
                                                    }
                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                                                    title={t('admin.clients.copyLink')}
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>

                                                {/* Show QR code */}
                                                <button
                                                    onClick={() => onOpenQr(client)}
                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                                                    title={t('admin.clients.qrCode')}
                                                >
                                                    <QrCode className="w-4 h-4" />
                                                </button>

                                                {/* Open Client Portal */}
                                                <a
                                                    href={getClientPortalLink(client.slug)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
                                                    title={t('admin.clients.openClientPage')}
                                                >
                                                    <ExternalLink className="w-4 h-4 text-emerald-500" />
                                                </a>

                                                {/* Edit */}
                                                <button
                                                    onClick={() => onEditClientClick(client)}
                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-blue-500 hover:text-blue-600 cursor-pointer"
                                                    title="Edit client"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => onDeleteClient(client)}
                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-red-500 hover:text-red-600 cursor-pointer"
                                                    title="Delete client"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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
