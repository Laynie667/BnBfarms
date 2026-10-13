// Oct 12: lines that fit the body they're about (a male was told about his pussy), and parasite strains told apart.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const stock=(mn,name,gender,x)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender,onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,ribbons:10,parasiteOn:true},x||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],ribbons:30},
 "500":stock(500,"Moo","female"), "600":stock(600,"Rex","male"), "700":stock(700,"Fae","femboy"), "800":stock(800,"Fu","futa",{futa:true})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,25,10),at(700,35,10),at(800,45,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}}, location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn], prod=mn=>P(mn).prod;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2400); };
const rnd=Math.random;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.1; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.BODY_TAIL_CHANCE=1;
  ['Laynie','Moo','Rex','Fae','Fu'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const m of [500,600,700,800,221397]) await say(m,'?stats',1500);
  // ── what they've got ──
  const b=m=>W.__body(m);
  ok(b(500).vulva && !b(500).cock && b(500).tits, 'a female: a pussy and tits, no cock');
  ok(!b(600).vulva && b(600).cock && !b(600).tits, 'a male is a male even with nothin\' drawn between his legs: a cock, no pussy, flat');
  ok(!b(700).vulva && b(700).cock && !b(700).tits && b(700).g==='femboy', 'a femboy: a cock, no pussy');
  ok(b(800).vulva && b(800).cock && b(800).tits, 'a futa: all of it');
  // ── the pick ──
  const pool=["%n's pussy drips.","{nv}%n's cock drips.","{v}%n's clit throbs.","%n shivers."];
  let bad=0; for(let i=0;i<40;i++){ const s=W.__tFill(W.__pickFor(600,'t1',pool),600); if(/pussy|clit|\{/.test(s)) bad++; }
  ok(bad===0, 'a male never draws a pussy line, and tags never show');
  bad=0; for(let i=0;i<40;i++){ const s=W.__tFill(W.__pickFor(500,'t2',pool),500); if(/cock|\{/.test(s)) bad++; }
  ok(bad===0, 'a female never draws a line written for somebody without one');
  ok(W.__tFill(W.__pickFor(600,'t3',["%n's cunt and tits, good girl."]),600)==="Rex's hole and chest, good boy.", 'when nothin\' in the pool fits, the words are swapped');
  ok(/soft little chest/.test(W.__bodyWords(700,"their tits swing")) && !/boy/.test(W.__bodyWords(700,"good girl")), 'a femboy keeps the soft words');
  ok(W.__bodyWords(500,"their pussy and tits")==="their pussy and tits" && W.__bodyWords(800,"their pussy and tits")==="their pussy and tits", 'a female and a futa are left as written');
  // ── a whole trap on a male: not one wrong word ──
  const WRONG=/\b(pussy|cunt|slit|womb|clit|tits|breasts|udders?|teats?)\b/i;
  for (const kind of ['breeder','eggs','wolves','tentacle','pump']){
    const r=P(600); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; const n=sent.length;
    await say(221397,'?trap spring Rex '+kind,1200); await wait(1800);
    const text=all(n).split(' | ').filter(t=>/Rex/.test(t)).join(' | '), hit=text.match(WRONG);
    ok(text.length>100 && !hit, 'the '+kind+' trap on a male says nothin\' about parts he hasn\'t got'+(hit?' ('+hit[0]+': '+text.slice(Math.max(0,hit.index-60),hit.index+30)+')':''));
  }
  { const r=P(600); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; const n=sent.length; await say(221397,'?trap spring Rex breeder',1200); await wait(1800);
    ok(/cock|balls/.test(all(n)), '...and he does hear about the ones he has'); }
  await say(600,'?safeword',2500);
  // ── the strains ──
  const sp=(s,n)=>W.__strainParts(s,n);
  ok(sp('breeder',2).root && !sp('breeder',2).suckers && sp('grower',2).suckers && !sp('grower',2).root, 'the Breeder roots first; the Grower goes for the teats first');
  ok(sp('glutton',1).suckers && sp('tyrant',1).root && !sp('tyrant',1).suckers, 'the Glutton is on the teats from the start; the Tyrant clasps from the start');
  const host=(mn,strain,hoursIn)=>{ const now=Date.now(); P(mn).parasite={since:now-hoursIn*3600000,until:now+(12-hoursIn)*3600000,next:now+9e9,n:0,fed:0,form:'lips',strain,stageTold:3,urgeAt:now+9e9}; };
  host(600,'tyrant',1); host(500,'tyrant',1);
  const names=m=>W.__strainGear(m).map(g=>g.name).join(',');
  ok(/Tyrant's Cage/.test(names(600)) && !/Tyrant's Cage/.test(names(500)) && /Parasite Root/.test(names(500)), 'a Tyrant cages a cock and seals a pussy');
  host(600,'glutton',5); ok(/Glutton's Sleeve/.test(names(600)) && /Parasite Suckers/.test(names(600)), 'a Glutton has a sleeve on a cock by hour four');
  host(500,'breeder',9); ok(/Brood Sac/.test(names(500)), 'a Breeder wraps the belly at hour eight');
  ok(W.__strainGear(500)[0].color!==(host(500,'grower',1),W.__strainGear(500)[0].color), 'each strain has its own colour');
  host(600,'grower',1); host(700,'grower',1); host(800,'grower',1); host(500,'grower',1);
  const ser=m=>W.__strainSerums(m).join(',');
  ok(/cock growth/.test(ser(600)) && !/udder/.test(ser(600)), 'a Grower on a male grows cock and balls');
  ok(/udder growth/.test(ser(500)) && !/cock/.test(ser(500)), '...on a female, tits and ass');
  ok(/udder growth/.test(ser(700)) && /ass growth/.test(ser(700)) && !/cock growth/.test(ser(700)), '...on a femboy, hips and ass and a pair of tits');
  ok(/cock growth/.test(ser(800)) && /udder growth/.test(ser(800)), '...on a futa, all of it');
  host(600,'breeder',1); ok(/mpreg/.test(ser(600)), 'a Breeder on a host with no womb makes them one');
  // the Breeder's first clutch at the half-way mark
  P(500).parasite=null; P(700).parasite=null; P(800).parasite=null; host(600,'breeder',7); prod(600).eggs=null;
  let n=sent.length; W.__parasiteTick(); await wait(900);
  ok(P(600).parasite.laidMid && prod(600).eggs && prod(600).eggs.n>0 && !/womb|pussy/.test(all(n)), 'half-way through, the Breeder lays its first clutch, and says so in words that fit');
  const errs=warns.filter(w=>/body|strain|parasite|trap|command failed|panel state/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
