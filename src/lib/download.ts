const maxBytes=500*1024*1024;
export async function downloadDirectVideo(url:string,title:string):Promise<void>{
  const source=new URL(url);
  if(source.protocol!=='https:')throw new Error('For safety, downloads require a secure HTTPS link.');
  let response:Response;
  try{response=await fetch(source.toString(),{credentials:'omit',redirect:'follow'})}catch{throw new Error('The video host blocks direct downloads from this app. Open the original video and use the host’s download option if available.')}
  if(!response.ok)throw new Error(`The video host returned an error (${response.status}). Open the original video and use its download option.`);
  if(!response.url.startsWith('https://'))throw new Error('The video host returned an unsupported link.');
  const type=response.headers.get('content-type')?.split(';')[0].trim().toLowerCase()??'';
  if(!type.startsWith('video/'))throw new Error('This is a social-media page, not a direct video file. Open it on the platform and use its official download option if available.');
  const length=Number(response.headers.get('content-length')??0);
  if(length>maxBytes)throw new Error('This file is larger than 500 MB. Download it from the video host instead.');
  let blob:Blob;
  if(response.body){const reader=response.body.getReader(),chunks:Uint8Array[]=[];let size=0;while(true){const{done,value}=await reader.read();if(done)break;if(value){size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new Error('This file is larger than 500 MB. Download it from the video host instead.')}chunks.push(value)}}blob=new Blob(chunks,{type})}else{blob=await response.blob();if(blob.size>maxBytes)throw new Error('This file is larger than 500 MB. Download it from the video host instead.')}
  const mimeExt:Record<string,string>={'video/mp4':'mp4','video/webm':'webm','video/quicktime':'mov','video/x-m4v':'m4v'};
  const pathExt=source.pathname.match(/\.(mp4|webm|mov|m4v)$/i)?.[1]?.toLowerCase();
  const ext=pathExt??mimeExt[type]??'mp4';
  const filename=(title||'videovault-video').replace(/[<>:"/\\|?*\u0000-\u001f]/g,' ').trim().slice(0,100)||'videovault-video';
  const objectUrl=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=objectUrl;anchor.download=`${filename}.${ext}`;anchor.style.display='none';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(objectUrl),60_000);
}

