import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import ThemeLanguageSelector from '../ThemeLanguageSelector';

interface ClientHeaderProps {
    isAuthorized: boolean;
    onReset: () => void;
    onNavigateHome: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
    isAuthorized,
    onReset,
    onNavigateHome,
}) => {
    const { t } = useTranslation();

    return (
        <header className="border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                        {t('common.brand')}{' '}
                        <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider ml-1 px-1.5 py-0.5 border border-emerald-500/20 rounded bg-emerald-500/5">
                            Client
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeLanguageSelector />
                    {isAuthorized && (
                        <button
                            onClick={onReset}
                            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors rounded-xl cursor-pointer"
                        >
                            Change Subscription
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
