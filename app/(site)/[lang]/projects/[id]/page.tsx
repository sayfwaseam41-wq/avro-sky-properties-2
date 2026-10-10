import Link from 'next/link';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {getCachedProject,getCachedProperties,localProject,localProperties} from '@/lib/public-data';
import {PropertyCard} from '@/components/property-card';
import {ArrowIcon,PinIcon} from '@/components/icons';
import {siteName} from '@/config/site';
import {fmt,localePath} from '@/lib/i18n/config';
import {areaName} from '@/lib/i18n/areas';
import {getDict} from '@/lib/i18n/dict';
import {alternates,langFrom} from '@/lib/i18n/server';

export const revalidate=60;
/** No pages are built ahead of time; each project page is generated on first visit, then cached and refreshed every minute. */
export async function generateStaticParams(){return [];}

type Params={params:Promise<{lang:string;id:string}>};

export async function generateMetadata({params}:Params){
  const {lang:rawLang,id}=await params;
  const lang=await langFrom(Promise.resolve({lang:rawLang}));
  const project=await getCachedProject(id).then(x=>x&&localProject(x,lang));
  if(!project)return {title:getDict(lang).projects.metaTitle};
  const description=(project.description||fmt(getDict(lang).projects.metaDesc,{site:siteName(lang)})).slice(0,200);
  return {title:project.name,description,alternates:alternates(lang,`/projects/${project.id}`),openGraph:{title:project.name,description,...(project.coverUrl?{images:[project.coverUrl]}:{})}};
}

export default async function ProjectPage({params}:Params){
  const {lang:rawLang,id}=await params;
  const lang=await langFrom(Promise.resolve({lang:rawLang}));
  const t=getDict(lang);
  const p=t.projects;
  const project=await getCachedProject(id).then(x=>x&&localProject(x,lang));
  if(!project)notFound();
  const homes=localProperties(await getCachedProperties().catch(()=>[]),lang).filter(home=>home.projectId===project.id);
  const to=(path:string)=>localePath(lang,path);
  return <>
    <section className="page-head">
      <div className="wrap">
        <nav className="crumbs crumbs-light" aria-label={t.detail.breadcrumb}><Link href={to('/')}>{t.common.home}</Link><span aria-hidden="true">/</span><Link href={to('/projects')}>{t.common.projects}</Link><span aria-hidden="true">/</span><span aria-current="page">{project.name}</span></nav>
        <h1>{project.name}</h1>
        <p>{[project.developer?fmt(p.by,{developer:project.developer}):'',project.area?areaName(lang,project.area):''].filter(Boolean).join(' · ')}</p>
      </div>
    </section>
    <section className="section">
      <div className="wrap project-body">
        {project.coverUrl&&<div className="project-cover"><Image src={project.coverUrl} alt={project.name} fill priority sizes="(min-width:1024px) 760px,100vw"/></div>}
        {project.description&&<p className="prose project-text" dir="auto">{project.description}</p>}
        {project.area&&<p className="detail-area"><PinIcon size={18}/>{areaName(lang,project.area)}</p>}
      </div>
    </section>
    <section className="section section-tint" aria-labelledby="homes-h">
      <div className="wrap">
        <header className="section-head split"><div><h2 id="homes-h">{p.availableHomes}</h2></div><Link className="text-link" href={`${to('/properties')}?project=${encodeURIComponent(project.id)}`}>{p.seeAll}<ArrowIcon size={16}/></Link></header>
        {homes.length
          ?<div className="grid">{homes.map(home=><PropertyCard key={home.id} property={home} lang={lang} t={t}/>)}</div>
          :<div className="empty"><h3>{p.noListings}</h3><p>{p.emptyHomes}</p><Link className="btn btn-gold" href={to('/request')}>{t.home.requestProperty}</Link></div>}
        <p className="project-back"><Link className="text-link" href={to('/projects')}>{p.back}<ArrowIcon size={16}/></Link></p>
      </div>
    </section>
  </>;
}
