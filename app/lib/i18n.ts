import zhHK from '../../public/locales/zh-HK.json'
import enUS from '../../public/locales/en-US.json'
import zhCN from '../../public/locales/zh-CN.json'

export const translations = {
    'zh-HK': zhHK,
    'en-US': enUS,
    'zh-CN': zhCN,
}

export type Language = keyof typeof translations
export const LANG_KEYS = [
    { key: 'zh-HK', label: '繁' },
    { key: 'en-US', label: 'EN' },
    { key: 'zh-CN', label: '简' },
] as const
export type TranslationType = typeof zhHK
