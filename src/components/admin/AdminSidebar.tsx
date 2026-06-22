import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Layers, Key, Settings, KeyRound, ShieldCheck } from 'lucide-react';

export type TabType = 'clients' | 'subscriptions' | 'invites' | 'apikeys' | 'totp' | 'settings';

interface AdminSidebarProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
    const { t } = useTranslation();

    const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
        { id: 'clients', icon: <Users className="w-4.5 h-4.5 shrink-0" />, label: t('admin.tabs.clients') },
        { id: 'subscriptions', icon: <Layers className="w-4.5 h-4.5 shrink-0" />, label: t('admin.tabs.subscriptions') },
        { id: 'invites', icon: <Key className="w-4.5 h-4.5 shrink-0" />, label: t('admin.tabs.invites') },
        { id: 'apikeys', icon: <KeyRound className="w-4.5 h-4.5 shrink-0" />, label: t('admin.tabs.apikeys') || 'API Tokens' },
        { id: 'totp', icon: <ShieldCheck className="w-4.5 h-4.5 shrink-0" />, label: t('admin.tabs.totp') || '2FA Security' },
        { id: 'settings', icon: <Settings className="w-4.5 h-4.5 shrink-0" />, label: t('admin.tabs.settings') },
    ];

    return (
        <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all cursor-pointer whitespace-nowrap flex-1 md:flex-initial ${
                        activeTab === tab.id
                            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/15'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
        </aside>
    );
};
