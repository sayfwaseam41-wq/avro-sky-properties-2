import test from 'node:test';
import assert from 'node:assert/strict';
import {adminAr,adminDictFor,adminEn} from '../lib/i18n/admin';
import {adminCkb} from '../lib/i18n/admin-ckb';

type Tree={[key:string]:string|string[]|Tree};
const leaves=(tree:Tree,prefix=''):Record<string,string>=>Object.entries(tree).reduce((all,[key,value])=>{
  const path=prefix+key;
  if(typeof value==='string')all[path]=value;
  else if(Array.isArray(value))value.forEach((item,index)=>{all[`${path}[${index}]`]=item;});
  else Object.assign(all,leaves(value,path+'.'));
  return all;
},{} as Record<string,string>);
const placeholders=(text:string)=>(text.match(/\{\w+\}/g)||[]).sort().join(',');

test('Kurdish admin dictionary has the same keys and placeholders as English',()=>{
  const en=leaves(adminEn as unknown as Tree),ckb=leaves(adminCkb as unknown as Tree);
  assert.deepEqual(Object.keys(ckb).sort(),Object.keys(en).sort());
  for(const key of Object.keys(en))assert.equal(placeholders(ckb[key]),placeholders(en[key]),`placeholders differ in ${key}`);
});
test('Kurdish and Arabic admin text has no stray English words',()=>{
  // Keys of the tab/status maps are English on purpose (they are database values), so only values are checked.
  for(const [name,dict] of [['ckb',adminCkb],['ar',adminAr]] as const)
    for(const [key,text] of Object.entries(leaves(dict as unknown as Tree))){
      if(/[A-Za-z]{4,}/.test(text.replace(/\{\w+\}|https|WebP|AVIF|JPG|PNG/g,'')))assert.fail(`Latin text in ${name} ${key}: ${text}`);
    }
});
test('admin language lookup',()=>{
  assert.equal(adminDictFor('ckb'),adminCkb);
  assert.equal(adminDictFor('ar'),adminAr);
  assert.equal(adminDictFor('en'),adminEn);
});
