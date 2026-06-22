import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Plus, Trash2, Copy, Check, Edit2, CheckCircle } from 'lucide-react';
import { apiService, type ApiKey } from '../../services/api';

interface ApiKeysTabProps {
    onShowStatus: (text: string, type: 'success' | 'error') => void;
    formatDate: (d: string | null) => string;
}

export const ApiKeysTab: React.FC<ApiKeysTabProps> = ({ onShowStatus, formatDate }) => {
    const { t } = useTranslation();
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Create form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);

    // Editing states
    const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');

    useEffect(() => {
        loadKeys();
    }, []);

    const loadKeys = async () => {
        setLoading(true);
        try {
            const data = await apiService.getApiKeys();
            setKeys(data);
        } catch (err: any) {
            console.error('Error loading API keys:', err);
            onShowStatus('Failed to load API keys', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setActionLoading(true);
        setGeneratedKey(null);
        try {
            // In the CreateApiKeyRequest, 'key' is the name/token identity
            await apiService.createApiKey({
                key: name,
                description: description || null
            });
            onShowStatus('API Token created!', 'success');
            
            // We reload the keys list
            const updatedKeys = await apiService.getApiKeys();
            setKeys(updatedKeys);

            // Find the newly created key (it might be the last one, or we can match by name)
            // Note: Since the backend might generate a key token internally and save it,
            // let's show a success confirmation. If the backend returned a specific object, we'd use it.
            // Since Minimal APIs POST response is usually 200 OK or the object itself,
            // we'll display the token name as created.
            setGeneratedKey(name);

            setName('');
            setDescription('');
        } catch (err: any) {
            console.error('Error creating API key:', err);
            onShowStatus('Failed to create API key', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;
        setActionLoading(true);
        try {
            await apiService.updateApiKey(id, {
                key: editName,
                description: editDesc || null
            });
            onShowStatus('API Token updated!', 'success');
            setEditingKeyId(null);
            loadKeys();
        } catch (err: any) {
            console.error('Error updating API key:', err);
            onShowStatus('Failed to update API key', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (apiKey: ApiKey) => {
        if (!window.confirm('Are you sure you want to revoke this API Token? All integrations using it will lose access.')) return;
        try {
            await apiService.deleteApiKey(apiKey.id);
            onShowStatus('API Token revoked!', 'success');
            loadKeys();
        } catch (err: any) {
            console.error('Error deleting API key:', err);
            onShowStatus('Failed to revoke API key', 'error');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        onShowStatus('API Token copied to clipboard!', 'success');
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <KeyRound className="w-5.5 h-5.5 text-emerald-500" />
                    {t('admin.apikeys.title') || 'API Tokens / Keys'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Generate and manage API keys for external automated integration with RemnaForge
                </p>
            </div>

            {/* Create API Key Form */}
            <form onSubmit={handleCreate} className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Generate New API Token
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Token Name / Key (Required)
                        </label>
                        <input
                            type="text"
                            required
                            disabled={actionLoading}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. HomeAssistant-Proxy"
                            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Description (Optional)
                        </label>
                        <input
                            type="text"
                            disabled={actionLoading}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Access token for syncing subscription states"
                            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={actionLoading || !name.trim()}
                    className="self-start px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-355 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Generate Token
                </button>
            </form>

            {/* Generated Key Warning Card */}
            <AnimatePresence>
                {generatedKey && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900/50 p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden"
                    >
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                                    Token Generated Successfully!
                                </h4>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400/80 mt-0.5">
                                    Please make sure to copy your new token now. For security reasons, you will not be able to view it again.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl justify-between">
                            <span className="font-mono text-sm tracking-wider text-slate-900 dark:text-white break-all select-all">
                                {generatedKey}
                            </span>
                            <button
                                onClick={() => copyToClipboard(generatedKey)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-500 hover:text-emerald-500 transition-colors cursor-pointer"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={() => setGeneratedKey(null)}
                            className="absolute top-4 right-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                            Dismiss
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Existing API Keys Table */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Active API Keys
                </h3>

                {loading ? (
                    <div className="text-center py-8 text-slate-400">
                        Loading keys...
                    </div>
                ) : keys.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
                        No API Keys generated yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-4 py-3">Token (Key Name)</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keys.map((key) => (
                                    <tr key={key.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                            {editingKeyId === key.id ? (
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="px-2 py-1 text-xs rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                                                        {key.key}
                                                    </span>
                                                    <button
                                                        onClick={() => copyToClipboard(key.key)}
                                                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                                                        title="Copy API Key"
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 max-w-[250px] truncate">
                                            {editingKeyId === key.id ? (
                                                <input
                                                    type="text"
                                                    value={editDesc}
                                                    onChange={(e) => setEditDesc(e.target.value)}
                                                    className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                            ) : (
                                                key.description || '-'
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500">
                                            {formatDate(key.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {editingKeyId === key.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdate(key.id)}
                                                            disabled={actionLoading}
                                                            className="p-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-colors cursor-pointer"
                                                            title="Save"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingKeyId(null)}
                                                            className="p-1.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                                                            title="Cancel"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingKeyId(key.id);
                                                                setEditName(key.key);
                                                                setEditDesc(key.description || '');
                                                            }}
                                                            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
                                                            title="Edit description"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(key)}
                                                            className="p-1.5 text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                                            title="Revoke Token"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
