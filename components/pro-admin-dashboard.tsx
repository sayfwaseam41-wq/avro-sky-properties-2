'use client';

import {useActionState,useMemo,useState} from 'react';
import {addClient,addRental,addSale,addStaff,addTemplate,closeRental,editClient,editStaff,payRent,removeClient,removeTemplate,type ActionState} from '@/app/(admin)/admin/actions';
import type {Activity,Client,MessageTemplate,Payment,Rental,Sale,StaffMember} from '@/lib/admin-store';
import type {Property} from '@/lib/property';
import {site} from '@/config/site';
import {renderReminder,whatsappUrl} from '@/lib/reminder';
import {useAdminI18n} from './admin-i18n-provider';

type Tab='Dashboard'|'Properties'|'Clients'|'Rentals'|'Sales & profit'|'Messages'|'Staff';
type Data={clients:Client[];staff:StaffMember[];rentals:Rental[];payments:Payment[];templates:MessageTemplate[];sales:Sale[];activity:Activity[]};
type ReminderTarget={tenantName:string;propertyName:string;rentAmount:string;dueDate:string;whatsapp:string;kind:'due'|'overdue'|'lease'};
const initial:ActionState={};
const usd=(n:number)=>new Intl.NumberFormat(site.locale,{style:'currency',currency:site.currency,maximumFractionDigits:0}).format(n);
const matches=(query:string,...values:string[])=>!query.trim()||values.some(v=>v.toLowerCase().includes(query.trim().toLowerCase()));
const daysUntil=(date:string)=>Math.ceil((new Date(`${date}T23:59:59Z`).getTime()-Date.now())/86400000);

function FormButton({children}:{children:string}){return <button className="button" type="submit">{children}</button>}
function Error({message}:{message?:string}){return message?<p className="error-message">{message}</p>:null}
function Search({value,onChange,placeholder}:{value:string;onChange:(v:string)=>void;placeholder:string}){return <input className="pro-search" type="search" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder}/>}

function ClientForm(){
  const {a}=useAdminI18n();const p=a.pro;const [state,action,pending]=useActionState(addClient,initial);
  return <form action={action} className="pro-form"><label>{p.name}<input name="name" required/></label><label>{p.type}<select name="clientType" defaultValue="Tenant">{['Buyer','Tenant','Landlord','Seller','Investor','Owner'].map(x=><option key={x} value={x}>{p.clientTypes[x]}</option>)}</select></label><label>{p.phone}<input name="phone"/></label><label>{p.whatsapp}<input name="whatsapp" placeholder="964..."/></label><label>{p.email}<input name="email" type="email"/></label><label>{p.address}<input name="address"/></label><label className="wide">{p.notes}<textarea name="notes" rows={2}/></label><Error message={state.error}/><FormButton>{pending?a.common.saving:p.addClient}</FormButton></form>;
}

