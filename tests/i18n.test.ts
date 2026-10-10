import test from 'node:test';
import assert from 'node:assert/strict';
import {en} from '../lib/i18n/en';
import {ar} from '../lib/i18n/ar';
import {ckb} from '../lib/i18n/ckb';
import {areaName,canonicalArea} from '../lib/i18n/areas';
import {dirOf,langs,localePath,stripLang} from '../lib/i18n/config';

/** Every key path of a dictionary, with arrays reduced to their first element's shape. */
function shape(value:unknown,prefix=''):string[]{
  if(Array.isArray(value))return value.length?shape(value[0],`${prefix}[]`):[`${prefix}[]`];
  if(value&&typeof value==='object')return Object.entries(value).flatMap(([key,child])=>shape(child,prefix?`${prefix}.${key}`:key));
  return [prefix];
}
/** Placeholders like {site} that a string uses, sorted. */
const placeholders=(text:string)=>(text.match(/\{\w+\}/g)||[]).sort().join(',');
function strings(value:unknown,prefix=''):[string,string][]{
  if(typeof value==='string')return [[prefix,value]];
  if(Array.isArray(value))return value.flatMap((child,i)=>strings(child,`${prefix}[${i}]`));
  if(value&&typeof value==='object')return Object.entries(value).flatMap(([key,child])=>strings(child,prefix?`${prefix}.${key}`:key));
  return [];
}

test('Kurdish and Arabic dictionaries have the same keys as English',()=>{
  assert.deepEqual(shape(ckb).sort(),shape(en).sort());
  assert.deepEqual(shape(ar).sort(),shape(en).sort());
});
test('Kurdish keeps every {placeholder} the English text has',()=>{
  const english=new Map(strings(en));
  for(const [key,text] of strings(ckb))assert.equal(placeholders(text),placeholders(english.get(key)??''),key);
});
test('no Kurdish string is empty or left in English by accident',()=>{
  const english=new Map(strings(en));
  for(const [key,text] of strings(ckb)){
    assert.ok(text.trim().length>0,key);
    if(/[A-Za-z]{4,}/.test(text.replace(/\{\w+\}/g,'')))assert.fail(`Latin text in ${key}: ${text} (English: ${english.get(key)})`);
  }
});
test('language paths and direction',()=>{
  assert.deepEqual([...langs],['en','ar','ckb']);
  assert.equal(localePath('ckb','/properties'),'/ckb/properties');
  assert.equal(localePath('ckb','/'),'/ckb');
  assert.equal(localePath('en','/properties'),'/properties');
  assert.equal(stripLang('/ckb/properties/MH-1'),'/properties/MH-1');
  assert.equal(stripLang('/ckb'),'/');
  assert.equal(dirOf('ckb'),'rtl');assert.equal(dirOf('ar'),'rtl');assert.equal(dirOf('en'),'ltr');
});
test('area names translate and map back to the stored English name',()=>{
  assert.equal(areaName('ckb','Malta'),'مالتا');
  assert.equal(areaName('ar','Malta'),'مالطا');
  assert.equal(areaName('en','Malta'),'Malta');
  assert.equal(areaName('ckb','Somewhere New'),'Somewhere New');
  assert.equal(canonicalArea('مالتا'),'Malta');
  assert.equal(canonicalArea('مالطا'),'Malta');
  assert.equal(canonicalArea(' malta '),'Malta');
  assert.equal(canonicalArea('Somewhere New'),'Somewhere New');
});
