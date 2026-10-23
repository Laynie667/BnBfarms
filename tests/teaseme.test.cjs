// Oct 23: Tease Me, rebuilt. Switched on by the pet or their herd leader, 3-4 an hour at light, private, and fitted to
// their body, their kind and what's goin' on with them right now. Staff lines for everybody, a herd leader's for one.

const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog",teaseOptIn:true}), "700":S(700,"Pip",{gender:"femboy",species:"bunny",herds:[{leader:221397,at:1}]}),
 "800":S(800,"Dot",{species:"goat"}), "900":S(900,"Fu",{gender:"futa",species:"pony",futa:true})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30),at(800,50,50),at(900,52,50)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
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
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const teasesTo=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&d.Type==='Whisper'&&d.Target===mn).map(([e,d])=>d.Content);
const VULVA=/\b(pussy|pussies|cunt|cunts|slit|womb|clit|cervix)\b/i, TITS=/\b(tits?|titties|breasts?|udders?|teats?|cleavage)\b/i, GIRL=/\b(good girl|heifer|broodmare|girl)\b/i, COCK=/\b(cock|balls|cage)\b/i;
const CLINICAL=/\b(lactat\w*|mammar\w*|secretion|ejaculat\w*|genital\w*|vagina\w*|penis(es)?|semen|urethra\w*|anus|rectum|uterus|ovar\w*|testicles?|scrotum|areolae?|labia|intercourse|copulat\w*)\b/i;
const LEAK=/\{(nv|nc|nt|fu|fb|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object|\bnull\b/;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ["Laynie","Moo","Rex","Pip","Dot","Fu"].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800,900]) await say(mn,'?stats',700);
  const st=W.__st();
  // ── the switch ──
  let n=sent.length; await say(500,'?teaseme');
  ok(/off for you/.test(all(n)), '?teaseme on its own says it is off');
  n=sent.length; await say(500,'?teaseme on');
  ok(P(500).teaseMe==='light' && /3 or 4 times an hour/.test(all(n)), '?teaseme on: light, 3 or 4 an hour');
  n=sent.length; await say(500,'?teaseme needy');
  ok(P(500).teaseMe==='needy' && /about 10 times an hour/.test(all(n)), '?teaseme needy');
  await say(500,'?teaseme light',800);
  n=sent.length; await say(600,'?teaseme');
  ok(P(600).teaseMe==='light' && P(600).teaseOptIn===undefined && /light for you/.test(all(n)), 'the old ?teaseme on carries over as light');
  // ── the herd leader ──
  n=sent.length; await say(221397,'?teaseme Pip steady');
  ok(P(700).teaseMe==='steady' && /Pip will be teased about 6 times an hour/.test(all(n)) && /Laynie asked me to keep you company/.test(all(n)), 'their herd leader switches it on for them, and they are told');
  n=sent.length; await say(800,'?teaseme Pip off');
  ok(P(700).teaseMe==='steady' && /Only Pip or their herd leader/.test(all(n)), 'nobody else can');
  n=sent.length; await say(221397,'?teaseme Dot on');
  ok(!P(800).teaseMe && /Only Dot or their herd leader/.test(all(n)), 'not even a proprietor, for somebody outside their herd');
  // ── the Companion's switch ──
  const sw=W.__stateFor(500).switches||{};
  ok(sw.teaseme===true && (W.__stateFor(800).switches||{}).teaseme===false, 'the Companion shows the Tease me switch');
  // ── when it comes ──
  st.teaseNext.set(500, Date.now()-1000); n=sent.length; W.__teaseTick(); await wait(500);
  ok(teasesTo(n,500).length===1, 'a tease comes when it is due: '+(teasesTo(n,500)[0]||'').slice(0,90));
  const next=st.teaseNext.get(500)-Date.now();
  ok(next>=14.9*60000 && next<=20.1*60000, 'and the next one at light is 15 to 20 minutes off: '+Math.round(next/60000)+' min');
  n=sent.length; W.__teaseTick(); await wait(300);
  ok(teasesTo(n,500).length===0, 'not before it is due');
  st.teaseNext.set(800, Date.now()-1000); n=sent.length; W.__teaseTick(); await wait(300);
  ok(teasesTo(n,800).length===0, 'never to somebody who has not switched it on');
  P(500).quietUntil=Date.now()+600000; st.teaseNext.set(500, Date.now()-1000); n=sent.length; W.__teaseTick(); await wait(300);
  ok(teasesTo(n,500).length===0, 'never while they are on ?quiet'); P(500).quietUntil=0;
  st.teaseNext.set(500, Date.now()-1000); st.lastSpoke.set(500, Date.now()-40*60000); n=sent.length; W.__teaseTick(); await wait(300);
  ok(teasesTo(n,500).length===0 && st.teaseNext.get(500)>Date.now(), 'not when they have gone quiet for half an hour: that one is skipped'); st.lastSpoke.set(500, Date.now());
  st.trapRuns=st.trapRuns||new Map(); st.trapRuns.set(500,{}); st.teaseNext.set(500, Date.now()-1000); n=sent.length; W.__teaseTick(); await wait(300);
  ok(teasesTo(n,500).length===0 && st.teaseNext.get(500)<Date.now(), 'not in a trap: it waits till they are out'); st.trapRuns.delete(500);
  n=sent.length; W.__teaseTick(); await wait(300);
  ok(teasesTo(n,500).length===1, 'and comes once they are');
  P(500).teaseDay={d:new Date().toISOString().slice(0,10), n:cfg.TEASE_DAY_MAX}; st.teaseNext.set(500, Date.now()-1000); n=sent.length; W.__teaseTick(); await wait(300);
  ok(teasesTo(n,500).length===0, 'never more than the cap in a day'); P(500).teaseDay=null;
  // ── what it notices ──
  const p=W.__prodOf(500); p.milk=W.__milkCapOf(500); p.heat={until:Date.now()+3600000};
  const ctx=W.__teaseCtx(500);
  ok(ctx.includes('udders') && ctx.includes('heat'), 'full udders and a heat are noticed: '+ctx.join(','));
  let heardUdders=false, heardHeat=false; for (let i=0;i<60;i++){ const t=W.__teaseLine(500); if(/udders|tits|nipples|parlour|pump/.test(t)) heardUdders=true; if(/heat|stud/.test(t)) heardHeat=true; }
  ok(heardUdders && heardHeat, 'and talked about');
  // ── fitted to their body ──
  const probs=[];
  for (const [mn,b] of [[500,{vulva:1,tits:1}],[600,{male:1}],[700,{femboy:1}],[800,{vulva:1,tits:1}],[900,{vulva:1,tits:1,cock:1}]]){
    const pp=W.__prodOf(mn); pp.heat={until:Date.now()+3600000}; pp.deniedUntil=Date.now()+3600000; pp.held=pp.held||{}; pp.held.butt=500; pp.held.vulva=b.vulva?500:0;
    const heard=new Set();
    for (let i=0;i<150;i++){ const t=W.__teaseLine(mn); heard.add(t);
      if (!b.vulva && VULVA.test(t)) probs.push(mn+' pussy: '+t); if (!b.tits && TITS.test(t)) probs.push(mn+' tits: '+t);
      if ((b.male||b.femboy) && GIRL.test(t)) probs.push(mn+' girl: '+t); if (!b.cock && !b.male && !b.femboy && COCK.test(t)) probs.push(mn+' cock: '+t);
      if (CLINICAL.test(t)) probs.push(mn+' clinical: '+t); if (LEAK.test(t)) probs.push(mn+' leak: '+t); }
    ok(heard.size>=20, mn+' hears plenty of different teases: '+heard.size);
  }
  ok(!probs.length, 'nothing about parts they have not got, nothing clinical, nothing left unfilled'+(probs.length?': '+probs.slice(0,4).join(' || '):''));
  let pup=false, bun=false; for (let i=0;i<200;i++){ if(/\bpup\b/.test(W.__teaseLine(600))) pup=true; if(/\bbunny\b/.test(W.__teaseLine(700))) bun=true; }
  ok(pup && bun, 'their kind comes up: a dog hears pup lines, a bunny bunny lines');
  // no line twice close together
  const seq=[]; for (let i=0;i<10;i++) seq.push(W.__teaseLine(800));
  ok(new Set(seq).size===10, 'ten in a row, none repeated');
  // ── the staff's lines, and a herd leader's own ──
  n=sent.length; await say(800,'?tease add You smell like hay, %name%.');
  ok(!(L().tease||[]).length && /for staff/.test(all(n)), 'only staff write teases for everybody');
  n=sent.length; await say(221397,'?tease add Somebody looks awful cute today, %name%.');
  ok((L().tease||[]).length===1 && /Added/.test(all(n)), 'staff add one');
  n=sent.length; await say(221397,'?tease for Pip Your herd leader is thinkin about you, %name%.');
  ok(L().tease.some(x=>x.for===700) && /Only Pip will ever hear that one/.test(all(n)), 'a herd leader writes one for their pet');
  n=sent.length; await say(800,'?tease for Pip You are mine now.');
  ok(L().tease.length===2 && /herd leader/.test(all(n)), 'but nobody else writes one for somebody else\'s pet');
  let personal=0, others=0; for (let i=0;i<200;i++){ const t=W.__teaseLine(700); if(/Your herd leader is thinkin about you, Pip/.test(t)) personal++; if(/Your herd leader is thinkin/.test(W.__teaseLine(500))) others++; }
  ok(personal>10 && others===0, 'their own line comes up for them now and then, and never for anybody else: '+personal);
  n=sent.length; await say(221397,'?tease list');
  ok(/TEASES/.test(all(n)) && /for Pip: Your herd leader/.test(all(n)) && /awful cute/.test(all(n)), '?tease list shows them');
  n=sent.length; await say(221397,'?tease remove 1');
  ok(L().tease.length===1 && /Took it off/.test(all(n)), '?tease remove');
  // ── off ──
  n=sent.length; await say(500,'?teaseme off');
  ok(!P(500).teaseMe && /No more whisperin/.test(all(n)), '?teaseme off');
  ok(!warns.some(w=>/tease/i.test(w)), 'no errors: '+warns.filter(w=>/tease/i.test(w)).slice(0,2).join(' | '));
  out(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
})();