function ClientProfile({client,data,role,onRemind,onClose}:{client:Client;data:Data;role:'Admin'|'Agent';onRemind:(t:ReminderTarget)=>void;onClose:()=>void}){
  const {a,fmt}=useAdminI18n();const p=a.pro;
  const [state,action,pending]=useActionState(editClient,initial);
  const [removeState,removeAction,removing]=useActionState(removeClient,initial);
  const leases=data.rentals.filter(r=>r.tenantId===client.id);
  const payments=data.payments.filter(x=>leases.some(l=>l.id===x.rentalId));
  const owed=payments.filter(x=>x.status!=='Paid').reduce((sum,x)=>sum+x.amountDue-x.amountPaid,0);
  const purchases=data.sales.filter(s=>s.buyerId===client.id);
  const link=whatsappUrl(client.whatsapp||client.phone,'');
  return <div className="pro-profile">
    <div className="pro-profile-head"><div><p className="kicker">{p.clientProfile}</p><h3>{client.name}</h3><span>{p.clientTypes[client.clientType]||client.clientType} · {p.clientSince} {client.createdAt}</span></div><button type="button" className="admin-close" onClick={onClose} aria-label={a.common.close}>×</button></div>
    {role==='Admin'&&<div className="pro-profile-stats"><div><small>{p.leasesLabel}</small><strong>{leases.filter(l=>l.active).length}</strong></div><div><small>{p.outstanding}</small><strong>{usd(owed)}</strong></div><div><small>{p.purchasesLabel}</small><strong>{purchases.length}</strong></div></div>}
    {link&&<p><a className="admin-edit" href={link} target="_blank" rel="noreferrer">{p.whatsapp}</a></p>}
    {role==='Admin'&&leases.length>0&&<div className="pro-list">{leases.map(l=><article key={l.id}><strong>{l.propertyName}</strong><span>{usd(l.monthlyRent)}{p.perMonth} · {fmt(p.ends,{date:l.leaseEnd})} · {l.active?p.active:p.ended}</span></article>)}</div>}
    {role==='Admin'&&payments.some(x=>x.status==='Overdue')&&<button type="button" className="admin-edit" onClick={()=>{const x=payments.find(y=>y.status==='Overdue');if(x)onRemind({tenantName:x.tenantName,propertyName:x.propertyName,rentAmount:usd(x.amountDue-x.amountPaid),dueDate:x.dueDate,whatsapp:x.tenantWhatsapp,kind:'overdue'});}}>{p.sendReminder}</button>}
    <form action={action} className="pro-form" key={JSON.stringify(client)}>
      <input type="hidden" name="id" value={client.id}/>
      <label>{p.name}<input name="name" defaultValue={client.name} required/></label>
      <label>{p.type}<select name="clientType" defaultValue={client.clientType}>{['Buyer','Tenant','Landlord','Seller','Investor','Owner'].map(x=><option key={x} value={x}>{p.clientTypes[x]}</option>)}</select></label>
      <label>{p.phone}<input name="phone" defaultValue={client.phone}/></label>
      <label>{p.whatsapp}<input name="whatsapp" defaultValue={client.whatsapp}/></label>
      <label>{p.email}<input name="email" type="email" defaultValue={client.email}/></label>
      <label>{p.address}<input name="address" defaultValue={client.address}/></label>
      <label className="wide">{p.notes}<textarea name="notes" rows={2} defaultValue={client.notes}/></label>
      <Error message={state.error}/>
      <FormButton>{pending?a.common.saving:p.saveChanges}</FormButton>
    </form>
    {role==='Admin'&&<form action={removeAction} onSubmit={e=>{if(!confirm(p.confirmRemoveClient))e.preventDefault();}}><input type="hidden" name="id" value={client.id}/><button className="admin-delete" type="submit" disabled={removing}>{p.removeClient}</button><Error message={removeState.error}/></form>}
  </div>;
}

