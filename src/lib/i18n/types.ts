export type Locale = 'en' | 'ar';

export type Direction = 'ltr' | 'rtl';

export interface TranslationKeys {
  // Navigation
  home: string;
  about: string;
  services: string;
  contact: string;
  
  // Common actions
  submit: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  search: string;
  
  // Authentication
  login: string;
  register: string;
  logout: string;
  email: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  rememberMe: string;
  
  // Messages
  welcome: string;
  success: string;
  error: string;
  loading: string;
  noResults: string;
  
  // Form validation
  required: string;
  invalid: string;
  tooShort: string;
  tooLong: string;
  
  // Common UI
  close: string;
  open: string;
  next: string;
  previous: string;
  select: string;
  selectOption: string;
  
  // Status
  active: string;
  inactive: string;
  pending: string;
  completed: string;
  
  // Time
  today: string;
  yesterday: string;
  tomorrow: string;
  now: string;
  
  // General
  name: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: string;
  actions: string;
}

export interface LanguageContextType {
  locale: Locale;
  direction: Direction;
  translations: TranslationKeys;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationKeys) => string;
}

export interface LocaleConfig {
  locale: Locale;
  direction: Direction;
  label: string;
  flag: string;
}