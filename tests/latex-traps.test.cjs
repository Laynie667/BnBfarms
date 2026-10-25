// Oct 25 (Laynie: "check the symbiotic cool downs, its a little long - also need to make sure every symbiotic is actually attainable, or atleast have a command way to give them. need more traps for the latex")
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}), "800":{mn:800,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rubber-shed":{X:60,Y:60}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30),at(800,31,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==='ChatRoomCharacterMapDataUpdate'||ev==='ChatRoomCharacterUpdate'){} }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.maze=null; r.benched=null; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
const done=async(mn,ms)=>{ for(let i=0;i<60;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.12; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SYM.LATEX_TRAP_CHANCE=0;
  ['Laynie','Moo','Rex','Pip','Hank'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700]) await say(mn,'?stats',900);
  const prod=mn=>P(mn).prod;
  cfg.SEND_INTERVAL_MS=2;
  for (const mn of [500,221397]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:"0.42.0"}});
  await wait(800);
  // ── the latex traps all run, start to finish, with lines that fit, and their real latex gear ──
  const NEW={vacbed:["device","VacBedDeluxe"],rubbervat:null,dollmaker:["hood","LatexHood"],rubberstall:["torso","LatexSuit"],bodybag:["device","InflatableBodyBag"],
             rubbermaid:["mitts","LatexBondageMitts"],blackpool:["legs","Slime"],rubberpup:["hood","LatexDogHood"]};
  const broke=[], silent=[], nogear=[]; let vatSkin=false;
  for (const [k,g] of Object.entries(NEW)){
    for (const mn of [500,600]){
      free(mn); prod(mn).milk=400; let n=sent.length;
      await say(221397,'?trap spring '+(mn===500?'Moo':'Rex')+' '+k,600);
      if (g && mn===500){ const have=(P(mn).gear||{})[g[0]]; if(!have||!(have.items||[]).includes(g[1])) nogear.push(k); }
      await done(mn,900);
      if (k==='rubbervat' && mn===500){ const g2=(P(mn).gear||{}).suit; vatSkin=!!(g2 && g2.items.includes('LatexCatsuit')); }
      const said=all(n);
      if (!/switched traps on|nothin' for/.test(said) && (said.split(W.__farmSets().TRAP_KINDS[k].icon).length-1)<6) silent.push(k+"/"+mn);
      if (/%[nchx]|\{[a-z]{1,2}\}|undefined|NaN/.test(said)) broke.push(k+": "+(said.match(/.{0,40}(%[nchx]|\{[a-z]{1,2}\}|undefined|NaN).{0,40}/)||[""])[0]);
    }
  }
  ok(!silent.length, 'every latex trap runs its whole story ('+(silent.join(", ")||"all "+Object.keys(NEW).length)+')');
  ok(!broke.length, '...and every line fills in ('+broke.join(" ; ")+')');
  ok(!nogear.length, 'each one puts its real latex gear on while it holds them ('+nogear.join(", ")+')');
  ok(vatSkin, 'the rubber vat leaves a set latex catsuit on after');
  { const sets=W.__farmSets(); ok(Object.keys(NEW).every(k=>W.__lines().INTENSITY_BY_TRAP[k] && W.__lines().INTENSITY_BY_TRAP[k].filthy.length), 'every latex trap has its tender and filthy lines'); }
  let n=sent.length; await say(221397,'?traps',900); ok(/the rubber shed: vacbed/.test(all(n)), '?traps lists the rubber shed');
  n=sent.length; await say(221397,'?traps blackpool',900); ok(/black pool/.test(all(n)) && /latex/.test(all(n)), '?traps blackpool says what it is');
  // limits rule them out
  P(700).limits='no latex'; free(700); n=sent.length; await say(221397,'?trap spring Pip vacbed',900);
  ok(!(W.__st().trapRuns&&W.__st().trapRuns.has(700)) && !/🫧 /.test(all(n).replace(/🫧 vacbed/g,'')), 'a limit that names latex rules them out');
  // ── a latex trap leaves livin' latex (a third of the time; here, always) ──
  free(500); P(500).symbioteOn=true; P(500).symbioteNext=0; P(500).symbiote=null; cfg.SYM.LATEX_TRAP_CHANCE=1;
  await say(221397,'?trap spring Moo bodybag',300); await done(500,7500);
  ok(P(500).symbiote && P(500).symbiote.kind==='latex', 'a latex trap leaves livin\' latex on somebody with ?symbiote on');
  cfg.SYM.LATEX_TRAP_CHANCE=0;
  // ...and somebody wearin' it draws more latex traps
  W.__hour=14; const f=W.__trapFactors(500); ok(f.includes('latex'), 'wearin\' livin\' latex counts as a factor ('+f.join(',')+')');
  { const c={}; for(let i=0;i<3000;i++){ const k=W.__trapWeighted(500,["vacbed","plow","pillory"]).kind; c[k]=(c[k]||0)+1; } ok(c.vacbed>c.pillory*2, '...and the latex traps come up a lot more '+JSON.stringify(c)); }
  // ── the cooldowns: shorter ──
  ok(cfg.SYM.STAGE_MIN===45, 'it grows a stage every 45 minutes');
  const t0=Date.now(); n=sent.length; await say(500,'?symbiote off',900);
  const left=Math.round((P(500).symbioteNext-t0)/60000); ok(left>=14&&left<=16, 'sent off: another can find them in 15 minutes ('+left+')');
  P(500).symbioteOn=true; P(500).symbioteNext=0; ok(W.__symBond(500,'latex')===null, 'bond again');
  P(500).symbiote.fedAt=Date.now()-cfg.SYM.STARVE_H*3600000-1000; W.__symTick(); await wait(400);
  const st=Math.round((P(500).symbioteNext-Date.now())/60000); ok(!P(500).symbiote && st>=118&&st<=121, 'starved: 2 hours, not 12 ('+st+')');
  // ── givin' one: proprietors and staff, to themselves too, and it doesn't wait ──
  n=sent.length; await say(221397,'?symbiote give Moo latex',900);
  ok(P(500).symbiote && P(500).symbiote.kind==='latex', 'a proprietor\'s give doesn\'t wait for the last one to be gone long');
  P(600).symbioteOn=true; n=sent.length; await say(800,'?symbiote give Rex nestling',900);
  ok(P(600).symbiote && P(600).symbiote.kind==='nestling', 'staff can give one too');
  P(800).symbioteOn=true; n=sent.length; await say(800,'?symbiote give me latex',900);
  ok(P(800).symbiote && P(800).symbiote.kind==='latex', '...and to themselves (?symbiote give me latex)');
  P(700).symbioteOn=false; n=sent.length; await say(800,'?symbiote give Pip latex',900);
  ok(!P(700).symbiote && /symbiote on/.test(all(n)), 'never on somebody who hasn\'t said ?symbiote on');
  n=sent.length; await say(600,'?symbiote give Moo moss',900); ok(/proprietors and staff/.test(all(n)), 'livestock can\'t give them');
  // the safeword: 4 hours
  await say(600,'?safeword',1500); { const s=Math.round((P(600).symbioteNext-Date.now())/60000); ok(!P(600).symbiote && s>=238&&s<=241, 'after a safeword: 4 hours, not a day ('+s+')'); }
  const errs=warns.filter(w=>!/Worker/.test(w)&&/command failed|TypeError|ReferenceError|trap /i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all passed'); process.exit(fails?1:0);
})();
