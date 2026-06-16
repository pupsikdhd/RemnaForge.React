import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X, RefreshCw, Info, Trash2 } from 'lucide-react';
import type { Client, Device } from '../../services/api';

interface DevicesModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
    devices: Device[];
    loadingDevices: boolean;
    onRevokeDevice: (deviceId: string) => Promise<void>;
    formatDate: (d: string | null) => string;
}

export const DevicesModal: React.FC<DevicesModalProps> = ({
    isOpen,
    onClose,
    client,
    devices,
    loadingDevices,
    onRevokeDevice,
    formatDate,
}) => {
    const { t } = useTranslation();

    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {t('admin.clients.devicesModal.title', { name: client.name || 'Unnamed' })}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 max-h-[75vh] overflow-y-auto">
                    {loadingDevices ? (
                        <div className="flex justify-center items-center py-12">
                            <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                        </div>
                    ) : devices.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            <Info className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-sm">{t('admin.clients.devicesModal.noDevices')}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-2xl">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-4 py-3">{t('admin.clients.devicesModal.tableHwid')}</th>
                                        <th className="px-4 py-3">{t('admin.clients.devicesModal.tableIp')}</th>
                                        <th className="px-4 py-3">{t('admin.clients.devicesModal.tableLastActive')}</th>
                                        <th className="px-4 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {devices.map((dev) => {
                                        const dId = dev.id || dev.deviceId || '';
                                        const dHwid = dev.hwid || 'N/A';
                                        const dIp = dev.ip || dev.ipAddress || 'N/A';
                                        const dActive = dev.lastActive || dev.lastActiveAt || '';

                                        return (
                                            <tr key={dId} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                                                <td className="px-4 py-3 font-mono text-xs text-slate-800 dark:text-slate-200 select-all">
                                                    {dHwid}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400 select-all">
                                                    {dIp}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-500">
                                                    {dActive ? formatDate(dActive) : 'Just now'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => onRevokeDevice(dId)}
                                                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer"
                                                        title={t('admin.clients.devicesModal.deleteTooltip')}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
