// Real farm gear (Oct 10): the Companion makes a character match the list the farm sends: a listed piece goes on,
// one that's no longer listed comes off, one pulled off early goes back, and nothin' that isn't the farm's is touched.
// Also the bot side: a trap puts its gear on the list and takes it off again.
const fs=require('fs'), path=require('path'), os=require('os');
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  // ── the Companion's half: marks.js against a stand-in wardrobe ──
  const esbuild=require('esbuild'), tmp=path.join(os.tmpdir(),'fh-marks-'+process.pid+'.cjs');
  await esbuild.build({ entryPoints:[path.join(__dirname,'../extension/src/marks.js')], bundle:true, format:'cjs', outfile:tmp, logLevel:'silent' });
  const ASSETS={ ItemButt:['BlackButtPlug','AnalBeads'], ItemVulva:['VibratingDildo'], ItemPelvis:['PolishedChastityBelt'], ItemNipples:['LactationPump'],
                 ItemNeckRestraints:['CollarChainLong'], ItemNeck:['LeatherCollar'], ItemMouth:['FunnelGag','LipGag','BallGag'], ItemMouth2:['FunnelGag','LipGag'], ItemMouth3:['LipGag'],
                 ItemArms:['HempRope','Tentacles'], ItemLegs:['HempRope'], ItemFeet:['HempRope'], Cloth:['Shirt'] };
  const mk=(Group,Name,extra)=>Object.assign({ Asset:{ Name, Group:{ Name:Group } }, Property:{} }, extra||{});
  const P={ MemberNumber:500, Name:'Moo', AssetFamily:'Female3DCG', Appearance:[mk('Cloth','Shirt'), mk('ItemMouth','BallGag',{ Craft:{ Name:'Her own gag', Description:'mine' } })] };
  let commits=0;
  const ls={};
  global.window={ Player:P, localStorage:{ getItem(k){return k in ls?ls[k]:null}, setItem(k,v){ls[k]=String(v)} },
    AssetGet:(f,g,n)=>(ASSETS[g]||[]).includes(n)?{ Name:n }:null, AssetGroupGet:(f,g)=>ASSETS[g]?{ Name:g, Clothing:g==='Cloth' }:null,
    ServerAppearanceBundle:(A)=>A.map(it=>({ Group:it.Asset.Group.Name, Name:it.Asset.Name, Color:it.Color, Craft:it.Craft, Property:it.Property, Difficulty:it.Difficulty })),
    ServerAppearanceLoadFromBundle:(C,f,b)=>{ C.Appearance=b.map(x=>mk(x.Group,x.Name,{ Color:x.Color, Craft:x.Craft, Property:x.Property||{}, Difficulty:x.Difficulty })); },
    CharacterRefresh(){}, ChatRoomCharacterUpdate(){ commits++; } };
  const { syncFarmGear }=require(tmp);
  const worn=()=>P.Appearance.map(it=>it.Asset.Group.Name+':'+it.Asset.Name+(it.Craft?'('+it.Craft.Name+')':''));
  const has=(g,n)=>P.Appearance.some(it=>it.Asset.Group.Name===g&&(!n||it.Asset.Name===n));
  const far=Date.now()+3600000;
  const plug={ slot:'plug', name:'Pump Bung', desc:'left in by the pump trap', until:far }, cups={ slot:'cups', name:'Growth Cups', desc:'x', until:far };
  const lips={ slot:'lips', name:'Parasite Lips', desc:'livin\' lips', always:true, color:'#E0607F', until:far };
  let d=syncFarmGear([plug,cups], false);
  ok(!d.on.length && !has('ItemButt'), 'trap gear stays off till "Farm can put real gear on me" is on');
  d=syncFarmGear([plug,cups,lips], false);
  ok(d.on.join()==='Parasite Lips' && has('ItemMouth2','LipGag') && has('ItemMouth','BallGag'), 'the parasite goes on regardless, in a free mouth slot, next to her own gag ('+worn().join(' ')+')');
  d=syncFarmGear([plug,cups,lips], true);
  ok(has('ItemButt','BlackButtPlug') && has('ItemNipples','LactationPump') && d.on.length===2, 'switched on: the plug and the cups go on as real items');
  const pl=P.Appearance.find(it=>it.Asset.Group.Name==='ItemButt');
  ok(pl.Craft.Name==='Pump Bung' && /^BnB Farm gear\./.test(pl.Craft.Description), '...crafted with the farm\'s name and tag');
  const c0=commits; d=syncFarmGear([plug,cups,lips], true); ok(!d.on.length && !d.off.length && commits===c0, 'nothin\' to do the second time: no needless wardrobe change');
  P.Appearance=P.Appearance.filter(it=>it.Asset.Group.Name!=='ItemButt'); d=syncFarmGear([plug,cups,lips], true);
  ok(has('ItemButt','BlackButtPlug') && d.on.join()==='Pump Bung', 'pulled out early: it goes back in');
  d=syncFarmGear([cups,lips], true);
  ok(!has('ItemButt') && d.off.join()==='Pump Bung' && has('ItemNipples'), 'off the list: the plug comes out, the rest stays');
  d=syncFarmGear([cups,lips,{ slot:'plug', name:'Old Plug', desc:'x', until:Date.now()-1000 }], true); ok(!has('ItemButt'), 'a piece whose time is up never goes on');
  d=syncFarmGear([], true);
  ok(!has('ItemNipples') && !has('ItemMouth2') && has('ItemMouth','BallGag') && has('Cloth','Shirt') && P.Appearance.length===2, 'empty list: every farm piece off, her own gag and clothes untouched ('+worn().join(' ')+')');
  // the game hands the item back without its crafted name: we still know it's ours
  syncFarmGear([plug], true); delete P.Appearance.find(it=>it.Asset.Group.Name==='ItemButt').Craft;
  d=syncFarmGear([plug], true); ok(!d.on.length && P.Appearance.filter(it=>it.Asset.Group.Name==='ItemButt').length===1, 'an item that lost its crafted name is still known as ours (no second one)');
  d=syncFarmGear([], true); ok(!has('ItemButt') && d.off.join()==='Pump Bung', '...and still comes off');
  // live, Oct 11: a Slime Seal whose description lost its tag (and whose note on this computer was gone) never came off
  P.Appearance.push(mk('ItemVulva','VibratingDildo',{ Craft:{ Name:'Slime Seal', Description:'mangled by the game', MemberNumber:500 } })); for (const k of Object.keys(ls)) delete ls[k];
  d=syncFarmGear([], true); ok(!has('ItemVulva') && d.off.join()==='Slime Seal', 'a farm piece is known by its name even with its tag gone: it comes off');
  P.Appearance.push(mk('ItemVulva','VibratingDildo',{ Craft:{ Name:'Slime Seal', Description:'somebody else made this', MemberNumber:999 } }));
  d=syncFarmGear([], true); ok(has('ItemVulva'), '...but somebody else\x27s item that only shares the name is left alone'); P.Appearance=P.Appearance.filter(it=>it.Asset.Group.Name!=='ItemVulva');
  // a piece can ask for a better-fittin' item and a colour; the usual one is used where this game has not got it
  d=syncFarmGear([{ slot:'arms', name:"The Water's Grip", desc:'x', items:['Tentacles'], color:'#C9577A', until:far },{ slot:'legs', name:"The Water's Coils", desc:'x', items:['Tentacles'], until:far }], true);
  { const a=P.Appearance.find(it=>it.Asset.Group.Name==='ItemArms'), l=P.Appearance.find(it=>it.Asset.Group.Name==='ItemLegs');
    ok(a && a.Asset.Name==='Tentacles' && a.Color==='#C9577A' && l && l.Asset.Name==='HempRope', 'a piece wears the item it asked for where the game has it (tentacles on the arms), the usual one where it has not (legs)'); }
  d=syncFarmGear([], true); ok(!has('ItemArms') && !has('ItemLegs'), '...and both come off again');
  // a spot that's taken, a chain with no collar, a locked farm piece
  P.Appearance.push(mk('ItemButt','AnalBeads',{ Craft:{ Name:'Her beads', Description:'' } }));
  d=syncFarmGear([plug,{ slot:'leash', name:'Winch Chain', desc:'x', until:far }], true);
  ok(has('ItemButt','AnalBeads') && !d.on.length, 'a spot she already has somethin\' in is left alone; a chain needs a collar');
  P.Appearance.push(mk('ItemNeck','LeatherCollar')); d=syncFarmGear([{ slot:'leash', name:'Winch Chain', desc:'x', until:far }], true);
  ok(has('ItemNeckRestraints','CollarChainLong'), 'with a collar on, the chain clips on');
  P.Appearance.find(it=>it.Asset.Group.Name==='ItemNeckRestraints').Property={ LockedBy:'HighSecurityPadlock' }; d=syncFarmGear([], true);
  ok(has('ItemNeckRestraints'), 'a farm piece somebody locked on her stays till it\'s unlocked');
  // the belt form, and an old-style parasite item with no tag
  P.Appearance=[mk('ItemMouth','LipGag',{ Craft:{ Name:'Parasite Lips', Description:'old, no tag' } })];
  d=syncFarmGear([{ slot:'belt', name:'Parasite Belt', desc:'x', always:true, until:far }], false);
  ok(!has('ItemMouth') && has('ItemPelvis','PolishedChastityBelt'), 'lips from an older Companion come off, and the belt goes on');
  // the big pieces (Oct 15): a device the piece names goes on, and comes off again; a cowbell clips to a collar
  ASSETS.ItemDevices=['WoodenStocks','SaddleStand','Net']; ASSETS.ItemNeckAccessories=['CollarCowBell','CollarNameTag'];
  P.Appearance=[mk('ItemNeck','LeatherCollar')];
  d=syncFarmGear([{ slot:'device', name:'Buckin\' Saddle', desc:'x', items:['SaddleStand'], until:far }, { slot:'tag', name:'Lost Cow Bell', desc:'x', items:['CollarCowBell'], until:far }], true);
  ok(has('ItemDevices','SaddleStand') && has('ItemNeckAccessories','CollarCowBell'), 'the saddle stand goes on as a device, and the cowbell on the collar');
  d=syncFarmGear([], true); ok(!has('ItemDevices') && !has('ItemNeckAccessories'), '...and both come off when the trap lets go');
  P.Appearance=[mk('ItemDevices','Net',{ Craft:{ Name:'Her own net', Description:'mine' } })];
  d=syncFarmGear([{ slot:'device', name:'Fair Stocks', desc:'x', items:['WoodenStocks'], until:far }], true);
  ok(has('ItemDevices','Net') && !has('ItemDevices','WoodenStocks'), 'a device she\'s already in is left alone');
  try { fs.unlinkSync(tmp); } catch(e){}

  // ── the bot's half: a trap lists its gear and takes it off ──
  const store={}; const sent=[]; const handlers={};
  store.bnb_ledger_v1=JSON.stringify({v:4,people:{
   "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
   "500":{mn:500,name:"Moo",roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true}
  },applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{}});
  global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
  const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
  const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
  const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10)];
  const evts={};
  const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
    CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}}, location:{reload(){}},alert(){},prompt(){},
    ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
    Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
    ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
  global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
  const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
  W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
  const L=()=>W.FarmhandLedger(), R=mn=>L().people[mn];
  const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
  await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.TRAP_BEAT_S=0.15; cfg.TRAP_COOLDOWN_MIN=0; cfg.CHAIN_CHANCE=0;
  chars[1].Name='Laynie'; chars[2].Name='Moo'; await say(500,'?stats');
  const gearOf=mn=>(W.__stateFor(mn).farmGear||[]).map(g=>g.slot+':'+g.name).join(' ');
  await say(221397,'?trap spring Moo clamp'); await wait(1500);
  ok(/belt:Denial Clamp/.test(gearOf(500)), 'the clamp trap leaves a real belt on the list ('+gearOf(500)+')');
  R(500).gear.belt.until=Date.now()-1; W.__trapTick(); ok(!/belt/.test(gearOf(500)), '...and it comes off the list when its time is up');
  R(500).trapAt=0; cfg.TRAP_BEAT_S=5; await say(221397,'?trap spring Moo snare'); await wait(300);
  ok(/arms:Snare Rope/.test(gearOf(500)) && /ropeFeet:Snare Hobble/.test(gearOf(500)), 'the snare ropes them for as long as it holds them');
  await say(500,'?safeword',2500); ok(!gearOf(500), 'the safeword takes every piece of trap gear off the list');
  cfg.TRAP_BEAT_S=0.15; R(500).trapQuiet=0; R(500).trapAt=0; R(500).penned=null;
  await say(221397,'?trap spring Moo pump'); await wait(1800);
  ok(/plug:Pump Bung/.test(gearOf(500)), 'the pump leaves its bung in the hole it used ('+gearOf(500)+')');
  R(500).parasiteOn=true; R(500).parasite={since:Date.now(),until:Date.now()+3600000,next:Date.now()+999999,n:0,fed:0,form:'lips'};
  ok(/lips:Parasite Lips/.test(gearOf(500)) && (W.__stateFor(500).farmGear.find(g=>g.slot==='lips')||{}).always===true, 'the parasite is on the same list, marked as needin\' no second switch');
  await say(221397,'?purge Moo'); ok(!/lips/.test(gearOf(500)), '?purge takes it off the list');
  R(500).trapAt=0; R(500).penned=null; R(500).gear=null; cfg.TRAP_BEAT_S=5; await say(221397,'?trap spring Moo tentacle'); await wait(300);
  { const fg=W.__stateFor(500).farmGear||[]; ok(fg.some(g=>g.slot==='arms' && g.items && g.items[0]==='Tentacles' && g.desc.length>100) && fg.some(g=>g.slot==='legs'), 'the thing in the water holds them in real tentacles, with a proper description'); }
  await say(500,'?safeword',2500); cfg.TRAP_BEAT_S=0.15; R(500).trapQuiet=0;
  await say(500,'?eager on'); ok(R(500).trapEager===true && W.__stateFor(500).switches.eager===true, '?eager on: the no-cooldown switch, and it shows in Toggles');
  ok(W.__stateFor(221397).trapAdmin && W.__stateFor(221397).trapAdmin.subjects.some(x=>x.mn===500) && W.__stateFor(500).trapCard, 'a proprietor gets the subjects card, a subject gets the trap card');
  const errs=warns.filter(w=>/trap|gear|command failed/i.test(w)); ok(!errs.length, 'no errors '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
