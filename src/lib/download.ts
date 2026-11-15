const maxBytes=500*1024*1024;
const mediaExtension=/\.(mp4|webm|mov|m4v)$/i;
export async function downloadDirectVideo(url:string,title:string):Promise<void>{
  const source=new URL(url);
  if(source.protocol!=='https:'||!mediaExtension.test(source.pathname))throw new Error('This link is a platform page, not a direct video file. Open the original video and use its official download or offline option.');
  const response=await fetch(source.toString(),{credentials:'omit',redirect:'follow'});
  if(!response.ok)throw new Error('The video host did not allow the download. Open the original video and use its official download option.');
  if(!response.url.startsWith('https://'))throw new Error('The video host returned an unsupported link.');
  const type=response.headers.get('content-type')?.split(';')[0].trim()??'';
  if(!type.startsWith('video/'))throw new Error('The link did not return a video file.');
  const length=Number(response.headers.get('content-length')??0);
  if(length>maxBytes)throw new Error('This file is larger than 500 MB. Download it from the video host instead.');
  let blob:Blob;
  if(response.body){const reader=response.body.getReader(),chunks:Uint8Array[]=[];let size=0;while(true){const{done,value}=await reader.read();if(done)break;if(value){size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new Error('This file is larger than 500 MB. Download it from the video host instead.')}chunks.push(value)}}blob=new Blob(chunks,{type})}else{blob=await response.blob();if(blob.size>maxBytes)throw new Error('This file is larger than 500 MB. Download it from the video host instead.')}
  const ext=source.pathname.match(mediaExtension)?.[1]?.toLowerCase()??'mp4';
  const filename=(title||'videovault-video').replace(/[<>:"/\\|?*\u0000-\u001f]/g,' ').trim().slice(0,100)||'videovault-video';
  const objectUrl=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=objectUrl;anchor.download=`${filename}.${ext}`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(objectUrl),60_000);
}

