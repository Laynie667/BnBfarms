// Nov 17, more: the Dispensary's new doses on the farm (Deep Throat Drops, Rut, cravings and ?fix).
// Before that, Nov 17: the farm girl calls on a player's Dispensary (Laynie: "have the farm girl 'call' on the extension to apply
// shots", "anything to make the farmgirls load a little lighter"). She keeps the books; their game does the feelin'
// and says the line. Without a Dispensary, everything as before.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,milkable:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],gender:"female"},
 "500":S(500,"Moo"), "600":S(600,"Hana",{freeuse:true}), "650":{mn:650,name:"Hand",roles:["FARMHAND"],onDuty:true,herds:[],tempKeys:[],cover:[]}, "700":S(700,"Rex",{gender:"male",species:"dog"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(650,17,10),at(700,18,10)];
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
  ['Laynie','Moo','Hana','Hand','Rex'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [221397,500,600,700]) await say(mn,'?stats',500);

  const cfg2=W.__cfg, big=()=>{ const p=prod(700); p.size=Object.assign(p.size||{}, {penis:cfg2.SIZES.penis.max}); p.semen=200; p.fills=[]; p.pentUp=false; p.deniedUntil=0; },
        tight=()=>{ const p=prod(600); p.size=Object.assign(p.size||{}, {throat:1}); p.sizeBase=Object.assign(p.sizeBase||{}, {throat:1}); p.held={}; p.throatTrain=0; };
  // ---- without the drops: a tight throat gags
  await hid(600,'dispHello',{ver:'0.3.0',farm:true,lscg:false,off:[],on:[]});
  big(); tight(); let n=sent.length; await say(700,'?cum hana mouth',1500);
  ok(/gags on that/.test(roomText(n)) && prod(600).throatTrain===1, "a tight throat, no drops: Hana gags, and it counts once ("+roomText(n).slice(0,160)+")");
  // ---- Deep Throat Drops: no gag, and the trainin' counts twice
  await hid(600,'dispHello',{ver:'0.3.0',farm:true,lscg:false,off:[],on:['deepthroat']});
  big(); tight(); n=sent.length; await say(700,'?cum hana mouth',1500);
  ok(/without a single gag/.test(roomText(n)) && !/gags on that/.test(roomText(n)), "Deep Throat Drops: her throat takes every inch without a gag");
  ok(prod(600).throatTrain===2, "...and the trainin' counts twice ("+prod(600).throatTrain+")");
  // ---- Rut: bigger loads, and no runnin' dry
  await hid(700,'dispHello',{ver:'0.3.0',farm:true,lscg:false,off:[],on:[]});
  await hid(600,'dispHello',{ver:'0.3.0',farm:true,lscg:false,off:[],on:[]});
  big(); tight(); let g0=prod(700).totals.given; await say(700,'?cum hana mouth',1500); const plain=prod(700).totals.given-g0;
  await hid(700,'dispHello',{ver:'0.3.0',farm:true,lscg:false,off:[],on:['rut']});
  big(); tight(); g0=prod(700).totals.given; await say(700,'?cum hana mouth',1500); const rutted=prod(700).totals.given-g0;
  ok(rutted > plain*1.4 && rutted < plain*1.6, "Rut: a stud's load comes half again as big ("+Math.round(plain)+" → "+Math.round(rutted)+" mL)");
  big(); tight(); prod(700).fills=[Date.now(),Date.now(),Date.now(),Date.now(),Date.now(),Date.now()]; g0=prod(700).totals.given; await say(700,'?cum hana mouth',1500);
  ok(prod(700).totals.given-g0 >= rutted*0.99, "...and a busy hour doesn't run him dry");
  // ---- ?myshots shows the Dispensary's doses
  n=sent.length; await say(700,'?myshots',1200);
  ok(/From your Dispensary: Rut/.test(roomText(n)+' '+sent.slice(n).map(([e,d])=>String(d&&(d.Content||d.Message)||'')).join(' ')), "?myshots lists what their Dispensary says is in them");
  // ---- cravings: she notices, and ?fix calls their Dispensary
  n=sent.length; await hid(600,'dispHello',{ver:'0.3.0',farm:true,lscg:false,off:[],on:[],crave:'rut'},900);
  const told=sent.slice(n).map(([e,d])=>String(d&&(d.Content||d.Message)||'')).join(' | ');
  ok(/Rut/.test(told) && /\?fix/.test(told), "cravin': she notices, and offers ("+told.slice(0,120)+")");
  n=sent.length; await hid(600,'dispHello',{ver:'0.3.0',farm:true,lscg:false,off:[],on:[],crave:'rut'},600);
  ok(!/\?fix/.test(sent.slice(n).map(([e,d])=>String(d&&(d.Content||d.Message)||'')).join(' ')), "...but not every time their Dispensary says hello");
  n=sent.length; await say(600,'?fix',1200);
  const fx=msgsTo(600,'dose',n).pop();
  ok(fx && fx.dose==='rut' && fx.by===260239, "?fix: she calls their Dispensary for it, like any of her calls");
  n=sent.length; await say(600,'?fix',1000);
  ok(!msgsTo(600,'dose',n).length, "...once (not again till they're cravin' again)");
  await hid(500,'dispHello',{ver:'0.3.0',farm:false,lscg:false,off:[],on:[],crave:'rut'});
  n=sent.length; await say(500,'?fix',1000);
  ok(!msgsTo(500,'dose',n).length, "...and never if their Dispensary doesn't take doses from the farm");
  // ---- a Dispensary needle on the farm: no "couldn't read a farm word"
  const C=(mn)=>chars.find(c=>c.MemberNumber===mn);
  C(700).Appearance=[{Asset:{Name:'MedicalInjector',Group:{Name:'ItemHandheld'}},Craft:{Name:'Rut Serum',Description:'for my bitch'}}];
  n=sent.length; handlers.ChatRoomMessage({Sender:700,Type:'Activity',Content:'ChatOther-ItemArms-Inject',Dictionary:[{SourceCharacter:700},{TargetCharacter:600},{Tag:'FocusAssetGroup',FocusGroupName:'ItemArms'},{ActivityName:'Inject'}]}); await wait(900);
  const said2=sent.slice(n).map(([e,d])=>String(d&&(d.Content||d.Message)||'')).join(' | ');
  ok(!/couldn't read a farm word/.test(said2), "a Dispensary needle on somebody runnin' it: she stays out of it");
  n=sent.length; handlers.ChatRoomMessage({Sender:700,Type:'Activity',Content:'ChatOther-ItemArms-Inject',Dictionary:[{SourceCharacter:700},{TargetCharacter:221397},{Tag:'FocusAssetGroup',FocusGroupName:'ItemArms'},{ActivityName:'Inject'}]}); await wait(900);
  const said3=sent.slice(n).map(([e,d])=>String(d&&(d.Content||d.Message)||'')).join(' | ');
  ok(/one of the Dispensary's doses/.test(said3), "...and on somebody without one, she says it needs the Dispensary ("+said3.slice(0,140)+")");
  out(fails ? fails+" FAILED" : "ALL PASSED"); process.exit(fails?1:0);
})();
