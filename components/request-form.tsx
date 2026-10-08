'use client';
import {useState} from 'react';
import Link from 'next/link';
import {CheckIcon} from './icons';
import {BudgetField} from './budget-field';
import {useI18n} from './i18n-provider';
import {site,whatsappLink} from '@/config/site';
import {propertyTypes} from '@/lib/property';
import {areaName, canonicalArea} from '@/lib/i18n/areas';
import {leadSummary,type Lead} from '@/lib/lead-summary';

const BEDROOM_OPTIONS = ['Any beds', '1+ beds', '2+ beds', '3+ beds', '4+ beds'] as const;
const TIMELINE_OPTIONS = ['ASAP', 'Within a month', 'Just looking'] as const;

const initial = {
  propertyType: 'Apartment',
  area: '',
  bedrooms: 'Any beds',
  budget: '',
  intent: 'Rent',
  timeline: 'ASAP',
  name: '',
  phone: '',
  message: '',
  website: '',
};

export function RequestForm({areas}: {areas: string[]}) {
  const {lang, t, path, fmt} = useI18n();
  const f = t.form;
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<Lead | null>(null);

  function change(key: keyof typeof initial, value: string) {
    setForm(old => ({...old, [key]: value}));
  }

  function handleIntentChange(newIntent: 'Rent' | 'Buy') {
    setForm(old => ({...old, intent: newIntent, budget: ''}));
  }

  /** Quick client-side check; the API route validates again with the full schema. */
  function validateLead(lead: Lead) {
    if (lead.area.length < 2) return f.errArea;
    if (!lead.budget) return f.errBudget;
    if (!(lead.budget.startsWith('$') || Number(lead.budget) > 0 || Number.isNaN(Number(lead.budget)))) return f.errBudgetPositive;
    if (lead.name.length < 2) return f.errName;
    if (lead.phone.length < 6) return f.errPhone;
    return '';
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const lead: Lead = {...form, area: form.area.trim(), budget: form.budget.trim(), name: form.name.trim(), phone: form.phone.trim(), message: form.message.trim(), intent: form.intent as Lead['intent']};
    const problem = validateLead(lead);
    if (problem) {
      setError(problem);
      return;
    }

    setPending(true);
    try {
      const response = await fetch('/api/property-request', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...lead, area: canonicalArea(lead.area)}),
      });
      const data = (await response.json()) as {ok?: boolean; error?: string};
      if (!response.ok || !data.ok) {
        // Server messages are English only, so other languages get the translated fallback.
        throw new Error((lang === 'en' && data.error) || f.errSend);
      }
      setDone(lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : f.errSend);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    const summary = leadSummary(done, {...f.summary, types: lang === 'en' ? undefined : t.types, beds: f.beds, timelines: f.timelines});
    return (
      <section className="success-panel" aria-live="polite">
        <span className="success-icon"><CheckIcon size={30}/></span>
        <h2>{fmt(f.thanks, {name: done.name})}</h2>
        <p>{fmt(f.thanksText, {site: site.name})}</p>
        <div className="success-actions">
          <Link href={path('/properties')} className="btn btn-outline">{f.browse}</Link>
          <a className="btn btn-gold" target="_blank" rel="noopener noreferrer" href={whatsappLink(summary)}>{f.continueWa}</a>
          <Link href={path('/')} className="btn btn-outline">{f.backHome}</Link>
        </div>
      </section>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <fieldset className="full">
        <legend>{f.intentLegend}</legend>
        <div className="toggle">
          <label>
            <input type="radio" name="intent" checked={form.intent === 'Rent'} onChange={() => handleIntentChange('Rent')} />
            {f.rent}
          </label>
          <label>
            <input type="radio" name="intent" checked={form.intent === 'Buy'} onChange={() => handleIntentChange('Buy')} />
            {f.buy}
          </label>
        </div>
      </fieldset>

      <label className="field" htmlFor="property-type-select">
        {f.propType}
        <select id="property-type-select" value={form.propertyType} onChange={e => change('propertyType', e.target.value)}>
          {propertyTypes.map(v => (
            <option key={v} value={v}>{t.types[v]}</option>
          ))}
        </select>
      </label>

      <label className="field" htmlFor="preferred-area-input">
        {f.area}
        <input
          id="preferred-area-input"
          required
          list="area-options"
          autoComplete="off"
          value={form.area}
          onChange={e => change('area', e.target.value)}
          placeholder={f.areaPh}
        />
        <datalist id="area-options">
          {areas.map(area => (
            <option key={area} value={areaName(lang, area)} />
          ))}
        </datalist>
      </label>

      <label className="field" htmlFor="bedrooms-select">
        {f.bedrooms}
        <select id="bedrooms-select" value={form.bedrooms} onChange={e => change('bedrooms', e.target.value)}>
          {BEDROOM_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{f.beds[opt]}</option>
          ))}
        </select>
      </label>

      <BudgetField key={form.intent} intent={form.intent as 'Rent' | 'Buy'} value={form.budget} onChange={value => change('budget', value)} />

      <label className="field full" htmlFor="timeline-select">
        {f.timeline}
        <select id="timeline-select" value={form.timeline} onChange={e => change('timeline', e.target.value)}>
          {TIMELINE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{f.timelines[opt]}</option>
          ))}
        </select>
      </label>

      <label className="field" htmlFor="name-input">
        {f.name}
        <input id="name-input" required autoComplete="name" value={form.name} onChange={e => change('name', e.target.value)} placeholder={f.namePh} />
      </label>

      <label className="field" htmlFor="phone-input">
        {f.phone}
        <input id="phone-input" dir="ltr" type="tel" required autoComplete="tel" value={form.phone} onChange={e => change('phone', e.target.value)} placeholder={f.phonePh} />
      </label>

      <label className="field full" htmlFor="message-textarea">
        {f.message} <span style={{fontWeight: 400}}>{f.optional}</span>
        <textarea id="message-textarea" dir="auto" value={form.message} onChange={e => change('message', e.target.value)} placeholder={f.messagePh} />
      </label>

      <label className="honeypot" aria-hidden="true" style={{display: 'none'}}>
        Website
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => change('website', e.target.value)} />
      </label>

      <p className="form-note full">{fmt(f.note, {site: site.name})}</p>

      <button className="btn btn-gold btn-lg full" disabled={pending}>
        {pending ? f.sending : f.submit}
      </button>
    </form>
  );
}
