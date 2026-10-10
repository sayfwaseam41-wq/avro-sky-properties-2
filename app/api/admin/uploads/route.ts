import {handleUpload} from '@vercel/blob/client';
import {NextResponse} from 'next/server';
import {verifiedStaff} from '@/lib/admin-auth';

export async function POST(request:Request){
  const staff=await verifiedStaff();
  if(!staff) return NextResponse.json({error:'Unauthorized'}, {status:401});

  const body=await request.json();
  try {
    const json=await handleUpload({
      body,
      request,
      onBeforeGenerateToken:async pathname=>{
        if(!pathname.startsWith('properties/')&&!pathname.startsWith('content/')) throw new Error('Invalid upload path.');
        return {
          allowedContentTypes:['image/jpeg','image/png','image/webp','image/avif'],
          maximumSizeInBytes:15*1024*1024,
          addRandomSuffix:true,
        };
      },
    });
    return NextResponse.json(json);
  } catch(error) {
    return NextResponse.json({error:error instanceof Error?error.message:'Unable to prepare the upload.'},{status:400});
  }
}
