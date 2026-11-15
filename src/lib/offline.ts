import {openDB} from 'idb';import type {Video} from '../types';
const db=()=>openDB('videovault-local',1,{upgrade(d){if(!d.objectStoreNames.contains('videos'))d.createObjectStore('videos',{keyPath:'id'});if(!d.objectStoreNames.contains('queue'))d.createObjectStore('queue',{keyPath:'id'});}});
export async function cacheVideos(items:Video[]){const d=await db(),t=d.transaction('videos','readwrite');for(const v of items)await t.store.put(v);await t.done}
export async function readCachedVideos():Promise<Video[]>{return(await db()).getAll('videos')}
export async function queueVideo(v:Video){await(await db()).put('queue',v)}
export async function readQueue():Promise<Video[]>{return(await db()).getAll('queue')}
export async function clearQueued(id:string){await(await db()).delete('queue',id)}
