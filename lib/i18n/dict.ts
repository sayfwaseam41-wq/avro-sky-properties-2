import 'server-only';
import {en,type Dict} from './en';
import {ar} from './ar';
import type {Lang} from './config';

const dictionaries:Record<Lang,Dict>={en,ar};
/** Server-side lookup. Client components read the active dictionary from the I18nProvider instead. */
export const getDict=(lang:Lang)=>dictionaries[lang];
