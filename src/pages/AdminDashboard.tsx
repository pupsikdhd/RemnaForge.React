import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle, Check } from 'lucide-react';
import {
    apiService,
    type Client,
    type Subscription,
    type Invite,
    type SystemSettings,
    type Device
} from '../services/api';

// Extracted Subcomponents
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminSidebar, type TabType } from '../components/admin/AdminSidebar';
import { ClientsTab } from '../components/admin/ClientsTab';
import { SubscriptionsTab } from '../components/admin/SubscriptionsTab';
import { InvitesTab } from '../components/admin/InvitesTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { ClientModal } from '../components/admin/ClientModal';
import { DevicesModal } from '../components/admin/DevicesModal';
import { QrModal } from '../components/admin/QrModal';
import { SubModal } from '../components/admin/SubModal';
import { InviteModal } from '../components/admin/InviteModal';

export default function AdminDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Active tab
    const [activeTab, setActiveTab] = useState<TabType>('clients');

    // Data lists
    const [clients, setClients] = useState<Client[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);

    // Search and loading states
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Client modal states
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    // Devices modal states
    const [devicesModalOpen, setDevicesModalOpen] = useState(false);
    const [selectedClientForDevices, setSelectedClientForDevices] = useState<Client | null>(null);
    const [clientDevices, setClientDevices] = useState<Device[]>([]);
    const [loadingDevices, setLoadingDevices] = useState(false);

    // QR code modal states
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedClientForQr, setSelectedClientForQr] = useState<Client | null>(null);

    // Subscription modal states
    const [subModalOpen, setSubModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subscription | null>(null);

    // Invite modal states
    const [inviteModalOpen, setInviteModalOpen] = useState(false);

    // Settings form states
    const [settingsForm, setSettingsForm] = useState<SystemSettings>({
        allowRegistration: false,
        useCaching: true,
        cacheDurationInMinutes: 10
    });

    // Load initial data
    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'clients') {
                const [clientsData, subsData] = await Promise.all([
                    apiService.getClients(),
                    apiService.getSubscriptions()
                ]);
                setClients(clientsData);
                setSubscriptions(subsData);
            } else if (activeTab === 'subscriptions') {
                const subsData = await apiService.getSubscriptions();
                setSubscriptions(subsData);
            } else if (activeTab === 'invites') {
                const invitesData = await apiService.getInvites();
                setInvites(invitesData);
            } else if (activeTab === 'settings') {
                const settingsData = await apiService.getSettings();
                setSettingsForm(settingsData);
            }
        } catch (err: any) {
            console.error('Error loading data:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                showStatus(t('login.networkError'), 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const showStatus = (text: string, type: 'success' | 'error') => {
        setStatusMessage({ text, type });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    // Client handlers
    const saveClient = async (payload: {
        name: string | null;
        subscriptionId: string;
        expireAt: string;
        deviceLimit: number;
    }) => {
        setActionLoading(true);
        try {
            if (editingClient) {
                await apiService.patchClient({
                    id: editingClient.id,
                    name: payload.name,
                    expireAt: payload.expireAt,
                    deviceLimit: payload.deviceLimit
                });
                showStatus(t('admin.settings.success'), 'success');
            } else {
                await apiService.createClient(payload);
                showStatus('Client created successfully!', 'success');
            }
            setClientModalOpen(false);
            loadData();
        } catch (err: any) {
            console.error('Error saving client:', err);
            showStatus(err.response?.data?.message || 'Error occurred while saving client', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const deleteClient = async (client: Client) => {
        if (!window.confirm(t('admin.clients.deleteConfirm', { name: client.name || 'Unnamed' }))) return;
        try {
            await apiService.deleteClient(client.id);
            showStatus('Client deleted successfully!', 'success');
            loadData();
        } catch (err: any) {
            showStatus(err.response?.data?.message || 'Error deleting client', 'error');
        }
    };

    // Client Devices operations
    const openDevicesModal = async (client: Client) => {
        setSelectedClientForDevices(client);
        setClientDevices([]);
        setLoadingDevices(true);
        setDevicesModalOpen(true);
        try {
            const devices = await apiService.getClientDevices(client.id);
            setClientDevices(devices);
        } catch (err: any) {
            console.error('Error loading client devices:', err);
            showStatus('Failed to load devices list', 'error');
        } finally {
            setLoadingDevices(false);
        }
    };

    const revokeDevice = async (deviceId: string) => {
        if (!selectedClientForDevices) return;
        if (!window.confirm(t('admin.clients.devicesModal.deleteConfirm'))) return;

        try {
            await apiService.deleteClientDevice(selectedClientForDevices.id, deviceId);
            showStatus('Device revoked successfully!', 'success');
            const devices = await apiService.getClientDevices(selectedClientForDevices.id);
            setClientDevices(devices);
        } catch (err: any) {
            showStatus('Failed to revoke device', 'error');
        }
    };

    // Subscriptions CRUD handlers
    const saveSub = async (payload: any) => {
        setActionLoading(true);
        try {
            if (editingSub) {
                await apiService.patchSubscription({
                    subscriptionId: editingSub.subscriptionId,
                    ...payload
                });
                showStatus('Subscription updated successfully!', 'success');
            } else {
                await apiService.createSubscription(payload);
                showStatus('Subscription created successfully!', 'success');
            }
            setSubModalOpen(false);
            loadData();
        } catch (err: any) {
            console.error('Error saving subscription:', err);
            showStatus(err.response?.data?.message || 'Error occurred while saving subscription', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const deleteSub = async (sub: Subscription) => {
        if (!window.confirm(t('admin.subscriptions.deleteConfirm', { name: sub.name || 'Unnamed' }))) return;
        try {
            await apiService.deleteSubscription(sub.subscriptionId);
            showStatus('Subscription deleted!', 'success');
            loadData();
        } catch (err: any) {
            showStatus(err.response?.data?.message || 'Error deleting subscription', 'error');
        }
    };

    // Invites CRUD handlers
    const saveInvite = async (payload: { description: string; expireDays: number }) => {
        setActionLoading(true);
        try {
            await apiService.createInvite({
                description: payload.description || null,
                expireDays: payload.expireDays
            });
            showStatus('Invite code generated!', 'success');
            setInviteModalOpen(false);
            loadData();
        } catch (err: any) {
            showStatus('Error creating invite', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const deleteInvite = async (invite: Invite) => {
        if (!window.confirm(t('admin.invites.deleteConfirm'))) return;
        try {
            await apiService.deleteInvite(invite.id);
            showStatus('Invite deleted!', 'success');
            loadData();
        } catch (err: any) {
            showStatus('Failed to delete invite', 'error');
        }
    };

    // Settings save
    const saveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await apiService.patchSettings(settingsForm);
            showStatus(t('admin.settings.success'), 'success');
            loadData();
        } catch (err: any) {
            showStatus('Failed to save settings', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Link/clipboard helpers
    const getSubscriptionLink = (slug: string) => {
        return `${window.location.origin}/sub/${slug}`;
    };

    const getClientPortalLink = (slug: string) => {
        return `${window.location.origin}/client/${slug}`;
    };

    const getInviteRegisterLink = (id: string) => {
        return `${window.location.origin}/login?invite=${id}`;
    };

    const copyToClipboard = (text: string, msg: string) => {
        navigator.clipboard.writeText(text);
        showStatus(msg, 'success');
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return t('admin.clients.unlimited');
        const date = new Date(dateString);
        if (date.getFullYear() >= 2099) return t('admin.clients.unlimited');
        
        return date.toLocaleDateString(navigator.language, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isExpired = (dateString: string | null) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        if (date.getFullYear() >= 2099) return false;
        return date < new Date();
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
            <AdminHeader />

            {/* Status alerts */}
            <AnimatePresence>
                {statusMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border ${
                            statusMessage.type === 'success'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-900/50 dark:text-emerald-300'
                                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/90 dark:border-red-900/50 dark:text-red-300'
                        }`}
                    >
                        {statusMessage.type === 'success' ? (
                            <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{statusMessage.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
                <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-[400px]"
                        >
                            {loading ? (
                                <div className="flex-1 flex flex-col justify-center items-center py-20 text-slate-400">
                                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                                    <p className="text-sm font-medium">{t('common.loading')}</p>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'clients' && (
                                        <ClientsTab
                                            clients={clients}
                                            subscriptions={subscriptions}
                                            searchQuery={searchQuery}
                                            onSearchQueryChange={setSearchQuery}
                                            onAddClientClick={() => {
                                                setEditingClient(null);
                                                setClientModalOpen(true);
                                            }}
                                            onEditClientClick={(client) => {
                                                setEditingClient(client);
                                                setClientModalOpen(true);
                                            }}
                                            onDeleteClient={deleteClient}
                                            onOpenDevices={openDevicesModal}
                                            onOpenQr={(client) => {
                                                setSelectedClientForQr(client);
                                                setQrModalOpen(true);
                                            }}
                                            onCopyLink={copyToClipboard}
                                            getSubscriptionLink={getSubscriptionLink}
                                            getClientPortalLink={getClientPortalLink}
                                            formatDate={formatDate}
                                            isExpired={isExpired}
                                        />
                                    )}

                                    {activeTab === 'subscriptions' && (
                                        <SubscriptionsTab
                                            subscriptions={subscriptions}
                                            onAddSubClick={() => {
                                                setEditingSub(null);
                                                setSubModalOpen(true);
                                            }}
                                            onEditSubClick={(sub) => {
                                                setEditingSub(sub);
                                                setSubModalOpen(true);
                                            }}
                                            onDeleteSub={deleteSub}
                                        />
                                    )}

                                    {activeTab === 'invites' && (
                                        <InvitesTab
                                            invites={invites}
                                            onAddInviteClick={() => setInviteModalOpen(true)}
                                            onDeleteInvite={deleteInvite}
                                            onCopyLink={copyToClipboard}
                                            getInviteRegisterLink={getInviteRegisterLink}
                                            formatDate={formatDate}
                                            isExpired={isExpired}
                                        />
                                    )}

                                    {activeTab === 'settings' && (
                                        <SettingsTab
                                            settingsForm={settingsForm}
                                            setSettingsForm={setSettingsForm}
                                            onSaveSettings={saveSettings}
                                            actionLoading={actionLoading}
                                        />
                                    )}
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {clientModalOpen && (
                    <ClientModal
                        isOpen={clientModalOpen}
                        onClose={() => setClientModalOpen(false)}
                        editingClient={editingClient}
                        subscriptions={subscriptions}
                        onSave={saveClient}
                        actionLoading={actionLoading}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {devicesModalOpen && selectedClientForDevices && (
                    <DevicesModal
                        isOpen={devicesModalOpen}
                        onClose={() => setDevicesModalOpen(false)}
                        client={selectedClientForDevices}
                        devices={clientDevices}
                        loadingDevices={loadingDevices}
                        onRevokeDevice={revokeDevice}
                        formatDate={formatDate}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {qrModalOpen && selectedClientForQr && (
                    <QrModal
                        isOpen={qrModalOpen}
                        onClose={() => setQrModalOpen(false)}
                        client={selectedClientForQr}
                        getSubscriptionLink={getSubscriptionLink}
                        onCopyLink={copyToClipboard}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {subModalOpen && (
                    <SubModal
                        isOpen={subModalOpen}
                        onClose={() => setSubModalOpen(false)}
                        editingSub={editingSub}
                        onSave={saveSub}
                        actionLoading={actionLoading}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {inviteModalOpen && (
                    <InviteModal
                        isOpen={inviteModalOpen}
                        onClose={() => setInviteModalOpen(false)}
                        onSave={saveInvite}
                        actionLoading={actionLoading}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
