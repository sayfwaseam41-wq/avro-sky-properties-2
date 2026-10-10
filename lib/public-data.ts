import 'server-only';
import {cache} from 'react';
import {unstable_cache} from 'next/cache';
import {getProperties,getPublicProperty} from './property-store';
import {getDict} from './i18n/dict';
import type {Lang} from './i18n/config';
import {localizeProperty,type Property} from './property';
import {localizeProject,localizeReview,localizeTeamMember,type Project,type Review,type TeamMember} from './content';
import {getProject,getProjects,getReviews,getTeam} from './content-store';

/** Public reads are cached for a minute and expired immediately by admin writes (tag: "properties"). */
export const propertiesTag='properties';
const options={tags:[propertiesTag],revalidate:60};

export const getCachedProperties=unstable_cache(getProperties,['public-properties'],options);
const loadProperty=unstable_cache(getPublicProperty,['public-property'],options);
/** `cache` dedupes the lookup between generateMetadata and the page within one render. */
export const getCachedProperty=cache((id:string)=>loadProperty(id));

/** Projects, team and reviews are cached the same way and expired by admin saves (tag: "content"). */
export const contentTag='content';
const contentOptions={tags:[contentTag],revalidate:60};
export const getCachedProjects=unstable_cache(()=>getProjects(true),['public-projects'],contentOptions);
const loadProject=unstable_cache(getProject,['public-project'],contentOptions);
export const getCachedProject=cache((id:string)=>loadProject(id));
export const getCachedTeam=unstable_cache(()=>getTeam(true),['public-team'],contentOptions);
export const getCachedReviews=unstable_cache(()=>getReviews(true),['public-reviews'],contentOptions);

/** Visitor-language versions of the cached data. Anything staff did not translate stays in English. */
export const localProperty=(p:Property,lang:Lang)=>localizeProperty(p,lang,getDict(lang).extras.photoWord);
export const localProperties=(list:Property[],lang:Lang)=>list.map(p=>localProperty(p,lang));
export const localProject=(x:Project,lang:Lang)=>localizeProject(x,lang);
export const localProjects=(list:Project[],lang:Lang)=>list.map(x=>localizeProject(x,lang));
export const localTeam=(list:TeamMember[],lang:Lang)=>list.map(x=>localizeTeamMember(x,lang));
export const localReviews=(list:Review[],lang:Lang)=>list.map(x=>localizeReview(x,lang));
