import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    ru: {
        translation: {
            common: {
                brand: "RemnaForge",
                login: "Войти",
                logout: "Выйти",
                goBack: "Вернуться назад",
                toHome: "На главную",
                copyright: "Все права защищены.",
                loading: "Загрузка..."
            },
            home: {
                subtitle: "Next-gen VLESS Proxy Management",
                titleStart: "Контролируйте свои подписки без ",
                titleAccent: "лишней нагрузки",
                description: "Легковесная панель для проксирования VLESS подписок, разработанная на высокопроизводительном стеке .NET Minimal API и React. Идеально подходит для запуска на ультра-бюджетных серверах.",
                openPanel: "Открыть панель управления",
                featuresTitle: "Возможности системы",
                featuresSubtitle: "Всё необходимое для гибкого менеджмента доступа",
                feature1Title: "Мульти-подписки",
                feature1Desc: "Привязывайте разные апстрим-подписки разным пользователям и гибко управляйте маршрутизацией трафика.",
                feature2Title: "Контроль устройств",
                feature2Desc: "Автоматический учет девайсов по уникальным HWID. Жесткие лимиты на одновременные сессии или режим «безлимит».",
                feature3Title: "Ультра-низкое ОЗУ",
                feature3Desc: "Бэкенд на .NET Minimal API требует всего ~40 МБ памяти, оставляя ресурсы сервера под системные нужды.",
                feature4Title: "Умный кэш и Proxy",
                feature4Desc: "Встроенное кэширование снижает нагрузку на апстрим-серверы, а при необходимости легко отключается"
            },
            login: {
                inviteApplied: "Код приглашения автоматически применен из ссылки!",
                passwordsMismatch: "Пароли не совпадают.",
                invalidInviteUuid: "Код приглашения должен быть корректным UUID (формат: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).",
                regSuccessAutoLogin: "Регистрация прошла успешно! Выполняется автоматический вход...",
                regSuccessLoginManual: "Регистрация успешна! Пожалуйста, войдите в систему.",
                tooManyAttempts: "Слишком много попыток входа. Пожалуйста, подождите.",
                invalidCredentials: "Неверное имя пользователя или пароль.",
                invalidRegData: "Неверные данные для регистрации или занятое имя пользователя.",
                userAlreadyExists: "Пользователь с таким именем уже существует.",
                serverError: "Ошибка сервера ({{status}}). Попробуйте позже.",
                networkError: "Не удалось связаться с сервером. Проверьте подключение к сети.",
                tabLogin: "Вход",
                tabRegister: "Регистрация",
                authHeader: "Авторизация",
                authDesc: "Введите учетные данные для доступа к панели",
                regHeader: "Регистрация",
                regDesc: "Создайте новую учетную запись администратора",
                username: "Имя пользователя",
                password: "Пароль",
                confirmPassword: "Подтверждение пароля",
                inviteCode: "Код приглашения (Опционально)",
                inviteCodeDesc: "Если регистрация ограничена настройками бэкенда, вам понадобится UUID код приглашения",
                btnSubmitLogin: "Войти в систему",
                btnSubmitRegister: "Создать аккаунт",
                totpHeader: "Двухфакторная авторизация",
                totpDesc: "Введите одноразовый код из вашего приложения Authenticator.",
                totpCode: "Код подтверждения",
                btnSubmitTotp: "Подтвердить код",
                invalidTotpCode: "Неверный код TOTP. Пожалуйста, попробуйте еще раз."
            },
            notFound: {
                title: "Страница не найдена",
                description: "Запрашиваемый ресурс был удален, перемещен или никогда не существовал. Пожалуйста, проверьте правильность написания адреса."
            },
            admin: {
                title: "Панель администратора",
                tabs: {
                    clients: "Клиенты",
                    subscriptions: "Подписки",
                    invites: "Инвайты",
                    apikeys: "API Ключи",
                    totp: "2FA Безопасность",
                    settings: "Настройки"
                },
                clients: {
                    title: "Управление клиентами",
                    addBtn: "Добавить клиента",
                    searchPlaceholder: "Поиск клиентов...",
                    table: {
                        name: "Имя",
                        subscription: "Подписка",
                        expireAt: "Истекает",
                        deviceLimit: "Лимит устройств",
                        devicesActive: "Активные устройства",
                        actions: "Действия"
                    },
                    modal: {
                        addTitle: "Создание нового клиента",
                        editTitle: "Редактирование клиента",
                        nameLabel: "Имя клиента",
                        subLabel: "Исходная подписка",
                        expireLabel: "Дата окончания",
                        expireUnlimited: "Безлимитно",
                        limitLabel: "Лимит устройств (0 - безлимит)",
                        saveBtn: "Сохранить",
                        createBtn: "Создать"
                    },
                    devicesModal: {
                        title: "Устройства клиента: {{name}}",
                        noDevices: "У этого клиента пока нет зарегистрированных устройств.",
                        tableHwid: "HWID / Идентификатор",
                        tableIp: "IP адрес",
                        tableLastActive: "Последняя активность",
                        deleteTooltip: "Отвязать устройство",
                        deleteConfirm: "Вы уверены, что хотите отвязать это устройство?"
                    },
                    deleteConfirm: "Вы уверены, что хотите удалить клиента {{name}}?",
                    subLinkCopied: "Ссылка на подписку скопирована в буфер обмена!",
                    copyLink: "Копировать ссылку",
                    qrCode: "QR-код",
                    openClientPage: "Кабинет клиента",
                    unlimited: "Безлимитно",
                    expired: "Истекла",
                    active: "Активна"
                },
                subscriptions: {
                    title: "Исходные подписки (Upstreams)",
                    addBtn: "Добавить подписку",
                    table: {
                        name: "Название",
                        url: "Ссылка на апстрим",
                        customHeaders: "Заголовки",
                        actions: "Действия"
                    },
                    modal: {
                        addTitle: "Добавление исходной подписки",
                        editTitle: "Редактирование подписки",
                        nameLabel: "Название подписки",
                        urlLabel: "Ссылка (VLESS/Subscription URL)",
                        hwidLabel: "Кастомный HWID",
                        deviceOsLabel: "X-Device-OS",
                        verOsLabel: "X-Ver-OS",
                        userAgentLabel: "User-Agent",
                        deviceModelLabel: "X-Device-Model / Модель устройства",
                        appVerLabel: "X-App-Version",
                        acceptEncLabel: "Accept-Encoding",
                        headersSection: "Кастомизация заголовков запроса к апстриму",
                        saveBtn: "Сохранить",
                        createBtn: "Создать"
                    },
                    deleteConfirm: "Вы уверены, что хотите удалить подписку {{name}}? Это может затронуть привязанных клиентов."
                },
                invites: {
                    title: "Коды приглашений для регистрации",
                    addBtn: "Создать инвайт",
                    table: {
                        code: "Код / Ссылка",
                        description: "Описание",
                        expireDays: "Срок действия",
                        created: "Создан",
                        expires: "Истекает",
                        actions: "Действия"
                    },
                    modal: {
                        title: "Создание инвайт-кода",
                        descLabel: "Описание (для кого)",
                        daysLabel: "Срок действия кода (в днях)",
                        createBtn: "Создать"
                    },
                    copied: "Ссылка для регистрации с инвайтом скопирована!",
                    deleteConfirm: "Удалить этот инвайт-код?"
                },
                settings: {
                    title: "Системные настройки",
                    allowReg: "Разрешить публичную регистрацию",
                    useCaching: "Использовать кэширование подписок",
                    cacheDuration: "Длительность кэша (в минутах)",
                    saveBtn: "Сохранить настройки",
                    success: "Настройки успешно сохранены!"
                },
                apikeys: {
                    title: "API Токены"
                },
                totp: {
                    title: "Двухфакторная защита (2FA)"
                }
            },
            client: {
                title: "Кабинет клиента",
                subtitle: "Управление вашим подключением",
                notFoundTitle: "Подписка не найдена",
                notFoundDesc: "Пожалуйста, введите корректный Slug или полную ссылку на вашу подписку.",
                inputPlaceholder: "Введите Slug или ссылку на подписку (например, sub-xxx)",
                btnEnter: "Войти",
                subDetails: "Детали подписки",
                subLink: "Ваша ссылка на подписку",
                copySubBtn: "Скопировать ссылку",
                copiedSub: "Ссылка скопирована в буфер обмена!",
                qrDesc: "Отсканируйте QR-код в мобильном приложении (v2rayTun, Happ, incy) для автоматического импорта.",
                devicesTitle: "Ваши зарегистрированные устройства",
                devicesDesc: "Если вы превысили лимит подключений, удалите неиспользуемые устройства ниже, чтобы освободить место для новых подключений.",
                limitLabel: "Лимит устройств",
                noDevices: "Устройства еще не зарегистрированы. Подключитесь по ссылке выше, чтобы зарегистрировать устройство.",
                tableHwid: "Идентификатор устройства (HWID)",
                tableIp: "IP адрес",
                tableLastActive: "Последняя активность",
                btnRevoke: "Отвязать",
                revokeConfirm: "Отвязать это устройство?",
                revokeSuccess: "Устройство успешно отвязано!",
                instructionTitle: "Как настроить подключение?",
                instruction1: "1. Скопируйте ссылку на подписку выше.",
                androidHapp: "2. Установите клиент с поддержкой HWID: <strong>v2rayTun</strong>, <strong>Happ</strong> или <strong>incy</strong> из Google Play.",
                androidStep3: "3. Откройте приложение, нажмите <strong>+</strong> в правом верхнем углу (или кнопку импорта) и выберите <strong>Импортировать из буфера обмена</strong> (или добавьте по ссылке).",
                androidStep4: "4. Обновите подписку и подключитесь. Ваше устройство автоматически зарегистрируется в системе с помощью уникального HWID.",
                iosHapp: "2. Установите клиент с поддержкой HWID: <strong>v2rayTun</strong>, <strong>Happ</strong> или <strong>incy</strong> из App Store.",
                iosStep3: "3. Откройте приложение, нажмите <strong>+</strong> и импортируйте подписку из буфера обмена (или добавьте по ссылке).",
                iosStep4: "4. Обновите список серверов и подключитесь. Устройство автоматически привяжется к вашему профилю по уникальному HWID.",
                desktopHapp: "2. Установите клиент <strong>incy</strong> или <strong>v2rayTun</strong> для вашей операционной системы (Windows / macOS).",
                desktopStep3: "3. Вставьте вашу ссылку на подписку в менеджер подписок приложения.",
                desktopStep4: "4. Обновите список серверов. Первое успешное подключение автоматически привяжет HWID вашего компьютера в личном кабинете."
            }
        }
    },
    en: {
        translation: {
            common: {
                brand: "RemnaForge",
                login: "Log In",
                logout: "Log Out",
                goBack: "Go Back",
                toHome: "Go to Home",
                copyright: "All rights reserved.",
                loading: "Loading..."
            },
            home: {
                subtitle: "Next-gen VLESS Proxy Management",
                titleStart: "Control your subscriptions without ",
                titleAccent: "extra load",
                description: "A lightweight panel for proxying VLESS subscriptions, built on a high-performance .NET Minimal API and React stack. Perfect for running on ultra-budget servers.",
                openPanel: "Open control panel",
                featuresTitle: "System Features",
                featuresSubtitle: "Everything you need for flexible access management",
                feature1Title: "Multi-subscriptions",
                feature1Desc: "Bind different upstream subscriptions to different users and flexibly manage traffic routing.",
                feature2Title: "Device Control",
                feature2Desc: "Automatic tracking of devices by unique HWIDs. Hard limits on simultaneous sessions or 'unlimited' mode.",
                feature3Title: "Ultra-low RAM",
                feature3Desc: "The backend on .NET Minimal API requires only ~40 MB of RAM, leaving server resources for system needs.",
                feature4Title: "Smart Cache & Proxy",
                feature4Desc: "Built-in caching reduces the load on upstream servers and can be easily disabled if necessary."
            },
            login: {
                inviteApplied: "Invite code automatically applied from the link!",
                passwordsMismatch: "Passwords do not match.",
                invalidInviteUuid: "Invite code must be a valid UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).",
                regSuccessAutoLogin: "Registration successful! Performing automatic login...",
                regSuccessLoginManual: "Registration successful! Please log in.",
                tooManyAttempts: "Too many login attempts. Please wait.",
                invalidCredentials: "Incorrect username or password.",
                invalidRegData: "Invalid registration details or username already taken.",
                userAlreadyExists: "A user with this username already exists.",
                serverError: "Server error ({{status}}). Try again later.",
                networkError: "Failed to connect to the server. Check your network connection.",
                tabLogin: "Log In",
                tabRegister: "Register",
                authHeader: "Authorization",
                authDesc: "Enter your credentials to access the panel",
                regHeader: "Registration",
                regDesc: "Create a new administrator account",
                username: "Username",
                password: "Password",
                confirmPassword: "Confirm Password",
                inviteCode: "Invite Code (Optional)",
                inviteCodeDesc: "If registration is restricted by backend settings, you will need a UUID invite code",
                btnSubmitLogin: "Log In",
                btnSubmitRegister: "Create Account",
                totpHeader: "2FA Verification",
                totpDesc: "Enter the one-time code from your Authenticator app.",
                totpCode: "Verification Code",
                btnSubmitTotp: "Verify & Login",
                invalidTotpCode: "Invalid TOTP verification code"
            },
            notFound: {
                title: "Page Not Found",
                description: "The requested resource was deleted, moved, or never existed. Please check the spelling of the address."
            },
            admin: {
                title: "Admin Dashboard",
                tabs: {
                    clients: "Clients",
                    subscriptions: "Subscriptions",
                    invites: "Invites",
                    apikeys: "API Tokens",
                    totp: "2FA Security",
                    settings: "Settings"
                },
                clients: {
                    title: "Client Management",
                    addBtn: "Add Client",
                    searchPlaceholder: "Search clients...",
                    table: {
                        name: "Name",
                        subscription: "Subscription",
                        expireAt: "Expires",
                        deviceLimit: "Device Limit",
                        devicesActive: "Active Devices",
                        actions: "Actions"
                    },
                    modal: {
                        addTitle: "Create New Client",
                        editTitle: "Edit Client",
                        nameLabel: "Client Name",
                        subLabel: "Upstream Subscription",
                        expireLabel: "Expiration Date",
                        expireUnlimited: "Unlimited",
                        limitLabel: "Device Limit (0 for unlimited)",
                        saveBtn: "Save",
                        createBtn: "Create"
                    },
                    devicesModal: {
                        title: "Client Devices: {{name}}",
                        noDevices: "This client has no registered devices yet.",
                        tableHwid: "HWID / Identifier",
                        tableIp: "IP Address",
                        tableLastActive: "Last Active",
                        deleteTooltip: "Revoke Device",
                        deleteConfirm: "Are you sure you want to revoke this device?"
                    },
                    deleteConfirm: "Are you sure you want to delete client {{name}}?",
                    subLinkCopied: "Subscription link copied to clipboard!",
                    copyLink: "Copy Link",
                    qrCode: "QR Code",
                    openClientPage: "Client Page",
                    unlimited: "Unlimited",
                    expired: "Expired",
                    active: "Active"
                },
                subscriptions: {
                    title: "Upstream Subscriptions",
                    addBtn: "Add Subscription",
                    table: {
                        name: "Name",
                        url: "Upstream URL",
                        customHeaders: "Headers",
                        actions: "Actions"
                    },
                    modal: {
                        addTitle: "Add Upstream Subscription",
                        editTitle: "Edit Subscription",
                        nameLabel: "Subscription Name",
                        urlLabel: "URL (VLESS/Subscription URL)",
                        hwidLabel: "Custom HWID",
                        deviceOsLabel: "X-Device-OS",
                        verOsLabel: "X-Ver-OS",
                        userAgentLabel: "User-Agent",
                        deviceModelLabel: "X-Device-Model",
                        appVerLabel: "X-App-Version",
                        acceptEncLabel: "Accept-Encoding",
                        headersSection: "Upstream Custom Request Headers",
                        saveBtn: "Save",
                        createBtn: "Create"
                    },
                    deleteConfirm: "Are you sure you want to delete subscription {{name}}? This may affect linked clients."
                },
                invites: {
                    title: "Registration Invite Codes",
                    addBtn: "Create Invite",
                    table: {
                        code: "Code / Link",
                        description: "Description",
                        expireDays: "Validity Period",
                        created: "Created",
                        expires: "Expires",
                        actions: "Actions"
                    },
                    modal: {
                        title: "Create Invite Code",
                        descLabel: "Description (for whom)",
                        daysLabel: "Code validity (days)",
                        createBtn: "Create"
                    },
                    copied: "Invite registration link copied!",
                    deleteConfirm: "Delete this invite code?"
                },
                settings: {
                    title: "System Settings",
                    allowReg: "Allow Public Registration",
                    useCaching: "Use Subscription Caching",
                    cacheDuration: "Cache Duration (minutes)",
                    saveBtn: "Save Settings",
                    success: "Settings saved successfully!"
                },
                apikeys: {
                    title: "API Tokens"
                },
                totp: {
                    title: "Two-Factor Authentication (2FA)"
                }
            },
            client: {
                title: "Client Portal",
                subtitle: "Manage your VPN connection",
                notFoundTitle: "Subscription Not Found",
                notFoundDesc: "Please enter a valid Slug or complete subscription link.",
                inputPlaceholder: "Enter Slug or subscription link (e.g. sub-xxx)",
                btnEnter: "Enter",
                subDetails: "Subscription Details",
                subLink: "Your Subscription Link",
                copySubBtn: "Copy Link",
                copiedSub: "Link copied to clipboard!",
                qrDesc: "Scan this QR code in your mobile application (v2rayTun, Happ, incy) to import automatically.",
                devicesTitle: "Your Registered Devices",
                devicesDesc: "If you have exceeded your connection limit, remove unused devices below to free up slots for new connections.",
                limitLabel: "Device Limit",
                noDevices: "No devices registered yet. Connect using the link above to register a device.",
                tableHwid: "Device Identifier (HWID)",
                tableIp: "IP Address",
                tableLastActive: "Last Active",
                btnRevoke: "Revoke",
                revokeConfirm: "Revoke this device?",
                revokeSuccess: "Device successfully revoked!",
                instructionTitle: "How to configure your connection?",
                instruction1: "1. Copy the subscription link above.",
                androidHapp: "2. Install an app with HWID support: <strong>v2rayTun</strong>, <strong>Happ</strong>, or <strong>incy</strong> from the Google Play Store.",
                androidStep3: "3. Open the app, tap <strong>+</strong> (or import button) and choose <strong>Import from Clipboard</strong> (or add by URL).",
                androidStep4: "4. Update the subscription and connect. Your device will automatically register in the system using its unique HWID.",
                iosHapp: "2. Install an app with HWID support: <strong>v2rayTun</strong>, <strong>Happ</strong>, or <strong>incy</strong> from the App Store.",
                iosStep3: "3. Open the app, tap <strong>+</strong> and import the subscription from your clipboard (or add by URL).",
                iosStep4: "4. Update the server list and connect. The device will automatically bind to your profile using its unique HWID.",
                desktopHapp: "2. Install <strong>incy</strong> or <strong>v2rayTun</strong> for your operating system (Windows / macOS).",
                desktopStep3: "3. Paste your subscription link into the app's subscription manager.",
                desktopStep4: "4. Update the server list. The first successful connection will automatically bind your computer's HWID to this subscription."
            }
        }
    }
};

const savedLanguage = localStorage.getItem('i18nextLng') || 'ru';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'ru',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
});

export default i18n;
