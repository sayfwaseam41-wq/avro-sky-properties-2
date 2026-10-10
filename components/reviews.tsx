import {fmt} from '@/lib/i18n/config';
import type {Dict} from '@/lib/i18n/en';
import type {Review} from '@/lib/content';

/** Client reviews entered by staff in the admin area. Renders nothing until there is at least one. */
export function Reviews({reviews,t}:{reviews:Review[];t:Dict}){
  if(!reviews.length)return null;
  return <section className="section" aria-labelledby="reviews-h">
    <div className="wrap">
      <header className="section-head"><p className="eyebrow">{t.reviews.eyebrow}</p><h2 id="reviews-h">{t.reviews.title}</h2></header>
      <ul className="reviews">
        {reviews.slice(0,6).map(r=><li key={r.id}>
          <figure>
            <div className="stars" role="img" aria-label={fmt(t.reviews.stars,{n:r.rating})}>{'★'.repeat(r.rating)}<span aria-hidden="true">{'☆'.repeat(5-r.rating)}</span></div>
            <blockquote dir="auto">{r.body}</blockquote>
            <figcaption>{r.author}</figcaption>
          </figure>
        </li>)}
      </ul>
    </div>
  </section>;
}
