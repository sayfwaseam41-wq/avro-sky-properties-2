'use client';

import {useActionState} from 'react';
import {login,type ActionState} from '@/app/admin/actions';
const initial:ActionState={};
export function AdminLoginForm(){const [state,action,pending]=useActionState(login,initial);return <form action={action} className="admin-login-form"><label className="field">Email<input name="email" type="email" autoComplete="email" required autoFocus/></label><label className="field">Password<input name="password" type="password" autoComplete="current-password" required/></label>{state.error&&<p className="error-message">{state.error}</p>}<button className="button" type="submit" disabled={pending}>{pending?'Signing in…':'Sign in'}</button></form>}
