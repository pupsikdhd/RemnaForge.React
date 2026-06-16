import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft, ShieldAlert, Compass } from 'lucide-react';
import ThemeLanguageSelector from '../components/ThemeLanguageSelector';

export default function NotFound() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between items-center relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-300">
            
            {/* Фоновые декоративные свечения */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-blue-500/3 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Сетка на фоне */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

            {/* Шапка */}
            <header className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <ShieldAlert className="w-5 h-5 text-slate-950 font-bold" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                        {t('common.brand')}
                    </span>
                </div>
                <ThemeLanguageSelector />
            </header>

            {/* Главный контент */}
            <main className="flex-1 flex flex-col justify-center items-center px-4 text-center z-10 max-w-xl">
                
                {/* Большая анимированная иллюстрация 404 */}
                <div className="relative mb-8 select-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                            type: 'spring', 
                            stiffness: 100, 
                            damping: 15,
                            delay: 0.1 
                        }}
                        className="text-[120px] sm:text-[180px] font-extrabold tracking-widest text-slate-200/50 dark:text-slate-800/40 relative font-mono leading-none"
                    >
                        404
                        {/* Маска с градиентом поверх */}
                        <span className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-400 dark:from-white dark:to-slate-600 bg-clip-text text-transparent opacity-90 filter drop-shadow-[0_10px_20px_rgba(16,185,129,0.15)]">
                            404
                        </span>
                    </motion.div>

                    {/* Парящий компас по центру */}
                    <motion.div
                        animate={{ 
                            y: [0, -12, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                            duration: 6, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-xl dark:shadow-2xl shadow-emerald-500/10 text-emerald-400"
                    >
                        <Compass className="w-10 h-10 animate-[spin_20s_linear_infinite]" />
                    </motion.div>
                </div>

                {/* Текстовый блок */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        {t('notFound.title')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8 leading-relaxed max-w-md mx-auto">
                        {t('notFound.description')}
                    </p>
                </motion.div>

                {/* Блок действий */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer active:scale-95 rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4 text-emerald-400" />
                        {t('common.goBack')}
                    </button>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-xl hover:bg-emerald-300 shadow-lg shadow-emerald-400/15 transition-all cursor-pointer active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        {t('common.toHome')}
                    </button>
                </motion.div>
            </main>

            {/* Подвал */}
            <footer className="w-full text-center py-6 text-xs text-slate-400 dark:text-slate-600 z-10 border-t border-slate-200 dark:border-slate-900/50 bg-white/20 dark:bg-slate-950/20 backdrop-blur-sm">
                <p>&copy; {new Date().getFullYear()} {t('common.brand')}. {t('common.copyright')}</p>
            </footer>
        </div>
    );
}
