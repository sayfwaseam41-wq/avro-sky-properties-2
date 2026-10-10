import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTranslations,pick,translationsFromForm} from '../lib/translations';
import {localizeProperty,type Property} from '../lib/property';
import {localizeProject,localizeReview,localizeTeamMember,projectFromForm} from '../lib/content';
import {siteName} from '../config/site';
import {areaName} from '../lib/i18n/areas';

const form=(values:Record<string,string>)=>{const data=new FormData();for(const [key,value] of Object.entries(values))data.set(key,value);return data;};
const base:Property={id:'p1',title:'Central Office Suite',type:'Office',listingType:'For Rent',price:1200,bedrooms:0,bathrooms:1,size:80,area:'City Centre',status:'Available',description:'Bright office',photos:[{url:'https://x/a.jpg',alt:'Central Office Suite — photograph 1'}],featured:false,dateListed:'2026-01-01T00:00:00.000Z',translations:{ckb:{title:'ئۆفیسی ناوەندی'},ar:{title:'مكتب مركزي',description:'مكتب مشرق'}}};

test('translationsFromForm reads _ar and _ckb boxes and skips empty ones',()=>{
  const t=translationsFromForm(form({title_ar:'  مكتب  ',title_ckb:'',description_ckb:'ڕوون'}),['title','description']);
  assert.deepEqual(t,{ar:{title:'مكتب'},ckb:{description:'ڕوون'}});
  assert.deepEqual(translationsFromForm(form({}),['title']),{});
});
test('parseTranslations survives bad database values',()=>{
  assert.deepEqual(parseTranslations(null,['title']),{});
  assert.deepEqual(parseTranslations('not json',['title']),{});
  assert.deepEqual(parseTranslations('{"ar":{"title":"س","evil":"x"},"fr":{"title":"y"}}',['title']),{ar:{title:'س'}});
  assert.deepEqual(parseTranslations({ckb:{title:5,description:' د '}},['title','description']),{ckb:{description:'د'}});
});
test('pick falls back to English',()=>{
  assert.equal(pick(undefined,'ar','title','English'),'English');
  assert.equal(pick({ar:{title:'عربي'}},'ckb','title','English'),'English');
  assert.equal(pick({ar:{title:'عربي'}},'ar','title','English'),'عربي');
  assert.equal(pick({ar:{title:'عربي'}},'en','title','English'),'English');
});
test('localizeProperty swaps title/description and photo text per language',()=>{
  const ckb=localizeProperty(base,'ckb','وێنە');
  assert.equal(ckb.title,'ئۆفیسی ناوەندی');
  assert.equal(ckb.description,'Bright office'); // no Kurdish description entered: English fallback
  assert.equal(ckb.photos[0].alt,'ئۆفیسی ناوەندی — وێنە 1');
  const ar=localizeProperty(base,'ar','صورة');
  assert.equal(ar.description,'مكتب مشرق');
  assert.equal(localizeProperty(base,'en'),base);
});
test('projects, team and reviews are localized',()=>{
  const project={id:'1',name:'Cavalli',developer:'Acme',area:'Malta',description:'d',coverUrl:'',sortOrder:0,isPublic:true,translations:{ar:{name:'كافالي',developer:'أكمي'}}};
  assert.equal(localizeProject(project,'ar').name,'كافالي');
  assert.equal(localizeProject(project,'ar').description,'d');
  assert.equal(localizeProject(project,'en').name,'Cavalli');
  assert.equal(localizeTeamMember({id:'2',name:'Aso',roleTitle:'Agent',photoUrl:'',sortOrder:0,isPublic:true,translations:{ckb:{name:'ئاسۆ',roleTitle:'ئەیجێنت'}}},'ckb').roleTitle,'ئەیجێنت');
  assert.equal(localizeReview({id:'3',author:'Sara',body:'Great',rating:5,sortOrder:0,isPublic:true,translations:{ar:{author:'سارة'}}},'ar').author,'سارة');
});
test('project form keeps the translations',()=>{
  assert.deepEqual(projectFromForm(form({name:'X',name_ar:'إكس'})).translations,{ar:{name:'إكس'}});
});
test('brand name is written in each language',()=>{
  assert.equal(siteName('en'),process.env.NEXT_PUBLIC_COMPANY_NAME||'');
  assert.ok(!/[A-Za-z]/.test(siteName('ar'))||!process.env.NEXT_PUBLIC_COMPANY_NAME);
});
test('added Duhok areas have Arabic and Kurdish names',()=>{
  assert.equal(areaName('ckb','Zakho'),'زاخۆ');
  assert.equal(areaName('ar','Akre'),'عقرة');
  assert.equal(areaName('ckb','Unknown Place'),'Unknown Place');
});
