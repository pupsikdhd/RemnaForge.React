import React from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, QrCode, Tv, Trash2, HelpCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Device } from '../../services/api';

interface ClientPortalProps {
    slug: string;
    devices: Device[];
    actionLoading: boolean;
    getSubscriptionLink: () => string;
    onCopySubscriptionLink: () => void;
    onOpenQrModal: () => void;
    onRevokeDevice: (deviceId: string) => Promise<void>;
    formatDate: (d: string | null | undefined) => string;
    guideTab: 'android' | 'ios' | 'desktop';
    setGuideTab: (tab: 'android' | 'ios' | 'desktop') => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
    slug,
    devices,
    actionLoading,
    getSubscriptionLink,
    onCopySubscriptionLink,
    onOpenQrModal,
    onRevokeDevice,
    formatDate,
    guideTab,
    setGuideTab,
}) => {
    const { t } = useTranslation();

    const subLink = getSubscriptionLink();

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Top Hero Banner with Subscription Info */}
            <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-1 flex flex-col gap-2">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        {t('client.subDetails')}
                    </h1>
                    <p className="text-xs text-slate-500 font-mono select-all truncate max-w-[320px] sm:max-w-md">
                        UID: {slug}
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t('client.subLink')}
                        </span>
                        <div className="flex items-center gap-2 max-w-md">
                            <input
                                type="text"
                                readOnly
                                value={subLink}
                                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 outline-none text-slate-550 overflow-x-auto"
                            />
                            <button
                                onClick={onCopySubscriptionLink}
                                className="p-2 bg-emerald-400 hover:bg-emerald-350 text-slate-950 rounded-lg transition-colors cursor-pointer"
                                title={t('client.copySubBtn')}
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onOpenQrModal}
                                className="p-2 border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                                title="Show QR Code"
                            >
                                <QrCode className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inline QR for convenience */}
                <div className="hidden md:block shrink-0 p-3 bg-white border border-slate-150 rounded-2xl shadow-inner">
                    <QRCodeSVG
                        value={subLink}
                        size={120}
                        level="L"
                        bgColor="#FFFFFF"
                        fgColor="#020617"
                    />
                </div>
            </div>

            {/* Active Devices Panel */}
            <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t('client.devicesTitle')}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">{t('client.devicesDesc')}</p>
                </div>

                {devices.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <Tv className="w-8 h-8 text-slate-455/50 mx-auto mb-2 text-slate-400" />
                        <p className="text-slate-500 text-sm font-medium">{t('client.noDevices')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {devices.map((dev) => {
                            const dId = dev.id || dev.deviceId || '';
                            const dHwid = dev.hwid || 'N/A';
                            const dIp = dev.ip || dev.ipAddress || 'N/A';
                            const ua:string = dev.userAgent || 'N/A';
                            const activeDate = dev.lastActive || dev.lastActiveAt;

                            return (
                                <div
                                    key={dId}
                                    className="p-4 border border-slate-150 dark:border-slate-800 rounded-2xl hover:border-slate-250 dark:hover:border-slate-700 transition-colors flex justify-between items-center bg-slate-50/20 dark:bg-slate-950/10"
                                >
                                    <div className="flex flex-col gap-1 overflow-hidden pr-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                UA
                                            </span>
                                            <span className="text-sm font-mono text-slate-800 dark:text-slate-200 font-bold truncate">
                                                {ua}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400 truncate font-mono">
                                            HWID: {dHwid}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-550 flex flex-wrap gap-x-3 mt-0.5">
                                            <span>IP: {dIp}</span>
                                            {activeDate && (
                                                <span>Active: {formatDate(activeDate)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        disabled={actionLoading}
                                        onClick={() => onRevokeDevice(dId)}
                                        className="p-2 hover:bg-red-500/10 hover:text-red-500 text-slate-455 border border-slate-200 dark:border-slate-800 hover:border-red-500/20 rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                                        title={t('client.btnRevoke')}
                                    >
                                        <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Setup & Guide Panel */}
            <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850 pb-4">
                    <HelpCircle className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {t('client.instructionTitle')}
                    </h2>
                </div>

                {/* Tabs for OS */}
                <div className="flex gap-2">
                    {(['android', 'ios', 'desktop'] as const).map((os) => (
                        <button
                            key={os}
                            onClick={() => setGuideTab(os)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer uppercase tracking-wider ${
                                guideTab === os
                                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500'
                                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            {os}
                        </button>
                    ))}
                </div>

                {/* Tab Contents */}
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex flex-col gap-3">
                    {guideTab === 'android' && (
                        <>
                            <p>{t('client.instruction1')}</p>
                            <p dangerouslySetInnerHTML={{ __html: t('client.androidHapp') }} />
                            <p dangerouslySetInnerHTML={{ __html: t('client.androidStep3') }} />
                            <p dangerouslySetInnerHTML={{ __html: t('client.androidStep4') }} />
                        </>
                    )}

                    {guideTab === 'ios' && (
                        <>
                            <p>{t('client.instruction1')}</p>
                            <p dangerouslySetInnerHTML={{ __html: t('client.iosHapp') }} />
                            <p dangerouslySetInnerHTML={{ __html: t('client.iosStep3') }} />
                            <p dangerouslySetInnerHTML={{ __html: t('client.iosStep4') }} />
                        </>
                    )}

                    {guideTab === 'desktop' && (
                        <>
                            <p>{t('client.instruction1')}</p>
                            <p dangerouslySetInnerHTML={{ __html: t('client.desktopHapp') }} />
                            <p dangerouslySetInnerHTML={{ __html: t('client.desktopStep3') }} />
                            <p dangerouslySetInnerHTML={{ __html: t('client.desktopStep4') }} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
