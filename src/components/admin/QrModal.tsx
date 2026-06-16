import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Client } from '../../services/api';

interface QrModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
    getSubscriptionLink: (slug: string) => string;
    onCopyLink: (text: string, msg: string) => void;
}

export const QrModal: React.FC<QrModalProps> = ({
    isOpen,
    onClose,
    client,
    getSubscriptionLink,
    onCopyLink,
}) => {
    const { t } = useTranslation();

    if (!isOpen || !client) return null;

    const subLink = getSubscriptionLink(client.slug);

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
                        {t('admin.clients.qrCode')} • {client.name || 'Client'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center gap-4 text-center">
                    <p className="text-xs text-slate-500">
                        Scan this subscription link to import proxy configuration to Sing-box, v2rayNG, or shadowrocket.
                    </p>
                    <div className="p-4 bg-white border border-slate-150 rounded-2xl shadow-inner inline-block">
                        <QRCodeSVG
                            value={subLink}
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
                            value={subLink}
                            className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 outline-none text-slate-500"
                        />
                        <button
                            onClick={() => onCopyLink(subLink, t('admin.clients.subLinkCopied'))}
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
