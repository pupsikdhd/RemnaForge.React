import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Languages } from 'lucide-react';

interface ThemeLanguageSelectorProps {
    className?: string;
}

export default function ThemeLanguageSelector({ className = '' }: ThemeLanguageSelectorProps) {
    const { i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    const changeLanguage = () => {
        const nextLang = i18n.language === 'ru' ? 'en' : 'ru';
        i18n.changeLanguage(nextLang);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Language Switcher */}
            <button
                onClick={changeLanguage}
                className="flex items-center justify-center w-12 h-9 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                title={i18n.language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
            >
                <Languages className="w-4.5 h-4.5 text-emerald-500" />
                <span className="text-xs font-bold ml-1">{i18n.language === 'ru' ? 'en' : 'ru'}</span>
            </button>
            
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            >
                {theme === 'dark' ? (
                    <Sun className="w-4.5 h-4.5 text-amber-500" />
                ) : (
                    <Moon className="w-4.5 h-4.5 text-indigo-500" />
                )}
            </button>
        </div>
    );
}
