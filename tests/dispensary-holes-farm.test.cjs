// HOLE TRAINING, THE FARM GIRL'S SIDE (Nov 18; Laynie: "if we can do the hole training better, i would love to explore
// that idea", then all seven). The books are hers: a player's Dispensary counts what happens anywhere and hands her
// the changes (dispHoles) when they're in her room; she applies each batch once and sends her numbers back
// (dispHolesOk). Their trainers on the farm are their Dispensary's to count, so she doesn't count them twice.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,milkable:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[],gender:"female"},
 "500":S(500,"Moo"), "600":S(600,"Hana"), "610":S(610,"Bo",{gender:"male",species:"bull"})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(610,17,10)];
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
  ['Laynie','Moo','Hana','Bo'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [221397,500,600,610]) await say(mn,'?stats',500);

  // ---- the rule book is the farm's own: the same sizes and names
  const H=await import(require('url').pathToFileURL(path.join(__dirname,'../shared/holes.js')).href);
  ok(['vulva','butt','throat'].every(h=>JSON.stringify(H.HOLE_SIZES[h].names)===JSON.stringify(cfg.SIZES[h].names) && H.HOLE_SIZES[h].start===cfg.SIZES[h].start && H.HOLE_SIZES[h].natural===cfg.SIZES[h].natural && H.HOLE_SIZES[h].max===cfg.SIZES[h].max),
    "shared/holes.js has the farm's own hole sizes, names, start, natural and max");
  ok(H.TRAIN_H===cfg.STRETCH_TRAIN_H && H.TIGHTEN_H===cfg.GAPE_TIGHTEN_H, "...and her trainin' and tightenin' times");

  // ---- hello: her numbers for their holes
  let n=sent.length;
  await hid(600,'dispHello',{ver:'0.18.0',farm:true,lscg:false,off:[],holes:1});
  const wel=msgsTo(600,'dispWelcome',n).pop();
  ok(wel && wel.holes && JSON.stringify(wel.holes.has)==='["vulva","butt","throat"]' && JSON.stringify(wel.holes.sizes.butt)==='[1,1]' && JSON.stringify(wel.holes.sizes.throat)==='[2,2]', "her welcome carries her numbers for their holes, now and trained ("+JSON.stringify(wel&&wel.holes)+")");
  n=sent.length; await hid(610,'dispHello',{ver:'0.18.0',farm:true,lscg:false,off:[],holes:1});
  const wb=msgsTo(610,'dispWelcome',n).pop();
  ok(wb && wb.holes && !wb.holes.has.includes('vulva') && !('vulva' in wb.holes.sizes), "a bull's: no pussy in the list");
  n=sent.length; await hid(500,'dispHello',{ver:'0.17.0',farm:true,lscg:false,off:[]});
  ok(!msgsTo(500,'dispWelcome',n).pop().holes, "an older Dispensary (no holes in its hello): none sent");

  // ---- the changes from off the farm
  n=sent.length;
  await hid(600,'dispHoles',{ep:'abcd1234',id:1,ops:[{h:'butt',up:2},{h:'butt',st:6},{h:'throat',up:1}]});
  const p=prod(600);
  ok(p.sizeBase.butt===3 && p.size.butt===6 && p.sizeBase.throat===3, "a batch from their Dispensary: trained up two, stretched to six, throat up one (butt "+p.size.butt+"/"+p.sizeBase.butt+", throat "+p.sizeBase.throat+")");
  const ok1=msgsTo(600,'dispHolesOk',n).pop();
  ok(ok1 && ok1.id===1 && JSON.stringify(ok1.sizes.butt)==='[6,3]', "...she says she has it, with her numbers back");
  n=sent.length; await hid(600,'dispHoles',{ep:'abcd1234',id:1,ops:[{h:'butt',up:2},{h:'butt',st:6},{h:'throat',up:1}]});
  ok(p.sizeBase.butt===3 && p.sizeBase.throat===3 && msgsTo(600,'dispHolesOk',n).length===1, "the same batch again (her answer got lost): not counted twice, and answered again");
  await hid(600,'dispHoles',{ep:'abcd1234',id:2,ops:[{h:'butt',tight:2},{h:'vulva',set:7},{h:'vulva',down:1},{h:'butt',up:30},{h:'nose',up:1}]});
  ok(p.sizeBase.butt===10 && p.size.butt===10, "tight two then up thirty: closed to its usual, then trained only to natural (10) ("+p.size.butt+"/"+p.sizeBase.butt+")");
  ok(p.sizeBase.vulva===6 && p.size.vulva===7, "their own pick (set 7), then healed one: usual 6, still stretched 7 ("+p.size.vulva+"/"+p.sizeBase.vulva+")");
  await hid(600,'dispHoles',{ep:'zzzz9999',id:1,ops:[{h:'butt',down:3}]});
  ok(p.sizeBase.butt===7, "a fresh Dispensary (new books) startin' its numbers again: counted ("+p.sizeBase.butt+")");
  await hid(610,'dispHoles',{ep:'bull0001',id:1,ops:[{h:'vulva',up:3},{h:'butt',up:1}]});
  ok(!(prod(610).sizeBase||{}).vulva && prod(610).sizeBase.butt===2, "a bull: nothin' for a pussy he hasn't got, his ass counts");
  n=sent.length; await hid(777,'dispHoles',{ep:'stranger',id:1,ops:[{h:'butt',up:1}]});
  const none=msgsTo(777,'dispHolesOk',n).pop();
  ok(none && none.none===true, "somebody not on her books: she says so, and their Dispensary keeps its own");

  // ---- the Companion: stretched and trained, both
  const body=W.__stateFor(600).body, bb=body.find(b=>b.part==='vulva');
  ok(bb && /gaping/.test(bb.size) && bb.trained==='well-used', "the Companion's Body rows: how open now, and trained when it's different ("+JSON.stringify(bb)+")");

  // ---- trainers on the farm: their Dispensary's to count
  const plug={Asset:{Name:'BlackButtPlug',Description:'Black Butt Plug',Group:{Name:'ItemButt'}},Craft:{Name:'Stretcher Plug',Description:'',MemberNumber:221397},Property:{}};
  p.size.butt=2; p.sizeBase.butt=2; p.stretchOn={}; chars[3].Appearance=[plug];
  n=sent.length; W.__pt(); await wait(300);
  ok(p.size.butt===2 && !/spreads that ass wide/.test(roomText(n)), "a stretcher on somebody whose Dispensary counts their holes: she leaves it to it (no stretch, no line from her)");
  await hid(500,'dispHello',{ver:'0.17.0',farm:true,lscg:false,off:[]});
  const m=prod(500); m.size=m.size||{}; m.sizeBase=m.sizeBase||{}; m.size.butt=2; m.sizeBase.butt=2; m.stretchOn={};
  chars[2].Appearance=[plug]; n=sent.length; W.__pt(); await wait(300);
  ok(m.size.butt===3 && /Moo/.test(roomText(n)), "without it (an older Dispensary, or none): she does it, as ever");
  chars[2].Appearance=[]; chars[3].Appearance=[];

  // ---- a throat held open closes back now too
  p.size.throat=6; p.sizeBase.throat=3; p.gapeAt.throat=Date.now()-25*3600000;
  W.__pt();
  ok(p.size.throat===5, "a stretched throat tightens back a size a day, like the others ("+p.size.throat+")");

  out(fails?'\n❌ '+fails+' failed':'\n✅ all passed'); process.exit(fails?1:0);
})();
