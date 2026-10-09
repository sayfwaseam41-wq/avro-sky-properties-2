/** Fills a WhatsApp reminder template and builds the wa.me link. Safe to import from client components. */
export type ReminderValues={tenantName:string;propertyName:string;rentAmount:string;dueDate:string;adminName:string};

export function renderReminder(body:string,v:ReminderValues){
  return body.replaceAll('{tenantName}',v.tenantName).replaceAll('{propertyName}',v.propertyName).replaceAll('{rentAmount}',v.rentAmount).replaceAll('{dueDate}',v.dueDate).replaceAll('{adminName}',v.adminName);
}

export function whatsappUrl(number:string,message:string){
  const digits=number.replace(/\D/g,'');
  return digits?`https://wa.me/${digits}?text=${encodeURIComponent(message)}`:undefined;
}
