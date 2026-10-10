import Link from 'next/link';
import Image from 'next/image';
import {getCachedProjects,getCachedProperties,localProjects,localProperties} from '@/lib/public-data';
import {siteName} from '@/config/site';
import {fmt,localePath} from '@/lib/i18n/config';
import {getDict} from '@/lib/i18n/dict';
import {alternates,langFrom,type LangParams} from '@/lib/i18n/server';
import {PinIcon} from '@/components/icons';
import {areaName} from '@/lib/i18n/areas';

export const revalidate=60;

export async function generateMetadata({params}:LangParams){
  const lang=await langFrom(params);
  const t=getDict(lang).projects;
  return {title:t.metaTitle,description:fmt(t.metaDesc,{site:siteName(lang)}),alternates:alternates(lang,'/projects')};
}

export default async function Projects({params}:LangParams){
  const lang=await langFrom(params);
  const t=getDict(lang);
  const p=t.projects;
  const [projects,properties]=await Promise.all([getCachedProjects().catch(()=>[]).then(x=>localProjects(x,lang)),getCachedProperties().catch(()=>[]).then(x=>localProperties(x,lang))]);
  const counts=new Map<string,number>();
  for(const property of properties)if(property.projectId)counts.set(property.projectId,(counts.get(property.projectId)||0)+1);
  return <>
    <section className="page-head"><div className="wrap"><p className="eyebrow eyebrow-light">{p.eyebrow}</p><h1>{p.h1}</h1><p>{p.lede}</p></div></section>
    <section className="section section-tint section-flush">
      <div className="wrap">
        {projects.length
          ?<div className="grid">{projects.map(project=>{
            const href=localePath(lang,`/projects/${project.id}`);
            const count=counts.get(project.id)||0;
            return <article className="card" key={project.id}>
              <Link href={href} className="card-media" tabIndex={-1} aria-hidden="true">
                {project.coverUrl
                  ?<Image src={project.coverUrl} alt="" fill sizes="(min-width:1024px) 360px,(min-width:640px) 50vw,100vw"/>
                  :<span className="card-placeholder" aria-hidden="true"><Image src="/brand/mark-96.webp" alt="" width={72} height={81} unoptimized/></span>}
              </Link>
              <div className="card-body">
                <h2><Link href={href}>{project.name}</Link></h2>
                {project.developer&&<p className="card-area">{fmt(p.by,{developer:project.developer})}</p>}
                {project.area&&<p className="card-area"><PinIcon size={16}/>{areaName(lang,project.area)}</p>}
                <p className="card-area">{count?fmt(p.listingsCount,{n:count}):p.noListings}</p>
                <div className="card-actions"><Link className="btn btn-outline btn-sm" href={href}>{p.viewProject}</Link></div>
              </div>
            </article>;
          })}</div>
          :<div className="empty"><h2>{p.empty}</h2><p>{t.home.preparingText}</p><Link className="btn btn-gold" href={localePath(lang,'/request')}>{t.home.requestProperty}</Link></div>}
      </div>
    </section>
  </>;
}
