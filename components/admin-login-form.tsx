'use client';

import {useActionState} from 'react';
import {login,type ActionState} from '@/app/(admin)/admin/actions';
import {useAdminI18n} from './admin-i18n-provider';
const initial:ActionState={};
export function AdminLoginForm({next='/admin'}:{next?:'/admin'|'/admin-basic'|'/admin-pro'}){const {a}=useAdminI18n();const [state,action,pending]=useActionState(login,initial);return <form action={action} className="admin-login-form"><input type="hidden" name="next" value={next}/><label className="field">{a.common.email}<input name="email" type="email" autoComplete="email" required autoFocus/></label><label className="field">{a.common.password}<input name="password" type="password" autoComplete="current-password" required/></label>{state.error&&<p className="error-message">{state.error}</p>}<button className="button" type="submit" disabled={pending}>{pending?a.common.signingIn:a.common.signIn}</button></form>}
