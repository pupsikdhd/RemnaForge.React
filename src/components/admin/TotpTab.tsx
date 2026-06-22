import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Loader2, Copy, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { apiService, type TotpStatus, type TotpSetupResponse } from '../../services/api';

interface TotpTabProps {
    onShowStatus: (text: string, type: 'success' | 'error') => void;
}

export const TotpTab: React.FC<TotpTabProps> = ({ onShowStatus }) => {
    const { t } = useTranslation();
    const [status, setStatus] = useState<TotpStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Setup state (when enabling 2FA)
    const [setupData, setSetupData] = useState<TotpSetupResponse | null>(null);
    const [code, setCode] = useState('');
    const [disableCode, setDisableCode] = useState('');

    useEffect(() => {
        loadTotpStatus();
    }, []);

    const loadTotpStatus = async () => {
        setLoading(true);
        try {
            const data = await apiService.getTotpStatus();
            setStatus(data);
        } catch (err: any) {
            console.error('Error fetching TOTP status:', err);
            onShowStatus('Failed to retrieve 2FA status', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStartSetup = async () => {
        setActionLoading(true);
        try {
            const data = await apiService.generateTotp();
            setSetupData(data);
        } catch (err: any) {
            console.error('Error generating TOTP secret:', err);
            onShowStatus('Failed to generate 2FA setup details', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEnable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) return;

        setActionLoading(true);
        try {
            await apiService.enableTotp(code);
            onShowStatus('Two-factor authentication successfully enabled!', 'success');
            setCode('');
            setSetupData(null);
            // Refresh status
            await loadTotpStatus();
        } catch (err: any) {
            console.error('Error enabling TOTP:', err);
            onShowStatus(err.response?.data?.message || 'Invalid confirmation code. Please try again.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDisable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (disableCode.length !== 6) return;

        if (!window.confirm('Are you sure you want to disable 2FA? This will make your administrator account less secure.')) return;

        setActionLoading(true);
        try {
            await apiService.disableTotp(disableCode);
            onShowStatus('Two-factor authentication has been disabled.', 'success');
            setDisableCode('');
            // Refresh status
            await loadTotpStatus();
        } catch (err: any) {
            console.error('Error disabling TOTP:', err);
            onShowStatus(err.response?.data?.message || 'Invalid code. Unable to disable 2FA.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        onShowStatus('Secret key copied to clipboard!', 'success');
    };

    // Helper to determine the qrCode value to render
    const getQrValue = () => {
        if (!setupData) return '';
        // If the backend returns an otpauth URI in qrCodeUrl or secret, use it
        if (setupData.qrCodeUrl && setupData.qrCodeUrl.startsWith('otpauth://')) {
            return setupData.qrCodeUrl;
        }
        if (setupData.secret) {
            // standard format: otpauth://totp/remnaforge?secret=SECRET_KEY
            return `otpauth://totp/RemnaForge?secret=${setupData.secret}`;
        }
        return setupData.qrCodeUrl || '';
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center py-20 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                <p className="text-sm font-medium">{t('common.loading')}</p>
            </div>
        );
    }

    const isEnabled = status?.enabled;

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-5.5 h-5.5 text-emerald-500" />
                    {t('admin.totp.title') || 'Two-Factor Authentication (2FA)'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Add an extra layer of security to your administrator account by requiring a verification code at login
                </p>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className={`p-3 rounded-xl ${isEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {isEnabled ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>
                <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {isEnabled ? 'Two-Factor Authentication is ENABLED' : 'Two-Factor Authentication is DISABLED'}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                        {isEnabled 
                            ? 'Your account is protected with 2FA. Every login attempt will require an authenticator code.'
                            : 'We highly recommend enabling 2FA to prevent unauthorized access to your server dashboard.'}
                    </div>
                </div>
            </div>

            {!isEnabled ? (
                <div className="flex flex-col gap-6">
                    {/* Setup Trigger */}
                    {!setupData ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                To set up two-factor authentication, you will need a TOTP-compatible authenticator application like Google Authenticator, Aegis Authenticator, 1Password, or Bitwarden on your device.
                            </p>
                            <button
                                onClick={handleStartSetup}
                                disabled={actionLoading}
                                className="self-start px-5 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-400/15 active:scale-98 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                                Enable 2FA Security
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col gap-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                    Configure Authenticator App
                                </h3>
                                <button
                                    onClick={() => setSetupData(null)}
                                    className="text-xs text-slate-400 hover:text-slate-655 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-4 bg-white border border-slate-150 rounded-2xl shadow-inner inline-block">
                                        <QRCodeSVG
                                            value={getQrValue()}
                                            size={160}
                                            level="H"
                                            bgColor="#FFFFFF"
                                            fgColor="#020617"
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-400">Scan this code with your Authenticator app</span>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-slate-500">Manual Entry Secret Key:</span>
                                        <div className="flex items-center gap-2 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl justify-between">
                                            <span className="font-mono text-xs tracking-wider text-slate-800 dark:text-slate-200 select-all break-all pr-2">
                                                {setupData.secret}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(setupData.secret)}
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                                                title="Copy Secret Key"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleEnable} className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-slate-500">
                                                Enter 6-digit verification code:
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                pattern="\d{6}"
                                                disabled={actionLoading}
                                                value={code}
                                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                                placeholder="e.g. 123456"
                                                className="w-full px-3.5 py-2.5 text-center text-lg tracking-widest font-mono rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={actionLoading || code.length !== 6}
                                            className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-350 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                            Verify & Activate 2FA
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Deactivate Two-Factor Authentication
                    </h3>
                    <p className="text-xs text-slate-500">
                        Disabling 2FA will reduce the security of your dashboard. You will only need your username and password to log in.
                    </p>

                    <form onSubmit={handleDisable} className="flex flex-col sm:flex-row gap-3 items-end max-w-md mt-2">
                        <div className="flex flex-col gap-1.5 flex-1 w-full">
                            <label className="text-xs font-semibold text-slate-500">
                                Enter 6-digit authenticator code:
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                pattern="\d{6}"
                                disabled={actionLoading}
                                value={disableCode}
                                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="123456"
                                className="w-full px-3.5 py-2.5 text-center text-sm tracking-widest font-mono rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={actionLoading || disableCode.length !== 6}
                            className="px-5 py-3 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center"
                        >
                            {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Disable 2FA
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
