// SEED AND THE BREEDER'S SEAL, THE FARM GIRL'S SIDE (Nov 19; Laynie: "Definitely the insemination and breeders seal,
// and I would love if the crafter can specify how much it deposits in which every hole, nipples, ass, pussy, or mouth
// in ml, l, or gallons"). A player's Dispensary hands her every load (dispSeed); she books each as its crafter's, it can
// catch with them as sire, and a Breeder's Seal keeps its hole's load in, opens only for its maker, and lets only its
// maker's loads catch.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,milkable:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],gender:"female"},
 "500":S(500,"Moo"), "600":S(600,"Hana",{freeuse:true}), "610":S(610,"Bo",{gender:"male",species:"bull"}), "620":S(620,"Pip",{breedable:false})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(610,17,10),at(620,18,10)];
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
const seal=(group,by,name)=>({Asset:{Name:'BlackButtPlug',Group:{Name:group},Description:'Plug'},Craft:{Name:name||"Breeder's Seal",Description:'',MemberNumber:by,MemberName:'Bo'},Property:{}});
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ['Laynie','Moo','Hana','Bo','Pip'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [221397,500,600,610,620]) await say(mn,'?stats',500);
  const p=prod(600), cap=W.__capacity(600);

  // ---- the rules are shared: the gap and the seal's words
  const SD=await import(require('url').pathToFileURL(path.join(__dirname,'../shared/seed.js')).href);
  ok(SD.SEED_GAP_MS===600000 && SD.SEED_HALF_LIFE_H.vulva===cfg.PROD.HALF_LIFE_H.vulva && SD.SEED_HALF_LIFE_H.butt===cfg.PROD.HALF_LIFE_H.butt && SD.SEED_HALF_LIFE_H.mouth===cfg.PROD.HALF_LIFE_H.mouth && SD.BASE_CAP===cfg.PROD.BASE_CAPACITY && SD.GAPE_LEAK_X===cfg.GAPE_LEAK_X,
    "shared/seed.js drains a load the way the farm does (its half-lives, its looseness, a belly's 200 mL)");

  // ---- hello: her numbers for what's in them
  let n=sent.length;
  await hid(600,'dispHello',{ver:'0.22.0',farm:true,lscg:false,off:[],holes:1,seed:1});
  const wel=msgsTo(600,'dispWelcome',n).pop();
  ok(wel && wel.seed && wel.seed.cap===Math.round(cap) && wel.seed.held && wel.seed.held.vulva===0, "her welcome carries what's in them and how much they hold ("+JSON.stringify(wel&&wel.seed)+")");
  n=sent.length; await hid(500,'dispHello',{ver:'0.21.0',farm:true,lscg:false,off:[],holes:1});
  ok(!msgsTo(500,'dispWelcome',n).pop().seed, "an older Dispensary (no seed in its hello): none sent");

  // ---- a load that landed here: in it goes, as Bo's
  n=sent.length;
  await hid(600,'dispSeed',{ep:'seedbook',id:1,loads:[{h:'vulva',ml:120,by:610,at:Date.now(),here:1,nm:'Bo'}],held:{vulva:120}});
  ok(Math.round(p.held.vulva)===120 && p.lastStud===610 && p.totals.by['610'] && p.totals.by['610'].n===1, "a load from their Dispensary: 120 mL of Bo's in her pussy, on the books as his ("+Math.round(p.held.vulva)+")");
  const ok1=msgsTo(600,'dispSeedOk',n).pop();
  ok(ok1 && ok1.id===1 && ok1.seed && ok1.seed.held.vulva===120 && ok1.seed.by===610, "...she says she has it, with her numbers back");
  const loads1=p.totals.loads;
  n=sent.length; await hid(600,'dispSeed',{ep:'seedbook',id:1,loads:[{h:'vulva',ml:120,by:610,at:Date.now(),here:1}],held:{vulva:240}});
  ok(Math.round(p.held.vulva)===120 && p.totals.loads===loads1 && msgsTo(600,'dispSeedOk',n).length===1, "the same batch again (her answer got lost): not counted twice, and answered again");
  // more than she holds spills; a second of Bo's inside ten minutes fills her but doesn't count again
  await hid(600,'dispSeed',{ep:'seedbook',id:2,loads:[{h:'butt',ml:5000,by:610,at:Date.now(),here:1}],held:{}});
  ok(Math.round(W.__capacity(600))===Math.round(cap) && Math.round(p.held.vulva+p.held.butt+p.held.mouth)<=Math.round(cap)+1 && p.totals.loads===loads1, "a gallon and more, unsealed: she keeps what fits ("+Math.round(p.held.butt)+" in her ass), the rest spills, and Bo's second inside ten minutes isn't another load on the books");
  // the tits: her own count, and it comes out with the milk
  const nl=p.totals.nipLoads||0;
  await hid(600,'dispSeed',{ep:'seedbook',id:3,loads:[{h:'nips',ml:200,by:221397,at:Date.now(),here:1}],held:{}});
  ok(p.totals.nipLoads===nl+1 && p.nipCream && p.nipCream.by===221397 && p.totals.nipMl>=200, "a load in her tits: counted, and it'll come out with her milk");
  // not breedable: nothin' booked
  n=sent.length; await hid(620,'dispSeed',{ep:'pipbook',id:1,loads:[{h:'vulva',ml:100,by:610,at:Date.now(),here:1}],held:{vulva:100}});
  const nb=msgsTo(620,'dispSeedOk',n).pop();
  ok(nb && nb.none==='breedable' && !(prod(620).held.vulva>0), "somebody not breedable on her books: nothin' booked, and their Dispensary's told why");

  // ---- the Breeder's Seal
  p.held.vulva=50; p.held.butt=0; p.held.mouth=0;
  chars[3].Appearance=[seal('ItemVulva',610)];
  const ss=W.__sealsFor(600);
  ok(ss.length===1 && ss[0].by===610 && ss[0].holes.join()==='vulva', "a Breeder's Seal in her pussy, Bo's, is seen ("+JSON.stringify(ss)+")");
  p.boosts=p.boosts||{}; p.boosts.ripe=Date.now()+3600000; p.preg=null;
  ok(W.__conceive(600,500,100,1,'vulva')===null && !p.preg, "while it's in, somebody else's load can't catch, even ripe");
  n=sent.length;
  await hid(600,'dispSeed',{ep:'seedbook',id:4,loads:[{h:'vulva',ml:300,by:221397,at:Date.now(),here:1}],held:{}});
  ok(Math.round(p.held.vulva)===50 && !p.preg, "...and somebody else's seed doesn't get past it");
  W.__st().seedGap && W.__st().seedGap.delete('600:610');
  await hid(600,'dispSeed',{ep:'seedbook',id:5,loads:[{h:'vulva',ml:3000,by:610,at:Date.now(),here:1}],held:{}});
  ok(Math.round(p.held.vulva)===3050, "its maker's opens it, and every drop stays: 3 L in a belly that holds "+Math.round(cap)+" ("+Math.round(p.held.vulva)+")");
  ok(p.preg && p.preg.sires[0]===610 && /It took!.*Bo's young/.test(roomText(n)), "...and Bo's catches: she's carryin' his ("+(p.preg&&p.preg.sires)+")");
  // it holds through the farm's drainin'
  p.last=Date.now()-6*3600000; W.__pt();
  ok(p.held.vulva>3000, "six hours on, sealed: not a drop's gone ("+Math.round(p.held.vulva)+")");
  // out it comes: most of it gushes out (her Dispensary says so, so the farm girl keeps quiet)
  chars[3].Appearance=[]; n=sent.length;
  W.__sealWatch(600);
  ok(Math.round(p.held.vulva)===Math.round(3050*0.4) || (p.held.vulva<1300 && p.held.vulva>1100), "the seal comes out: most of it gushes out ("+Math.round(p.held.vulva)+" left)");
  ok(!/seal, and/.test(roomText(n)), "...her Dispensary says that line, not the farm girl");

  // ---- a cock: Bo's seal opens for Bo alone, and keeps every drop of his
  p.held.vulva=0; p.preg=null; delete p.boosts.ripe;
  chars[3].Appearance=[seal('ItemVulva',610)]; W.__sealsFor(600);
  const sp=prod(610); sp.semen=60; sp.deniedUntil=0; sp.fills=[];
  n=sent.length; await say(610,'?cum Hana pussy',1500);
  ok(p.held.vulva>0 && /opens for Bo alone/.test(roomText(n)), "Bo cums in her, right through his own seal ("+Math.round(p.held.vulva)+" mL; "+roomText(n).slice(0,160)+")");
  const pm=prod(500); pm.semen=60;
  W.__st().breedOk && W.__st().breedOk.set('600:221397', Date.now()+3600000);
  const pl=prod(221397); W.__rec && 0;
  n=sent.length; await say(221397,'?cum Hana pussy',1500);
  ok(!/221397|Laynie empties/.test(roomText(n)) || /blocked by Breeder's Seal/.test(sent.slice(n).map(s=>JSON.stringify(s[1])).join(' ')), "...but it's shut to anybody else");
  chars[3].Appearance=[];

  // ---- loads from elsewhere: her Dispensary's numbers for what's left, and they can catch late
  W.__sealsFor(600); p.held.vulva=0; p.preg=null; p.boosts.ripe=Date.now()+3600000;
  W.__st().seedGap && W.__st().seedGap.delete('600:221397');
  n=sent.length;
  await hid(600,'dispSeed',{ep:'seedbook',id:6,loads:[{h:'vulva',ml:800,by:221397,at:Date.now()-5*3600000}],held:{vulva:180,butt:0,mouth:0}});
  ok(Math.round(p.held.vulva)===180, "a load from off the farm, five hours back: she takes their Dispensary's count of what's left (180 mL)");
  ok(p.preg && p.preg.sires[0]===221397, "...and what's left can still catch, with its crafter as sire");
  ok(/Somethin' took/.test(roomText(n)) || /Somethin' took/.test(sent.slice(n).map(s=>JSON.stringify(s[1])).join(' ')), "...told as somethin' that took from earlier");
  // a load marked "somebody else's seal was in" can't catch
  p.preg=null; W.__st().seedGap && W.__st().seedGap.delete('600:500');
  await hid(600,'dispSeed',{ep:'seedbook',id:7,loads:[{h:'vulva',ml:400,by:500,at:Date.now(),here:1,nc:1}],held:{}});
  ok(!p.preg, "a load that landed past somebody else's seal can't catch");
  // a fresh Dispensary (new books) starts its numbers again
  p.held.vulva=0; p.held.butt=0; p.held.mouth=0;
  await hid(600,'dispSeed',{ep:'freshbk1',id:1,loads:[{h:'mouth',ml:60,by:610,at:Date.now(),here:1}],held:{}});
  ok(p.held.mouth>=59, "a fresh Dispensary's first batch is counted ("+Math.round(p.held.mouth)+")");

  out(fails ? fails+' FAILED' : 'all passed'); if (warns.some(w=>/seed:|seal:/.test(w))) out('warns: '+warns.filter(w=>/seed:|seal:/.test(w)).join(' / '));
  process.exit(fails?1:0);
})();
