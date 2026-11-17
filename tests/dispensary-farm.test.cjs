// Nov 17: the farm girl calls on a player's Dispensary (Laynie: "have the farm girl 'call' on the extension to apply
// shots", "anything to make the farmgirls load a little lighter"). She keeps the books; their game does the feelin'
// and says the line. Without a Dispensary, everything as before.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,milkable:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],gender:"female"},
 "500":S(500,"Moo"), "600":S(600,"Hana"), "650":{mn:650,name:"Hand",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(650,17,10)];
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
const prod=mn=>W.__prodOf(mn);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1500); };
const hid=async(mn,type,data,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:Object.assign({v:2,type},data||{})}); await wait(ms||400); };
const msgsTo=(mn,type,from)=>sent.slice(from||0).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Target===mn&&d.Dictionary&&d.Dictionary.type===type).map(([,d])=>d.Dictionary);
const roomText=(from)=>sent.slice(from||0).filter(([e,d])=>e==='ChatRoomChat'&&d&&d.Content!=='FarmhandMsg'&&typeof d.Content==='string').map(([,d])=>d.Content).join(' | ');
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ['Laynie','Moo','Hana','Hand'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [221397,500,600]) await say(mn,'?stats',500);

  // ---- hello
  let n=sent.length;
  await hid(600,'dispHello',{ver:'0.1.0',farm:true,lscg:false,off:[]});
  const wel=msgsTo(600,'dispWelcome',n).pop();
  ok(wel && wel.farm.includes(260239) && wel.farm.includes(221397) && wel.farm.includes(650) && !wel.farm.includes(500), "her welcome tells their Dispensary who the farm is: her, the proprietors, the staff (not the stock)");
  ok(wel && wel.stock === true, "...and that they're on her books (so the proprietors hold their hardcore key)");

  // ---- a Denial Serum needle on somebody with a Dispensary
  n=sent.length; const before=Date.now();
  W.__applyShot(600,221397,'Denial Serum'); await wait(500);
  ok(prod(600).deniedUntil>before+110*60000, "she still keeps the books: two hours denied");
  const call=msgsTo(600,'dose',n).pop();
  ok(call && call.dose==='denial' && call.mins===120 && call.hand===true && /Hana/.test(call.line||''), "...and calls their Dispensary: the dose, how long, a needle in the hand, and her line with their name in it");
  ok(!/slides the needle into Hana/.test(roomText(n)), "...without narratin' it herself (only the private \"your shot took\" notes)");
  // it didn't take on their side (LSCG has it switched off): she takes her side back off
  await hid(600,'doseDone',{id:call.id,dose:'denial',ok:false,why:'lscg-off'});
  ok(!(prod(600).deniedUntil>Date.now()), "it didn't take on their side: she takes her side back off");
  // it took: stays
  n=sent.length; W.__applyShot(600,221397,'Denial Serum'); await wait(500);
  const c2=msgsTo(600,'dose',n).pop(); await hid(600,'doseDone',{id:c2.id,dose:'denial',ok:true});
  ok(prod(600).deniedUntil>Date.now()+110*60000, "it took: the books stay as they are");

  // ---- the sedative: her slow walk steps aside (their Dispensary slows them itself)
  const s0=W.__slow(600);
  n=sent.length; W.__applyShot(600,221397,'Sedative'); await wait(500);
  ok(prod(600).boosts.sedate>Date.now() && msgsTo(600,'dose',n).some(d=>d.dose==='sedative'), "a sedative: booked, and called");
  ok(W.__slow(600)===s0, "...and she doesn't slow them too (the Dispensary does it, so not twice)");
  // somebody without a Dispensary: everything as before
  n=sent.length; const m0=W.__slow(500);
  W.__applyShot(500,221397,'Sedative'); await wait(500);
  ok(msgsTo(500,'dose',n).length===0 && W.__slow(500)>=m0+0.7 && /slides the needle into Moo/.test(roomText(n)), "without a Dispensary: she does it all herself, line and slow walk, as ever");

  // ---- their ladder leaves the farm out, or they've switched a dose off
  await hid(600,'dispHello',{ver:'0.1.0',farm:false,lscg:false,off:[]});
  prod(600).deniedUntil=0; n=sent.length;
  W.__applyShot(600,221397,'Denial Serum'); await wait(500);
  ok(!(prod(600).deniedUntil>Date.now()) && msgsTo(600,'dose',n).length===0, "the farm off their list: no denial, no call");
  ok(/doesn't take doses from the farm/.test(roomText(n)+' '+JSON.stringify(sent.slice(n))), "...and she says why, like a limit");
  await hid(600,'dispHello',{ver:'0.1.0',farm:true,lscg:false,off:['denial']});
  n=sent.length; W.__applyShot(600,221397,'Denial Serum'); await wait(500);
  ok(!(prod(600).deniedUntil>Date.now()) && /switched it off in their Dispensary/.test(JSON.stringify(sent.slice(n))), "a dose they've switched off: no denial, and she says so");
  await hid(600,'dispHello',{ver:'0.1.0',farm:true,lscg:false,off:[]});

  // ---- safewords, both ways
  W.__applyShot(600,221397,'Denial Serum'); await wait(300);
  await hid(600,'dispSafeword',{});
  ok(!(prod(600).deniedUntil>Date.now()) && !(prod(600).boosts.sedate>Date.now()), "their Dispensary's safeword: the farm's side of the doses goes too");
  W.__applyShot(600,221397,'Denial Serum'); await wait(300);
  n=sent.length; await say(600,'?safeword',1200);
  ok(msgsTo(600,'dispClear',n).length===1 && !(prod(600).deniedUntil>Date.now()), "her ?safeword: their Dispensary's doses lifted, and her side of them");

  // ---- hardcore (they switched it on, for themselves): her ?safeword fetches help, and their doses stay
  await hid(600,'dispHello',{ver:'0.1.1',farm:true,lscg:false,off:[],hard:true});
  W.__applyShot(600,221397,'Denial Serum'); await wait(300);
  n=sent.length; await say(600,'?safeword',1200);
  ok(msgsTo(600,'dispClear',n).length===1 && prod(600).deniedUntil>Date.now(), "in hardcore: her ?safeword still reaches their Dispensary, but the denial stays till a keyholder lets them out");
  ok(/hardcore/.test(JSON.stringify(sent.slice(n))) && /PAUSE CALLED/.test(JSON.stringify(sent.slice(n))), "...she says so, and still calls the pause and fetches help");


  // ---- hardcore on her side: their switches stay put, keyholders set them, limits frozen for everybody
  const R0=()=>W.FarmhandLedger().people[600];
  await hid(600,'dispHello',{ver:'0.1.2',farm:true,lscg:false,off:[],hard:true,due:Date.now()+30*86400000,keys:[221397,650]});
  ok(R0().dispHard && R0().dispHard.on && R0().dispHard.keys.includes(650), "their hardcore goes on their record, with who holds the key");
  const b0=!!R0().breedable;
  n=sent.length; await say(600,'?breedable '+(b0?'off':'on'),900);
  ok(!!R0().breedable===b0 && /You're in hardcore/.test(JSON.stringify(sent.slice(n))), "in hardcore their own ?breedable won't flip, and she says why");
  n=sent.length; await say(600,'?breedable',900);
  ok(!/You're in hardcore/.test(JSON.stringify(sent.slice(n))), "...askin' what it's set to still works");
  n=sent.length; await say(650,'?ward Hana breedable '+(b0?'off':'on'),1200);
  ok(!!R0().breedable===!b0 && /Done: Hana's breedable/.test(JSON.stringify(sent.slice(n))), "a keyholder sets it for them with ?ward");
  ok(/your keyholder. set your breedable/.test(JSON.stringify(sent.slice(n))), "...and they're told who set what");
  n=sent.length; await say(500,'?ward Hana breedable '+(b0?'on':'off'),1200);
  ok(!!R0().breedable===!b0 && /don't hold Hana's key/.test(JSON.stringify(sent.slice(n))), "somebody who doesn't hold the key can't");
  const lim0=R0().limits||'';
  n=sent.length; await say(221397,'?edit 600 limits no needles at all',1200);
  ok((R0().limits||'')===lim0 && /limits are frozen/.test(JSON.stringify(sent.slice(n))), "their limits are frozen: not even a proprietor changes them");
  n=sent.length; await say(600,'?safeword',1200);
  ok(/PAUSE CALLED/.test(JSON.stringify(sent.slice(n))), "the safeword's never frozen: the pause and the help still come");
  R0().dispHard.due=Date.now()-1;
  n=sent.length; await say(600,'?breedable '+(b0?'on':'off'),900);
  ok(!!R0().breedable===b0, "past its date (their Dispensary gone quiet), it lets go by itself: their switch is theirs again");
  await hid(600,'dispHello',{ver:'0.1.2',farm:true,lscg:false,off:[],hard:false});
  ok(!R0().dispHard, "their Dispensary says hardcore's off: it comes off their record");

  out(fails?'FAILURES: '+fails:'all good'); process.exit(fails?1:0);
})();
