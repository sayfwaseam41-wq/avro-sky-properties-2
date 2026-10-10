import type {Lang} from './i18n/config';
import {pick,translationsFromForm,type Translations} from './translations';

/** Website content that staff edit in the admin area: development projects, team members and client reviews. */
export type Project={id:string;name:string;developer:string;area:string;description:string;coverUrl:string;sortOrder:number;isPublic:boolean;translations?:Translations};
export type TeamMember={id:string;name:string;roleTitle:string;photoUrl:string;sortOrder:number;isPublic:boolean;translations?:Translations};
export type Review={id:string;author:string;body:string;rating:number;sortOrder:number;isPublic:boolean;translations?:Translations};

function text(form:FormData,key:string,max:number){return String(form.get(key)||'').trim().slice(0,max);}
function required(form:FormData,key:string,max:number,label:string){const value=text(form,key,max);if(!value)throw new Error(`${label} is required.`);return value;}
function imageUrl(form:FormData,key:string,label:string){const value=text(form,key,2000);if(value&&!/^https:\/\//.test(value))throw new Error(`${label} must start with https://`);return value;}
function whole(form:FormData,key:string,min:number,max:number,fallback:number,label:string){
  const raw=String(form.get(key)??'').trim();
  if(raw==='')return fallback;
  const value=Number(raw);
  if(!Number.isInteger(value)||value<min||value>max)throw new Error(`${label} must be a whole number from ${min} to ${max}.`);
  return value;
}

/** Fields staff can translate (Arabic and Kurdish boxes in the admin area). */
export const projectTranslatedFields=['name','developer','description'] as const;
export const teamTranslatedFields=['name','roleTitle'] as const;
export const reviewTranslatedFields=['author','body'] as const;

export type ProjectFields=Omit<Project,'id'>;
export type TeamFields=Omit<TeamMember,'id'>;
export type ReviewFields=Omit<Review,'id'>;

export function projectFromForm(form:FormData):ProjectFields{
  return {name:required(form,'name',120,'Name'),developer:text(form,'developer',120),area:text(form,'area',120),description:text(form,'description',4000),coverUrl:imageUrl(form,'coverUrl','Cover photo URL'),sortOrder:whole(form,'sortOrder',0,9999,0,'Sort order'),isPublic:form.get('isPublic')==='on',translations:translationsFromForm(form,projectTranslatedFields,{name:120,developer:120})};
}
export function teamFromForm(form:FormData):TeamFields{
  return {name:required(form,'name',120,'Name'),roleTitle:text(form,'roleTitle',120),photoUrl:imageUrl(form,'photoUrl','Photo URL'),sortOrder:whole(form,'sortOrder',0,9999,0,'Sort order'),isPublic:form.get('isPublic')==='on',translations:translationsFromForm(form,teamTranslatedFields,{name:120,roleTitle:120})};
}
export function reviewFromForm(form:FormData):ReviewFields{
  return {author:required(form,'author',120,'Client name'),body:required(form,'body',1200,'Review text'),rating:whole(form,'rating',1,5,5,'Rating'),sortOrder:whole(form,'sortOrder',0,9999,0,'Sort order'),isPublic:form.get('isPublic')==='on',translations:translationsFromForm(form,reviewTranslatedFields,{author:120,body:1200})};
}

/** Two initials for a team member without a photo. */
export function initials(name:string){return name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(part=>Array.from(part)[0]).join('').toUpperCase();}

/** Names, roles and reviews in the visitor's language; English when no translation was entered. */
export function localizeProject(x:Project,lang:Lang):Project{return lang==='en'?x:{...x,name:pick(x.translations,lang,'name',x.name),developer:pick(x.translations,lang,'developer',x.developer),description:pick(x.translations,lang,'description',x.description)};}
export function localizeTeamMember(x:TeamMember,lang:Lang):TeamMember{return lang==='en'?x:{...x,name:pick(x.translations,lang,'name',x.name),roleTitle:pick(x.translations,lang,'roleTitle',x.roleTitle)};}
export function localizeReview(x:Review,lang:Lang):Review{return lang==='en'?x:{...x,author:pick(x.translations,lang,'author',x.author),body:pick(x.translations,lang,'body',x.body)};}
