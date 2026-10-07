// Ribbons (the farm's scrip), the store, potions, dares, the corral, and wheel slices that do things.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "700":{mn:700,name:"Hand",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:""},
 "600":{mn:600,name:"Rex",roles:["LIVESTOCK"],species:"dog",gender:"male",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[],limits:"no humiliation please"}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"pen":{X:20,Y:20},"stocks":{X:25,Y:25},"milking1":{X:5,Y:5}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(700,11,10),at(500,12,10),at(600,13,10)];
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="ChatRoomCharacterMapDataUpdate"&&d&&d.Pos){} },
  ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const to=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&((d.Type==='Whisper'&&d.Target===mn)||(e==='AccountBeep'&&d.MemberNumber===mn))).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const all=n=>sent.slice(n).filter(([e,d])=>d&&typeof d.Content==='string').map(([e,d])=>d.Content).join(' | ');
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0;
  // ── ribbons ──
  let n=sent.length; await say(700,'?ribbon give 500 9 good girl');
  ok(/up to 5/.test(to(700,n)) && !P(500).ribbons, 'a farmhand can give at most 5 at once');
  await say(221397,'?ribbon give 500 30 bein the best cow');
  ok(P(500).ribbons===30, 'a proprietor can give any amount (30)');
  n=sent.length; await say(500,'?ribbons');
  ok(/YOUR RIBBONS: 30/.test(to(500,n)), '?ribbons shows the purse');
  // ── the store ──
  n=sent.length; await say(500,'?store');
  ok(/THE FARM STORE/.test(to(500,n)) && /hiccup/.test(to(500,n)) && /luxury/.test(to(500,n)), '?store lists the shelf, potions too');
  n=sent.length; await say(500,'?buy hiccup');
  ok(W.__potionOn(500,'hiccup') && P(500).ribbons===27, 'buyin\' a potion for yourself works without ?potions on (27 left)');
  ok(/Hiccup Fizz/.test(all(n)), 'the room sees them drink it');
  await say(500,'?buy tag Good Cow');
  ok(P(500).tag && P(500).tag.text==='Good Cow' && P(500).ribbons===22, 'a ribbon tag');
  n=sent.length; await say(500,'?who',6000);
  ok(/N500 (🎀)?Good Cow/.test(to(500,n)), 'the tag shows on ?who');
  await say(500,'?buy luxury');
  ok(!P(500).roles.includes('LUXURY'), "can't afford a luxury day on 22 ribbons");
  await say(221397,'?ribbon give 500 20 extra');
  await say(500,'?buy luxury');
  ok(P(500).roles.includes('LUXURY') && P(500).luxuryTemp, 'a luxury day adds the role for a while');
  P(500).luxuryUntil=Date.now()-1; W.__ribbonTick();
  ok(!P(500).roles.includes('LUXURY'), '...and takes it away after');
  // ── gifts ask first ──
  n=sent.length; await say(500,'?buy bell for 600');
  ok(/hasn't said \?potions on/.test(to(500,n)), "no gifts to somebody who hasn't said ?potions on");
  await say(600,'?potions on');
  n=sent.length; await say(500,'?buy bell for 600');
  ok(/limits rule out/.test(to(500,n)), "Rex's limits (humiliation) rule out a Bell Tonic");
  const before=P(500).ribbons;
  n=sent.length; await say(500,'?buy feather for 600');
  ok(/asked/.test(to(500,n)) && P(500).ribbons===before, 'a gift asks first, and nothin\'s paid yet');
  await say(600,'yes');
  ok(W.__potionOn(600,'feather') && P(500).ribbons===before-3, 'Rex said yes: he drinks it and Moo pays');
  // ── Bitterroot ruins orgasms ──
  await say(221397,'?potion give 600 bitterroot');
  ok(W.__potionOn(600,'bitterroot'), 'staff give a potion');
  n=sent.length; handlers.ChatRoomMessage({Sender:600,Type:'Activity',Content:'Orgasm2',Dictionary:[{SourceCharacter:600}]}); await wait(2500);
  ok(/Bitterroot|ruined|fizzles/i.test(all(n)) && !/comes apart/.test(all(n)), 'with Bitterroot an orgasm is ruined');
  // ── wrong barn, and the safeword pours everything out ──
  await say(500,'?potions on');
  await say(221397,'?potion give 500 wrongbarn');
  const swapped=P(500).species;
  ok(swapped && swapped!=='cow', 'Wrong Barn: Moo is a '+swapped+' for now');
  await say(221397,'?corral 500 20');
  ok(P(500).penned && P(500).penned.name==='pen', 'corralled at the pen spot');
  await say(500,'?safe', 3000);
  ok(!W.__potionOn(500,'wrongbarn') && P(500).species==='cow' && !P(500).penned, 'the safeword pours out potions (cow again) and opens the gate');
  // ── the corral walks you back ──
  await say(221397,'?corral 500 20');
  chars[3].MapData.Pos={X:40,Y:40};
  n=sent.length; W.__penTick(); await wait(1500);
  ok(sent.slice(n).some(([e,d])=>e==='ChatRoomCharacterMapDataUpdate'||(d&&d.Content==='ChatRoomAdmin')||/Teleport|MapData/.test(e)) || /back/i.test(all(n)), 'wanderin\' off the corral brings them back');
  await say(221397,'?uncorral 500');
  // ── dares ──
  n=sent.length; await say(221397,'?dare 500');
  ok(/hasn't said \?dares on/.test(to(221397,n)), 'no dares without ?dares on');
  await say(500,'?dares on'); await say(221397,'?dare 500');
  ok(!!P(500).dare, 'a dare handed out');
  const r0=P(500).ribbons; await say(500,'?dared');
  ok(!P(500).dare && P(500).ribbons===r0+2, '?dared pays 2 ribbons');
  // ── the wheel does things ──
  await say(221397,'?wheel farm off');
  await say(221397,'?wheel add punish Off to the pen, %name% => pen 15');
  ok(L().wheel.length===1 && L().wheel[0].act==='pen 15', 'an action slice');
  n=sent.length; await say(221397,'?spin 500 punish', 3000);
  ok(P(500).penned && /Off to the pen/.test(all(n)), 'the spin penned Moo');
  await say(221397,'?uncorral 500');
  await say(221397,'?wheel farm on');
  let landed=0; for (let i=0;i<6;i++){ const k=sent.length; await say(221397,'?spin 600 silly', 1500); if (/Round and round/.test(all(k))) landed++; }
  ok(landed>=5, 'farm silly slices land ('+landed+'/6)');
  // ── bounties ──
  await say(500,'?buy bounty 3 Polish the cowbells');
  ok(L().chores.some(c=>c.bounty===3), 'a bounty goes on the chore board');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
