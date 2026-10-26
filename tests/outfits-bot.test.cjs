// Outfits on the bot: proprietors save from the Companion, fallbacks pick by species and gender,
// approval and clock-in offer them, keys go to the farm, and only proprietors can save.
const fs=require('fs');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "700":{mn:700,name:"Rex",roles:["HERDMASTER"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "800":{mn:800,name:"Hand",roles:["FARMHAND"],onDuty:true,herd:null,tempKeys:[],cover:[]},
 "900":{mn:900,name:"Daisy",roles:[],onDuty:true,herd:null,tempKeys:[],cover:[]}
},applications:[{id:"a",mn:900,name:"Daisy",at:1,staffTrack:false,answers:[],byKey:{species:"goat",gender:"femboy",stay:"1w",depth:"deep"}}],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221397,700,800,900].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>{ sent.push([ev,d]); if(ev==="AccountQuery"&&d.Query==="OnlineFriends"&&handlers.AccountQueryResult) setTimeout(()=>handlers.AccountQueryResult({Query:"OnlineFriends",Result:(W.__mutual||W.Player.FriendList).map(m=>({MemberNumber:m}))}),0); }, ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[221397,700,800,900]},
  ChatRoomData:{Name:'B&B Farm',Admin:[260239],MapData:{Type:'Always'}}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const B=async(mn,msg)=>{handlers.AccountBeep({MemberNumber:mn,Message:msg});await wait(5200);};
