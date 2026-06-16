import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ClientQrModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptionLink: string;
    onCopy: () => void;
}

export const ClientQrModal: React.FC<ClientQrModalProps> = ({
    isOpen,
    onClose,
    subscriptionLink,
    onCopy,
}) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {t('admin.clients.qrCode')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center gap-4 text-center">
                    <p className="text-xs text-slate-500">{t('client.qrDesc')}</p>
                    <div className="p-4 bg-white border border-slate-150 rounded-2xl shadow-inner inline-block">
                        <QRCodeSVG
                            value={subscriptionLink}
                            size={200}
                            level="H"
                            bgColor="#FFFFFF"
                            fgColor="#020617"
                        />
                    </div>
                    <div className="w-full flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={subscriptionLink}
                            className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 outline-none text-slate-550"
                        />
                        <button
                            onClick={onCopy}
                            className="px-3.5 py-2 text-xs font-semibold bg-emerald-400 hover:bg-emerald-350 text-slate-950 rounded-xl transition-all cursor-pointer"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