function RentalForm({properties,clients}:{properties:Property[];clients:Client[]}){
  const {a}=useAdminI18n();const p=a.pro;const [state,action,pending]=useActionState(addRental,initial);
  return <form action={action} className="pro-form"><label>{p.property}<select name="propertyId" required><option value="">{p.choose}</option>{properties.map(x=><option value={x.id} key={x.id}>{x.title}</option>)}</select></label><label>{p.tenant}<select name="tenantId" required><option value="">{p.choose}</option>{clients.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><label>{p.monthlyRent}<input name="monthlyRent" type="number" min="0" required/></label><label>{p.deposit}<input name="deposit" type="number" min="0" defaultValue="0" required/></label><label>{p.leaseStarts}<input name="leaseStart" type="date" required/></label><label>{p.leaseEnds}<input name="leaseEnd" type="date" required/></label><label>{p.dueDay}<select name="dueDay" defaultValue="1">{Array.from({length:28},(_,i)=><option value={i+1} key={i+1}>{i+1}</option>)}</select></label><label>{p.payMethod}<input name="paymentMethod" placeholder={p.payMethodPh}/></label><Error message={state.error}/><FormButton>{pending?a.common.saving:p.createLease}</FormButton></form>;
}

function remindFor(x:Payment):ReminderTarget{return {tenantName:x.tenantName,propertyName:x.propertyName,rentAmount:usd(x.amountDue-x.amountPaid),dueDate:x.dueDate,whatsapp:x.tenantWhatsapp,kind:x.status==='Overdue'?'overdue':'due'};}

function PaymentTable({payments,onRemind}:{payments:Payment[];onRemind:(t:ReminderTarget)=>void}){
  const {a,fmt}=useAdminI18n();const t=a.pro;const [state,action,pending]=useActionState(payRent,initial);
  return <div className="pro-table-wrap"><table className="pro-table"><thead><tr><th>{t.tenantProp}</th><th>{t.due}</th><th>{t.amount}</th><th>{t.status}</th><th>{t.action}</th></tr></thead><tbody>{payments.map(p=><tr key={p.id}><td><strong>{p.tenantName}</strong><span>{p.propertyName}</span></td><td>{p.dueDate}</td><td>{usd(p.amountPaid)}/{usd(p.amountDue)}</td><td><span className={`payment-status ${p.status.toLowerCase().replaceAll(' ','-')}`}>{t.statuses[p.status]}</span></td><td><div className="payment-actions">{p.status!=='Paid'&&<button type="button" className="admin-edit" onClick={()=>onRemind(remindFor(p))}>{t.sendReminder}</button>}<form action={action}><input type="hidden" name="paymentId" value={p.id}/><input name="amountPaid" type="number" min="0" max={p.amountDue} defaultValue={p.amountPaid} aria-label={fmt(t.paidFor,{name:p.tenantName})}/><button className="admin-edit" disabled={pending}>{t.save}</button>{p.status!=='Paid'&&<button className="admin-edit" name="full" value="1" disabled={pending}>{t.paidInFull}</button>}</form></div></td></tr>)}{payments.length===0&&<tr><td colSpan={5}>{t.noResults}</td></tr>}</tbody></table><Error message={state.error}/></div>;
}

function LeaseRow({lease}:{lease:Rental}){
  const {a,fmt}=useAdminI18n();const t=a.pro;const [state,action,pending]=useActionState(closeRental,initial);
  const left=daysUntil(lease.leaseEnd);
  return <article><strong>{lease.propertyName} — {lease.tenantName}</strong><span>{usd(lease.monthlyRent)}{t.perMonth} · {fmt(t.dueOnDay,{day:lease.dueDay})} · {fmt(t.ends,{date:lease.leaseEnd})} · {lease.active?(left<=30&&left>=0?<b className="pro-flag">{fmt(t.endsIn,{days:left})}</b>:t.active):t.ended}</span>{lease.active&&<form action={action} onSubmit={e=>{if(!confirm(t.confirmEndLease))e.preventDefault();}}><input type="hidden" name="id" value={lease.id}/><button className="admin-delete" disabled={pending}>{t.endLease}</button><Error message={state.error}/></form>}</article>;
}

function TemplateForm({template,onDone}:{template?:MessageTemplate;onDone:()=>void}){
  const {a}=useAdminI18n();const p=a.pro;const [state,action,pending]=useActionState(addTemplate,initial);
  return <form action={action} className="pro-form" key={template?`${template.id}-${template.name}-${template.body}`:'new'}>{template&&<input type="hidden" name="id" value={template.id}/>}<label>{p.templateName}<input name="name" required defaultValue={template?.name} placeholder="Payment due reminder"/></label><label className="wide">{p.message}<textarea name="body" rows={4} required defaultValue={template?.body} placeholder="Hi {tenantName}, your rent of {rentAmount} for {propertyName} is due on {dueDate}."/></label><small className="wide">{p.placeholders} {`{tenantName}`}, {`{propertyName}`}, {`{rentAmount}`}, {`{dueDate}`}, {`{adminName}`}</small><Error message={state.error}/><FormButton>{pending?a.common.saving:template?p.saveChanges:p.addTemplate}</FormButton>{template&&<button type="button" className="button secondary" onClick={onDone}>{a.basic.cancel}</button>}</form>;
}

function TemplateRow({template,onEdit}:{template:MessageTemplate;onEdit:()=>void}){
  const {a}=useAdminI18n();const p=a.pro;const [state,action,pending]=useActionState(removeTemplate,initial);
  return <article><strong>{template.name}</strong><span>{template.body}</span><div className="payment-actions"><button type="button" className="admin-edit" onClick={onEdit}>{a.basic.edit}</button><form action={action} onSubmit={e=>{if(!confirm(p.confirmDeleteTemplate))e.preventDefault();}}><input type="hidden" name="id" value={template.id}/><button className="admin-delete" disabled={pending}>{a.basic.del}</button></form></div><Error message={state.error}/></article>;
}

function SaleForm({properties,clients,staff}:{properties:Property[];clients:Client[];staff:StaffMember[]}){
  const {a}=useAdminI18n();const p=a.pro;const [state,action,pending]=useActionState(addSale,initial);
  return <form action={action} className="pro-form"><label>{p.property}<select name="propertyId" required><option value="">{p.choose}</option>{properties.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select></label><label>{p.saleType}<select name="saleType"><option value="Company Owned">{p.saleTypes['Company Owned']}</option><option value="Client Listed">{p.saleTypes['Client Listed']}</option></select></label><label>{p.buyer}<select name="buyerId"><option value="">{p.notRecorded}</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>{p.agent}<select name="agentId"><option value="">{p.notRecorded}</option>{staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>{p.purchase}<input name="purchaseAmount" type="number" min="0" defaultValue="0" required/></label><label>{p.saleAmount}<input name="saleAmount" type="number" min="0" required/></label><label>{p.expenses}<input name="expenses" type="number" min="0" defaultValue="0" required/></label><label>{p.commission}<input name="commissionAmount" type="number" min="0" defaultValue="0" required/></label><label>{p.soldDate}<input name="soldAt" type="date" required/></label><label className="wide">{p.notes}<textarea name="notes" rows={2}/></label><Error message={state.error}/><FormButton>{pending?a.common.saving:p.recordSale}</FormButton></form>;
}

function StaffForm(){
  const {a}=useAdminI18n();const p=a.pro;const [state,action,pending]=useActionState(addStaff,initial);
  return <form action={action} className="pro-form"><label>{p.name}<input name="name" required/></label><label>{p.email}<input name="email" type="email" required/></label><label>{p.role}<select name="role"><option value="Agent">{p.roles.Agent}</option><option value="Admin">{p.roles.Admin}</option></select></label><label>{p.passwordL}<input name="password" type="password" minLength={10} required/></label><Error message={state.error}/><FormButton>{pending?a.common.saving:p.addStaff}</FormButton></form>;
}

function StaffRow({member,isSelf}:{member:StaffMember;isSelf:boolean}){
  const {a}=useAdminI18n();const p=a.pro;const [state,action,pending]=useActionState(editStaff,initial);
  return <article><strong>{member.name}{isSelf?` (${p.you})`:''}</strong><span>{member.email}</span><form action={action} className="pro-inline-form"><input type="hidden" name="id" value={member.id}/><select name="role" defaultValue={member.role} disabled={isSelf} aria-label={p.role}><option value="Agent">{p.roles.Agent}</option><option value="Admin">{p.roles.Admin}</option></select><select name="active" defaultValue={String(member.active)} disabled={isSelf} aria-label={p.status}><option value="true">{p.active}</option><option value="false">{p.inactive}</option></select><input name="password" type="password" minLength={10} placeholder={p.newPassword} aria-label={p.newPassword} autoComplete="new-password"/>{isSelf&&<><input type="hidden" name="role" value={member.role}/><input type="hidden" name="active" value="true"/></>}<button className="admin-edit" disabled={pending}>{p.save}</button></form><Error message={state.error}/></article>;
}

function ReminderModal({target,templates,adminName,onClose}:{target:ReminderTarget;templates:MessageTemplate[];adminName:string;onClose:()=>void}){
  const {a}=useAdminI18n();const p=a.pro;
  const preferred=target.kind==='overdue'?'Payment Overdue':target.kind==='lease'?'Lease Ending Soon':'Payment Due Soon';
  const [templateId,setTemplateId]=useState((templates.find(x=>x.name===preferred)||templates[0])?.id||'');
  const [edited,setEdited]=useState<string>();
  const [copied,setCopied]=useState(false);
  const template=templates.find(x=>x.id===templateId);
  const message=edited??renderReminder(template?.body||p.defaultReminder,{tenantName:target.tenantName,propertyName:target.propertyName,rentAmount:target.rentAmount,dueDate:target.dueDate,adminName});
  const link=whatsappUrl(target.whatsapp,message);
  return <div className="admin-modal" role="dialog" aria-modal="true" aria-label={p.reminderTitle}><div className="admin-modal-card"><div className="admin-section-heading"><h2>{p.reminderTitle}</h2><button type="button" className="admin-close" onClick={onClose} aria-label={a.common.close}>×</button></div>
    <p><strong>{target.tenantName}</strong> · {target.propertyName}</p>
    <div className="pro-form"><label>{p.template}<select value={templateId} onChange={e=>{setTemplateId(e.target.value);setEdited(undefined);}}>{templates.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label><label className="wide">{p.message}<textarea rows={6} value={message} onChange={e=>setEdited(e.target.value)}/></label>
      {!link&&<p className="error-message wide">{p.noWhatsapp}</p>}
      <div className="payment-actions wide">{link&&<a className="button" href={link} target="_blank" rel="noreferrer">{p.openWhatsapp}</a>}<button type="button" className="button secondary" onClick={async()=>{try{await navigator.clipboard.writeText(message);setCopied(true);}catch{setCopied(false);}}}>{copied?p.copied:p.copy}</button></div>
    </div></div></div>;
}

export function ProAdminDashboard({properties,data,role,adminId,adminName}:{properties:Property[];data:Data;role:'Admin'|'Agent';adminId:string;adminName:string}){
  const {a,fmt}=useAdminI18n();const t=a.pro;
  const [tab,setTab]=useState<Tab>('Dashboard');
  const [reminder,setReminder]=useState<ReminderTarget>();
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState('');
  const [kind,setKind]=useState('');
  const [listing,setListing]=useState('');
  const [clientId,setClientId]=useState<string>();
  const [templateId,setTemplateId]=useState<string>();
  const go=(next:Tab)=>{setTab(next);setQuery('');setFilter('');setKind('');setListing('');setClientId(undefined);setTemplateId(undefined);};

  const month=new Date().toISOString().slice(0,7);
  const paid=data.payments.filter(p=>p.dueDate.startsWith(month)).reduce((sum,p)=>sum+p.amountPaid,0);
  const dueSoon=data.payments.filter(p=>p.status==='Due Soon'||p.status==='Partially Paid'&&daysUntil(p.dueDate)>=0);
  const due=dueSoon.reduce((sum,p)=>sum+p.amountDue-p.amountPaid,0);
  const overduePayments=data.payments.filter(p=>p.status==='Overdue'||p.status==='Partially Paid'&&daysUntil(p.dueDate)<0);
  const overdue=overduePayments.reduce((sum,p)=>sum+p.amountDue-p.amountPaid,0);
  const profit=data.sales.reduce((sum,s)=>sum+s.netProfit,0);
  const endingSoon=data.rentals.filter(r=>r.active&&daysUntil(r.leaseEnd)>=0&&daysUntil(r.leaseEnd)<=30);
  const nav=(role==='Admin'?['Dashboard','Properties','Clients','Rentals','Sales & profit','Messages','Staff']:['Dashboard','Properties','Clients']) as Tab[];

  const visibleProperties=useMemo(()=>properties.filter(p=>matches(query,p.title,p.area,p.type)&&(!filter||p.status===filter)&&(!kind||p.type===kind)&&(!listing||p.listingType===listing)),[properties,query,filter,kind,listing]);
  const visibleClients=useMemo(()=>data.clients.filter(c=>matches(query,c.name,c.phone,c.whatsapp,c.email)&&(!kind||c.clientType===kind)),[data.clients,query,kind]);
  const visiblePayments=useMemo(()=>data.payments.filter(p=>matches(query,p.tenantName,p.propertyName)&&(!filter||p.status===filter)),[data.payments,query,filter]);
  const visibleLeases=useMemo(()=>data.rentals.filter(r=>matches(query,r.tenantName,r.propertyName)),[data.rentals,query]);
  const visibleSales=useMemo(()=>data.sales.filter(s=>matches(query,s.propertyName,s.buyerName,s.agentName)&&(!filter||s.saleType===filter)),[data.sales,query,filter]);
  const selectedClient=data.clients.find(c=>c.id===clientId);
  const editingTemplate=data.templates.find(x=>x.id===templateId);
  const remindLease=(r:Rental)=>setReminder({tenantName:r.tenantName,propertyName:r.propertyName,rentAmount:usd(r.monthlyRent),dueDate:r.leaseEnd,whatsapp:r.tenantWhatsapp,kind:'lease'});

  return <div className="pro-live"><aside className="pro-sidebar"><strong>{site.name}</strong>{nav.map(item=><button key={item} className={tab===item?'selected':''} onClick={()=>go(item)}>{t.tabs[item]}</button>)}</aside><div className="pro-main"><div className="pro-heading"><div><p className="kicker">{t.kickerMgmt}</p><h2>{t.tabs[tab]}</h2></div><span>{fmt(t.access,{role:t.roles[role]})}</span></div>

    {tab==='Dashboard'&&<>
      {role==='Admin'?<>
        <div className="pro-metric-grid"><div className="pro-metric paid"><small>{t.paidRents}</small><strong>{usd(paid)}</strong><span>{t.paidSub}</span></div><div className="pro-metric due"><small>{t.dueSoon}</small><strong>{usd(due)}</strong><span>{t.dueSub}</span></div><div className="pro-metric overdue"><small>{t.overdueRent}</small><strong>{usd(overdue)}</strong><span>{t.overdueSub}</span></div><div className="pro-metric profit"><small>{t.netProfit}</small><strong>{usd(profit)}</strong><span>{t.netSub}</span></div></div>
        <div className="pro-alert"><strong>{t.attention}</strong>{overduePayments.length?<><p>{fmt(t.overdueMsg,{amount:usd(overdue)})}</p><div className="pro-list">{overduePayments.map(p=><article key={p.id}><strong>{p.tenantName} — {usd(p.amountDue-p.amountPaid)}</strong><span>{p.propertyName} · {fmt(t.dueOn,{date:p.dueDate})}</span><button type="button" className="admin-edit" onClick={()=>setReminder(remindFor(p))}>{t.sendReminder}</button></article>)}</div></>:<p>{t.noOverdue}</p>}</div>
        {endingSoon.length>0&&<div className="pro-alert pro-alert-info"><strong>{t.leasesEnding}</strong><div className="pro-list">{endingSoon.map(r=><article key={r.id}><strong>{r.tenantName} — {r.propertyName}</strong><span>{fmt(t.ends,{date:r.leaseEnd})} · {fmt(t.endsIn,{days:daysUntil(r.leaseEnd)})}</span><button type="button" className="admin-edit" onClick={()=>remindLease(r)}>{t.sendReminder}</button></article>)}</div></div>}
        {data.activity.length>0&&<div className="pro-section"><h3>{t.recentActivity}</h3><div className="pro-list">{data.activity.map(x=><article key={x.id}><strong>{x.action}{x.details?` — ${x.details}`:''}</strong><span>{x.staffName} · {x.createdAt.slice(0,16).replace('T',' ')}</span></article>)}</div></div>}
      </>:<div className="pro-metric-grid"><div className="pro-metric profit"><small>{t.tabs.Properties}</small><strong>{properties.length}</strong><span>{t.propsCount}</span></div><div className="pro-metric paid"><small>{t.tabs.Clients}</small><strong>{data.clients.length}</strong><span>{t.clientsCount}</span></div></div>}
    </>}

    {tab==='Properties'&&<div className="pro-section">
      <div className="pro-filters"><Search value={query} onChange={setQuery} placeholder={t.searchProperties}/><select value={filter} onChange={e=>setFilter(e.target.value)} aria-label={t.status}><option value="">{t.allStatuses}</option>{['Available','Reserved','Rented','Sold','Off Market'].map(x=><option key={x} value={x}>{t.propertyStatuses[x]}</option>)}</select><select value={kind} onChange={e=>setKind(e.target.value)} aria-label={t.type}><option value="">{t.allTypes}</option>{Array.from(new Set(properties.map(x=>x.type))).map(x=><option key={x} value={x}>{x}</option>)}</select><select value={listing} onChange={e=>setListing(e.target.value)} aria-label={a.basic.fListingType}><option value="">{t.allListings}</option><option value="For Sale">{t.listingTypes['For Sale']}</option><option value="For Rent">{t.listingTypes['For Rent']}</option></select></div>
      <div className="pro-list">{visibleProperties.map(x=><article key={x.id}><strong>{x.title}</strong><span>{x.type} · {x.area} · {usd(x.price)} · {t.listingTypes[x.listingType]} · {t.propertyStatuses[x.status]||x.status}</span></article>)}{visibleProperties.length===0&&<article><span>{t.noResults}</span></article>}</div>
      <p>{t.propsText}</p><a className="button" href="/admin-basic">{t.openManager}</a>
    </div>}

    {tab==='Clients'&&<div className="pro-section">
      {selectedClient&&<ClientProfile client={selectedClient} data={data} role={role} onRemind={setReminder} onClose={()=>setClientId(undefined)}/>}
      <ClientForm/>
      <div className="pro-filters"><Search value={query} onChange={setQuery} placeholder={t.searchClients}/><select value={kind} onChange={e=>setKind(e.target.value)} aria-label={t.type}><option value="">{t.allClientTypes}</option>{['Buyer','Tenant','Landlord','Seller','Investor','Owner'].map(x=><option key={x} value={x}>{t.clientTypes[x]}</option>)}</select></div>
      <div className="pro-list">{visibleClients.map(c=><article key={c.id}><strong>{c.name}</strong><span>{t.clientTypes[c.clientType]||c.clientType} · {c.whatsapp||c.phone||c.email||t.noContact}</span><button type="button" className="admin-edit" onClick={()=>setClientId(c.id)}>{t.openProfile}</button></article>)}{visibleClients.length===0&&<article><span>{t.noResults}</span></article>}</div>
    </div>}

    {tab==='Rentals'&&role==='Admin'&&<div className="pro-section">
      <RentalForm properties={properties} clients={data.clients}/>
      <div className="pro-filters"><Search value={query} onChange={setQuery} placeholder={t.searchRentals}/><select value={filter} onChange={e=>setFilter(e.target.value)} aria-label={t.status}><option value="">{t.allStatuses}</option>{['Overdue','Due Soon','Partially Paid','Paid'].map(x=><option key={x} value={x}>{t.statuses[x]}</option>)}</select></div>
      <h3>{t.tracker}</h3><PaymentTable payments={visiblePayments} onRemind={setReminder}/>
      <h3>{t.leases}</h3><div className="pro-list">{visibleLeases.map(r=><LeaseRow key={r.id} lease={r}/>)}{visibleLeases.length===0&&<article><span>{t.noResults}</span></article>}</div>
    </div>}

    {tab==='Sales & profit'&&role==='Admin'&&<div className="pro-section">
      <SaleForm properties={properties} clients={data.clients} staff={data.staff.filter(s=>s.active)}/>
      <div className="pro-metric-grid"><div className="pro-metric paid"><small>{t.revenue}</small><strong>{usd(visibleSales.reduce((n,s)=>n+s.saleAmount,0))}</strong></div><div className="pro-metric overdue"><small>{t.expenses}</small><strong>{usd(visibleSales.reduce((n,s)=>n+s.expenses,0))}</strong></div><div className="pro-metric due"><small>{t.commission}</small><strong>{usd(visibleSales.reduce((n,s)=>n+s.commissionAmount,0))}</strong></div><div className="pro-metric profit"><small>{t.netProfit}</small><strong>{usd(visibleSales.reduce((n,s)=>n+s.netProfit,0))}</strong></div></div>
      <div className="pro-filters"><Search value={query} onChange={setQuery} placeholder={t.searchSales}/><select value={filter} onChange={e=>setFilter(e.target.value)} aria-label={t.saleType}><option value="">{t.allSaleTypes}</option><option value="Company Owned">{t.saleTypes['Company Owned']}</option><option value="Client Listed">{t.saleTypes['Client Listed']}</option></select></div>
      <div className="pro-list">{visibleSales.map(s=><article key={s.id}><strong>{s.propertyName} — {t.netProfitOf} {usd(s.netProfit)}</strong><span>{t.saleTypes[s.saleType]||s.saleType} · {fmt(t.sold,{date:s.soldAt})} · {t.sale} {usd(s.saleAmount)} · {t.buyer}: {s.buyerName} · {t.agent}: {s.agentName}</span></article>)}{visibleSales.length===0&&<article><span>{t.noResults}</span></article>}</div>
    </div>}

    {tab==='Messages'&&role==='Admin'&&<div className="pro-section">
      <TemplateForm template={editingTemplate} onDone={()=>setTemplateId(undefined)}/>
      <div className="pro-list">{data.templates.map(x=><TemplateRow key={x.id} template={x} onEdit={()=>setTemplateId(x.id)}/>)}</div>
    </div>}

    {tab==='Staff'&&role==='Admin'&&<div className="pro-section">
      <StaffForm/>
      <div className="pro-list">{data.staff.map(s=><StaffRow key={`${s.id}-${s.role}-${s.active}`} member={s} isSelf={s.id===adminId}/>)}</div>
    </div>}
  </div>
  {reminder&&<ReminderModal target={reminder} templates={data.templates} adminName={adminName} onClose={()=>setReminder(undefined)}/>}
  </div>;
}
