'use client';
import Link from 'next/link';
import {useI18n} from '@/components/i18n-provider';

export default function PublicError({reset}:{reset:()=>void}){
  const {t,path}=useI18n();
  return <section className="section"><div className="wrap empty" role="alert"><h1>{t.error.h1}</h1><p>{t.error.text}</p><div className="empty-actions"><button type="button" className="btn btn-gold" onClick={reset}>{t.error.retry}</button><Link className="btn btn-outline" href={path('/request')}>{t.error.request}</Link></div></div></section>;
}
