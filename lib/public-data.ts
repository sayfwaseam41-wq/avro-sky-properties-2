import 'server-only';
import {cache} from 'react';
import {unstable_cache} from 'next/cache';
import {getProperties,getPublicProperty} from './property-store';

/** Public reads are cached for a minute and expired immediately by admin writes (tag: "properties"). */
export const propertiesTag='properties';
const options={tags:[propertiesTag],revalidate:60};

export const getCachedProperties=unstable_cache(getProperties,['public-properties'],options);
const loadProperty=unstable_cache(getPublicProperty,['public-property'],options);
/** `cache` dedupes the lookup between generateMetadata and the page within one render. */
export const getCachedProperty=cache((id:string)=>loadProperty(id));
