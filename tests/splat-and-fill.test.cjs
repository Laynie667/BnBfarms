// Seen live (Oct 6): a guest came in Laynie three times through the game's own actions and only one counted
// (the one she typed a cum word for), as "a little dribble (2 mL)" from a brand-new stud; and no LSCG splatter
// ever landed, because the bot has no LSCG of its own to tell it who has splatters on.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["LIVESTOCK"],species:"cow",gender:"female",breedable:true,freeuse:true,onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",gender:"female",breedable:true,freeuse:true,onDuty:true,herds:[],tempKeys:[],cover:[]},
 "195939":{mn:195939,name:"Sally",roles:["LUXURY"],gender:"futa",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[]},
 "600":{mn:600,name:"Rex",roles:["LIVESTOCK"],species:"dog",gender:"male",futa:true,onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,500,195939,600].map(m=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239]}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const msg=d=>handlers.ChatRoomMessage(d);
const lscg=(mn,on)=>msg({Sender:mn,Type:'Hidden',Content:'LSCGMsg',Dictionary:[{message:{version:'v0.9.7',type:'init',reply:false,target:null,
  settings:{enabled:true,Version:'v0.9.7',SplatterModule:{enabled:on,giver:true,taker:true}}}}]});
const penetrate=(src,tgt,group)=>msg({Sender:src,Type:'Activity',Content:'ChatOther-'+group+'-PenetrateFast',
  Dictionary:[{SourceCharacter:src},{TargetCharacter:tgt},{FocusGroupName:group},{ActivityName:'PenetrateFast'}]});
const orgasm=mn=>msg({Sender:mn,Type:'Activity',Content:'Orgasm2',Dictionary:[{SourceCharacter:mn}]});
const splats=(n,mn)=>sent.slice(n).filter(([e,d])=>e==='ChatRoomChat'&&d&&d.Type==='Activity'&&/LSCG_Splat$/.test(d.Content)&&d.Target===mn).map(([e,d])=>d.Content);
const said=n=>sent.slice(n).filter(([e,d])=>e==='ChatRoomChat'&&d&&typeof d.Content==='string').map(([e,d])=>d.Content).join(' | ');
(async()=>{ await wait(3500);
  lscg(221397, true); lscg(500, false);
  ok(L().people[221397].lscgSplat===true && !L().people[500].lscgSplat, "LSCG's own room message tells the bot who has splatters on");
  let n=sent.length;
  penetrate(195939, 221397, 'ItemVulva'); await wait(1500);
  orgasm(195939); await wait(3500);
  await wait(4000); const s=said(n);
  ok(/N195939 empties .* into N221397's vulva/.test(s), "the stud's real orgasm while inside fills them ("+(s.match(/N195939 empties[^|]*/)||[''])[0].slice(0,90)+")");
  ok(!/a little dribble/.test(s), "a brand-new stud comes in full, not with a dribble");
  ok(!/wasted seed/.test(s), "the load isn't counted as wasted");
  ok(splats(n,221397).includes('ChatOther-ItemVulva-LSCG_Splat'), 'an LSCG splatter lands on the hole it went in');
  ok(L().people[221397].prod.held.vulva > 5, 'it shows in what they hold');
  // somebody whose LSCG says splatters are off gets the load, but no splatter
  n=sent.length;
  penetrate(600, 500, 'ItemButt'); await wait(1500);
  orgasm(600); await wait(7500);
  ok(/N600 empties .* into N500's butt/.test(said(n)), 'a second stud fills Moo');
  ok(splats(n,500).length===0, "no splatter for someone whose LSCG has them off");
  // the Companion can say it too
  W.__st().lscgSeen.delete(500); L().people[500].lscgSplat=false;
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
