import test from 'node:test';
import assert from 'node:assert/strict';
import {filterProperties,featuredProperties,type Property} from '../lib/property';
const p=(partial:Partial<Property>):Property=>({id:'rec12345678901234',title:'A',type:'Apartment',listingType:'For Rent',price:500,bedrooms:2,bathrooms:1,size:80,area:'Malta',status:'Available',description:'',photos:[],featured:false,dateListed:'2026-09-23T00:00:00Z',...partial});
test('filters apply without excluding matching inventory',()=>assert.deepEqual(filterProperties([p({id:'a'}),p({id:'b',area:'Zawa',price:2000,bedrooms:4})],{area:'Zawa',listingType:'For Rent',minPrice:'1000',maxPrice:'',bedrooms:'4+'}).map(x=>x.id),['b']));
test('featured falls back to the newest supplied list',()=>assert.equal(featuredProperties([p({id:'a'}),p({id:'b'})]).length,2));
