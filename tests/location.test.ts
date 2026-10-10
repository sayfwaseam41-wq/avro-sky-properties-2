import test from 'node:test';
import assert from 'node:assert/strict';
import {coordinatesOf,formatLocation,parseLocation} from '../lib/location';

test('plain coordinates',()=>{
  assert.deepEqual(parseLocation('36.8669, 42.9503'),{lat:36.8669,lng:42.9503});
  assert.deepEqual(parseLocation(' 36.8669 42.9503 '),{lat:36.8669,lng:42.9503});
  assert.deepEqual(parseLocation('36.8669;42.9503'),{lat:36.8669,lng:42.9503});
  assert.deepEqual(parseLocation('-33.86, 151.21'),{lat:-33.86,lng:151.21});
});
test('google maps links',()=>{
  assert.deepEqual(parseLocation('https://www.google.com/maps/@36.8669,42.9503,17z'),{lat:36.8669,lng:42.9503});
  assert.deepEqual(parseLocation('https://www.google.com/maps/place/Duhok/@36.9,43.0,12z/data=!3m1!4b1!4m6!3m5!1s0x0:0x0!8m2!3d36.8669!4d42.9503'),{lat:36.8669,lng:42.9503});
  assert.deepEqual(parseLocation('https://maps.google.com/?q=36.8669,42.9503'),{lat:36.8669,lng:42.9503});
  assert.deepEqual(parseLocation('https://www.google.com/maps/search/?api=1&query=36.8669%2C42.9503'),{lat:36.8669,lng:42.9503});
});
test('rejects things that are not a location',()=>{
  assert.equal(parseLocation(''),null);
  assert.equal(parseLocation('Duhok, Iraq'),null);
  assert.equal(parseLocation('https://maps.app.goo.gl/abc123'),null);
  assert.equal(parseLocation('95, 42'),null);
  assert.equal(parseLocation('36.8, 190'),null);
});
test('round trip and listing helpers',()=>{
  assert.equal(formatLocation({latitude:36.8669,longitude:42.9503}),'36.8669, 42.9503');
  assert.deepEqual(parseLocation(formatLocation({latitude:36.8669,longitude:42.9503})),{lat:36.8669,lng:42.9503});
  assert.equal(formatLocation({}),'');
  assert.equal(formatLocation({latitude:null,longitude:null}),'');
  assert.deepEqual(coordinatesOf({latitude:36.8,longitude:42.9}),{lat:36.8,lng:42.9});
  assert.equal(coordinatesOf({latitude:36.8,longitude:null}),null);
  assert.equal(coordinatesOf({}),null);
});
