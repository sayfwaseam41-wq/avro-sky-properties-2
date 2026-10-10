import 'server-only';
import {neon} from '@neondatabase/serverless';
import {companyId,ensurePropertySchema} from './property-store';
import {parseTranslations} from './translations';
import {projectTranslatedFields,reviewTranslatedFields,teamTranslatedFields,type Project,type ProjectFields,type Review,type ReviewFields,type TeamFields,type TeamMember} from './content';

function database(){const url=process.env.DATABASE_URL;if(!url)throw new Error('The website database is not configured.');return neon(url);}

let schemaReady:Promise<void>|undefined;
/** Creates the content tables once per server instance. Every statement is IF NOT EXISTS, so it never touches existing data. */
export function ensureContentSchema(){return schemaReady??=createContentSchema().catch(error=>{schemaReady=undefined;throw error;});}
async function createContentSchema(){
  await ensurePropertySchema();
  const sql=database();
  await sql`CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY,company_id TEXT NOT NULL DEFAULT 'avro-sky',name TEXT NOT NULL,developer TEXT NOT NULL DEFAULT '',area TEXT NOT NULL DEFAULT '',description TEXT NOT NULL DEFAULT '',cover_url TEXT NOT NULL DEFAULT '',sort_order INTEGER NOT NULL DEFAULT 0,is_public BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),deleted_at TIMESTAMPTZ)`;
  await sql`CREATE TABLE IF NOT EXISTS team_members (id TEXT PRIMARY KEY,company_id TEXT NOT NULL DEFAULT 'avro-sky',name TEXT NOT NULL,role_title TEXT NOT NULL DEFAULT '',photo_url TEXT NOT NULL DEFAULT '',sort_order INTEGER NOT NULL DEFAULT 0,is_public BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),deleted_at TIMESTAMPTZ)`;
  await sql`CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY,company_id TEXT NOT NULL DEFAULT 'avro-sky',author TEXT NOT NULL,body TEXT NOT NULL,rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),sort_order INTEGER NOT NULL DEFAULT 0,is_public BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),deleted_at TIMESTAMPTZ)`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb`;
  await sql`ALTER TABLE team_members ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb`;
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb`;
}

type ProjectRow={id:string;name:string;developer:string;area:string;description:string;cover_url:string;sort_order:number|string;is_public:boolean;translations?:unknown};
type TeamRow={id:string;name:string;role_title:string;photo_url:string;sort_order:number|string;is_public:boolean;translations?:unknown};
type ReviewRow={id:string;author:string;body:string;rating:number|string;sort_order:number|string;is_public:boolean;translations?:unknown};
const toProject=(r:ProjectRow):Project=>({id:r.id,name:r.name,developer:r.developer,area:r.area,description:r.description,coverUrl:r.cover_url,sortOrder:Number(r.sort_order),isPublic:r.is_public,translations:parseTranslations(r.translations,projectTranslatedFields)});
const toTeam=(r:TeamRow):TeamMember=>({id:r.id,name:r.name,roleTitle:r.role_title,photoUrl:r.photo_url,sortOrder:Number(r.sort_order),isPublic:r.is_public,translations:parseTranslations(r.translations,teamTranslatedFields)});
const toReview=(r:ReviewRow):Review=>({id:r.id,author:r.author,body:r.body,rating:Number(r.rating),sortOrder:Number(r.sort_order),isPublic:r.is_public,translations:parseTranslations(r.translations,reviewTranslatedFields)});

