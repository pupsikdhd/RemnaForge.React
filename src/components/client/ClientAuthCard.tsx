import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface ClientAuthCardProps {
    inputSlug: string;
    setInputSlug: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ClientAuthCard: React.FC<ClientAuthCardProps> = ({
    inputSlug,
    setInputSlug,
    onSubmit,
}) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 w-full max-w-md p-8 rounded-3xl shadow-xl transition-all"
        >
            <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {t('client.title')}
                </h2>
                <p className="text-sm text-slate-500 mt-2">{t('client.notFoundDesc')}</p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Subscription Key / Link
                    </label>
                    <input
                        type="text"
                        required
                        value={inputSlug}
                        onChange={(e) => setInputSlug(e.target.value)}
                        placeholder={t('client.inputPlaceholder')}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-950 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-850 dark:text-slate-100"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-400 hover:bg-emerald-350 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-400/20 active:scale-98 transition-all cursor-pointer"
                >
                    <span>{t('client.btnEnter')}</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </form>
        </motion.div>
    );
};
