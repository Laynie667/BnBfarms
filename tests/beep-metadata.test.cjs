// Seen live: an applicant's mod added hidden data to every beep ("cat" + {"messageType":...}), so even "cat"
// and "not stock" were refused and they were stuck on the animal question. Only the typed words count now.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]}
},applications:[],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,121256].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[121256]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const META='\n\n{"messageType":"Message","messageColor":"#2B59DB"}';
const beep=async(t)=>{ handlers.AccountBeep({MemberNumber:121256,MemberName:'Dommy Pawz',Message:t+META}); await wait(5300); };
const beepsTo=(k)=>sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===121256).map(([e,d])=>d.Message).join(' | ');
(async()=>{ await wait(3500);
  chars[2].Name='Pawz';
  W.__st().mutual={at:Date.now(),set:new Set([121256])};
  ok(W.__beepText('cat'+META)==='cat' && W.__beepText('not stock'+META)==='not stock' && W.__beepText('plain words')==='plain words', 'the extra mod data is taken off a beep, plain beeps untouched');
  await beep('!apply'); await wait(2000);
  await beep('Pawz, kitten please');
  await beep('livestock');
  let k=sent.length; await beep('cat');
  ok(/How should the farm see you/.test(beepsTo(k)) && !/didn't catch an animal|don't know that animal/.test(beepsTo(k)), '"cat" by beep is accepted (Pawz was stuck here)');
  for (const a of ['female','1 day','deep','milking','being petted','no blood','ask first','none','cuddles','thanks']) await beep(a);
  const app=(L().applications||[]).find(a=>a.mn===121256)||{};
  ok(app.byKey && app.byKey.species==='cat', 'their animal is saved as cat');
  ok(app.byKey && !Object.values(app.byKey).some(v=>/messageType|\{/.test(String(v))), 'no mod data in any saved answer');
  ok(app.byKey && app.byKey.name==='Pawz, kitten please', 'their name answer is exactly what they typed');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
