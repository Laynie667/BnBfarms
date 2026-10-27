// Oct 27 (Laynie: "I tlove the features ideas, minus the daily report"), from the ideas doc: herd leader reins, ?away hold,
// welcome home, and contract renewal. The bot first, then the Companion keepin' a pet at heel on its own screen.
const fs=require('fs'), path=require('path');
const CUR=JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'),'utf8')).versions.companion;   // (the current Companion: no update notice mid-test)
const store={}; const sent=[]; const handlers={};
const herd=[{leader:900,type:"perm",since:1,ends:null,warned:false}];
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo",{herds:herd}), "600":S(600,"Rex",{gender:"male",species:"dog",herds:herd}), "700":S(700,"Pip",{gender:"femboy",species:"bunny",herds:herd}), "800":S(800,"Fu",{gender:"futa",species:"pony",futa:true}),
 "900":{mn:900,name:"Hank",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(800,31,30),at(900,20,20)];
const pip=at(700,30,30);
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, ChatRoomMapViewIsWall:()=>false, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true;
eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1200); };
const all=n=>sent.slice(n).filter(([e,d])=>d&&(typeof d.Content==='string'||e==='AccountBeep')).map(([e,d])=>d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message)).join(' | ');
const tps=(n,mn)=>sent.slice(n).filter(([e,d])=>e==='ChatRoomChat'&&d.Content==='ChatRoomMapViewTeleport'&&d.Target===mn).map(([,d])=>d.Dictionary[0].Position);
const pos=(mn)=>chars.concat([pip]).find(c=>c.MemberNumber===mn).MapData.Pos;
const LEAK=/%[a-z]\b|\bundefined\b|\bNaN\b|\[object/;
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2; cfg.REINS_HOP_MS=0;
  ['Laynie','Moo','Rex','Fu','Hank'].forEach((nm,i)=>chars[i+1].Name=nm); pip.Name='Pip';
  // Moo, Hank and Laynie have the Companion; Rex hasn't
  for (const mn of [500,900,221397,260239]) handlers.ChatRoomMessage({Sender:mn,Type:"Hidden",Content:"FarmhandMsg",Dictionary:{v:2,type:"hello",ver:CUR}});
  await wait(600);

  // ── the reins ──
  { let n=sent.length; await say(900,'?reins Fu',900); ok(/only take up the reins of your own herd/.test(all(n)), 'only a pet in your own herd');
    n=sent.length; await say(900,'?reins Moo 30',1200);
    ok(P(500).reins && P(500).reins.by===900 && P(500).reins.until-Date.now()>29*60000, '?reins Moo 30: on Hank\'s reins for half an hour');
    ok(/🐴 Hank (clips|gathers|takes|snaps|loops)/.test(all(n)) && /You're on Hank's reins for 30 minutes/.test(all(n)), 'the room sees it, and Moo is told ('+all(n).slice(0,220)+')');
    const s=W.__stateFor(500); ok(s.reins && s.reins.mn===900 && !s.reins.hold, 'Moo\'s Companion is told whose reins, to walk them');
    ok((s.now||[]).some(x=>x.icon==='🐴'&&/On Hank's reins/.test(x.text)), '...and a 🐴 chip for right now');
    ok((W.__stateFor(900).reinsMine||[]).some(x=>x.mn===500), 'Hank\'s Companion gets a Let go card');
    n=sent.length; W.__reinsTick(); await wait(300); ok(!tps(n,500).length, 'a pet with the Companion is walked by it, not hopped by me');
    n=sent.length; await say(221397,'?walk Moo',900); ok(/on Hank's reins right now/.test(all(n)), 'nobody clips the old ?walk lead on a pet on the reins');
    n=sent.length; await say(800,'?reins off Moo',900); ok(P(500).reins, 'Fu can\'t let go of somebody else\'s reins'); }
  // no Companion: hopped along a step behind
  { let n=sent.length; await say(900,'?reins Rex',1200);
    const t0=tps(n,600); ok(t0.length && Math.max(Math.abs(t0[0].X-20),Math.abs(t0[0].Y-20))<=1, 'no Companion: Rex is brought to heel at once ('+JSON.stringify(t0)+')');
    pos(600).X=t0[0].X; pos(600).Y=t0[0].Y;
    pos(900).X=24; pos(900).Y=20; W.__reinsTick(); pos(900).X=25; n=sent.length; W.__reinsTick(); await wait(300);
    const t1=tps(n,600); ok(t1.length && t1[t1.length-1].X===24 && t1[t1.length-1].Y===20, 'Hank walks east: Rex lands a step behind him, on the side he came from ('+JSON.stringify(t1)+')');
    pos(600).X=24; pos(600).Y=20; n=sent.length; W.__reinsTick(); await wait(300); ok(!tps(n,600).length, 'at heel: left be');
    // somethin' else has hold of them: the reins wait
    P(600).stocked={until:Date.now()+60000,by:900}; pos(900).X=30; n=sent.length; W.__reinsTick(); await wait(300);
    ok(W.__reinsHeld(600) && !tps(n,600).length, 'in the stocks: not hopped away from them');
    P(600).stocked=null; n=sent.length; W.__reinsTick(); await wait(300); ok(tps(n,600).length===1, 'let out: back to heel');
    P(500).penned={until:Date.now()+60000,X:15,Y:10,name:'a pen',by:900}; W.__reinsTick(); await wait(400);
    ok(W.__stateFor(500).reins.hold===true, 'Moo penned: her Companion is told to wait');
    P(500).penned=null; W.__reinsTick(); await wait(400); ok(!W.__stateFor(500).reins.hold, '...and to walk again after');
    n=sent.length; await say(900,'?reins',900); ok(/On your reins: (Moo|Rex).*(Moo|Rex)/.test(all(n)), '?reins: who\'s on yours'); }
  // lettin' go
  { let n=sent.length; await say(500,'?safeword',1500);
    ok(!P(500).reins && /Moo called their safeword, so the reins are off/.test(all(n)), 'Moo\'s safeword lets go, and Hank is told');
    n=sent.length; await say(900,'?reins off',1200);
    ok(!P(600).reins && /Let go of Rex/.test(all(n)) && /(unclips|drops|coils)/.test(all(n)), '?reins off lets go of the rest, out loud');
    await say(900,'?reins Rex 5',900); P(600).reins.until=Date.now()-1; n=sent.length; W.__reinsTick(); await wait(500);
    ok(!P(600).reins && /Time's up/.test(all(n)), 'the time runs out: off the reins');
    await say(900,'?reins Rex',900); const hank=chars.findIndex(c=>c.MemberNumber===900), H=chars.splice(hank,1)[0];
    n=sent.length; W.__reinsTick(); await wait(500); ok(!P(600).reins && /Hank left the farm/.test(all(n)), 'Hank leaves: Rex is let go'); chars.push(H);
    await say(900,'?reins Rex 45',900); const rx=chars.findIndex(c=>c.MemberNumber===600), RX=chars.splice(rx,1)[0];   // (not the same words again so soon: I'd take that for a double send)
    n=sent.length; W.__reinsTick(); await wait(500); ok(!P(600).reins && /Rex left the room, so the reins came off/.test(all(n)), 'Rex leaves: the reins come off'); chars.push(RX);
    ok(!LEAK.test(all(0)), 'no stray placeholders in anything said'); }

  // ── ?away hold, and welcome home ──
  { W.__awayTick(); W.__awayAdd(5); W.__awayTick(60000);
    ok(Math.round(W.__awayDays(700))===5, 'Pip\'s been away five days ('+W.__awayDays(700)+')');
    ok(W.__holdLength('2w')===14*86400000 && W.__holdLength('12h')===12*3600000 && W.__holdLength('30')===30*86400000 && W.__holdLength('1m')===30*86400000 && !W.__holdLength('soon'), 'hold lengths read 2w, 12h, 30, 1m');
    let n=sent.length; await say(500,'?away hold Pip 30d',900); ok(!P(700).awayHold, 'only staff hold somebody\'s place');
    n=sent.length; await say(900,'?away hold Hank 30d',900); ok(/doesn't need one, sugar: the two weeks are only for livestock and guests/.test(all(n)), 'staff never need one');
    W.__st().mutual={ at:Date.now()+3600000, set:new Set([700,800]) };   // (Pip and Fu are friends online: my beeps reach them)
    n=sent.length; await say(900,'?away hold Pip 30d exams',1200);
    ok(P(700).awayHold && Math.round(P(700).awayHold.days)===5 && /on hold till/.test(all(n)), '?away hold Pip 30d exams: paused at five days');
    ok(/Your place on the farm is on hold till .*\(exams\).*carries on from where it stopped \(5 of 14 days\)/.test(all(n)), 'Pip is told, with why ('+all(n).slice(-300)+')');
    W.__awayAdd(20); W.__awayTick(60000); ok(Math.round(W.__awayDays(700))===5 && !P(700).awayWarned && P(L().people[700]?700:0), 'twenty days on hold: still five, no note, still on the books');
    n=sent.length; await say(900,'?away',900); ok(/ON HOLD/.test(all(n)) && /Pip · till .* · exams · 5 days used/.test(all(n)), '?away lists who\'s on hold');
    P(700).awayHold.until=Date.now()-1; n=sent.length; W.__awayTick(60000); await wait(400);
    ok(!P(700).awayHold && Math.round(W.__awayDays(700))===5 && /hold on the farm's run out.*\(5 of 14 days\)/.test(all(n)), 'the hold runs out: the clock carries on from five, and Pip hears');
    W.__awayAdd(7.5); n=sent.length; W.__awayTick(60000); await wait(400);
    ok(P(700).awayWarned && /We haven't seen you on the farm in 12 days/.test(all(n)) && /Ask staff to put your place on hold/.test(all(n)), 'twelve days: the note, and it says a hold\'s there for the askin\'');
    chars.push(pip); n=sent.length; W.__awayTick(60000); await wait(6500);
    ok(!P(700).awayWarned && /Pip/.test(all(n)) && /(home|back)/i.test(all(n)) && /place .*kept|kept your place/.test(all(n)), 'Pip walks back in: welcomed home by name, place kept ('+all(n).slice(0,240)+')');
    ok(/Pip is back on the farm after 12 days away/.test(all(n)), '...and Hank, their herd leader, hears');
    n=sent.length; W.__awayTick(60000); await wait(5500); ok(!/back on the farm/.test(all(n)), '...once');
    // came by while on hold: nothin' carries over
    await say(900,'?away hold Pip 2w',900); W.__awayTick(60000); ok(P(700).awayHold.days===0, 'here while on hold: the days held are nought');
    n=sent.length; await say(900,'?away hold Pip off',900); ok(!P(700).awayHold && /hold is off/.test(all(n)), '?away hold Pip off ends it'); }

  // ── another contract? ──
  { const now=Date.now(), C=(mn,key,min,untilH,extra)=>Object.assign({key,mn,by:221397,tpl:'deep',title:'B&B Farm · Deep',depth:'deep',durationMin:min,policy:'farm',rules:[],status:'signed',at:now-1e6,signedAt:now-1e6,until:now+untilH*3600000},extra||{});
    L().contracts=[C(500,'a',10080,30), C(600,'b',720,2), C(800,'c',1440,10)];
    let n=sent.length; W.__contractTick(); await wait(600);
    ok(!L().contracts[0].renewAt, 'a week-long one with 30 hours left: not asked yet');
    ok(L().contracts[1].renewAt && /Would you like another one, the same again\?/.test(all(n)) && /\?renew yes/.test(all(n)), 'Rex\'s 12-hour one with 2 left: asked (no Companion: told how to answer)');
    ok(/Rex's farm contract .* ends in about 2 hours\. I've asked them/.test(all(n)), '...and Hank, their herd leader, is told');
    ok(!L().contracts[2].renewAt, 'Fu\'s day-long one with 10 hours left: not yet (three hours before, for short ones)');
    L().contracts[0].until=now+20*3600000; n=sent.length; W.__contractTick(); await wait(600);
    ok(L().contracts[0].renewAt && /"type":"ask"/.test(all(n)) && /Would you like another one/.test(all(n)), 'Moo\'s week-long one with 20 hours left: a yes/no card in her Companion');
    n=sent.length; W.__contractTick(); await wait(400); ok(!/Would you like another/.test(all(n)), '...asked once');
    n=sent.length; await say(500,'?yes',1200);
    ok(L().contracts[0].renewSaid==='yes' && /told staff and your herd leader/.test(all(n)) && /would like their farm contract again/.test(all(n)), 'Moo says yes: she\'s told, staff hear');
    const rn=W.__stateFor(221397).renewals; ok(rn && rn[0].mn===500 && rn[0].said==='yes' && rn[0].here, 'the Staff panel has her at the top of Renewals, ready to offer');
    ok(!W.__stateFor(500).renewals, '...and only staff see that list');
    n=sent.length; await say(900,'?renew offer Moo',900); ok(/for herdmasters and the proprietors/.test(all(n)), 'a farmhand can\'t offer one');
    n=sent.length; await say(221397,'?renew offer Moo',1500);
    const nx=L().contracts.filter(x=>x.mn===500&&x.status==='offered');
    ok(nx.length===1 && nx[0].durationMin===10080 && nx[0].tpl==='deep' && L().contracts[0].renewOffered, '?renew offer Moo: the same contract, the same length, offered again ('+all(n).slice(0,200)+')');
    n=sent.length; await say(600,'?renew no',1200); ok(L().contracts[1].renewSaid==='no' && /No more after this one/.test(all(n)) && /Rex said no to another/.test(all(n)), 'Rex says no: Hank hears');
    n=sent.length; await say(600,'?renew yes',1200); ok(L().contracts[1].renewSaid==='yes', '...and can change his mind');
    // Fu isn't here when it's time: a beep, then asked in person when she comes by
    const fu=chars.findIndex(c=>c.MemberNumber===800), FU=chars.splice(fu,1)[0];
    L().contracts[2].until=now+2*3600000; n=sent.length; W.__contractTick(); await wait(600);
    ok(L().contracts[2].renewAt && !L().contracts[2].renewAskedHere && sent.slice(n).some(([e,d])=>e==='AccountBeep'&&d.MemberNumber===800&&/next time you're on the farm/.test(d.Message)), 'Fu\'s away: beeped the question');
    chars.push(FU); n=sent.length; W.__contractTick(); await wait(600); ok(L().contracts[2].renewAskedHere, '...and asked again when she comes by');
    n=sent.length; await say(221397,'?renew',900); ok(/CONTRACT RENEWALS/.test(all(n)) && /Rex · .*SAID YES/.test(all(n)) && /Fu · .*asked, no answer yet/.test(all(n)), '?renew lists them for staff');
    n=sent.length; await say(800,'?renew',900); ok(/Your farm contract "B&B Farm · Deep" [(\[]1 day[)\]] ends in about 2 hours/.test(all(n)), '?renew for a pet: their own ('+all(n).slice(0,200)+')');
    ok(!LEAK.test(all(0)), 'no stray placeholders anywhere'); }
  ok(!warns.some(w=>/reins|renew|away/i.test(w)), 'no errors ('+warns.filter(w=>/reins|renew|away/i.test(w)).slice(0,3).join(' / ')+')');

  // ── the Companion: at heel on its own screen ──
  { const { JSDOM } = require("jsdom");
    const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { runScripts: "outside-only", url: "https://bondageprojects.elementfx.com/" });
    const w = dom.window, csent=[];
    w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.CurrentScreen = "ChatRoom";
    const leader={ MemberNumber: 900, MapData:{ Pos:{ X: 5, Y: 5 } } };
    w.ChatRoomCharacter = [{ MemberNumber: 500 }, { MemberNumber: 260239 }, leader];
    w.ServerSend = (ev, d) => csent.push([ev, d]); w.ChatRoomMessage = () => {}; w.CommandCombine = () => {};
    w.eval(fs.readFileSync(path.join(__dirname, "../dist/farmhand-companion.user.js"), "utf8"));
    await wait(4500);
    w.Player = Object.assign(w.Player || {}, { MemberNumber: 500, MapData: { Pos: { X: 1, Y: 1 } } });
    w.ChatRoomMapViewWidth = 12; w.ChatRoomMapViewHeight = 12; w.ChatRoomMapViewIsActive = () => true; w.ChatRoomMapViewMovement = null;
    const occupied = (x, y) => leader.MapData.Pos.X === x && leader.MapData.Pos.Y === y;
    w.ChatRoomMapViewCanEnterTile = (x, y) => (x < 0 || y < 0 || x > 11 || y > 11 || occupied(x, y)) ? 0 : 1;
    const steps=[]; w.ChatRoomMapViewMove = (d) => { const p = w.Player.MapData.Pos; steps.push(d); w.Player.MapData.Pos = { X: p.X + (d === "East" ? 1 : d === "West" ? -1 : 0), Y: p.Y + (d === "South" ? 1 : d === "North" ? -1 : 0) }; };
    w.ChatRoomSendLocal = () => {};
    const bot = (d) => w.ChatRoomMessage({ Sender: 260239, Type: "Hidden", Content: "FarmhandMsg", Dictionary: { v: 2, ...d } });
    const ST = { name: "Moo", onBooks: true, roles: ["LIVESTOCK"], species: "cow", gender: "female", reins: { mn: 900, name: "Hank", until: Date.now() + 3600000 } };
    bot({ type: "welcome", ver: "0.54.0", name: "Moo", proto: 2 }); bot({ type: "state", state: ST, seq: 1 });
    await wait(3500);
    const me=()=>w.Player.MapData.Pos, d=()=>Math.max(Math.abs(me().X-leader.MapData.Pos.X),Math.abs(me().Y-leader.MapData.Pos.Y));
    ok(d()<=1 && steps.length>0, 'the Companion walks Moo over to Hank, step by step ('+JSON.stringify(me())+', '+steps.length+' steps)');
    leader.MapData.Pos={X:6,Y:5}; await wait(1200); leader.MapData.Pos={X:7,Y:5}; await wait(1200); leader.MapData.Pos={X:8,Y:5}; await wait(2500);
    ok(me().X===7 && me().Y===5, 'Hank walks east: Moo follows a step behind him ('+JSON.stringify(me())+')');
    ok(!csent.some(([,x])=>x && x.Dictionary && (x.Dictionary.type==='leadOk'||x.Dictionary.type==='leadNo')), 'walkin\' at heel sends the farm nothin\'');
    bot({ type: "stateDiff", set: { reins: { mn: 900, name: "Hank", until: Date.now() + 3600000, hold: true } }, del: [], base: 1, seq: 2 });
    const n0=steps.length; leader.MapData.Pos={X:8,Y:10}; await wait(2000); ok(steps.length===n0, 'held by somethin\' else of the farm\'s: she stays put');
    bot({ type: "stateDiff", set: { reins: { mn: 900, name: "Hank", until: Date.now() + 3600000 } }, del: [], base: 2, seq: 3 }); await wait(3000);
    ok(d()<=1, '...and catches up after');
    bot({ type: "stateDiff", set: {}, del: ["reins"], base: 3, seq: 4 }); const n1=steps.length; leader.MapData.Pos={X:2,Y:10}; await wait(2000);
    ok(steps.length===n1, 'the reins come off: she stays where she is'); }
  out(fails ? '\n'+fails+' FAILED' : '\nALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e=>{ out('CRASH '+(e&&e.stack||e)); process.exit(1); });
