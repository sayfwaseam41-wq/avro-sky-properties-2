'use client';

import {useActionState,useEffect,useState} from 'react';
import {upload} from '@vercel/blob/client';
import type {Project,Review,TeamMember} from '@/lib/content';
import {removeProjectAction,removeReviewAction,removeTeamAction,saveProjectAction,saveReviewAction,saveTeamAction,type ContentState} from '@/app/(admin)/admin/content-actions';
import {useAdminI18n} from './admin-i18n-provider';
import {TranslationFields} from './translation-fields';

const initial:ContentState={};
type Action=(state:ContentState,form:FormData)=>Promise<ContentState>;

/** Calls `onSaved` once each time the server reports a successful save. */
function useOnSaved(state:ContentState,onSaved:()=>void){
  useEffect(()=>{if(state.saved)onSaved();},[state.saved]);
}

/** A photo address field with an upload button next to it. */
function PhotoField({name,label,defaultValue}:{name:string;label:string;defaultValue?:string}){
  const {a}=useAdminI18n();const c=a.content;
  const [url,setUrl]=useState(defaultValue||'');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  async function pick(files:FileList|null){
    const file=files?.[0];
    if(!file)return;
    setBusy(true);setError('');
    try{const result=await upload(`content/${Date.now()}-${file.name}`,file,{access:'public',handleUploadUrl:'/api/admin/uploads'});setUrl(result.url);}
    catch{setError(c.uploadFailed);}
    finally{setBusy(false);}
  }
  return <>
    <label className="field full">{label}<input name={name} dir="ltr" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://" autoComplete="off"/></label>
    <label className="field full">{c.upload}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>pick(e.target.files)} disabled={busy}/><small>{busy?c.uploading:c.uploadHint}</small>{error&&<span className="admin-inline-error">{error}</span>}</label>
  </>;
}

function FormFooter({state,pending,editing,onCancel}:{state:ContentState;pending:boolean;editing:boolean;onCancel?:()=>void}){
  const {a}=useAdminI18n();const c=a.content;
  return <>
    {state.error&&<p className="error-message">{state.error}</p>}
    <div className="admin-actions">{onCancel&&<button type="button" className="button secondary" onClick={onCancel}>{c.cancel}</button>}<button className="button" type="submit" disabled={pending}>{pending?a.common.saving:editing?c.save:c.add}</button></div>
  </>;
}

function ProjectForm({item,onSaved,onCancel}:{item?:Project;onSaved:()=>void;onCancel?:()=>void}){
  const {a}=useAdminI18n();const c=a.content;
  const [state,action,pending]=useActionState(saveProjectAction,initial);
  useOnSaved(state,onSaved);
  return <form action={action} className="admin-form">
    {item&&<input type="hidden" name="id" value={item.id}/>}
    <label className="field full">{c.fName}<input name="name" defaultValue={item?.name} required maxLength={120}/></label>
    <label className="field">{c.fDeveloper}<input name="developer" defaultValue={item?.developer} maxLength={120}/></label>
    <label className="field">{c.fArea}<input name="area" defaultValue={item?.area} maxLength={120}/></label>
    <PhotoField name="coverUrl" label={c.fCover} defaultValue={item?.coverUrl}/>
    <label className="field full">{c.fDescription}<textarea name="description" rows={4} defaultValue={item?.description} maxLength={4000}/></label>
    <TranslationFields values={item?.translations} fields={[{name:'name',label:c.fName,max:120},{name:'developer',label:c.fDeveloper,max:120},{name:'description',label:c.fDescription,multiline:true,max:4000}]}/>
    <label className="field">{c.fOrder}<input name="sortOrder" type="number" min="0" max="9999" step="1" defaultValue={item?.sortOrder??0}/><small>{c.sortHint}</small></label>
    <label className="admin-checkbox full"><input name="isPublic" type="checkbox" defaultChecked={item?.isPublic??true}/> {c.fPublic}</label>
    <FormFooter state={state} pending={pending} editing={Boolean(item)} onCancel={onCancel}/>
  </form>;
}

function TeamForm({item,onSaved,onCancel}:{item?:TeamMember;onSaved:()=>void;onCancel?:()=>void}){
  const {a}=useAdminI18n();const c=a.content;
  const [state,action,pending]=useActionState(saveTeamAction,initial);
  useOnSaved(state,onSaved);
  return <form action={action} className="admin-form">
    {item&&<input type="hidden" name="id" value={item.id}/>}
    <label className="field">{c.fName}<input name="name" defaultValue={item?.name} required maxLength={120}/></label>
    <label className="field">{c.fRole}<input name="roleTitle" defaultValue={item?.roleTitle} maxLength={120}/></label>
    <TranslationFields values={item?.translations} fields={[{name:'name',label:c.fName,max:120},{name:'roleTitle',label:c.fRole,max:120}]}/>
    <PhotoField name="photoUrl" label={c.fPhoto} defaultValue={item?.photoUrl}/>
    <label className="field">{c.fOrder}<input name="sortOrder" type="number" min="0" max="9999" step="1" defaultValue={item?.sortOrder??0}/><small>{c.sortHint}</small></label>
    <label className="admin-checkbox full"><input name="isPublic" type="checkbox" defaultChecked={item?.isPublic??true}/> {c.fPublic}</label>
    <FormFooter state={state} pending={pending} editing={Boolean(item)} onCancel={onCancel}/>
  </form>;
}

