// Oct 27 (Laynie: "on rate a trap, picking not for me twice just makes it less likely to spring for them, it doesnt stop
// it completely. more trap versions, like the water beast could use alot more versions ... aftermath lines, yes"):
// rate a trap, the trap of the day, whole kinds of trap switched off, how they're left after, and the things in the water.
const fs=require('fs'), path=require('path'), os=require('os');
const CUR=JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).versions.companion;   // (the current Companion: no update notice mid-test)
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}), "800":S(800,"Fu",{gender:"futa",species:"pony",futa:true}),
 "900":{mn:900,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"trap":{X:22,Y:40},"trap-mud":{X:40,Y:40},"trap-kennels-1":{X:60,Y:60},"kennel":{X:61,Y:60},"pond":{X:5,Y:5}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,30,30),at(800,31,30),at(900,33,30)];
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
W.__FARMHAND_TEST__=true; W.__date="2026-08-10T12:00:00";
eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.benched=null; r.quietUntil=0; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
const done=async(mn,ms)=>{ for(let i=0;i<80;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
const LEAK=/\{(nv|nc|nt|fu|fb|nb|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object/;
const spring=async(mn,kind)=>{ free(mn); const n=sent.length; await say(221397,'?trap spring '+mn+' '+kind,500); await done(mn); return all(n); };
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.08; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SYM.LATEX_TRAP_CHANCE=0; cfg.SEND_INTERVAL_MS=2;
  cfg.AFTER_CHANCE=0;
  ['Laynie','Moo','Rex','Pip','Fu','Hank'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800]) await say(mn,'?stats',700);
  // Moo, Pip and Fu have the Companion; Rex hasn't
  for (const mn of [500,700,800,221397,260239]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:CUR}});
  await wait(600);

  // ── rate a trap ──
  { let n=sent.length; await say(500,'?rate',900); ok(/Nothin' rated yet/.test(all(n)), '?rate with nothin\' rated says so');
    n=sent.length; await say(500,'?rate wire loved',900); ok(/hasn't had you yet/.test(all(n)), 'you can only rate a trap that\'s had you');
    await spring(500,'mud');
    const s=W.__stateFor(500); ok(s.rateTrap && s.rateTrap.kind==='mud' && s.rateTrap.until>Date.now(), 'after a trap, the Companion asks how it was ('+JSON.stringify(s.rateTrap)+')');
    n=sent.length; await say(500,'?rate loved',900);
    ok(/loved the 🐖 mud/.test(all(n)) && W.__trapRateX(500,'mud')===1.25, '?rate loved rates the last one: a bit likelier ('+W.__trapRateX(500,'mud')+')');
    ok(!W.__stateFor(500).rateTrap, '...and the question goes away');
    await say(500,'?rate mud no',700); n=sent.length; await say(500,'?rate mud not for me',900);
    const x2=W.__trapRateX(500,'mud'); ok(x2>0.2 && x2<0.5 && /twice/.test(all(n)), 'twice not for me: a lot less likely, but not stopped ('+x2+')');
    await say(500,'?rate mud no',700); await say(500,'?rate mud no',700);
    ok(W.__trapRateX(500,'mud')===0.2, 'four times not for me: never rarer than a fifth, never zero ('+W.__trapRateX(500,'mud')+')');
    let mud=0; for (let i=0;i<600;i++) if (W.__trapWeighted(500,['mud','wire']).kind==='mud') mud++;
    ok(mud>=3 && mud<200, '...and it still comes up now and then in the pick ('+mud+' of 600, and it only just had them)');
    ok(L().trapRates.mud && L().trapRates.mud.no===1 && L().trapRates.mud.loved===0, 'the farm\'s tally keeps each player\'s latest word ('+JSON.stringify(L().trapRates.mud)+')');
    n=sent.length; await say(500,'?rate',900); ok(/Not for me: mud \(rare now\)/.test(all(n)), '?rate lists what you\'ve rated'); }
  // a player without the Companion is whispered the question once per trap
  { const n=sent.length; await spring(600,'mud'); await wait(9500);
    ok(/How was the mud, sugar\? \?rate loved/.test(all(n)), 'no Companion: whispered how it was');
    const n2=sent.length; await spring(600,'mud'); await wait(9500); ok(!/How was the mud/.test(all(n2)), '...only the first time that trap has them'); }
  { await say(700,'?rate ask off',700); await spring(700,'mud'); ok(!W.__stateFor(700).rateTrap, '?rate ask off: no question after'); await say(700,'?rate ask on',700); }

  // ── the trap of the day ──
  { const pool=W.__trapDayPool(), k=W.__trapOfDay();
    ok(pool.includes('mud') && pool.includes('tentacle') && pool.includes('kennel') && pool.includes(k), 'the trap of the day is one the farm has out ('+k+' of '+pool.length+')');
    L().trapDay={ key:new Date().toISOString().slice(0,10), kind:'wire', told:false };
    let n=sent.length; W.__trapDayTick(); await wait(600);
    ok(/Today's trap of the day is the ✂️ wire/.test(all(n)), 'the room is told what it is');
    n=sent.length; W.__trapDayTick(); await wait(600); ok(!/trap of the day/.test(all(n)), '...once');
    let w=0; for (let i=0;i<600;i++) if (W.__trapWeighted(800,['wire','gas']).kind==='wire') w++;
    ok(w>330, 'it\'s twice as likely to be the one that springs ('+w+' of 600)');
    const r0=P(800).ribbons||0; n=sent.length; await spring(800,'wire'); await wait(3000);
    ok((P(800).ribbons||0)===r0, 'sprung by hand: no ribbon');
    P(800).trapLog.push({ t:Date.now(), kind:'wire', spot:'trap-wire' }); W.__trapEnded(800,'wire'); await wait(3000);
    ok((P(800).ribbons||0)===r0+1, 'the first time it catches them today: a ribbon ('+r0+' → '+P(800).ribbons+')');
    W.__trapEnded(800,'wire'); await wait(3000); ok((P(800).ribbons||0)===r0+1, '...only the first time');
    ok(W.__stateFor(800).trapCard.today.kind==='wire' && W.__stateFor(800).trapCard.today.paid, 'the trap card shows it, and that it paid');
    n=sent.length; await say(800,'?traps today',900); ok(/Trap of the day: ✂️ wire/.test(all(n)), '?traps today says which');
    n=sent.length; await say(800,'?traps',900); ok(/Trap of the day: ✂️ wire/.test(all(n)), '...and so does ?traps'); }

  // ── whole kinds of trap ──
  { let n=sent.length; await say(500,'?traps theme',900); ok(/KINDS OF TRAP FOR YOU/.test(all(n)) && (all(n).match(/: on/g)||[]).length===10, '?traps theme lists ten kinds, all on');
    n=sent.length; await say(500,'?traps theme furry off',900); ok(/Furry folk: off/.test(all(n)), '?traps theme furry off');
    n=sent.length; await say(221397,'?trap spring 500 wolves',900); ok(/they've switched off furry traps/.test(all(n)), '...and not even a proprietor can spring the wolves on them');
    const th=W.__stateFor(500).trapThemes; ok(th && th.length===10 && th.find(t=>t.id==='furry').on===false, 'the Companion has the switches');
    await say(500,'?traps theme monsters off',700);
    n=sent.length; await say(221397,'?trap spring 500 tentacle',900); ok(/monster traps/.test(all(n)), 'monsters off: the water leaves them be');
    n=sent.length; await say(500,'?traps theme eggs',900); ok(/Pregnancy and eggs is on/.test(all(n)) && /tentacle/.test(all(n)), '?traps theme <kind> says what\'s in it (words work too: eggs)');
    let picked=new Set(); for (let i=0;i<300;i++){ const p=W.__trapWeighted(500, Object.keys(W.__farmSets().TRAP_KINDS).filter(k=>!W.__seasonOf()[k])); picked.add(p.kind); }
    await say(500,'?traps theme all on',700); ok(!(P(500).trapThemesOff||[]).length, '?traps theme all on');
    ok(W.__trapTagsOf('hellhounds').includes('furry') && W.__trapTagsOf('headless').includes('seasonal') && W.__trapTagsOf('vacbed').includes('latex'), 'the seasons\' own say what they are, and every season trap is seasonal'); }

  // ── how they're left ──
  { cfg.AFTER_CHANCE=1; cfg.AFTER_DELAY=[100,200];
    const n=sent.length; await spring(500,'pillory'); await wait(800);
    const said=all(n); ok(/👣 [^|]*Moo/.test(said), 'a line after it\'s done with them ('+(said.match(/👣[^|]*/)||[''])[0].slice(0,140)+')');
    cfg.AFTER_CHANCE=0;
    const A=W.__afterLines(), bad=[];
    for (const [k,pool] of Object.entries(A)) for (const mn of [500,600,700,800]) for (const l of pool){ const t=W.__tFill(l,mn,{h:'pussy',x:'12',c:"Spider Silk",ml:'300 mL'}); if (LEAK.test(t)) bad.push(k+'/'+mn+': '+t.slice(0,80)); }
    ok(!bad.length, 'every after line fills in on every body ('+bad.slice(0,2).join(' || ')+')');
    ok(Object.keys(A).length>=11 && Object.values(A).every(p=>p.length>=3), 'eleven kinds of after, each with a few lines'); }

  // ── the things in the water ──
  { const F=W.__waterForms(), ids=Object.keys(F);
    ok(ids.length===10, 'ten things live in the water ('+ids.join(', ')+')');
    const quiet=[], leaks=[], told=[];
    for (const id of ids) for (const mn of [500,600,700,800]){
      W.__waterForce=id; P(mn).limits=""; const p=W.__prodOf(mn); p.eggs=null; p.held={}; p.milk=Math.max(p.milk||0,800);
      const said=await spring(mn,'tentacle');
      const nm=P(mn).name, lines=said.split(' | ').filter(x=>x.includes(nm)&&!/Sprung on/.test(x));
      if (lines.length<6) quiet.push(id+'/'+nm+'('+lines.length+')');
      if (LEAK.test(said)) leaks.push(id+'/'+nm+': '+(said.match(new RegExp('.{0,60}'+LEAK.source+'.{0,40}'))||[''])[0]);
      const who=id==='classic'?'It':F[id].name.charAt(0).toUpperCase()+F[id].name.slice(1);
      if (!new RegExp('(🥚 |\\()'+who+' (left|packed)').test(said)) told.push(id+'/'+nm);   // (a whisper to somebody without the Companion starts with a bracket)
    }
    W.__waterForce=null;
    ok(!quiet.length, 'every one of them tells its whole story on every body ('+quiet.join(', ')+')');
    ok(!leaks.length, '...and every line fills in ('+leaks.slice(0,2).join(' || ')+')');
    ok(!told.length, 'the whisper after says which it was ('+told.slice(0,4).join(', ')+')');
    ok(Object.keys(P(500).waterForms||{}).length===10, 'the farm remembers which ones have had them');
    let n=sent.length; await say(500,'?traps tentacle',900); ok(/the jelly bloom \(had you 1×\)/.test(all(n)) && /the twins/.test(all(n)), '?traps tentacle lists them, and which have had you');
    // what each one leaves
    W.__waterForce='bloom'; P(500).limits=""; W.__prodOf(500).heat=null; await spring(500,'tentacle');
    ok(W.__prodOf(500).heat && W.__prodOf(500).heat.until>Date.now(), 'the jelly bloom\'s stings leave a heat');
    W.__waterForce='reeds'; W.__prodOf(500).deniedUntil=0; await spring(500,'tentacle');
    ok(W.__prodOf(500).deniedUntil>Date.now()+5*60000, 'the reed-thing leaves them on the edge');
    W.__waterForce='hungry'; W.__prodOf(500).milk=900; await spring(500,'tentacle');
    ok(W.__prodOf(500).milk<400, 'the hungry one drinks their milk ('+Math.round(W.__prodOf(500).milk)+' left)');
    W.__waterForce='ink'; n=sent.length; await spring(500,'tentacle'); await wait(500);
    ok(/"mess":"ink"/.test(all(n)) && /#15121C/i.test(all(n)), 'the ink-spitter leaves them black with ink');
    W.__waterForce='mother'; n=sent.length; await spring(500,'tentacle'); await wait(3500);
    ok(/MOTHER'S BROOD/.test(all(n)), 'the mother leaves her name on them');
    W.__waterForce='warm'; const p=W.__prodOf(500); p.eggs=null; await spring(500,'tentacle');
    ok(p.eggs && p.eggs.layAt < p.eggs.since + (cfg.EGG_DAYS[1]-0.9)*86400000, 'the warm one\'s eggs come sooner');
    W.__waterForce=null;
    // left to itself, mostly the old one
    const c={}; for (let i=0;i<2000;i++){ const f=W.__waterForm(500).id; c[f]=(c[f]||0)+1; }
    ok(c.classic>500 && c.classic<900 && c.mother>20 && c.mother<180 && Object.keys(c).length===10, 'left to itself: the old one most often, the mother rarely ('+JSON.stringify(c)+')'); }

  // ── the herd's ratings ──
  { let n=sent.length; await say(221397,'?traps ratings',900); ok(/HOW THE HERD RATES THE TRAPS/.test(all(n)) && /Most \\?"not for me\\?": 🐖 mud \(1\)/.test(all(n)), '?traps ratings for staff');
    n=sent.length; await say(500,'?traps ratings',900); ok(/for staff/.test(all(n)), '...not for livestock'); }

  const errs=warns.filter(w=>/Error|TypeError|ReferenceError|is not/i.test(w)&&!/Worker/.test(w));
  ok(!errs.length, 'no errors '+errs.slice(0,3).join(' || '));

  // ── the Companion: costume pieces only ever the item they name ──
  { const esbuild=require('esbuild'), tmp=path.join(os.tmpdir(),'fh-marks27-'+process.pid+'.cjs');
    await esbuild.build({ entryPoints:[path.join(__dirname,'../extension/src/marks.js')], bundle:true, format:'cjs', outfile:tmp, logLevel:'silent' });
    const ASSETS={ HairAccessory2:['KittenEars2','FoxEars1'], HairAccessory1:['Horns2'], TailStraps:['KittenTailStrap1'], Hat:['FlowerCrown'], Cloth:['Shirt'] };
    const mk=(Group,Name,extra)=>Object.assign({ Asset:{ Name, Group:{ Name:Group } }, Property:{} }, extra||{});
    const Pl={ MemberNumber:500, Name:'Moo', AssetFamily:'Female3DCG', Appearance:[mk('Cloth','Shirt'), mk('HairAccessory2','FoxEars1')] };
    const ls={};
    const saveW=global.window;
    global.window={ Player:Pl, localStorage:{ getItem(k){return k in ls?ls[k]:null}, setItem(k,v){ls[k]=String(v)} },
      AssetGet:(f,g,n)=>(ASSETS[g]||[]).includes(n)?{ Name:n }:null, AssetGroupGet:(f,g)=>ASSETS[g]?{ Name:g, Clothing:g==='Cloth' }:null,
      ServerAppearanceBundle:(A)=>A.map(it=>({ Group:it.Asset.Group.Name, Name:it.Asset.Name, Color:it.Color, Craft:it.Craft, Property:it.Property, Difficulty:it.Difficulty })),
      ServerAppearanceLoadFromBundle:(C,f,b)=>{ C.Appearance=b.map(x=>mk(x.Group,x.Name,{ Color:x.Color, Craft:x.Craft, Property:x.Property||{}, Difficulty:x.Difficulty })); },
      CharacterRefresh(){}, ChatRoomCharacterUpdate(){} };
    const { syncFarmGear }=require(tmp);
    const has=(g,n)=>Pl.Appearance.some(it=>it.Asset.Group.Name===g&&(!n||it.Asset.Name===n));
    const far=Date.now()+3600000;
    const ears={ slot:'ears', name:'Black Cat Ears', desc:'x', items:['KittenEars2'], color:'#1A1A1A', only:true, always:true, until:far };
    const tail={ slot:'tail', name:'Black Cat Tail', desc:'x', items:['KittenTailStrap1'], only:true, always:true, until:far };
    const horns={ slot:'horns', name:"Demon's Horns", desc:'x', items:['Horns2'], only:true, until:far };
    const hat={ slot:'hat', name:"Witch's Hat", desc:'x', items:['WitchHat1','WitchHat'], only:true, always:true, until:far };
    let d=syncFarmGear([ears,tail,hat], false);
    ok(has('HairAccessory2','KittenEars2') && !has('HairAccessory2','FoxEars1') && has('TailStraps','KittenTailStrap1'), 'cat ears go on in place of her own ears, and the tail');
    ok(!has('Hat'), 'a witch\'s hat this game hasn\'t got: nothin\' goes on (never a stand-in)');
    d=syncFarmGear([ears,tail,hat,horns], true); ok(has('HairAccessory1','Horns2'), 'a demon\'s horns, with trap gear on');
    ASSETS.Hat.push('WitchHat1'); d=syncFarmGear([ears,tail,hat,horns], true); ok(has('Hat','WitchHat1'), 'once the game has the hat, it goes on');
    d=syncFarmGear([], true); ok(has('HairAccessory2','FoxEars1') && !has('HairAccessory2','KittenEars2') && !has('TailStraps') && !has('HairAccessory1') && !has('Hat'), 'off again: her own ears back, the rest gone');
    global.window=saveW;
    const comp=fs.readFileSync(path.join(__dirname,'../dist/farmhand-companion.user.js'),'utf8');
    ok(/pumpkin:\s*\{ style: "smear"/.test(comp) && /ink:\s*\{ style: "run"/.test(comp) && /"#15121c": "ink"/.test(comp), 'the Companion draws the new messes (pumpkin, caramel, ecto, cider, brew, ink)');
    ok(/How was the " \+ rt\.kind/.test(comp) && /Kinds of trap/.test(comp), 'the Companion asks how a trap was, and has the kinds of trap switches'); }

  out(fails? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
