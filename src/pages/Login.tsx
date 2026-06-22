import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    User, 
    Lock, 
    Eye, 
    EyeOff, 
    Loader2, 
    AlertCircle, 
    UserPlus, 
    LogIn, 
    Tag, 
    CheckCircle2 
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeLanguageSelector from '../components/ThemeLanguageSelector';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Утилита для извлечения UUID из строки (например, если вставили полную ссылку)
const extractUuid = (str: string) => {
    const match = str.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return match ? match[0] : null;
};

export default function Login() {
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated, login } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    // Общие поля
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Поля для регистрации
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [inviteId, setInviteId] = useState('');

    // Состояния для обработки UI
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Состояния для TOTP
    const [showTotpVerification, setShowTotpVerification] = useState(false);
    const [totpToken, setTotpToken] = useState<string | null>(null);
    const [totpCode, setTotpCode] = useState('');

    // Проверяем URL на наличие кода приглашения (например, ?invite=UUID)
    useEffect(() => {
        const inviteParam = searchParams.get('invite') || searchParams.get('inviteId') || searchParams.get('code');
        if (inviteParam) {
            const uuid = extractUuid(inviteParam);
            if (uuid) {
                setInviteId(uuid);
                setActiveTab('register');
                setSuccessMessage(t('login.inviteApplied'));
            }
        }
    }, [searchParams, t]);

    // Обработка ввода инвайт-кода (авто-парсинг UUID, если вставили ссылку)
    const handleInviteChange = (val: string) => {
        const uuid = extractUuid(val);
        setInviteId(uuid || val);
    };

    const handleTotpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!totpToken || totpCode.length !== 6) return;

        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/verify-totp', {
                totpToken: totpToken,
                code: totpCode
            });

            if (response.status === 200) {
                console.log("Успешная двухфакторная авторизация!");
                login();
                navigate('/admin', { replace: true });
            }
        } catch (err: any) {
            console.error('Error verifying TOTP:', err);
            let serverError = '';
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'string') {
                    serverError = err.response.data;
                } else if (err.response.data.message) {
                    serverError = err.response.data.message;
                } else if (err.response.data.error) {
                    serverError = err.response.data.error;
                }
            }
            setError(serverError || t('login.invalidTotpCode') || 'Неверный код подтверждения');
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!username || !password) return;

        // Валидация для регистрации
        if (activeTab === 'register') {
            if (password !== confirmPassword) {
                setError(t('login.passwordsMismatch'));
                return;
            }
            if (inviteId.trim() !== '') {
                const isValidUuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(inviteId.trim());
                if (!isValidUuid) {
                    setError(t('login.invalidInviteUuid'));
                    return;
                }
            }
        }

        setIsLoading(true);

        try {
            if (activeTab === 'login') {
                // Вход в систему по эндпоинту /api/auth/login
                const response = await api.post('/api/auth/login', {
                    username: username,
                    password: password
                });

                if (response.status === 200) {
                    const data = response.data;
                    if (data && (data.totpToken || data.requireTotp)) {
                        setTotpToken(data.totpToken || '');
                        setShowTotpVerification(true);
                        setIsLoading(false);
                        return;
                    }
                    console.log("Успешная авторизация!");
                    login();
                    navigate('/admin', { replace: true });
                }
            } else {
                // Регистрация пользователя по эндпоинту /api/auth/create
                const response = await api.post('/api/auth/create', {
                    username: username,
                    password: password,
                    inviteId: inviteId.trim() ? inviteId.trim() : null
                });

                if (response.status === 200) {
                    setSuccessMessage(t('login.regSuccessAutoLogin'));
                    
                    // Автоматический логин после успешной регистрации для идеального UX
                    setTimeout(async () => {
                        try {
                            const loginResponse = await api.post('/api/auth/login', {
                                username: username,
                                password: password
                            });
                            if (loginResponse.status === 200) {
                                const data = loginResponse.data;
                                if (data && (data.totpToken || data.requireTotp)) {
                                    setTotpToken(data.totpToken || '');
                                    setShowTotpVerification(true);
                                    setIsLoading(false);
                                    return;
                                }
                                login();
                                navigate('/admin', { replace: true });
                            }
                        } catch (loginErr) {
                            console.error('Ошибка авто-входа:', loginErr);
                            // Если авто-вход не сработал, переключаем на вкладку логина с заполненными данными
                            setActiveTab('login');
                            setSuccessMessage(t('login.regSuccessLoginManual'));
                            setIsLoading(false);
                        }
                    }, 1500);
                    return;
                }
            }
        } catch (err: any) {
            console.error(err);

            // Получаем сообщение об ошибке от бэкенда, если оно есть
            let serverError = '';
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'string') {
                    serverError = err.response.data;
                } else if (err.response.data.message) {
                    serverError = err.response.data.message;
                } else if (err.response.data.error) {
                    serverError = err.response.data.error;
                }
            }

            // Обработка ошибок в зависимости от ответа бэкенда
            if (err.response) {
                const status = err.response.status;
                if (status === 429) {
                    setError(t('login.tooManyAttempts'));
                } else if (status === 401 || status === 400) {
                    setError(serverError || (activeTab === 'login' ? t('login.invalidCredentials') : t('login.invalidRegData')));
                } else if (status === 409) {
                    setError(serverError || t('login.userAlreadyExists'));
                } else {
                    setError(serverError || t('login.serverError', { status }));
                }
            } else {
                setError(t('login.networkError'));
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-center items-center px-4 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden transition-colors duration-300">
            
            {/* Кнопки переключения темы и языка */}
            <div className="absolute top-4 right-4 z-20">
                <ThemeLanguageSelector />
            </div>

            {/* Фоновые декоративные свечения */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-blue-500/3 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Сетка на фоне */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

            {/* Логотип */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mb-8 z-10 cursor-pointer select-none"
                onClick={() => window.location.href = '/'}
            >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {t('common.brand')}
                </span>
            </motion.div>

            {/* Карточка формы */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-full max-w-md bg-white/80 border border-slate-200 rounded-3xl p-8 backdrop-blur-md shadow-xl dark:bg-slate-900/40 dark:border-slate-900 dark:shadow-2xl z-10 transition-colors duration-300"
            >
                {showTotpVerification ? (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                {t('login.totpHeader') || '2FA Verification'}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-sans">
                                {t('login.totpDesc') || 'Введите одноразовый код из вашего приложения Authenticator.'}
                            </p>
                        </div>

                        {/* Вывод ошибок */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleTotpSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    {t('login.totpCode') || 'Код подтверждения'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    pattern="\d{6}"
                                    disabled={isLoading}
                                    value={totpCode}
                                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="123456"
                                    className="w-full py-3 px-4 text-center text-2xl tracking-widest bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || totpCode.length !== 6}
                                className="w-full py-3 px-4 bg-emerald-400 text-slate-950 font-semibold rounded-xl hover:bg-emerald-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-400/10 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    t('login.btnSubmitTotp') || 'Подтвердить'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowTotpVerification(false);
                                    setTotpCode('');
                                    setError(null);
                                }}
                                className="w-full text-center text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-1 cursor-pointer"
                            >
                                {t('common.goBack') || 'Вернуться назад'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        {/* Вкладки Вход / Регистрация */}
                        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800/80 mb-6 relative transition-colors duration-300">
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                    setActiveTab('login');
                                    setError(null);
                                    setSuccessMessage(null);
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 relative cursor-pointer ${
                                    activeTab === 'login' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                                } disabled:opacity-50`}
                            >
                                {activeTab === 'login' && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className="absolute inset-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    {t('login.tabLogin')}
                                </span>
                            </button>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                    setActiveTab('register');
                                    setError(null);
                                    setSuccessMessage(null);
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 relative cursor-pointer ${
                                    activeTab === 'register' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                                } disabled:opacity-50`}
                            >
                                {activeTab === 'register' && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className="absolute inset-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    {t('login.tabRegister')}
                                </span>
                            </button>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                {activeTab === 'login' ? t('login.authHeader') : t('login.regHeader')}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {activeTab === 'login' 
                                    ? t('login.authDesc') 
                                    : t('login.regDesc')}
                            </p>
                        </div>

                        {/* Вывод ошибок */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* Вывод сообщений об успехе */}
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm flex items-start gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{successMessage}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Поле Username */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    {t('login.username')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        disabled={isLoading}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="admin"
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Поле Password */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    {t('login.password')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        disabled={isLoading}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Дополнительные поля для регистрации */}
                            <AnimatePresence initial={false}>
                                {activeTab === 'register' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden space-y-5"
                                    >
                                        {/* Поле Подтверждения Пароля */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                                {t('login.confirmPassword')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    required={activeTab === 'register'}
                                                    disabled={isLoading}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                                                />
                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Поле Invite ID */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                {t('login.inviteCode')}
                                            </label>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-500 mb-2 leading-tight">
                                                {t('login.inviteCodeDesc')}
                                            </p>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                                    <Tag className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    disabled={isLoading}
                                                    value={inviteId}
                                                    onChange={(e) => handleInviteChange(e.target.value)}
                                                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Кнопка отправки */}
                            <button
                                type="submit"
                                disabled={isLoading || !username || !password || (activeTab === 'register' && !confirmPassword)}
                                className="w-full py-3 px-4 mt-2 bg-emerald-400 text-slate-950 font-semibold rounded-xl hover:bg-emerald-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-400/10 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : activeTab === 'login' ? (
                                    t('login.btnSubmitLogin')
                                ) : (
                                    t('login.btnSubmitRegister')
                                )}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
}