function ReviewForm({item,onSaved,onCancel}:{item?:Review;onSaved:()=>void;onCancel?:()=>void}){
  const {a}=useAdminI18n();const c=a.content;
  const [state,action,pending]=useActionState(saveReviewAction,initial);
  useOnSaved(state,onSaved);
  return <form action={action} className="admin-form">
    {item&&<input type="hidden" name="id" value={item.id}/>}
    <label className="field">{c.fAuthor}<input name="author" defaultValue={item?.author} required maxLength={120}/></label>
    <label className="field">{c.fRating}<select name="rating" defaultValue={item?.rating??5}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
    <label className="field full">{c.fReview}<textarea name="body" rows={4} defaultValue={item?.body} required maxLength={1200}/><small>{c.reviewNote}</small></label>
    <TranslationFields values={item?.translations} fields={[{name:'author',label:c.fAuthor,max:120},{name:'body',label:c.fReview,multiline:true,max:1200}]}/>
    <label className="field">{c.fOrder}<input name="sortOrder" type="number" min="0" max="9999" step="1" defaultValue={item?.sortOrder??0}/><small>{c.sortHint}</small></label>
    <label className="admin-checkbox full"><input name="isPublic" type="checkbox" defaultChecked={item?.isPublic??true}/> {c.fPublic}</label>
    <FormFooter state={state} pending={pending} editing={Boolean(item)} onCancel={onCancel}/>
  </form>;
}

function DeleteForm({action,id}:{action:Action;id:string}){
  const {a}=useAdminI18n();const c=a.content;
  const [state,formAction,pending]=useActionState(action,initial);
  return <form action={formAction} onSubmit={e=>{if(!confirm(c.confirmDelete))e.preventDefault();}}>
    <input type="hidden" name="id" value={id}/>
    <button className="admin-delete" type="submit" disabled={pending}>{pending?c.deleting:c.del}</button>
    {state.error&&<p className="admin-inline-error">{state.error}</p>}
  </form>;
}

type Item={id:string;title:string;meta:string;isPublic:boolean};
/** One content type: an add form on top, then the saved items with edit and delete. */
function Panel<T extends {id:string}>({kicker,heading,items,describe,remove,renderForm}:{
  kicker:string;heading:string;items:T[];describe:(item:T)=>Item;remove:Action;
  renderForm:(item:T|undefined,onSaved:()=>void,onCancel?:()=>void)=>React.ReactNode;
}){
  const {a,fmt}=useAdminI18n();const c=a.content;
  const [editing,setEditing]=useState<T>();
  const [resetKey,setResetKey]=useState(0);
  return <>
    <section className="admin-panel">
      <div className="admin-section-heading"><div><p className="kicker">{kicker}</p><h2>{heading}</h2></div></div>
      <div key={resetKey}>{renderForm(undefined,()=>setResetKey(k=>k+1))}</div>
    </section>
    <section className="admin-panel">
      <div className="admin-section-heading"><div><p className="kicker">{kicker}</p><h2>{heading}</h2></div><span>{items.length}</span></div>
      {items.length?<div className="admin-list">{items.map(item=>{const row=describe(item);return <article className="admin-row" key={item.id}>
        <div><strong>{row.title}</strong><span>{row.meta}{row.isPublic?'':` · ${c.hidden}`}</span></div>
        <div className="admin-row-actions"><button type="button" className="admin-edit" onClick={()=>setEditing(item)}>{c.edit}</button><DeleteForm action={remove} id={item.id}/></div>
      </article>;})}</div>:<p>{c.none}</p>}
    </section>
    {editing&&<div className="admin-modal" role="dialog" aria-modal="true" aria-label={fmt(a.basic.editAria,{title:describe(editing).title})}>
      <div className="admin-modal-card">
        <div className="admin-section-heading"><h2>{c.edit}</h2><button type="button" className="admin-close" onClick={()=>setEditing(undefined)} aria-label={a.common.close}>×</button></div>
        {renderForm(editing,()=>setEditing(undefined),()=>setEditing(undefined))}
      </div>
    </div>}
  </>;
}

export function ContentManager({projects,team,reviews}:{projects:Project[];team:TeamMember[];reviews:Review[]}){
  const {a}=useAdminI18n();const c=a.content;
  return <>
    <Panel kicker={c.projectTitle} heading={c.projects} items={projects} remove={removeProjectAction}
      describe={p=>({id:p.id,title:p.name,meta:[p.developer,p.area].filter(Boolean).join(' · ')||'—',isPublic:p.isPublic})}
      renderForm={(item,onSaved,onCancel)=><ProjectForm key={item?.id} item={item} onSaved={onSaved} onCancel={onCancel}/>}/>
    <Panel kicker={c.teamTitle} heading={c.team} items={team} remove={removeTeamAction}
      describe={m=>({id:m.id,title:m.name,meta:m.roleTitle||'—',isPublic:m.isPublic})}
      renderForm={(item,onSaved,onCancel)=><TeamForm key={item?.id} item={item} onSaved={onSaved} onCancel={onCancel}/>}/>
    <Panel kicker={c.reviewTitle} heading={c.reviews} items={reviews} remove={removeReviewAction}
      describe={r=>({id:r.id,title:r.author,meta:`${'★'.repeat(r.rating)} · ${r.body.slice(0,70)}${r.body.length>70?'…':''}`,isPublic:r.isPublic})}
      renderForm={(item,onSaved,onCancel)=><ReviewForm key={item?.id} item={item} onSaved={onSaved} onCancel={onCancel}/>}/>
  </>;
}
