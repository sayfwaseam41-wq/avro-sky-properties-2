'use client';
import {useState} from 'react';
import Link from 'next/link';
import {MessageCircle} from 'lucide-react';
import {site,whatsappLink} from '@/config/site';
import {leadSchema,leadSummary,type Lead} from '@/lib/lead';

const RENT_BUDGET_OPTIONS = [
  '$150 - $250',
  '$250 - $400',
  '$450 - $600',
  'Other (enter your own price)',
] as const;

const BEDROOM_OPTIONS = [
  'Any beds',
  '1+ beds',
  '2+ beds',
  '3+ beds',
  '4+ beds',
] as const;

const initial = {
  propertyType: 'Apartment',
  area: '',
  bedrooms: 'Any beds',
  budget: '$150 - $250',
  intent: 'Rent',
  timeline: 'ASAP',
  name: '',
  phone: '',
  message: '',
  website: '',
};

export function RequestForm() {
  const [form, setForm] = useState(initial);
  const [rentOption, setRentOption] = useState<string>('$150 - $250');
  const [customRentBudget, setCustomRentBudget] = useState<string>('');
  const [buyBudget, setBuyBudget] = useState<string>('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<Lead | null>(null);

  function change(key: keyof typeof initial, value: string) {
    setForm(old => ({...old, [key]: value}));
  }

  function handleIntentChange(newIntent: 'Rent' | 'Buy') {
    setForm(old => {
      let nextBudget = '';
      if (newIntent === 'Rent') {
        nextBudget = rentOption === 'Other (enter your own price)' ? customRentBudget : rentOption;
      } else {
        nextBudget = buyBudget;
      }
      return {...old, intent: newIntent, budget: nextBudget};
    });
  }

  function handleRentOptionChange(value: string) {
    setRentOption(value);
    if (value === 'Other (enter your own price)') {
      change('budget', customRentBudget);
    } else {
      change('budget', value);
    }
  }

  function handleCustomRentBudgetChange(value: string) {
    setCustomRentBudget(value);
    change('budget', value);
  }

  function handleBuyBudgetChange(value: string) {
    setBuyBudget(value);
    change('budget', value);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.intent === 'Rent' && rentOption === 'Other (enter your own price)' && !customRentBudget.trim()) {
      setError('Please enter your budget.');
      return;
    }
    if (form.intent === 'Buy' && !buyBudget.trim()) {
      setError('Please enter your budget.');
      return;
    }

    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setPending(true);
    try {
      const response = await fetch('/api/property-request', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as {ok?: boolean; error?: string};
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to send your request.');
      }
      setDone(parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send your request.');
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <section className="success-panel" aria-live="polite">
        <MessageCircle size={34} color={site.primaryColor} />
        <h2>Thanks, {done.name}.</h2>
        <p>
          Your request has been sent to {site.name}. Continue the conversation on WhatsApp if you’d
          like a faster response.
        </p>
        <div className="success-actions">
          <Link href="/properties" className="button secondary-dark">
            Browse available properties
          </Link>
          <a
            className="button"
            target="_blank"
            rel="noopener noreferrer"
            href={whatsappLink(leadSummary(done))}
          >
            Continue on WhatsApp
          </a>
          <Link href="/" className="button secondary-dark">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <fieldset className="full">
        <legend>What are you looking to do?</legend>
        <div className="toggle">
          <label>
            <input
              type="radio"
              name="intent"
              checked={form.intent === 'Rent'}
              onChange={() => handleIntentChange('Rent')}
            />
            Rent
          </label>
          <label>
            <input
              type="radio"
              name="intent"
              checked={form.intent === 'Buy'}
              onChange={() => handleIntentChange('Buy')}
            />
            Buy
          </label>
        </div>
      </fieldset>

      <label className="field" htmlFor="property-type-select">
        Property Type
        <select
          id="property-type-select"
          value={form.propertyType}
          onChange={e => change('propertyType', e.target.value)}
        >
          {['Apartment', 'House', 'Villa', 'Land', 'Office'].map(v => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>

      <label className="field" htmlFor="preferred-area-input">
        Preferred Area
        <input
          id="preferred-area-input"
          required
          value={form.area}
          onChange={e => change('area', e.target.value)}
          placeholder="e.g. Malta or Zawa"
        />
      </label>

      <label className="field" htmlFor="bedrooms-select">
        Bedrooms
        <select
          id="bedrooms-select"
          value={form.bedrooms}
          onChange={e => change('bedrooms', e.target.value)}
        >
          {BEDROOM_OPTIONS.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      {form.intent === 'Rent' ? (
        <label className="field" htmlFor="rent-budget-select">
          Budget (USD)
          <select
            id="rent-budget-select"
            value={rentOption}
            onChange={e => handleRentOptionChange(e.target.value)}
          >
            {RENT_BUDGET_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {rentOption === 'Other (enter your own price)' && (
            <input
              id="custom-rent-budget"
              type="number"
              min="1"
              required
              value={customRentBudget}
              onChange={e => handleCustomRentBudgetChange(e.target.value)}
              placeholder="Enter your budget"
              aria-label="Enter your custom rent budget in USD"
              autoFocus
            />
          )}
        </label>
      ) : (
        <label className="field" htmlFor="buy-budget-input">
          Budget (USD)
          <input
            id="buy-budget-input"
            required
            type="number"
            min="1"
            value={buyBudget}
            onChange={e => handleBuyBudgetChange(e.target.value)}
            placeholder="Your maximum budget"
          />
        </label>
      )}

      <label className="field full" htmlFor="timeline-select">
        Timeline
        <select
          id="timeline-select"
          value={form.timeline}
          onChange={e => change('timeline', e.target.value)}
        >
          <option>ASAP</option>
          <option>Within a month</option>
          <option>Just looking</option>
        </select>
      </label>

      <label className="field" htmlFor="name-input">
        Your Name
        <input
          id="name-input"
          required
          autoComplete="name"
          value={form.name}
          onChange={e => change('name', e.target.value)}
          placeholder="Full name"
        />
      </label>

      <label className="field" htmlFor="phone-input">
        Phone / WhatsApp
        <input
          id="phone-input"
          required
          autoComplete="tel"
          value={form.phone}
          onChange={e => change('phone', e.target.value)}
          placeholder="+964 ..."
        />
      </label>

      <label className="field full" htmlFor="message-textarea">
        Anything else? <span style={{fontWeight: 400}}>(optional)</span>
        <textarea
          id="message-textarea"
          value={form.message}
          onChange={e => change('message', e.target.value)}
          placeholder="Tell us what would make this property right for you."
        />
      </label>

      <label className="honeypot" aria-hidden="true" style={{display: 'none'}}>
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={e => change('website', e.target.value)}
        />
      </label>

      <p className="form-note full">
        By sending this form, you ask {site.name} to contact you about your property search.
      </p>

      <button className="button full" disabled={pending}>
        {pending ? 'Sending request…' : 'Send my request'}
      </button>
    </form>
  );
}
