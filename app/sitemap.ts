import type {MetadataRoute} from 'next';
import {getCachedProjects,getCachedProperties} from '@/lib/public-data';
import {langs,localePath} from '@/lib/i18n/config';

export const revalidate=3600;
const origin=process.env.NEXT_PUBLIC_SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:'http://localhost:3000');

/** One entry per page, each listing its versions in every language. */
function entry(path:string,changeFrequency:'daily'|'weekly'|'monthly',priority:number,lastModified?:string):MetadataRoute.Sitemap[number][]{
  const languages=Object.fromEntries(langs.map(lang=>[lang,origin+localePath(lang,path)]));
  return langs.map(lang=>({url:origin+localePath(lang,path),changeFrequency,priority,alternates:{languages},...(lastModified?{lastModified}:{})})) as never;
}

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const properties=await getCachedProperties().catch(()=>[]);
  const projects=await getCachedProjects().catch(()=>[]);
  return [
    ...entry('/','weekly',1),
    ...entry('/properties','daily',0.9),
    ...entry('/request','monthly',0.6),
    ...entry('/about','monthly',0.5),
    ...(projects.length?entry('/projects','weekly',0.7):[]),
    ...projects.flatMap(project=>entry(`/projects/${project.id}`,'weekly',0.6)),
    ...properties.flatMap(p=>entry(`/properties/${p.id}`,'weekly',0.7,p.dateListed)),
  ];
}
