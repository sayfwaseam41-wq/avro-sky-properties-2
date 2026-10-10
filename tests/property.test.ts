import test from 'node:test';
import assert from 'node:assert/strict';
import {filterProperties,featuredProperties,type Property} from '../lib/property';
const p=(partial:Partial<Property>):Property=>({id:'rec12345678901234',title:'A',type:'Apartment',listingType:'For Rent',price:500,bedrooms:2,bathrooms:1,size:80,area:'Malta',status:'Available',description:'',photos:[],featured:false,dateListed:'2026-09-23T00:00:00Z',...partial});
test('filters apply without excluding matching inventory',()=>assert.deepEqual(filterProperties([p({id:'a'}),p({id:'b',area:'Zawa',price:2000,bedrooms:4})],{area:'Zawa',listingType:'For Rent',minPrice:'1000',maxPrice:'',bedrooms:'4+'}).map(x=>x.id),['b']));
test('featured falls back to the newest supplied list',()=>assert.equal(featuredProperties([p({id:'a'}),p({id:'b'})]).length,2));
import {similarProperties} from '../lib/property';
test('similar properties: same rent/sale type only, closest match first, never itself',()=>{
  const here=p({id:'here',area:'Malta',type:'Apartment',listingType:'For Rent',price:1000});
  const list=[
    here,
    p({id:'same-all',area:'Malta',type:'Apartment',listingType:'For Rent',price:1100}),
    p({id:'same-area',area:'Malta',type:'House',listingType:'For Rent',price:5000}),
    p({id:'same-type',area:'Zawa',type:'Apartment',listingType:'For Rent',price:1000}),
    p({id:'for-sale',area:'Malta',type:'Apartment',listingType:'For Sale',price:1000}),
    p({id:'unrelated',area:'Zawa',type:'Land',listingType:'For Rent',price:1000}),
  ];
  assert.deepEqual(similarProperties(list,here).map(x=>x.id),['same-all','same-type','same-area']);
  assert.deepEqual(similarProperties(list,here,1).map(x=>x.id),['same-all']);
  assert.deepEqual(similarProperties([here],here),[]);
});
