// Oct 27 (Laynie: "They should be immersive, detailed, non-clinical, expansive message pools for all traps... covers all the
// various factors, like gender, equipment, species, fullness... Plus the rubberpup trap should really feature a full outfit.
// I think the parasites would benefit from more strains and fuller outfits to spread into."):
//  • the rubber pup puts a whole outfit on (catsuit, pup hood, petsuit, collar and bone tag, leash, tail plug or tail)
//  • the Companion's new collar spot, the leash and tag clippin' on after it, a tentacle tail goin' to the tail spot
//  • four more parasite strains, and every strain spreadin' into more of them
//  • every trap meetin' the state they're in: carryin', full, in heat, what they're wearin', their kind
const fs=require('fs'), path=require('path'), os=require('os');
const CUR=JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).versions.companion;
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const LEAK=/\{(nv|nc|nt|fu|fb|nb|v|c|t|f|m)\}|%[a-z]{1,8}\b|\bundefined\b|\bNaN\b|\[object/;

(async()=>{
  // ── the Companion's half: marks.js against a stand-in wardrobe that knows where each item lives ──
  { const esbuild=require('esbuild'), tmp=path.join(os.tmpdir(),'fh-marks-pup-'+process.pid+'.cjs');
    await esbuild.build({ entryPoints:[path.join(__dirname,'../extension/src/marks.js')], bundle:true, format:'cjs', outfile:tmp, logLevel:'silent' });
    const ASSETS={ ItemNeck:['DogCollar','LeatherCollar'], ItemNeckAccessories:['CollarPupBone','CollarNameTag'], ItemNeckRestraints:['CollarLeash','CollarChainLong'],
                   ItemArms:['Tentacles','HempRope','PawPaddedPetsuitArms'], ItemLegs:['Tentacles','PawPaddedPetsuitLegs','HempRope'], TailStraps:['Tentacles','PuppyTailStrap','KittenTailStrap1'],
                   ItemButt:['PuppyTailPlug1','BlackButtPlug'], Gloves:['LatexElbowGloves'], Cloth:['Shirt'] };
    const mk=(Group,Name,extra)=>Object.assign({ Asset:{ Name, Group:{ Name:Group } }, Property:{} }, extra||{});
    const Pl={ MemberNumber:500, Name:'Moo', AssetFamily:'Female3DCG', Appearance:[mk('Cloth','Shirt'), mk('TailStraps','KittenTailStrap1')] };
    const ls={};
    global.window={ Player:Pl, localStorage:{ getItem(k){return k in ls?ls[k]:null}, setItem(k,v){ls[k]=String(v)} },
      Asset:Object.entries(ASSETS).flatMap(([g,ns])=>ns.map(n=>({ Name:n, Group:{ Name:g, Family:'Female3DCG' } }))),
      AssetGet:(f,g,n)=>(ASSETS[g]||[]).includes(n)?{ Name:n }:null, AssetGroupGet:(f,g)=>ASSETS[g]?{ Name:g }:null,
      ServerAppearanceBundle:(A)=>A.map(it=>({ Group:it.Asset.Group.Name, Name:it.Asset.Name, Color:it.Color, Craft:it.Craft, Property:it.Property })),
      ServerAppearanceLoadFromBundle:(C,f,b)=>{ C.Appearance=b.map(x=>mk(x.Group,x.Name,{ Color:x.Color, Craft:x.Craft, Property:x.Property||{} })); },
      CharacterRefresh(){}, ChatRoomCharacterUpdate(){} };
    const { syncFarmGear }=require(tmp);
    const has=(g,n)=>Pl.Appearance.some(it=>it.Asset.Group.Name===g&&(!n||it.Asset.Name===n));
    const far=Date.now()+3600000;
    const leash={ slot:'leash', name:'Kennel Leash', items:['CollarLeash'], until:far }, tag={ slot:'tag', name:'Good Pup Tag', items:['CollarPupBone'], only:true, until:far },
          collar={ slot:'collar', name:'Kennel Collar', items:['DogCollar'], only:true, color:'#9E1B24', until:far };
    let d=syncFarmGear([leash, tag, collar], true);
    ok(has('ItemNeck','DogCollar') && has('ItemNeckRestraints','CollarLeash') && has('ItemNeckAccessories','CollarPupBone'), 'the collar goes on first, then the leash and the bone tag clip to it, all in one go ('+d.on.join(', ')+')');
    syncFarmGear([], true);
    ok(!has('ItemNeck') && !has('ItemNeckRestraints') && !has('ItemNeckAccessories'), '...and all of it comes off again');
    Pl.Appearance.push(mk('ItemNeck','LeatherCollar',{ Craft:{ Name:'My owner\'s collar', Description:'theirs' } }));
    d=syncFarmGear([collar, leash, tag], true);
    ok(has('ItemNeck','LeatherCollar') && !has('ItemNeck','DogCollar') && has('ItemNeckRestraints','CollarLeash') && has('ItemNeckAccessories','CollarPupBone'), 'somebody already wearin\' a collar keeps theirs, and the leash and tag clip to it');
    syncFarmGear([], true);
    ok(has('ItemNeck','LeatherCollar'), '...and their own collar is never touched');
    const tail={ slot:'tail', name:'Deep\'s Tail', items:['Tentacles'], always:true, color:'#2E8B7A', until:far };
    syncFarmGear([tail], false);
    ok(has('TailStraps','Tentacles') && !has('ItemArms','Tentacles'), 'a tentacle TAIL goes in the tail spot, not round their arms');
    syncFarmGear([], false);
    ok(has('TailStraps','KittenTailStrap1') && !has('TailStraps','Tentacles'), '...and their own tail goes back after');
    const arms={ slot:'arms', name:'Rubber Petsuit', items:['PawPaddedPetsuitArms'], only:true, until:far }, legs={ slot:'legs', name:'Rubber Petsuit (legs)', items:['PawPaddedPetsuitLegs'], only:true, until:far };
    syncFarmGear([arms, legs], true);
    ok(has('ItemArms','PawPaddedPetsuitArms') && has('ItemLegs','PawPaddedPetsuitLegs'), 'the petsuit goes on, arms and legs');
    syncFarmGear([], true);
    const nope={ slot:'arms', name:'Rubber Petsuit', items:['ShinyPetSuitThatIsNotThere'], only:true, until:far };
    syncFarmGear([nope], true);
    ok(!has('ItemArms'), 'a piece this game hasn\'t got puts nothin\' on in its place (no stray rope)');
    try { fs.unlinkSync(tmp); } catch(e){} }

  // ── the bot ──
  const store={}; const sent=[]; const handlers={};
  const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,trapsOn:true,parasiteOn:true},extra||{});
  store.bnb_ledger_v1=JSON.stringify({v:4,people:{
   "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
   "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"wolf"}), "700":S(700,"Pip",{gender:"femboy",species:"bunny"}), "800":S(800,"Fu",{gender:"futa",species:"horse"})
  },applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pasture":{X:20,Y:40},"trap":{X:22,Y:40},"pond":{X:60,Y:60}}});
  global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
  const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
  const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
  const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,30,30),at(700,32,30),at(800,34,30)];
  const evts={};
  const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
    CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}}, location:{reload(){}},alert(){},prompt(){},
    ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
    Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
    ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
  global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
  const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
  W.__FARMHAND_TEST__=true; W.__date="2026-08-10T12:00:00";
  eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
  const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn], prod=mn=>W.__prodOf(mn);
  const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
  const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
  const marks=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Dictionary&&d.Dictionary.type==='mark'&&(!mn||d.Target===mn)).map(([e,d])=>d.Dictionary);
  const free=(...mns)=>{ for(const mn of mns){ const r=P(mn); r.trapAt=0; r.penned=null; r.gear=null; r.trapQuiet=0; r.trapWait=null; r.benched=null; r.quietUntil=0; if(W.__st().trapRuns) W.__st().trapRuns.delete(mn); } };
  const done=async(mn,ms)=>{ for(let i=0;i<80;i++){ await wait(250); if(!(W.__st().trapRuns&&W.__st().trapRuns.has(mn))) break; } await wait(ms||600); };
  const gear=mn=>W.__farmGear(mn);
  await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.08; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0; cfg.SYM.TRAP_CHANCE=0; cfg.SYM.LATEX_TRAP_CHANCE=0; cfg.SEND_INTERVAL_MS=2; cfg.TRAP_WRITE_CHANCE=0;
  ['Laynie','Moo','Rex','Pip','Fu'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,800]) await say(mn,'?stats',600);
  for (const mn of [500,600,700,800,221397,260239]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:CUR}});
  await wait(500);

  // ── the rubber pup's whole outfit ──
  { free(500); let seenHold=null;
    const n=sent.length; await say(221397,'?trap spring Moo rubberpup',300);
    seenHold=gear(500).map(g=>g.slot+':'+g.name+':'+(g.items||[]).join('/'));
    await done(500,800);
    const after=gear(500).map(g=>g.slot+':'+g.name);
    const want=['suit:Rubber Pup Skin:LatexCatsuit','suitLower:Rubber Pup Skin (legs):LatexCatsuit','hood:Rubber Pup Hood:LatexDogHood/LatexDogMask','arms:Rubber Petsuit:PawPaddedPetsuitArms',
                'legs:Rubber Petsuit (legs):PawPaddedPetsuitLegs','collar:Kennel Collar:DogCollar','tag:Good Pup Tag:CollarPupBone','leash:Kennel Leash:CollarLeash','plug:Pup\'s Tail Plug:PuppyTailPlug1/PuppyTailPlug'];
    const miss=want.filter(w=>!seenHold.includes(w));
    ok(!miss.length, 'while the rubber kennel has them, Moo wears the whole pup: catsuit, hood, petsuit arms and legs, collar, bone tag, leash, tail plug ('+(miss.join(', ')||'all 9')+')');
    ok(after.includes('collar:Kennel Collar') && after.includes('tag:Good Pup Tag') && !after.some(x=>/^(suit|hood|arms|legs|leash|plug):/.test(x)), 'after, only the collar and its GOOD PUP tag stay on ('+after.join(', ')+')');
    const said=all(n); ok(/catsuit|petsuit|collar/i.test(said) && !LEAK.test(said), 'the story tells the outfit goin\' on, and every line fills in');
    P(600).limits="no anal"; free(600); await say(221397,'?trap spring Rex rubberpup',300);
    const g6=gear(600).map(g=>g.slot+':'+g.name);
    ok(g6.includes('tail:Rubber Pup Tail') && !g6.some(x=>/^plug:/.test(x)), 'with anal in their limits, Rex gets a strapped-on tail instead of the plug');
    await done(600,600); P(600).limits=""; }

  // ── the strains ──
  const NEW=['oozer','weaver','deep','gloss'], OLD=['breeder','grower','glutton','tyrant'];
  const host=async(mn,strain,hoursIn)=>{ const r=P(mn); r.parasite=null; r.parasiteNext=0; r.parasiteN=0; W.__forceStrain=strain; const st=W.__st(); if(st.lastCmd) st.lastCmd.clear(); await say(221397,'?parasite give '+r.name,500); const g=r.parasite; g.since=Date.now()-hoursIn*3600000; g.stageTold=9; g.urgeAt=Date.now()+9e9; return g; };
  ok(NEW.every(k=>W.__strainParts(k,1).lips && W.__strainParts(k,3).lips && W.__strainParts(k,3).root && W.__strainParts(k,3).suckers), 'four new strains, each blooms all the way by hour eight');
  ok(W.__strainParts('oozer',2).root && !W.__strainParts('oozer',2).suckers && W.__strainParts('weaver',2).suckers && !W.__strainParts('weaver',2).root, '...each in its own order (the Oozer roots first, the Weaver goes for the teats)');
  for (const k of NEW){ const g=await host(500,k,0.1); ok(g && g.strain===k, 'the '+k+' latches when it\'s given'); }
  const piece=(mn)=>W.__strainGear(mn).map(x=>x.slot+':'+x.name);
  { await host(500,'oozer',0.1); const a=piece(500); await host(500,'oozer',5); const b=piece(500); await host(500,'oozer',9); const c=piece(500);
    ok(a.includes('gloves:Ooze Gloves') && b.includes('socks:Ooze Stockings') && b.includes('suitLower:Ooze Skin (legs)') && c.includes('suit:Ooze Skin (body)') && c.includes('gloves:Ooze Sleeves') && !c.includes('gloves:Ooze Gloves'),
       'the Oozer spreads: gloves, then stockings and the legs, then the whole body and the sleeves ('+c.join(', ')+')'); }
  { await host(500,'gloss',0.1); const a=piece(500); await host(500,'gloss',9); const c=piece(500);
    ok(a.includes('gloves:Gloss Gloves') && ['suit:Gloss Skin (body)','suitLower:Gloss Skin (legs)','socks:Gloss Stockings','boots:Gloss Heels','gloves:Gloss Sleeves','chestbra:Parasite Suckers','belt:Parasite Root','lips:Parasite Lips'].every(x=>c.includes(x)),
       'the Gloss goes from rubber gloves to rubber from the throat down, heels and all ('+c.join(', ')+')'); }
  { await host(500,'deep',0.1); const a=piece(500); await host(500,'deep',9); const c=piece(500);
    ok(a.includes('tail:Deep\'s Tail') && c.includes('torso:Deep\'s Embrace') && c.includes('gloves:Deep\'s Sleeves'), 'the Deep gives a tentacle tail at once and wraps the whole body by hour eight');
    const g=W.__strainGear(500).find(x=>x.slot==='tail'); ok(g && g.color==='#2E8B7A' && g.always && (g.items||[]).includes('Tentacles'), '...in its sea green, on the parasite\'s own say-so'); }
  { await host(500,'weaver',5); const c=piece(500); ok(c.includes('torso:Silk Harness') && c.includes('gloves:Silk Gloves'), 'the Weaver spins a silk harness and gloves by hour four'); }
  for (const k of OLD){ await host(500,k,5); const b=piece(500); await host(500,k,9); const c=piece(500);
    ok(b.includes('tail:Parasite Tail') && c.includes('gloves:Parasite Sleeves') && c.includes('socks:Parasite Stockings'), 'the '+k+' spreads further now: a tail by hour four, sleeves and stockings by hour eight'); }
  // their tricks
  { const g=await host(500,'weaver',5); g.cocoonAt=0; P(500).penned=null; const n=sent.length; W.__parasiteTick(); await wait(400);
    ok(g.cocoonUntil>Date.now() && piece(500).includes('arms:Weaver\'s Cocoon') && /silk/i.test(all(n)), 'the Weaver cocoons their arms for a few minutes');
    g.cocoonUntil=Date.now()-1; ok(!piece(500).includes('arms:Weaver\'s Cocoon'), '...and lets go again'); }
  { const g=await host(500,'deep',5); prod(500).held={vulva:0,butt:0,mouth:0}; g.next=0; const n=sent.length; W.__parasiteTick(); await wait(500);
    ok((prod(500).held.vulva+prod(500).held.butt)>20, 'the Deep pumps brine in at a feed ('+JSON.stringify(prod(500).held)+')'); }
  { const g=await host(500,'gloss',1); const n0=g.n||0; prod(500).deniedUntil=0; W.__climax(500); await wait(300);
    ok((g.n||0)>n0 && !(prod(500).deniedUntil>Date.now()), 'the Gloss drinks a climax and pays a dose for it, and never denies them'); }
  { const g=await host(500,'oozer',1); g.next=0; const n=sent.length; W.__parasiteTick(); await wait(500);
    ok(marks(n,500).some(m=>m.mess==='slime'), 'the Oozer slimes its host at a feed'); }
  { cfg.STRAIN_FEED_CHANCE=1; const g=await host(500,'deep',1); g.next=0; const n=sent.length; W.__parasiteTick(); await wait(500); cfg.STRAIN_FEED_CHANCE=0.4;
    const t=all(n); ok(/rock pool|the ocean|for miles|hundred little kisses|swell comin|only it can feel|its place for later|heavy and sloshin/i.test(t) && !LEAK.test(t), 'each feed can tell them how that strain\'s brew feels, the Deep\'s tastin\' of the sea'); }
  { P(500).parasite=null; P(500).limits="no latex"; W.__forceStrain='gloss'; W.__st().lastCmd && W.__st().lastCmd.clear(); await say(221397,'?parasite give Moo',500);
    ok(!P(500).parasite || P(500).parasite.strain!=='gloss', 'latex in their limits: never a Gloss'); P(500).parasite=null; P(500).limits=""; }
  W.__forceStrain=null; for (const mn of [500,600,700,800]) P(mn).parasite=null;
  // every new strain line fills, for every body
  { const bad=[]; const PM=W.__lines().PARASITE_MORE;
    const keys=Object.keys(PM).filter(k=>/^(oozer|weaver|deep|gloss)_|^(breeder|grower|glutton|tyrant)_feed$|^(oozerSlime|oozerStretch|weaverCocoon|weaverFree|deepBrine|glossDrink|glossSqueeze|glossClean|urge_water)$/.test(k));
    for (const mn of [500,600,700,800]) for (const k of keys) for (let i=0;i<6;i++){ const t=W.__tFill(W.__pickFor(mn,'t:'+k,PM[k]),mn,{ml:'60 mL',h:'ass'}); if (LEAK.test(t)) bad.push(k+': '+t.slice(0,80)); }
    ok(keys.length>=45 && !bad.length, 'the new strains\' '+keys.length+' pools fill in for every body ('+bad.slice(0,2).join(' ; ')+')'); }

  // ── the state they're in ──
  { const now=Date.now(); const p=prod(500); p.preg={since:now-3*86400000,due:now+86400000,sires:[-1],count:3}; p.heat={until:now+3600000}; p.milk=99999;
    const s=W.__stateOf(500);
    ok(s.pregHeavy && s.heat && s.milkBurst && s.sp_cow, 'Moo, heavy with a litter, in heat, udders fit to burst, a cow: the farm can tell ('+Object.keys(s).join(', ')+')'); }
  { const s=W.__stateOf(600); ok(s.sp_wolf && !s.milkBurst && !s.pregHeavy, 'Rex is a wolf, and nothin\' he hasn\'t got'); }
  // every line, every body: fills cleanly, and nobody's told about parts they haven't got
  { const SB=W.__stateBeat, ST=W.__stateTail, bad=[], wrong=[]; const WRONG_M=/\b(pussy|cunt|slit|womb|clit|tits|breasts|udders?|teats?)\b/i;
    let n=0;
    for (const [k,P0] of Object.entries(SB)) for (const pool of Object.values(P0)) for (const l of pool){ n++; for (const mn of [500,600,700,800]){ const t=W.__tFill(W.__pickFor(mn,'x',[l]),mn).replace(/%w/g,'the trap'); if (LEAK.test(t)) bad.push(k+': '+t.slice(0,70)); } }
    for (const [k,pool] of Object.entries(ST)) for (const l of pool){ n++; const t=W.__tFill(l,500); if (LEAK.test(t)) bad.push(k+': '+t.slice(0,70)); }
    ok(n>=450 && !bad.length, n+' state lines, every one fills in ('+bad.slice(0,2).join(' ; ')+')');
    ok(Object.keys(ST).filter(k=>/^sp_/.test(k)).length===14 && Object.keys(ST).filter(k=>/^sp_/.test(k)).every(k=>ST[k].length>=9), 'every one of the 14 kinds of stock has its own ears, tails and noises (9 or more each)');
    ok(Object.keys(SB).filter(k=>/^sp_/.test(k)).every(k=>['any','breed','held','milk','mess','tease','watched'].every(f=>(SB[k][f]||[]).length) && SB[k].any.length>=4), 'and each kind is bred, held, milked, messed, teased and watched its own way');
    ok(Object.keys(ST).filter(k=>/^g_/.test(k)).length>=24, 'and there are lines for '+Object.keys(ST).filter(k=>/^g_/.test(k)).length+' kinds of gear');
    for (let i=0;i<300;i++){ cfg.STATE_TAIL_CHANCE=1; const t=W.__stateTailFor(600,'breeder',3); if (WRONG_M.test(t)) wrong.push(t); }
    ok(!wrong.length, 'a male is never told about parts he hasn\'t got in them ('+wrong.slice(0,1)+')'); }
  // in a real trap
  { cfg.STATE_TAIL_CHANCE=1; cfg.BODY_TAIL_CHANCE=0; free(500); const n=sent.length; await say(221397,'?trap spring Moo breeder',300); await done(500,600);
    const said=all(n);
    ok(/litter|belly|heat|udders|moo|cow|milk/i.test(said) && !LEAK.test(said), 'a trap on Moo talks about the litter she\'s carryin\', her heat, her udders, her kind');
    const beats=said.split(' | ').filter(t=>/Moo/.test(t)).length; ok(beats>=8, 'and it\'s a full scene ('+beats+' beats)'); }
  { cfg.STATE_BEATS={tender:0,rough:0,filthy:0}; const b=W.__stateBeats(500,'breeder',[["a"],["b"],["c"],["d"]]); ok(b.length===4, 'it can be switched off'); cfg.STATE_BEATS={tender:1,rough:1,filthy:2}; }
  { const b=W.__stateBeats(500,'breeder',[["a"],["b"],["c"],["d"]]); ok(b.length===5 && b.slice(0,1)[0][0]==='a' && b[4][0]==='d', 'one state beat goes in the back half, never first or last'); }
  ok(!warns.some(w=>/strain|parasite|trap |state/.test(w)), 'no errors '+warns.filter(w=>/strain|parasite|trap |state/.test(w)).slice(0,2).join(' | '));
  out(fails ? '\n❌ '+fails+' failed' : '\n✅ all good'); process.exit(fails?1:0);
})();
