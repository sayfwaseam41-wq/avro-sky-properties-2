'use server';

import {revalidatePath,updateTag} from 'next/cache';
import {requireRole} from '@/lib/admin-auth';
import {contentTag,propertiesTag} from '@/lib/public-data';
import {deleteProject,deleteReview,deleteTeamMember,saveProject,saveReview,saveTeamMember} from '@/lib/content-store';
import {projectFromForm,reviewFromForm,teamFromForm} from '@/lib/content';

/** `saved` changes on every successful save, so a form can react to it (close, reset). */
export type ContentState={error?:string;saved?:number};

async function run(task:()=>Promise<void>,fallback:string,alsoListings=false):Promise<ContentState>{
  try{await requireRole('Admin');await task();}
  catch(error){return {error:error instanceof Error?error.message:fallback};}
  updateTag(contentTag);
  if(alsoListings)updateTag(propertiesTag);
  revalidatePath('/[lang]','layout');revalidatePath('/admin-basic/content');revalidatePath('/admin-basic');
  return {saved:Date.now()};
}
const idOf=(form:FormData)=>String(form.get('id')||'').trim();

export async function saveProjectAction(_:ContentState,form:FormData){return run(()=>saveProject(projectFromForm(form),idOf(form)||undefined),'Unable to save this project.');}
export async function removeProjectAction(_:ContentState,form:FormData){return run(()=>deleteProject(idOf(form)),'Unable to delete this project.',true);}
export async function saveTeamAction(_:ContentState,form:FormData){return run(()=>saveTeamMember(teamFromForm(form),idOf(form)||undefined),'Unable to save this team member.');}
export async function removeTeamAction(_:ContentState,form:FormData){return run(()=>deleteTeamMember(idOf(form)),'Unable to delete this team member.');}
export async function saveReviewAction(_:ContentState,form:FormData){return run(()=>saveReview(reviewFromForm(form),idOf(form)||undefined),'Unable to save this review.');}
export async function removeReviewAction(_:ContentState,form:FormData){return run(()=>deleteReview(idOf(form)),'Unable to delete this review.');}
