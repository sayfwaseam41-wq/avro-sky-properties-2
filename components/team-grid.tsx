import Image from 'next/image';
import {initials,type TeamMember} from '@/lib/content';

export function TeamGrid({team}:{team:TeamMember[]}){
  return <ul className="team">
    {team.map(member=><li key={member.id}>
      <div className="team-photo">
        {member.photoUrl
          ?<Image src={member.photoUrl} alt={member.name} fill sizes="(min-width:1024px) 240px,(min-width:640px) 33vw,50vw"/>
          :<span className="team-initials" aria-hidden="true">{initials(member.name)}</span>}
      </div>
      <b>{member.name}</b>
      {member.roleTitle&&<span>{member.roleTitle}</span>}
    </li>)}
  </ul>;
}