// ---- Projects ----
export async function getProjects(publicOnly=true):Promise<Project[]>{
  await ensureContentSchema();
  const rows=await database()`SELECT * FROM projects WHERE company_id=${companyId} AND deleted_at IS NULL AND (is_public=TRUE OR ${!publicOnly}) ORDER BY sort_order ASC,name ASC,id ASC`;
  return (rows as ProjectRow[]).map(toProject);
}
export async function getProject(id:string){
  if(!id)return undefined;
  await ensureContentSchema();
  const rows=await database()`SELECT * FROM projects WHERE company_id=${companyId} AND deleted_at IS NULL AND is_public=TRUE AND id=${id} LIMIT 1`;
  return rows[0]?toProject(rows[0] as ProjectRow):undefined;
}
export async function saveProject(fields:ProjectFields,id?:string){
  await ensureContentSchema();
  const sql=database();
  if(id){await sql`UPDATE projects SET name=${fields.name},developer=${fields.developer},area=${fields.area},description=${fields.description},cover_url=${fields.coverUrl},sort_order=${fields.sortOrder},is_public=${fields.isPublic},translations=${JSON.stringify(fields.translations??{})}::jsonb WHERE company_id=${companyId} AND id=${id} AND deleted_at IS NULL`;return;}
  await sql`INSERT INTO projects (id,company_id,name,developer,area,description,cover_url,sort_order,is_public,translations) VALUES (${crypto.randomUUID()},${companyId},${fields.name},${fields.developer},${fields.area},${fields.description},${fields.coverUrl},${fields.sortOrder},${fields.isPublic},${JSON.stringify(fields.translations??{})}::jsonb)`;
}
export async function deleteProject(id:string){
  if(!id)throw new Error('Invalid project.');
  await ensureContentSchema();
  const sql=database();
  await sql`UPDATE projects SET deleted_at=NOW(),is_public=FALSE WHERE company_id=${companyId} AND id=${id} AND deleted_at IS NULL`;
  // Listings that pointed at the project stay online; they just stop belonging to it.
  await sql`UPDATE properties SET project_id=NULL,updated_at=NOW() WHERE company_id=${companyId} AND project_id=${id}`;
}

// ---- Team ----
export async function getTeam(publicOnly=true):Promise<TeamMember[]>{
  await ensureContentSchema();
  const rows=await database()`SELECT * FROM team_members WHERE company_id=${companyId} AND deleted_at IS NULL AND (is_public=TRUE OR ${!publicOnly}) ORDER BY sort_order ASC,name ASC,id ASC`;
  return (rows as TeamRow[]).map(toTeam);
}
export async function saveTeamMember(fields:TeamFields,id?:string){
  await ensureContentSchema();
  const sql=database();
  if(id){await sql`UPDATE team_members SET name=${fields.name},role_title=${fields.roleTitle},photo_url=${fields.photoUrl},sort_order=${fields.sortOrder},is_public=${fields.isPublic},translations=${JSON.stringify(fields.translations??{})}::jsonb WHERE company_id=${companyId} AND id=${id} AND deleted_at IS NULL`;return;}
  await sql`INSERT INTO team_members (id,company_id,name,role_title,photo_url,sort_order,is_public,translations) VALUES (${crypto.randomUUID()},${companyId},${fields.name},${fields.roleTitle},${fields.photoUrl},${fields.sortOrder},${fields.isPublic},${JSON.stringify(fields.translations??{})}::jsonb)`;
}
export async function deleteTeamMember(id:string){
  if(!id)throw new Error('Invalid team member.');
  await ensureContentSchema();
  await database()`UPDATE team_members SET deleted_at=NOW(),is_public=FALSE WHERE company_id=${companyId} AND id=${id} AND deleted_at IS NULL`;
}

// ---- Reviews ----
export async function getReviews(publicOnly=true):Promise<Review[]>{
  await ensureContentSchema();
  const rows=await database()`SELECT * FROM reviews WHERE company_id=${companyId} AND deleted_at IS NULL AND (is_public=TRUE OR ${!publicOnly}) ORDER BY sort_order ASC,created_at DESC,id ASC`;
  return (rows as ReviewRow[]).map(toReview);
}
export async function saveReview(fields:ReviewFields,id?:string){
  await ensureContentSchema();
  const sql=database();
  if(id){await sql`UPDATE reviews SET author=${fields.author},body=${fields.body},rating=${fields.rating},sort_order=${fields.sortOrder},is_public=${fields.isPublic},translations=${JSON.stringify(fields.translations??{})}::jsonb WHERE company_id=${companyId} AND id=${id} AND deleted_at IS NULL`;return;}
  await sql`INSERT INTO reviews (id,company_id,author,body,rating,sort_order,is_public,translations) VALUES (${crypto.randomUUID()},${companyId},${fields.author},${fields.body},${fields.rating},${fields.sortOrder},${fields.isPublic},${JSON.stringify(fields.translations??{})}::jsonb)`;
}
export async function deleteReview(id:string){
  if(!id)throw new Error('Invalid review.');
  await ensureContentSchema();
  await database()`UPDATE reviews SET deleted_at=NOW(),is_public=FALSE WHERE company_id=${companyId} AND id=${id} AND deleted_at IS NULL`;
}
