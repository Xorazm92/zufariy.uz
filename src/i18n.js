import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // tarjimalarni serverdan yuklaydi
  .use(initReactI18next) // i18n ni react-i18next ga uzatadi
  .init({
    lng: 'uz', // standart til
    fallbackLng: 'uz', // agar tanlangan til mavjud bo'lmasa, 'uz' tilidan foydalanadi

    backend: {
      // tarjima fayllarini qayerdan yuklash kerakligi
      loadPath: '/locales/{{lng}}/translation.json',
    },

    interpolation: {
      escapeValue: false, // React XSS hujumlaridan o'zi himoya qiladi
    },
  });

export default i18n;
