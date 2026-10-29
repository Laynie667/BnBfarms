// Oct 29 (Laynie): no pumps on the outfits, dragons, ?drain without staff, farm services for parasites
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,parasiteOn:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo",{ribbons:5}), "600":S(600,"Rex",{gender:"male",species:"dragon"}), "700":S(700,"Pip",{gender:"female",species:"dragoness"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50},"water-1":{X:39,Y:19}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
W.LZString={ compressToBase64:(t)=>Buffer.from(t).toString('base64'), decompressFromBase64:(t)=>Buffer.from(t,'base64').toString() };
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.SERVICES.BEAT_S=0.2;
  ['Laynie','Moo','Rex','Pip'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700]) await say(mn,'?stats',600);
  // ── no milkin' pumps on the farm's outfits ──
  const { outfitPieces, outfitDesc } = await import('../shared/farm-outfits.js');
  const pumps=[]; for (const sp of ['cow','bull']) for (const g of ['female','futa','nonbinary']) if ((outfitPieces(sp,g)||[]).some(p=>p.Name==='LactationPump')) pumps.push(sp+'/'+g);
  ok(!pumps.length, 'no lactation pumps on cow or bull outfits ('+pumps.join(', ')+')');
  ok(!/pump|cups/i.test(outfitDesc('cow','female')+outfitDesc('cow','futa')+outfitDesc('bull','female')), 'and the blurbs don\'t promise them');
  // ── dragons ──
  const gaps=[];
  for (const g of ['female','male','futa','femboy','nonbinary']){ const p=outfitPieces('dragon',g)||[]; for (const n of ['Horns5','DragonWings','DragonTailStrap1','Claws']) if (!p.some(x=>x.Name===n)) gaps.push(g+':'+n); }
  ok(!gaps.length, 'every dragon outfit has horns, wings, tail and claws ('+gaps.join(', ')+')');
  ok(/^farm:dragon\|male$/.test(W.__outfitSlot(600)||''), 'a male dragon gets the dragon outfit ('+W.__outfitSlot(600)+')');
  ok(/^farm:dragon\|female$/.test(W.__outfitSlot(700)||''), '"dragoness" is a dragon too ('+W.__outfitSlot(700)+')');
  const sp=W.__buildContract('fun',600,'1d').rules['pet.speech'].settings;
  ok(sp.animal==='Custom' && /rawr/.test((sp.sounds||[]).join()), 'a dragon\'s contract says rawr ('+(sp.sounds||[]).join()+')');
  ok(W.__washFacts(600).includes('dragon'), 'the wash knows a dragon');
  let n=sent.length; await say(221397,'?outfit about dragon female',900); ok(/Hoard Queen/i.test(all(n)), '?outfit about dragon female names it');
  // ── ?drain yourself, no staff ──
  W.__prodOf(500).held.vulva=120; W.__prodOf(500).held.butt=40;
  n=sent.length; await say(500,'?drain butt');
  ok(W.__prodOf(500).held.butt===0 && W.__prodOf(500).held.vulva>60, '?drain butt drains just that hole, no staff needed');
  ok(/40 mL/.test(all(n)) && !/just for farm staff/.test(all(n)), '...with a line ('+all(n).slice(0,160)+')');
  n=sent.length; await say(500,'?drain'); ok(W.__prodOf(500).held.vulva===0, '?drain empties the rest');
  n=sent.length; await say(500,'?drain'); ok(/not holdin/i.test(all(n)), 'an empty one is told so');
  // ── ?drain somebody else: they say yes first ──
  W.__prodOf(600).held.butt=80;
  n=sent.length; await say(500,'?drain Rex'); ok(W.__prodOf(600).held.butt===80 && /asked Rex/i.test(all(n)), 'drainin\' Rex asks him first');
  await say(600,'?yes',2500);
  ok(W.__prodOf(600).held.butt===0, 'he says yes: drained');
  // ── services: the vet's purge ──
  W.__latch(500,'given'); ok(!!P(500).parasite, 'Moo has a parasite');
  n=sent.length; await say(500,'?services',800); ok(/purge/.test(all(n)) && /soak/.test(all(n)) && /coax/.test(all(n)), '?services lists them');
  await say(500,'?service purge',300);
  for (let i=0;i<30 && P(500).parasite;i++) await wait(200);
  ok(!P(500).parasite && P(500).ribbons===2, 'the vet takes it off for 3 ribbons ('+P(500).ribbons+' left)');
  // not enough ribbons
  P(500).parasiteNext=0; W.__latch(500,'given');
  await wait(2500); n=sent.length; await say(500,'?service purge',2500); ok(P(500).parasite && /ribbons/.test(all(n)), 'without the ribbons, the vet won\'t ('+!!P(500).parasite+' '+all(n).slice(0,200)+')');
  // ── the salt soak ──
  n=sent.length; await say(500,'?service soak',800); ok(/water/.test(all(n)) && P(500).parasite, 'a soak needs the water');
  moveTo(500,39,19); cfg.SERVICES.SOAK_MIN=0.04; await wait(1500);
  n=sent.length; await say(500,'?service soak',300);
  for (let i=0;i<60 && P(500).parasite;i++) await wait(250);
  ok(!P(500).parasite, 'standin\' in the salt water, it lets go ('+all(n).slice(0,400)+')');
  // step out and it stops
  P(500).parasiteNext=0; W.__latch(500,'given'); cfg.SERVICES.SOAK_MIN=0.2;
  await say(500,'?service soak',400); moveTo(500,15,10);
  await wait(4500); ok(P(500).parasite && !W.__svc().get(500), 'steppin\' out stops the soak; it stays on');
  // ── coaxed off by a friend ──
  moveTo(600,16,10); P(600).parasiteOn=false;
  n=sent.length; await say(600,'?coax Moo',800); ok(/asked Moo/.test(all(n)), '?coax asks them first');
  await say(500,'?yes',300);
  for (let i=0;i<30 && P(500).parasite;i++) await wait(200);
  ok(!P(500).parasite && !P(600).parasite, 'Rex coaxes it off Moo');
  // ── the farm's brand: the logo, seared on ──
  n=sent.length; await say(221397,'?brand Rex logo left thigh',1500);
  ok(P(600).brand && P(600).brand.logo && P(600).brand.logo.place==='thighL', '?brand Rex logo left thigh ('+JSON.stringify(P(600).brand)+')');
  ok(/iron|brand/i.test(all(n)), '...with the searin\' line');
  const sb=W.__stateFor(600).brand; ok(sb && sb.place==='thighL', 'Rex\'s Companion is told where to draw it ('+JSON.stringify(sb)+')');
  ok(!W.__stateFor(700).brand, 'Pip isn\'t branded yet');
  await say(221397,'?brand all logo',1200); ok(W.__stateFor(700).brand && W.__stateFor(700).brand.place==='hipR', '?brand all logo: every livestock carries it');
  ok(!W.__stateFor(221397).brand, '...but not the proprietor');
  await say(221397,'?brand all clear',1200); ok(!W.__stateFor(700).brand && W.__stateFor(600).brand, '?brand all clear: off the herd, Rex keeps his own');
  ok(!warns.some(w=>/TypeError|ReferenceError/.test(w) && !/Worker/.test(w)), 'no errors ('+warns.filter(w=>/Error/.test(w)).slice(0,2).join(' / ')+')');
  out(fails ? 'FAILED '+fails : 'ALL PASSED'); process.exit(fails?1:0);
})();
