/** A point on the map. */
export type Coordinates={lat:number;lng:number};

const num='-?\\d{1,3}(?:\\.\\d+)?';
// Most precise first: Google puts the place itself in !3d…!4d…, and only the map centre after @.
const patterns=[
  new RegExp(`!3d(${num})!4d(${num})`),
  new RegExp(`@(${num}),(${num})`),
  new RegExp(`[?&](?:q|ll|query|center|destination)=(${num})(?:,|%2C|\\+|%20)\\s*(${num})`,'i'),
  new RegExp(`^\\s*(${num})\\s*[,;\\s]\\s*(${num})\\s*$`),
];
const inRange=(lat:number,lng:number)=>Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180;

/**
 * Reads a map location typed or pasted by staff: "36.8669, 42.9503", or a full Google Maps link
 * (…/@36.8669,42.9503,17z, …!3d36.8669!4d42.9503, …?q=36.8669,42.9503).
 * Returns null when nothing usable is found. Short links (maps.app.goo.gl) hide the coordinates and cannot be read.
 */
export function parseLocation(input:string):Coordinates|null{
  const text=input.trim();
  if(!text)return null;
  for(const pattern of patterns){
    const match=text.match(pattern);
    if(!match)continue;
    const lat=Number(match[1]);const lng=Number(match[2]);
    if(inRange(lat,lng))return {lat,lng};
  }
  return null;
}

/** Text for the admin field: "36.8669, 42.9503", or empty when the listing has no location. */
export function formatLocation(p:{latitude?:number|null;longitude?:number|null}){
  return p.latitude!=null&&p.longitude!=null?`${p.latitude}, ${p.longitude}`:'';
}

/** Coordinates of a listing, or null when staff have not set a map location. */
export function coordinatesOf(p:{latitude?:number|null;longitude?:number|null}):Coordinates|null{
  return p.latitude!=null&&p.longitude!=null&&inRange(p.latitude,p.longitude)?{lat:p.latitude,lng:p.longitude}:null;
}
