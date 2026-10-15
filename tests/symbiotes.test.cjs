// Symbiotes (Laynie, Oct 14: "symbiote versions of parasites, like living latex"): only for ?symbiote on, one at a time,
// they grow while fed and give somethin' back (latex: room to hold more, and it cleans; moss: more milk; the nestling:
// an easier catch), they get hungry and leave when starved, they leave a thank-you when their time's up, and the
// safeword takes one off at once.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const P=(mn,name,species,gender,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species,gender,onDuty:true,herds:[],tempKeys:[],cover:[],milkable:true,breedable:true,fertile:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "501":P(501,"Bessie","cow","female",{symbioteOn:true}), "502":P(502,"Brutus","cow","male",{symbioteOn:true,milkable:false}),
 "503":P(503,"Clover","pony","female"), "504":P(504,"Daisy","cow","female",{symbioteOn:true,limits:"no symbiotes"})
},applications:[],archive:{},log:[],stuckLog:[],spots:{"symbiote-moss":{X:5,Y:5}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,1,1),at(221397,20,20),at(501,5,5),at(502,8,8),at(503,9,9),at(504,10,10)];
const evts={};
const W={document:doc,addEventListener(e,f){(evts[e]=evts[e]||[]).push(f)},dispatchEvent(ev){(evts[ev.type]||[]).forEach(f=>f(ev))},
  CustomEvent:class{constructor(t,o){this.type=t;this.detail=o&&o.detail}},
  location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,501,502,503,504]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger(), R=(mn)=>L().people[mn];
const realTimeout=setTimeout, wait=ms=>new Promise(r=>realTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const said=(k)=>sent.slice(k).map(([e,d])=>d?JSON.stringify(d):'').join(' ');
const beep=async(mn,msg,ms)=>{ handlers.AccountBeep({MemberNumber:mn,Message:msg}); await wait(ms||5400); };
(async()=>{ await wait(3500);
  const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  chars.forEach(c=>{ const p=R(c.MemberNumber); if(p) c.Name=p.name; });
  // opt-in only, limits rule it out, moss only for milkers
  ok(W.__symBond(503,'latex')!==null, 'no symbiote without ?symbiote on');
  ok(/limits/.test(String(W.__symBond(504,'latex'))), 'a hard limit naming symbiotes rules them out');
  ok(/milk/.test(String(W.__symBond(502,'moss'))), 'milk moss only takes to somebody who makes milk');
  // latex on Bessie, given by a proprietor
  const cap0=W.__capacity(501);
  let k=sent.length; await beep(221397,'symbiote give Bessie latex');
  ok(R(501).symbiote && R(501).symbiote.kind==='latex', '?symbiote give puts livin\' latex on');
  ok(/latex/i.test(said(k)), 'they are told what it is and what it gives');
  ok(W.__symBond(501,'moss')!==null, 'one symbiote at a time');
  ok(W.__capacity(501)>cap0, 'stage one already gives room: '+cap0+' to '+W.__capacity(501));
  // it grows while fed
  const g=R(501).symbiote; g.stageAt=Date.now()-cfg.SYM.STAGE_MIN*60000-1000; k=sent.length; W.__symTick(); await wait(300);
  ok(g.stage===2 && /latex|second skin/i.test(said(k)), 'it grows a stage when it is fed and its time comes ('+g.stage+')');
  const cap2=W.__capacity(501); ok(cap2>=cap0+200, 'more room at stage two ('+cap2+')');
  // feeding extends its stay; a load anywhere feeds latex
  const u0=g.until; g.fedAt=Date.now()-2*3600000; W.__symFed(501,'load','mouth');
  ok(g.until>u0 && Date.now()-g.fedAt<1000, 'a load feeds it and it stays longer');
  W.__symFed(501,'milked'); ok(g.fed===1, 'latex does not eat a milkin\'');
  W.__symFed(501,'climax'); ok(g.fed===2, 'a climax feeds latex');
  // hungry: it says so, privately
  g.fedAt=Date.now()-(cfg.SYM.HUNGRY_MIN+5)*60000; g.told=0; k=sent.length; W.__symTick(); await wait(300);
  ok(/hungry|feed|squeez|eaten/i.test(said(k)), 'hungry, it lets them know');
  // starved, it leaves
  g.fedAt=Date.now()-(cfg.SYM.STARVE_H+1)*3600000; k=sent.length; W.__symTick(); await wait(300);
  ok(!R(501).symbiote && R(501).symbioteNext>Date.now(), 'starved, it leaves and does not come straight back');
  ok(W.__capacity(501)===cap0, 'the room goes with it');
  // moss at a spot: more milk while it is on
  R(501).symbioteNext=0; const m0=W.__milkRate(501);
  k=sent.length; await beep(501,'symbiote take');
  ok(R(501).symbiote && R(501).symbiote.kind==='moss', '?symbiote take at a symbiote-moss spot bonds the moss');
  const mg=R(501).symbiote; mg.stage=3; ok(W.__milkRate(501)>m0*1.7, 'full-grown moss: three quarters more milk ('+Math.round(W.__milkRate(501))+' vs '+Math.round(m0)+')');
  W.__symFed(501,'milked'); ok(mg.fed===1, 'moss eats a milkin\'');
  W.__symFed(501,'load','vulva'); ok(mg.fed===1, 'moss does not eat a load');
  // time's up: a thank-you
  mg.until=Date.now()-1; k=sent.length; W.__symTick(); await wait(2600);
  ok(!R(501).symbiote && /moss/i.test(said(k)), 'when its time is up it lets go with a goodbye');
  // nestling on Brutus: an easier catch, fed by loads below, and the safeword takes it off
  R(502).breedable=true; ok(W.__symBond(502,'nestling')===null, 'the nestling takes to a male too');
  W.__symFed(502,'load','mouth'); ok(R(502).symbiote.fed===0, 'the nestling does not eat a mouthful');
  W.__symFed(502,'load','butt'); ok(R(502).symbiote.fed===1, 'it eats a load in the ass');
  k=sent.length; handlers.ChatRoomMessage({Sender:502,Type:'Whisper',Content:'?safeword',Target:260239}); await wait(1500);
  ok(!R(502).symbiote, 'the safeword takes it off at once');
  // the lines: nothing about parts they have not got, no tags or placeholders
  const LINES=W.__symLines(), VUL=/\b(pussy|clit|womb)\b/i, TIT=/\b(tits?|breasts?|udders?|teats?)\b/i, LEAK=/\{[a-z]{1,2}\}|%[a-z]{1,3}\b|undefined/;
  const bad=[];
  for (const [mn,vul,tit] of [[501,true,true],[502,false,false]]) for (const [key,pool] of Object.entries(LINES)) for (let i=0;i<pool.length*2;i++){
    const t=W.__tFill(W.__pickFor(mn,'symtest:'+key,pool),mn,{});
    if((!vul&&VUL.test(t))||(!tit&&TIT.test(t))||LEAK.test(t)) bad.push(mn+' '+key+': '+t);
  }
  bad.slice(0,5).forEach(b=>out('  '+b));
  ok(bad.length===0, 'every symbiote line fits the body it is about ('+bad.length+' problems, '+Object.values(LINES).reduce((a,p)=>a+p.length,0)+' lines)');
  out(fails?'FAIL':'PASS'); process.exit(fails?1:0);
})();
