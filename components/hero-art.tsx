/** Skyline drawn from the Avro Sky mark: gold side faces, outlined glass faces with vertical bands. Pure SVG, no image request. */
export function HeroArt(){
  const stripes=(x:number,y:number,w:number,h:number,n:number)=>Array.from({length:n},(_,i)=><rect key={i} x={x+(w/(n+1))*(i+1)-4} y={y} width="8" height={h} fill="url(#band)"/>);
  return <svg className="hero-art" viewBox="0 0 760 560" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9bf7a"/><stop offset="1" stopColor="#9e813e" stopOpacity=".55"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16365c"/><stop offset="1" stopColor="#0b1f38"/></linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b79a53"/><stop offset="1" stopColor="#8a6f31"/></linearGradient>
    </defs>
    <path d="M0 560V400l70-62 60 44 90-96 80 78 70-60 100 90 80-52 90 70 120-80v228Z" fill="#102c4c" opacity=".7"/>
    <path d="M0 560V450l90-48 80 40 110-70 100 66 90-40 120 56 170-60v166Z" fill="#0c2542" opacity=".9"/>
    {/* tall tower */}
    <path d="M470 120 548 84V560h-78Z" fill="url(#gold)"/>
    <rect x="548" y="84" width="150" height="476" fill="url(#glass)" stroke="#cdb36f" strokeWidth="3"/>
    {stripes(548,120,150,420,3)}
    {/* middle tower */}
    <path d="M300 300 372 266V560h-72Z" fill="url(#gold)"/>
    <rect x="372" y="266" width="108" height="294" fill="url(#glass)" stroke="#cdb36f" strokeWidth="3"/>
    {stripes(372,296,108,244,3)}
    {/* house */}
    <path d="M118 418 238 330 358 418l-22 24-98-72-98 72Z" fill="#f2ead8"/>
    <path d="M148 430 238 364 328 430V560H148Z" fill="url(#gold)"/>
    <path d="M214 450h22v26h-22zM240 450h22v26h-22zM214 480h22v26h-22zM240 480h22v26h-22z" fill="#f2ead8" opacity=".95"/>
    <rect x="100" y="552" width="620" height="8" fill="#9e813e"/>
  </svg>;
}
