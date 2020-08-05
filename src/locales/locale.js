import translationsFr from './translations-fr';
import translationsEn from './translations-en';

import optionsFr from './options-fr';
import optionsEn from './options-en';

export const lang = navigator.languages[0].includes('fr') ? 'fr' : 'en';
export const options = lang === 'fr' ? optionsFr : optionsEn;
export const translations = lang === 'fr' ? translationsFr : translationsEn;