const H=async(mn,d)=>{handlers.ChatRoomMessage({Sender:mn,Type:'Hidden',Content:'FarmhandMsg',Dictionary:{v:2,...d}});await wait(400);};
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const farmTo=(mn,type,n)=>sent.slice(n||0).filter(s=>s[1]&&s[1].Content==='FarmhandMsg'&&s[1].Target===mn&&s[1].Dictionary.type===type).map(s=>s[1].Dictionary);
// a line heard in the room: public, or (map rooms) privately to the people around: "(*…" whispers, Companion roomlines and relays
const roomText=s=>{ const d=s&&s[1]; if(!d) return null;
  if(!d.Target&&(d.Type==='Emote'||d.Type==='Chat')) return d.Content;
  if(d.Type==='Whisper'&&typeof d.Content==='string'&&/^\(\*/.test(d.Content)) return d.Content.slice(1);
  if(d.Type==='Hidden'&&d.Content==='FarmhandMsg'&&d.Dictionary&&(d.Dictionary.type==='roomline'||d.Dictionary.type==='relay')) return '*'+String(d.Dictionary.text).replace(/^\*/,'');
  return null; };
(async()=>{ await wait(3500);
  for (const mn of [221397,700,800,900]) await H(mn,{type:'hello',ver:'0.3.0'});
  // 1. saving
  await H(221397,{type:'outfitSave',slot:'goat|*',data:'GOATDATA',items:9,locks:2});
  await H(221397,{type:'outfitSave',slot:'uniform:farmhand',data:'HANDDATA',items:5,locks:0});
  await H(800,{type:'outfitSave',slot:'stock',data:'NOPE',items:1,locks:0});
  out('1 proprietor saves ->', L().outfits['goat|*'] && L().outfits['goat|*'].items===9);
  out('1 farmhand cannot ->', !L().outfits.stock);
  // 2. approval offers the goat outfit (goat|femboy missing → goat|*)
  let n=sent.length; await B(221397,'approve 900 livestock'); await wait(4500);
  const o=farmTo(900,'outfit',n)[0]||{};
  out('2 approval offers by species fallback ->', o.slot==='goat|*' && o.data==='GOATDATA');
  out('2 keys are farm staff, not them ->', Array.isArray(o.keys) && o.keys.includes(800) && o.keys.includes(700) && !o.keys.includes(900));
  // 3. clock-in offers the uniform; clock-out sends change-back
  n=sent.length; await B(800,'clockin'); await wait(2000);
  out('3 uniform at clock-in ->', (farmTo(800,'outfit',n)[0]||{}).slot==='uniform:farmhand');
  n=sent.length; await B(800,'clockout');
  out('3 change back at clock-out ->', farmTo(800,'outfitBack',n).length===1);
  // 4. keys setting
  await B(221397,'outfit keys owners'); n=sent.length; await B(700,'outfit offer 900');
  const o2=farmTo(900,'outfit',n)[0]||{};
  out('4 keys to proprietors only ->', o2.keys && o2.keys.includes(221397) && !o2.keys.includes(800));
  // 5. answers are logged and emoted
  n=sent.length; await H(900,{type:'outfitAnswer',answer:'worn',slot:'goat|*',locks:2});
  out('5 worn is announced ->', sent.slice(n).some(s=>/padlocks click shut/.test(roomText(s)||'')));
  // 6. list and clear
  await B(221397,'outfit clear goat any');
  out('6 cleared ->', !L().outfits['goat|*']);
  // 7. Oct 23: the farm's own starter outfits fill every slot nobody has saved (shared/farm-outfits.js)
  W.LZString={ compressToBase64:(t)=>Buffer.from(t).toString('base64'), decompressFromBase64:(t)=>Buffer.from(t,'base64').toString() };
  for (const k of Object.keys(L().outfits)) delete L().outfits[k];
  n=sent.length; await B(700,'outfit offer 900');
  const o7=farmTo(900,'outfit',n)[0]||{}, it7=o7.data?JSON.parse(W.LZString.decompressFromBase64(o7.data)).items:[];
  const g=(grp)=>it7.find(i=>i.Group===grp)||{};
  out('7 a goat femboy is offered the farm goat outfit ->', o7.slot==='farm:goat|femboy', g('ItemHands').Name==='PonyMittensBinder', !!(g('ItemHands').Property&&g('ItemHands').Property.TypeRecord));
  out('7 ...locked collar and cage, the sissy set, every hole open ->', g('ItemNeck').locked===true, g('ItemVulva').Name==='PlasticChastityCage1'&&g('ItemVulva').locked===true, g('Cloth').Name==='MaidBikini', !g('ItemButt').Name, /RingGag|BitGag|Pony/.test(g('ItemMouth').Name||''));
  L().people[900].species='bull'; L().people[900].gender='female';
  n=sent.length; await B(700,'outfit offer 900');
  const o8=farmTo(900,'outfit',n)[0]||{}, it8=o8.data?JSON.parse(W.LZString.decompressFromBase64(o8.data)).items:[];
  out('7 a bull wears its own bull outfit; women go without chastity ->', o8.slot==='farm:bull|female' && /CowHorns/.test(JSON.stringify(it8)), it8.some(i=>i.Name==='LeatherCuffs'), !it8.some(i=>/Chastity|Cockring/.test(i.Name)));
  // 8. Oct 25: every starter outfit has a name and a description, and the offer carries them
  out('8 the offer is named and described ->', o7.label==='Little Kid Frills outfit', /^A pink maid bikini/.test(o7.desc||''), /In it: .*hoof mittens strapped together/.test(o7.desc||''), /Padlocked: .*pink chastity cage/.test(o7.desc||''));
  out('8 ...and the bull is offered its own ->', o8.label==='Herd Matriarch outfit', o8.label);
  n=sent.length; await B(900,'outfit starters');
  const st8=sent.slice(n).map(x=>JSON.stringify(x)).join(' ');
  out('8 ?outfit starters lists all 45 by name ->', /Dairy Darling/.test(st8), /Cave Scrapper/.test(st8), /Midnight Mare/.test(st8));
  n=sent.length; await B(900,'outfit about pony female');
  out('8 ?outfit about pony female describes it ->', /MIDNIGHT MARE/.test(sent.slice(n).map(x=>JSON.stringify(x)).join(' ')));
  process.exit(0);
})();
