import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ShieldCheck,
    Layers,
    Cpu,
    Globe,
    Smartphone,
    LogIn,
    CheckCircle2
} from 'lucide-react';
import ThemeLanguageSelector from '../components/ThemeLanguageSelector';

// Варианты анимации для плавного появления элементов (Stagger эффект)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as const }
    }
};

export default function Home() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans overflow-x-hidden transition-colors duration-300">

            {/* Шапка / Навигация */}
            <header className="border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r flow-root from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                            {t('common.brand')} <span className="text-emerald-400 font-medium text-sm border border-emerald-500/30 rounded-full px-2 py-0.5 ml-1 bg-emerald-500/10">v3</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeLanguageSelector />
                        <button
                            onClick={handleLoginClick}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer rounded-lg"
                        >
                            <LogIn className="w-4 h-4 text-emerald-400" />
                            {t('common.login')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Секция (Главный экран) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-6">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t('home.subtitle')}
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                        {t('home.titleStart')}<span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{t('home.titleAccent')}</span>
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed transition-colors duration-300">
                        {t('home.description')}
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleLoginClick}
                            className="px-6 py-3 text-base font-semibold text-slate-950 bg-emerald-400 rounded-xl hover:bg-emerald-300 shadow-lg shadow-emerald-400/20 active:scale-95 transition-all cursor-pointer"
                        >
                            {t('home.openPanel')}
                        </button>
                    </div>
                </motion.div>

                {/* Секция возможностей (Features) */}
                <div className="mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">{t('home.featuresTitle')}</h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 transition-colors duration-300">{t('home.featuresSubtitle')}</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {/* Карточка 1 */}
                        <motion.div variants={itemVariants} className="p-6 bg-white/70 border border-slate-200 rounded-2xl hover:border-slate-300 dark:bg-slate-900/40 dark:border-slate-900 dark:hover:border-slate-800 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                                <Layers className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('home.feature1Title')}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                                {t('home.feature1Desc')}
                            </p>
                        </motion.div>

                        {/* Карточка 2 */}
                        <motion.div variants={itemVariants} className="p-6 bg-white/70 border border-slate-200 rounded-2xl hover:border-slate-300 dark:bg-slate-900/40 dark:border-slate-900 dark:hover:border-slate-800 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                                <Smartphone className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('home.feature2Title')}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                                {t('home.feature2Desc')}
                            </p>
                        </motion.div>

                        {/* Карточка 3 */}
                        <motion.div variants={itemVariants} className="p-6 bg-white/70 border border-slate-200 rounded-2xl hover:border-slate-300 dark:bg-slate-900/40 dark:border-slate-900 dark:hover:border-slate-800 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                                <Cpu className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('home.feature3Title')}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                                {t('home.feature3Desc')}
                            </p>
                        </motion.div>

                        {/* Карточка 4 */}
                        <motion.div variants={itemVariants} className="p-6 bg-white/70 border border-slate-200 rounded-2xl hover:border-slate-300 dark:bg-slate-900/40 dark:border-slate-900 dark:hover:border-slate-800 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                                <Globe className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('home.feature4Title')}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                                {t('home.feature4Desc')}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

        </div>
    );
}
