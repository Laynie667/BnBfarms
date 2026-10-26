// Oct 26 (Laynie): ?stuck teleports, kitty smart match, ratsluts, ?help hides the private add-on, ?wash fitted, ?seedmilk, friend the bot or come off the books
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"female",species:"kitty"}), "800":{mn:800,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}, "900":S(900,"Nibs",{gender:"male",species:"ratslut",futa:false})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30),at(800,31,30),at(900,33,30)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==='ChatRoomCharacterMapDataUpdate'||ev==='ChatRoomCharacterUpdate'){} }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
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
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.maze=null; r.benched=null; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
const done=async(mn,ms)=>{ for(let i=0;i<60;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.WASH_BEAT_S=0.1; cfg.STUCK_COOLDOWN_MIN=0;
  ['Laynie','Moo','Rex','Pip','Hank','Nibs'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,900]) await say(mn,'?stats',700);
  // mutual friends: everybody but Nibs
  const friends=set=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:set.map(m=>({MemberNumber:m,ChatRoomName:"B&B Farm"}))});
  friends([221397,500,600,700,800]);
  // ── ?stuck: straight to the rescue spot, even with staff about ──
  let n=sent.length; await say(500,'?stuck',2500);
  const tp=sent.slice(n).filter(([e,d])=>d&&d.Content==='ChatRoomMapViewTeleport'&&d.Target===500);
  ok(tp.length && tp[0][1].Dictionary[0].Position.X===50, '?stuck teleports them to the rescue spot (staff on duty and all)');
  ok(/rescue spot/.test(all(n)), '...and staff are told where they went');
  // ── kitty: the cat's sounds and the kitty outfit ──
  const k=W.__buildContract('deep',700,'1d');
  ok(k.rules['pet.speech'] && k.rules['pet.speech'].settings.animal==='Cat', 'a kitty\'s contract has cat sounds ('+(k.rules['pet.speech']&&k.rules['pet.speech'].settings.animal)+')');
  ok(W.__outfitSlot && /^farm:kitt\|female$/.test(W.__outfitSlot(700)), 'and the kitty outfit ('+(W.__outfitSlot&&W.__outfitSlot(700))+')');
  P(700).species='catgirl'; ok(W.__buildContract('fun',700,'1d').rules['pet.speech'].settings.animal==='Cat' && /^farm:kitt/.test(W.__outfitSlot(700)), '"catgirl" too');
  // ── ratsluts ──
  const rr=W.__buildContract('deep',900,'1d');
  ok(rr.rules['pet.speech'] && rr.rules['pet.speech'].settings.animal==='Mouse', 'a ratslut squeaks ('+(rr.rules['pet.speech']&&rr.rules['pet.speech'].settings.animal)+')');
  ok(/^farm:rat\|male$/.test(W.__outfitSlot(900)), 'and wears the rat outfit ('+W.__outfitSlot(900)+')');
  n=sent.length; await say(221397,'?outfit about rat female',900); ok(/Gutter Sweetheart/i.test(all(n)), '?outfit about rat female names it ('+all(n).slice(0,200)+')');
  // ── ?help with a typo never shows a private add-on ──
  W.Farmhand.register({ name:'secretstuff', label:'Secret', version:'1', only:[221397], commands:{ slutty:{ usage:'slutty', run:(c)=>c.reply('x') } } });
  for (const mn of [500,221397]){ n=sent.length; await say(mn,'?help qwertyzz',900); ok(!/secretstuff|slutty|Secret/.test(all(n)) && /don't have a guide/.test(all(n)), '?help <nonsense> lists no private add-on (for '+mn+')'); }
  n=sent.length; await say(500,'?help secretstuf',900); ok(!/Secret/.test(all(n)), 'a near miss never opens somebody else\'s private add-on');
  n=sent.length; await say(500,'?addons secretstuff',900); ok(/no add-on called/.test(all(n)), '?addons <private one> is as if it isn\'t there');
  // ── ?wash fits who they are ──
  const facts=W.__washFacts(600); ok(facts.includes('pup') && facts.includes('walk') && facts.includes('tail'), 'wash facts: a dog walks and has a tail ('+facts.join(',')+')');
  const L0=W.__washLines(), bad=[];
  for (const mn of [600,900]) for (let i=0;i<120;i++){ for (const kk of ['start','scrub','rinse','dry']){ const t=W.__washPick(mn,kk); if (/\b(tits|udders?|pussy|her)\b/.test(t)) bad.push(mn+':'+t.slice(0,60)); if (/heifer|kitty|show pig|foal/.test(t)) bad.push(mn+':'+t.slice(0,60)); } }
  ok(!bad.length, 'a male dog and a male rat never get tits, pussies or other kinds\' lines ('+bad.slice(0,2).join(' / ')+')');
  chars.find(c=>c.MemberNumber===700).Appearance=[{Asset:{Name:'PawPaddedPetsuitLegs',Group:{Name:'ItemLegs'}}},{Asset:{Name:'RingGag',Group:{Name:'ItemMouth'}}}];
  const f7=W.__washFacts(700); ok(f7.includes('fours') && f7.includes('gag') && f7.includes('bound')===false && f7.includes('kitt'), 'a kitty in a petsuit, gagged: on all fours ('+f7.join(',')+')');
  const steps=[]; for (let i=0;i<200;i++){ const t=W.__washPick(700,'start'); if (/\b(steps|climbs|stands)\b/.test(t)) steps.push(t.slice(0,50)); }
  ok(!steps.length, '...and never "steps" or "climbs" into the wash ('+steps[0]+')');
  n=sent.length; await say(700,'?wash',1500); ok((all(n).match(/\(\*/g)||[]).length>=4, '?wash still runs its beats ('+all(n).slice(0,300)+')');
  // ── ?seedmilk ──
  P(600).semen=0; n=sent.length; await say(600,'?seedmilk off',900); ok(P(600).seedMilk===false && /left be/.test(all(n)), '?seedmilk off');
  W.__prodOf(600).semen=80; const had=W.__prodOf(600).semen; n=sent.length; await say(221397,'?collect Rex',900); ok(/seed off/.test(all(n)) && !/collected|bottled/i.test(all(n)), '...and nobody can ?collect them ('+all(n).slice(0,300)+')');
  ok(W.__stateFor(600).switches.seedmilk===false, 'the Companion shows the switch');
  n=sent.length; await say(600,'?milkable seed on',900); ok(P(600).seedMilk===true, '?milkable seed on switches it back');
  // ── friend the bot ──
  W.__friendTick(); W.__friendTick(); await wait(600);
  const nag=sent.slice(n).filter(([e,d])=>d&&d.Type==='Whisper'&&d.Target===900&&/haven't friended me/.test(d.Content));
  ok(nag.length===1 && P(900).friendNag && P(900).friendNag.n===1, 'somebody on the books who hasn\'t friended the bot gets one reminder');
  ok(!sent.slice(n).some(([e,d])=>d&&d.Type==='Whisper'&&d.Target===500&&/friended me/.test(d.Content||'')), 'friends get nothin\'');
  P(900).friendNag.first=Date.now()-49*3600000; n=sent.length; W.__friendTick(); await wait(600);
  ok(!P(900) && L().archive[900], '48 hours on, still not friends: off the books, paperwork archived');
  // ...and one who friends in time is cleared
  L().people[901]=JSON.parse(JSON.stringify(L().archive[900])); L().people[901].mn=901; L().people[901].friendNag={first:Date.now()-3600000,last:Date.now(),n:1}; chars.push(at(901,35,30)); friends([221397,500,600,700,800,901]);
  W.__friendTick(); await wait(400); ok(!P(901).friendNag, 'friendin\' the bot in time clears it');
  // ── the contract's outfit: owed till their Companion is here, only "dressed" once it says it's on ──
  const outfitTo=(mn,k)=>sent.slice(k).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Target===mn&&d.Dictionary&&d.Dictionary.type==='outfit').map(([e,d])=>d.Dictionary);
  delete P(500).contractDressedAt; P(500).outfitOwed={slot:'farm:cow|female',at:Date.now()};
  n=sent.length; W.__contractOutfit(500); await wait(500);
  ok(!outfitTo(500,n).length && P(500).outfitOwed && /Turn on the Companion/.test(all(n)), 'no Companion: the outfit is owed and they are told');
  n=sent.length; handlers.ChatRoomMessage({Sender:500,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'hello',ver:'0.43.0'}}); await wait(3500);
  ok((outfitTo(500,n)[0]||{}).auto===true && !P(500).contractDressedAt, 'their Companion checks in: it goes on, not marked dressed yet');
  n=sent.length; handlers.ChatRoomMessage({Sender:500,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'outfitAnswer',answer:'failed',slot:'farm:cow|female',why:'test'}}); await wait(500);
  ok(!P(500).contractDressedAt && P(500).outfitOwed && /couldn't put on/i.test(all(n)), 'the game refused it: staff hear, still owed');
  handlers.ChatRoomMessage({Sender:500,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'outfitAnswer',answer:'worn',slot:'farm:cow|female'}}); await wait(400);
  ok(P(500).contractDressedAt && !P(500).outfitOwed, 'worn: marked dressed');
  // ── every kind on the farm: an outfit, its own contract sound (never a cow's moo), its wash lines ──
  const gaps=[]; const was=P(500).species;
  for (const k of Object.keys(cfg.SPECIES).filter(k=>k!=='default')){
    P(500).species = k==='kitt' ? 'kitty' : k;
    const sp=W.__buildContract('fun',500,'1d').rules['pet.speech'].settings;
    if (k!=='cow' && k!=='bull' && sp.animal==='Custom' && (sp.sounds||[]).join()==='moo') gaps.push(k+': moos');
    for (const g of ['female','male','futa','femboy','nonbinary']){ P(500).gender=g; if (!/^farm:/.test(W.__outfitSlot(500)||'')) gaps.push(k+'/'+g+': no outfit'); }
    P(500).gender='female';
    if (!W.__washFacts(500).length) gaps.push(k+': no wash kind');
  }
  P(500).species=was;
  ok(!gaps.length, 'every kind has an outfit, its own sound and wash lines ('+gaps.join(', ')+')');
  // ── the outfit wheel: a random outfit for a random 5 min to 4 h, padlocks opened by the farm at the end ──
  handlers.ChatRoomMessage({Sender:700,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'hello',ver:'0.43.0'}}); await wait(600);
  const outfitTo7=(k)=>sent.slice(k).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Target===700&&d.Dictionary&&['outfit','outfitBack'].includes(d.Dictionary.type)).map(([e,d])=>d.Dictionary);
  n=sent.length; await say(700,'?outfitwheel',1200);
  const w1=outfitTo7(n).find(d=>d.type==='outfit')||{}; const t7=P(700).tempOutfit||{};
  ok(/^farm:[a-z]+\|female$/.test(w1.slot||'') && w1.auto===true && t7.mins>=5 && t7.mins<=240 && /outfit wheel/i.test(all(n)), 'the wheel spins: a female outfit, '+t7.mins+' min, straight on ('+w1.slot+')');
  await wait(1000); n=sent.length; await say(700,'?outfitwheel',900); ok(/already in a wheel outfit/.test(all(n)), 'one at a time');
  handlers.ChatRoomMessage({Sender:700,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'outfitAnswer',answer:'worn',slot:w1.slot}}); await wait(400);
  ok(P(700).tempOutfit.until > Date.now() && !P(700).contractDressedAt, 'the clock starts when it is on (and it is not the contract outfit)');
  n=sent.length; await say(700,'?outfitwheel status',900); ok(/for another/.test(all(n)), '?outfitwheel status says how long');
  P(700).tempOutfit.until=Date.now()-1000; n=sent.length; W.__tempOutfitTick(); await wait(600);
  const back=outfitTo7(n).find(d=>d.type==='outfitBack'); ok(back && back.farmLocks===true && !P(700).tempOutfit, 'time up: back in their own things, the farm opens its padlocks');
  n=sent.length; await say(800,'?outfitwheel Pip',1200); const w2=outfitTo7(n).find(d=>d.type==='outfit')||{};
  ok(w2.slot && w2.auto===false, 'staff spin it for somebody: they get the card first');
  n=sent.length; await say(700,'?safe',1500); ok(outfitTo7(n).some(d=>d.type==='outfitBack') && !P(700).tempOutfit, 'the safeword ends it');
  // ── the Wrong Barn swaps the outfit for the hour too ──
  await wait(1000); P(700).potionsOn=true; const sp0=P(700).species; n=sent.length; W.__givePotion(700,'wrongbarn',221397); await wait(2500);
  const wb=outfitTo7(n).find(d=>d.type==='outfit')||{}; const t8=P(700).tempOutfit||{};
  ok(wb.auto===true && t8.src==='wrongbarn' && t8.mins===60 && P(700).species!==sp0, 'Wrong Barn: a new animal and its outfit, for the hour ('+wb.slot+', '+P(700).species+')');
  handlers.ChatRoomMessage({Sender:700,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,type:'outfitAnswer',answer:'worn',slot:wb.slot}}); await wait(300);
  P(700).fx.wrongbarn.until=Date.now()-1000; n=sent.length; W.__potionTick(); await wait(800);
  ok(outfitTo7(n).some(d=>d.type==='outfitBack') && !P(700).tempOutfit && P(700).species===sp0, '...and when it wears off, they are themselves again, clothes and all');
  const errs=warns.filter(w=>!/Worker/.test(w)&&/command failed|TypeError|ReferenceError|wash/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | ').slice(0,300));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all passed'); process.exit(fails?1:0);
})();
