import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, LogOut } from 'lucide-react';
import ThemeLanguageSelector from '../ThemeLanguageSelector';
import { useAuth } from '../../context/AuthContext';

export const AdminHeader: React.FC = () => {
    const { t } = useTranslation();
    const { logout } = useAuth();

    return (
        <header className="border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                        {t('common.brand')}{' '}
                        <span className="text-xs text-emerald-500 font-semibold uppercase tracking-wider ml-1 px-1.5 py-0.5 border border-emerald-500/20 rounded bg-emerald-500/5">
                            Admin
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeLanguageSelector />
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 dark:border-red-500/10 hover:border-red-500/30 transition-all rounded-xl cursor-pointer"
                        title={t('common.logout')}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('common.logout')}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
