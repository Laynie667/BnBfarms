// Oct 27 (Laynie): "limit how much has to be sent via my connection". The bot side: a Companion's hello keeps the panel and
// the store it already holds, room lines for several people go as one message, an outdated Companion is told to update,
// the room whitelist stops re-askin' for one that never sticks, and the shrinking shots.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK","SUBJECT"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo"), "600":S(600,"Rex",{gender:"male",species:"dog"}), "700":S(700,"Pip",{gender:"female",species:"kitty"}), "800":{mn:800,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}, "900":S(900,"Nibs",{gender:"futa",species:"horse",futa:true})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
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
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'},Whitelist:[]}, ChatRoomCharacter:chars,
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
const hello=(mn,d)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:Object.assign({v:2,type:'hello'},d)});
const to=(mn,type,k)=>sent.slice(k).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Target===mn&&d.Dictionary&&d.Dictionary.type===type).map(([e,d])=>d.Dictionary);
const room=(type,k)=>sent.slice(k).filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&!d.Target&&d.Dictionary&&d.Dictionary.type===type).map(([e,d])=>d.Dictionary);
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.CHAIN_CHANCE=0;
  ['Laynie','Moo','Rex','Pip','Hank','Nibs'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700,900]) await say(mn,'?stats',700);
  handlers.AccountQueryResult({Query:"OnlineFriends",Result:[221397,500,600,700,800,900].map(m=>({MemberNumber:m,ChatRoomName:"B&B Farm"}))});

  // ── a hello keeps what the Companion already holds ──
  let n=sent.length; hello(500,{ver:'0.46.0',relay:false}); await wait(2500);
  const s1=to(500,'state',n), sh1=to(500,'store',n);
  ok(s1.length===1 && typeof s1[0].seq==='number' && sh1.length===1 && typeof sh1[0].h==='string' && to(500,'welcome',n).length===1, 'first hello: a welcome, a whole panel with its number, and the shelf with its fingerprint');
  const seq1=s1[0].seq, h1=sh1[0].h;
  n=sent.length; hello(500,{ver:'0.46.0',relay:false,seq:seq1,sh:h1,w:true}); await wait(2000);
  ok(!to(500,'state',n).length && !to(500,'stateDiff',n).length && !to(500,'store',n).length && !to(500,'welcome',n).length, 'the same Companion says hello again holdin\' that panel and shelf: nothin\' is sent again');
  P(500).ribbons=(P(500).ribbons||0)+3; n=sent.length; W.__sync(); await wait(800);
  const d1=to(500,'stateDiff',n);
  ok(d1.length===1 && d1[0].base===seq1 && d1[0].seq>seq1 && d1[0].set.ribbons===P(500).ribbons, 'a change after that is a patch onto that very panel (base '+(d1[0]&&d1[0].base)+')');
  n=sent.length; hello(500,{ver:'0.46.0',relay:false,seq:seq1,sh:h1,w:true}); await wait(2000);
  const s2=to(500,'state',n);
  ok(s2.length===1 && !to(500,'store',n).length, 'a hello holdin\' an older panel gets a whole new one, but not the shelf it already has');
  n=sent.length; hello(500,{ver:'0.46.0',relay:false,seq:0,sh:h1}); await wait(2000);
  ok(to(500,'state',n).length===1 && !to(500,'store',n).length && to(500,'welcome',n).length===1, 'after a reload (no panel, the shelf saved): a whole panel and a welcome, still no shelf');
  n=sent.length; hello(500,{ver:'0.46.0',relay:false,seq:to(500,'state',0).pop().seq,sh:'wrong',w:true,again:true}); await wait(2000);
  ok(to(500,'state',n).length===1 && to(500,'store',n).length===1, 'askin\' again (a patch that didn\'t fit) and a different shelf: both come whole');
  n=sent.length; hello(500,{ver:'0.45.0',relay:false}); await wait(2000);
  ok(to(500,'state',n).length===1, 'an older Companion with no number still gets its whole panel');

  // ── one shared message for several people's room lines ──
  hello(600,{ver:'0.46.0'}); hello(221397,{ver:'0.46.0'}); hello(500,{ver:'0.46.0',relay:false}); await wait(2500);
  n=sent.length; W.__emote("The farm girl scratches Moo behind the ears.", 500); await wait(600);
  const rl=room('roomlines',n);
  ok(rl.length===1 && [500,600,221397].every(m=>rl[0].to.includes(m)) && /scratches Moo/.test(rl[0].text) && !to(600,'roomline',n).length && !to(221397,'roomline',n).length, 'a line about Moo for three Companions near her goes once, to the room, namin\' them ('+(rl[0]?rl[0].to.join(','):'none')+')');
  hello(600,{ver:'0.45.0'}); await wait(1500);
  n=sent.length; W.__emote("The farm girl pats Moo's flank.", 500); await wait(600);
  ok(to(600,'roomline',n).length===1 && room('roomlines',n).length===1 && !room('roomlines',n)[0].to.includes(600), 'an older Companion still gets its own line; the rest share one');
  n=sent.length; W.__announce("Feedin' time on the farm!"); await wait(600);
  ok(room('roomlines',n).length===1 && to(700,'roomline',n).length===0 && sent.slice(n).some(([e,d])=>d&&d.Type==='Whisper'&&d.Target===700), 'an announcement: one shared message for the new Companions, a whisper for somebody with none');

  // ── an outdated Companion is told to update (Laynie, Oct 27) ──
  delete P(700).updateTold; n=sent.length; hello(700,{ver:'0.40.0'}); await wait(10500);
  const told=to(700,'notice',n).map(x=>x.text).join(' ');
  const CUR=JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).versions.companion;   // (whatever this release's Companion is)
  ok(/v0\.40\.0/.test(told) && told.includes(CUR+' is out') && /Check for userscript updates/.test(told), 'a Companion older than this release gets a notice to update ('+told.slice(0,90)+')');
  ok(sent.slice(n).some(([e,d])=>e==='AccountBeep'&&d.MemberNumber===700&&/is out/.test(d.Message)), '...and a real beep, since the bot can reach them');
  n=sent.length; hello(700,{ver:'0.40.0',again:true}); await wait(10500);
  ok(!to(700,'notice',n).some(x=>/is out/.test(x.text)), 'not again the same day');
  n=sent.length; hello(900,{ver:CUR}); await wait(10500);
  ok(!to(900,'notice',n).some(x=>/is out/.test(x.text)), 'an up-to-date Companion hears nothin\' about it');

  // ── the whitelist stops re-askin' for one that never sticks ──
  W.ChatRoomData.Whitelist=[221397,500,600,700,800]; P(900).roles=["LIVESTOCK"];
  const asks=k=>sent.slice(k).filter(([e,d])=>e==='ChatRoomAdmin'&&d.MemberNumber===900&&d.Action==='Whitelist').length;
  n=sent.length; if (W.__st().wlTries) W.__st().wlTries.delete(900); if (W.__st().wlSent) W.__st().wlSent.delete(900);
  for (let i=0;i<6;i++){ W.__wl(); const ws=W.__st().wlSent; if (ws && ws.get(900)) ws.get(900).at-=130000; await wait(50); }
  ok(asks(n)===3, 'somebody the room\'s whitelist never takes is asked for three times, then left an hour ('+asks(n)+' asks)');
  W.ChatRoomData.Whitelist.push(900); W.__wl(); ok(!W.__st().wlTries.has(900), '...and once it sticks, the count is forgotten');
  ok(W.__mutualEvery()===120000, 'nobody out roamin\': who\'s online is asked every two minutes, not every minute');

  // ── shrinkin' shots in the store (Laynie, Oct 27) ──
  const shelf=W.__stateFor(500).store||[];
  const ids=['shot-udder-down','shot-balls-down','shot-cock-down','shot-knot-down','shot-ass-down','shot-pussy-down','shot-throat-down','shot-shrink'];
  ok(ids.every(id=>shelf.some(it=>it.id===id && it.shelf==='shrink' && it.price>0)), 'the shelf has a shrinkin\' shot for every part that grows, on a shelf of their own');
  const pr=W.__prodOf(500); pr.size=pr.size||{}; pr.size.udder=6; pr.sizeBase=pr.sizeBase||{}; pr.sizeBase.udder=6; P(500).ribbons=50; P(500).milkable=true;
  n=sent.length; await say(500,'?buy shot-udder-down',1500);
  ok(W.__prodOf(500).size.udder===5 && P(500).ribbons===43, 'an udder shrinkin\' shot: a size smaller, for 7 ribbons ('+W.__prodOf(500).size.udder+', '+P(500).ribbons+' left)');
  W.__prodOf(500).size.udder=1; n=sent.length; await say(500,'?buy shot-udder-down',1500);
  ok(W.__prodOf(500).size.udder===1 && P(500).ribbons===43 && /can't go any smaller/.test(all(n)), 'already as small as it goes: no shot, no charge');
  W.__prodOf(500).capBonus=0; n=sent.length; await say(500,'?buy shot-shrink',1500);
  ok(P(500).ribbons===43 && /belly can't go any smaller/.test(all(n)), 'a belly shrinkin\' shot with nothin\' stretched yet: no charge');
  W.__prodOf(500).capBonus=1500; await say(500,'?buy shot-shrink',1500);
  ok(W.__prodOf(500).capBonus===1000 && P(500).ribbons===37, 'with a stretched belly it takes some of the stretch back ('+W.__prodOf(500).capBonus+')');
  const pn=W.__prodOf(900); pn.size=pn.size||{}; pn.size.penis=14; P(900).ribbons=20;
  n=sent.length; await say(900,'?buy shot-cock-down',1500);
  ok(W.__prodOf(900).size.penis===12 && P(900).ribbons===13, 'a cock shrinkin\' shot takes two inches off ('+W.__prodOf(900).size.penis+'")');
  P(500).ribbons=20; n=sent.length; await say(500,'?buy shot-balls-down',1500);
  ok(P(500).ribbons===20 && /nothin' to work on/.test(all(n)), 'a ball shrinkin\' shot on somebody with no balls: kept on the shelf, no charge');
  n=sent.length; await say(500,'?store',1500);
  ok(/SHRINKIN' SHOTS/.test(all(n)) && /An udder shrinkin' shot/.test(all(n)), '?store lists them under their own headin\'');

  out(fails ? fails+' FAILED' : 'ALL PASSED');
  const errs=warns.filter(w=>/TypeError|ReferenceError/.test(w) && !/Worker is not defined/.test(w)); if (errs.length) out('ERRORS: '+errs.slice(0,3).join(' | '));
  process.exit(fails || errs.length ? 1 : 0);
})();
