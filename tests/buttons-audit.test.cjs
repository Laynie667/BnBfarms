// Every button and switch the Companion can press, pushed through the bot.
// Each must get SOMETHING back: an answer, an Office doc, a notice, or a room emote. Silence = not hooked up.
// Switches must also flip the value the panel reads.
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR","LIVESTOCK"],species:"cow",onDuty:true,herds:[],tempKeys:[],cover:[]},
 "700":{mn:700,name:"Rex",roles:["HERDMASTER"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "800":{mn:800,name:"Hand",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":{mn:500,name:"Moo",roles:["LIVESTOCK"],species:"cow",onDuty:true,herds:[{leader:700,type:"perm",at:1}],tempKeys:[],cover:[],breedable:true,milkable:true}
},applications:[{id:"a",mn:900,name:"Newbie",at:1,staffTrack:false,answers:[],byKey:{species:"pig",gender:"female",stay:"1d",depth:"fun"}}],archive:{},log:[],stuckLog:[],spots:{staff:{X:2,Y:2},milking1:{X:9,Y:9}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X,Y},PrivateState:{}},Appearance:[]});
const chars=[at(260239,0,0),at(221397,10,10),at(700,5,5),at(800,6,6),at(500,8,8),at(900,12,12)];
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,700,800,500,900]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const FM=(mn,d)=>handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,...d}});
// did anything come back to them, or out to the room?
const answered=(k,mn)=>sent.slice(k).some(([ev,d])=>d&&((d.Type==='Hidden'&&d.Content==='FarmhandMsg'&&d.Target===mn&&['reply','notice','doc','ask','choose','outfit','outfitBack'].includes(d.Dictionary.type))||
  (d.Type==='Emote'&&!d.Target)||(d.Type==='Chat'&&!d.Target)));
const latestState=(mn)=>{const s=sent.filter(([e,d])=>d&&d.Content==='FarmhandMsg'&&d.Target===mn&&d.Dictionary.type==='state').pop(); return s?s[1].Dictionary.state:{};};
const silent=[];
async function press(mn, cmd){
  const k=sent.length; FM(mn,{type:'cmd',text:cmd}); await wait(2600);
  if (!answered(k,mn)) silent.push(cmd+' (as '+mn+')');
}
(async()=>{ await wait(3500);
  for (const [m,n] of [[221397,'Laynie'],[700,'Rex'],[800,'Hand'],[500,'Moo'],[900,'Newbie']]) chars.find(c=>c.MemberNumber===m).Name=n;
  chars.find(c=>c.MemberNumber===500).Appearance=[{Asset:{Name:'Pussy2',Group:{Name:'Pussy'}}}];
  for (const mn of [221397,700,800,500]) { FM(mn,{type:'hello',ver:'0.5.0'}); await wait(1200); }
  L().people[500].prod && (L().people[500].prod.milk=1500);

  // 1. every switch on the Toggles tabs: press it, and the panel's switch must flip
  const SW=['fertile','jarok','freeuse','futa','milkable','naturalheat','praise','degrade','tally','teaseme','hypno','breedable'];   // free use needs breedable, so breedable goes last
  const stuck=[];
  for (const sw of SW){
    W.__sync(true); await wait(400);
    const before=!!(latestState(500).switches||{})[sw];
    await press(500, sw+' '+(before?'off':'on'));
    W.__sync(true); await wait(400);
    const after=!!(latestState(500).switches||{})[sw];
    if (after===before) stuck.push(sw+' ('+before+'→'+after+')');
  }
  out('1 every livestock switch flips ->', stuck.length===0, stuck.join(', '));
  W.__sync(true); await wait(400); const f0=!!(latestState(800).switches||{}).forced;
  await press(800,'forced'); W.__sync(true); await wait(400);
  out('1 staff on-call switch flips ->', !!(latestState(800).switches||{}).forced !== f0);

  // 2. every button on the livestock panel
  for (const c of ['stats','measure','record','pedigree','keys','quota','board','tally','eggs','wash','gender femboy','outfit back','rules','consent','tour','doors','species','help'])
    await press(500, c);
  // 3. every button on the staff panel (Me, Herd, Office, Barn, Contracts, Tease, Voice, Zones, Shift)
  for (const c of ['record','hours','myherd','keys','chores','pasture','onduty',
                   'record 500','milk 500','drain 500','edge 500','summon 500','vet 500','stats 500','quota 500','keys 500','size 500','pedigree 500',
                   'collect 700','denial 500','inspect 500','jars','roster','stock','queue','herdcall','herdsummon',
                   'claim 500','turnout 500','letup 500','contract list','contract show deep 500','contract check 500',
                   'tease add Cute today, %name%.','tease remove 1','zone who','zone a pasture','zone b pasture','zone pair pasture fields',
                   'voice','voice add herd Good cows stand still.','voice on herd','voice every herd 15','voice remove herd 1',
                   'clockin','clockout','spin','where','outfit','machine'])
    await press(700, c);
  // 4. proprietor Dashboard buttons
  for (const c of ['contract new prizecow from fun','contract add prizecow other.listenToMyVoice sentences="Good cows.|Moo." frequency="15"',
                   'contract title prizecow Prize cow contract','contract terms prizecow You belong to the farm, %name%.','contract policy prizecow farm',
                   'contract show prizecow','contract outfit prizecow auto','outfit keys staff','outfit rule approve on','contract delete prizecow','approve 900 livestock'])
    await press(221397, c);
  out('2-4 every button gets an answer, a doc or an emote ->', silent.length===0, silent.length ? 'silent: '+silent.join(' · ') : '');
  process.exit(0);
})();
