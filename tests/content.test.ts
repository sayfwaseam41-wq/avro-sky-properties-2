import test from 'node:test';
import assert from 'node:assert/strict';
import {initials,projectFromForm,reviewFromForm,teamFromForm} from '../lib/content';

const form=(values:Record<string,string>)=>{const data=new FormData();for(const [key,value] of Object.entries(values))data.set(key,value);return data;};

test('project form: trims, defaults and checkbox',()=>{
  const project=projectFromForm(form({name:'  Cavalli Tower  ',developer:'Acme',area:'Malta',description:'Nice',coverUrl:'https://example.com/a.jpg',sortOrder:'3',isPublic:'on'}));
  assert.deepEqual(project,{name:'Cavalli Tower',developer:'Acme',area:'Malta',description:'Nice',coverUrl:'https://example.com/a.jpg',sortOrder:3,isPublic:true,translations:{}});
  assert.equal(projectFromForm(form({name:'X'})).isPublic,false);
  assert.equal(projectFromForm(form({name:'X'})).sortOrder,0);
});
test('project form: rejects bad input',()=>{
  assert.throws(()=>projectFromForm(form({name:'   '})),/Name is required/);
  assert.throws(()=>projectFromForm(form({name:'X',coverUrl:'http://example.com/a.jpg'})),/https/);
  assert.throws(()=>projectFromForm(form({name:'X',coverUrl:'javascript:alert(1)'})),/https/);
  assert.throws(()=>projectFromForm(form({name:'X',sortOrder:'-1'})),/Sort order/);
  assert.throws(()=>projectFromForm(form({name:'X',sortOrder:'1.5'})),/Sort order/);
});
test('team form',()=>{
  assert.deepEqual(teamFromForm(form({name:'Aso Ahmed',roleTitle:'Agent',isPublic:'on'})),{name:'Aso Ahmed',roleTitle:'Agent',photoUrl:'',sortOrder:0,isPublic:true,translations:{}});
  assert.throws(()=>teamFromForm(form({roleTitle:'Agent'})),/Name is required/);
});
test('review form: rating 1 to 5, text required',()=>{
  assert.equal(reviewFromForm(form({author:'A',body:'Great'})).rating,5);
  assert.equal(reviewFromForm(form({author:'A',body:'Ok',rating:'3'})).rating,3);
  assert.throws(()=>reviewFromForm(form({author:'A',body:'Ok',rating:'6'})),/Rating/);
  assert.throws(()=>reviewFromForm(form({author:'A',body:'Ok',rating:'0'})),/Rating/);
  assert.throws(()=>reviewFromForm(form({author:'A',body:''})),/Review text is required/);
  assert.equal(reviewFromForm(form({author:'A',body:'x'.repeat(2000)})).body.length,1200);
});
test('initials',()=>{
  assert.equal(initials('Aso Ahmed'),'AA');
  assert.equal(initials('  dilan '),'D');
  assert.equal(initials('ئاسۆ ئەحمەد'),'ئئ');
  assert.equal(initials(''),'');
});
