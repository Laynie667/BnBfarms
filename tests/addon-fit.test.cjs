// Add-on lines fit who they're about (Laynie, Oct 14: "checking that they make sense via gender, equipped anatomy,
// equipped items, species"): the dairy, barn life and the glory stalls, run for a female cow, a male cow, a futa pony,
// a femboy pup and a male pig, with and without gear. No line talks about a part they haven't got, no tag or
// placeholder shows, no clinical word, and a cow's moo stays with the cows.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const P=(mn,name,species,gender,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species,gender,onDuty:true,herds:[],tempKeys:[],cover:[],milkable:true,degradeMe:true,praiseMe:false},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "501":P(501,"Bessie","cow","female"), "502":P(502,"Brutus","cow","male"), "503":P(503,"Clover","pony","futa"),
 "504":P(504,"Pip","pup","femboy"), "505":P(505,"Hamlet","pig","male",{praiseMe:true,degradeMe:false})
},applications:[],archive:{},log:[],stuckLog:[],spots:{"trough-1":{X:5,Y:5},"water-1":{X:6,Y:5}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(501,5,5),at(502,5,5),at(503,5,5),at(504,5,5),at(505,5,5)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,501,502,503,504,505]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const realTimeout=setTimeout, wait=ms=>new Promise(r=>realTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const BODY={501:{v:1,t:1},502:{c:1},503:{v:1,c:1,t:1},504:{c:1},505:{c:1}};
const VUL=/\b(pussy|pussies|cunt|clit|womb|slit)\b/i, TIT=/\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i, COCK=/\b(cock|balls)\b/i;
const CLIN=/\b(lactat\w*|mammar\w*|ejaculat\w*|genital\w*|vagina\w*|penis(es)?|semen|anus|rectum|testicles?)\b/i;
const problems=[]; const seen=new Set();
const OWN_COCK=/%n's (own )?(cock|balls)|their own (cock|balls)|\b[A-Z][a-z]+'s (own )?(cock|balls)/;
function check(mn, t, where, cowOk){
  t=String(t); seen.add(t); const b=BODY[mn], why=[];
  if(!b.v && VUL.test(t)) why.push('pussy word');
  if(!b.t && TIT.test(t)) why.push('tits word');
  if(!b.c && (where==='glory' ? OWN_COCK.test(t) : COCK.test(t))) why.push('cock word');
  if(/\{[a-z]{1,3}\}/.test(t)) why.push('tag');
  if(/%[A-Za-z]+%?/.test(t.replace(/%n\b|%n'/g,''))) why.push('placeholder');
  if(CLIN.test(t)) why.push('clinical');
  if(!cowOk && /\bmoo\w*\b|\bcow\b|heifer/i.test(t)) why.push('cow word');
  if(/\bundefined\b|\bnull\b|NaN/.test(t)) why.push('leak');
  if(why.length) problems.push(where+' '+mn+' '+why.join(',')+': '+t.slice(0,160));
}
(async()=>{ await wait(3500);
  chars.forEach(c=>{ const p=L().people[c.MemberNumber]; if(p) c.Name=p.name; });
  for (const a of ['dairy','barn-life','glory-stalls','breeding','shows','conditioning']) eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-'+a+'.user.js'),'utf8'));
  await wait(300);
  ok(['dairy','barn-life','glory-stalls'].every(n=>W.Farmhand.list().some(a=>a.name===n)), 'the add-ons registered');
  const cows=[501,502];
  // dairy: every kind of line, for every body, at every level and fullness
  for (const mn of [501,502,503,504,505]) for (let i=0;i<120;i++){
    const p=W.__prodOf(mn); if(p) p.milk=(i%3+1)*1000;
    const kinds=['pump','echo','stallMilk','stallDone','gearDry'].concat(BODY[mn].c?['stallSemen','stallDoneSemen']:[]);
    for (const k of kinds){ const t=W.__addonLine(k, W.__lineInfo(mn,{level:1+i%3, gear:'Milker', ml:'40 mL', cock: BODY[mn].c?'thick':''})); if(t) check(mn,t,'dairy:'+k,cows.includes(mn)); }
  }
  // gear: a gag, bound arms and a bell on Hamlet; nothing on the others
  const C5=chars.find(c=>c.MemberNumber===505);
  C5.Appearance=[{Asset:{Name:'BallGag',Description:'Ball Gag',Group:{Name:'ItemMouth'},Effect:['BlockMouth','GagNormal']}},{Asset:{Name:'HempRope',Description:'Hemp Rope',Group:{Name:'ItemArms'}}},{Asset:{Name:'CowBell',Description:'Cow Bell',Group:{Name:'ItemNeckAccessories'}}}];
  const g=W.__gearSense(505);
  ok(g.gag && g.arms && g.bell && !g.collar, 'gear is seen: gag, arms, bell (and no collar)');
  // barn life: Hamlet can't eat with a gag in; the others eat and get groomed in their own kind's way
  for (const mn of [501,502,503,504,505]) L().mods['barn-life'].optIn[mn]=true;
  { const n=L().mods['barn-life'].needs; n[505]=n[505]||{food:10,water:10,groom:100,t:Date.now(),warned:{},said:0}; n[505].food=10; }
  let k=sent.length; handlers.AccountBeep({MemberNumber:505,Message:'eat'}); await wait(5600);
  ok(sent.slice(k).some(([e,d])=>d&&/mouth stopped up/.test(JSON.stringify(d))), "a gagged pig is told they can't eat like that");
  for (let r=0;r<3;r++) for (const mn of [501,502,503,504]){
    const n=L().mods['barn-life'].needs[mn]; if(n){ n.food=10; n.water=10; }
    k=sent.length; handlers.AccountBeep({MemberNumber:mn,Message:'eat'}); await wait(5200);
    const em=sent.slice(k).map(([e,d])=>d&&d.Content).filter(t=>typeof t==='string'&&/🌾/.test(t));
    em.forEach(t=>check(mn,t,'eat',cows.includes(mn)));
  }
  // the glory stalls' scenes, straight from the module: every body, gear on and off, a cow and a pony
  const S=await import('file://'+path.join(__dirname,'../addons/glory-stalls/scenes.js').replace(/\\/g,'/'));
  const bodies={501:{g:'female',vulva:true,cock:false,tits:true},502:{g:'male',vulva:false,cock:true,tits:false},503:{g:'futa',vulva:true,cock:true,tits:true},504:{g:'femboy',vulva:false,cock:true,tits:false}};
  const gear={collar:true,bell:true,gag:true,cage:true,plugBack:true,latex:true,paws:true,leash:true,blind:true};
  const animals={cow:{key:'cow',a:'cow',call:'moo',sounds:['a low moo']},pony:{key:'pony',a:'pony',call:'whinny',sounds:['a soft nicker']}};
  let beats=0;
  for (const [mn,body] of Object.entries(bodies)) for (let i=0;i<250;i++){
    const holes=body.vulva?['vulva','butt']:['butt'], v=S.pickVisitor(holes), cow=Number(mn)===501||Number(mn)===502;
    const sc=S.buildScene({hole:v.type==='double'?'vulva':holes[i%holes.length],visitor:v,funnel:false,degrade:i%2===0,praise:i%3===0,holes,setup:['voluntary','bound','punished'][i%3],body,gear:i%2?gear:{},animal:cow?animals.cow:animals.pony});
    for (const b of sc.beats){ beats++; check(Number(mn), b.t.replace(/\bstranger's cock\b/g,''), 'glory', cow); if(!(i%2) && /\b(gag|cage|collar|leash|blindfold)\b/i.test(b.t) && !/funnel/i.test(b.t)) problems.push('glory gear-without '+mn+': '+b.t.slice(0,120)); }
  }
  ok(beats>20000, 'scenes built: '+beats+' beats');
  ok(seen.size>2000, 'plenty of different lines ('+seen.size+')');
  problems.slice(0,20).forEach(p=>out('  '+p));
  ok(problems.length===0, 'every line fits the body, gear and species it is about ('+problems.length+' problems)');
  out(fails?'FAIL':'PASS'); process.exit(fails?1:0);
})();
