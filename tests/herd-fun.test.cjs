// The herd's own fun (Oct 10): play (rock-paper-scissors, a race, a romp), evenin' turn-out, callin' a stud, and
// mates for the day. All ask-first where another animal's involved.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,benchOn:true},
 "600":{mn:600,name:"Rex",roles:["LIVESTOCK"],species:"dog",gender:"male",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[],limits:""}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"bench":{X:15,Y:10}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,14,10)];
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
const to=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&((d.Type==='Whisper'&&d.Target===mn)||(e==='AccountBeep'&&d.MemberNumber===mn))).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||2200); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>String(d.Content||d.Message)).join(' | ');
const ADDON=(name)=>process.env['FH_'+name.toUpperCase().replace('-','_')]||path.join(__dirname,'../dist/farmhand-'+name+'.user.js');
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0;
  ['Laynie','Moo','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  L().spots.pasture={X:30,Y:30}; L().spots['trough-1']={X:25,Y:5};
  P(500).benchOn=false; P(500).breedable=true; P(500).fertile=true;
  eval(fs.readFileSync(ADDON('barn-life'),'utf8')); eval(fs.readFileSync(ADDON('breeding'),'utf8')); await wait(400);
  const moveTo=(mn,X,Y)=>{ chars.find(c=>c.MemberNumber===mn).MapData.Pos={X,Y}; };
  const rib=mn=>P(mn).ribbons||0;
  // ── play: rock, paper, scissors ──
  let n=sent.length; await say(600,'?play Moo rps');
  ok(/asked Moo/.test(to(600,n)) && /Rex wants to play with you/.test(to(500,n)), 'play asks the other animal first');
  n=sent.length; await say(500,'yes');
  ok(/Rock, paper, scissors with Rex/.test(to(500,n)) && /Rock, paper, scissors with Moo/.test(to(600,n)), 'on a yes, both are told how to throw');
  const r0=rib(600); n=sent.length; await say(600,'?rps rock'); await say(500,'?rps scissors',3000);
  ok(/Rex throws rock, Moo throws scissors. Rex wins!/.test(all(n)), 'rock beats scissors, and the room hears it');
  ok(rib(600)===r0+1, 'the first win of the day earns a ribbon');
  n=sent.length; await say(500,'?rps rock'); ok(/not in a game/.test(to(500,n)), 'no game, no throw');
  // ── a race ──
  n=sent.length; await say(600,'?play Moo race',3000);
  ok(/Game on/.test(to(600,n)) && /First to stand on/.test(to(500,n)), 'a second game needs no new yes: a race, to a named spot');
  const spot=(to(500,n).match(/stand on ([a-z0-9-]+) wins/)||[])[1], sp=L().spots[spot];
  moveTo(500,sp.X,sp.Y); n=sent.length; W.__addons('tick'); await wait(2500);
  ok(/Moo gets there first/.test(all(n)), 'first one onto the spot wins the race ('+spot+')');
  ok(rib(600)===r0+1, '...Rex gets no second ribbon today (and Moo gets her first)');
  // ── evenin' turn-out ──
  n=sent.length; await say(500,'?bell'); ok(/turn-out rings at 19:00/.test(to(500,n)), '?bell tells stock when it rings');
  n=sent.length; await say(221397,'?bell now',3000);
  ok(/turn-out|Turn-out/.test(to(500,n)) && /turn-out|Turn-out/.test(to(600,n)), 'the bell calls everybody on the books');
  moveTo(500,30,30); moveTo(600,31,30); const m0=rib(500), x0=rib(600);
  L().mods['barn-life'].herd.bell.until=Date.now()-1; n=sent.length; W.__addons('tick'); await wait(3500);
  ok(rib(500)===m0+1 && rib(600)===x0+1 && /Moo and Rex|Rex and Moo/.test(all(n)), 'ten minutes on, whoever came out shares the scene and gets a ribbon');
  ok(rib(221397)===0 || !P(221397).ribbons, '...nobody who stayed in is marked down or paid');
  // ── call a stud ──
  n=sent.length; await say(500,'?callstud'); ok(/not in heat/.test(to(500,n)), 'only somebody in heat can call a stud');
  P(500).prod.heat={until:Date.now()+3600000,by:0};
  n=sent.length; await say(500,'?callstud'); ok(/No stud on the farm is takin' calls/.test(to(500,n)), 'no studs signed up: she is told');
  await say(600,'?studcall on');
  n=sent.length; await say(500,'?callstud');
  ok(/Moo/.test(to(600,n)) && /heat|season/.test(to(600,n)) && /1 stud /.test(to(500,n)), 'a signed-up stud is told who and where');
  n=sent.length; await say(500,'?callstud'); ok(/called not long ago/.test(to(500,n)), 'one call every 20 minutes');
  // ── mates for the day ──
  n=sent.length; await say(600,'?mate Moo'); await say(500,'yes',4500);
  const pr=()=>L().mods['breeding'].pairs;
  ok(pr().mates['600']===500 && pr().mates['500']===600, 'mates for the day, once she says yes');
  const a0=rib(600), b0=rib(500); W.__addons('bred',600,500,'vulva',40,null); await wait(2500);
  ok(rib(600)===a0+1 && rib(500)===b0+1, 'breedin\' your mate pays you both a ribbon');
  W.__addons('bred',600,500,'vulva',40,null); await wait(2500);
  ok(rib(600)===a0+1 && rib(500)===b0+1, '...once a day');
  n=sent.length; await say(500,'?mate'); ok(/Your mate today is Rex/.test(to(500,n)), '?mate shows yours');
  await say(500,'?mate off'); ok(!pr().mates['600'] && !pr().mates['500'], '?mate off parts them');
  const errs=warns.filter(w=>/add-on/.test(w)); ok(!errs.length, 'no add-on errors '+errs.join(' | '));
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
