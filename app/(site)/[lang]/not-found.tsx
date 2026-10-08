'use client';
import Link from 'next/link';
import {useI18n} from '@/components/i18n-provider';

export default function NotFound(){
  const {t,path}=useI18n();
  return <section className="section"><div className="wrap empty"><h1>{t.notFound.h1}</h1><p>{t.notFound.text}</p><div className="empty-actions"><Link className="btn btn-gold" href={path('/properties')}>{t.notFound.browse}</Link><Link className="btn btn-outline" href={path('/request')}>{t.notFound.request}</Link></div></div></section>;
}
