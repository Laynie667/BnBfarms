// Nov 4 (Laynie): feats and perks — tracks, tiers that stack, credit for the past, perks that switch off, eggs that pay less,
// the nursery's private gold stars, the Companion's Feats tab
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
const S=(mn,name,extra)=>Object.assign({mn,name,roles:["LIVESTOCK"],species:"cow",gender:"female",onDuty:true,herds:[],tempKeys:[],cover:[],limits:"",breedable:true,fertile:true,milkable:true},extra||{});
store.bnb_ledger_v1=JSON.stringify({v:4,people:{
 "221397":{mn:221397,name:"Laynie",roles:["PROPRIETOR"],onDuty:true,herds:[],tempKeys:[],cover:[]},
 "500":S(500,"Moo",{ribbons:20}), "600":S(600,"Rex",{gender:"male",species:"bull"}), "700":S(700,"Pip",{nursery:{role:"little",space:false,carers:[],starsEver:25}})
},applications:[],archive:{},log:[],stuckLog:[],chores:[],wheel:[],spots:{"rescue":{X:50,Y:50}}});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const at=(m,X,Y)=>({MemberNumber:m,Name:'N'+m,Appearance:[],MapData:{Pos:{X,Y},PrivateState:{}}});
const chars=[at(260239,1,1),at(221397,10,10),at(500,15,10),at(600,16,10),at(700,17,10)];
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
const L=()=>W.FarmhandLedger(), P=mn=>L().people[mn], prod=mn=>W.__prodOf(mn), K=W.__perks;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
const say=async(mn,msg,ms)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(ms||1300); };
const txt=([e,d])=>d&&(d.Content==='FarmhandMsg'?JSON.stringify(d.Dictionary):String(d.Content||d.Message||''));
const all=n=>sent.slice(n).map(txt).join(' | ');
const to=(n,mn)=>sent.slice(n).filter(([e,d])=>d&&(d.Target===mn||d.MemberNumber===mn)).map(txt).join(' | ');
const room=n=>sent.slice(n).filter(([e,d])=>d&&e==='ChatRoomChat'&&!d.Target&&d.Type!=='Hidden').map(txt).join(' | ');
(async()=>{ await wait(3500); const cfg=W.__cfg; cfg.USER_COOLDOWN_S=0; cfg.SEND_INTERVAL_MS=2;
  ['Laynie','Moo','Rex','Pip'].forEach((nm,i)=>chars[i+1].Name=nm);
  for (const mn of [500,600,700]) await say(mn,'?stats',400);
  // ── the past counts, quietly, and no ribbons for back-pay ──
  prod(500).totals.milked=160000; prod(500).offspring.eggs=60; P(500).ribbonsEver=300;
  delete P(500).feats; const cap0=W.__milkCapOf(500), rb0=P(500).ribbons;   // (her first look: the panel may have peeked already, with nothin' on her totals)
  let n=sent.length; W.__featCheck(500); await wait(800);
  ok(P(500).feats.dairy===3 && P(500).feats.eggs===2 && P(500).feats.favourite===3, 'the past counts: Dairy III, Egg layer II, Farm favourite III ('+JSON.stringify(P(500).feats)+')');
  ok(/already yours/.test(to(n,500)) && P(500).ribbons===rb0 && !sent.slice(n).some(x=>/🏅/.test(txt(x)) && x[1].Target!==500 && x[1].MemberNumber!==500), '...quietly, in one message, no ribbons for back-pay');
  ok(W.__milkCapOf(500)>cap0*1.14, 'Heavy Udders III: milk capacity +15% ('+Math.round(cap0)+' → '+Math.round(W.__milkCapOf(500))+')');
  // ── a new tier, out loud, with a stingy handful of ribbons ──
  prod(500).totals.milked=400000; n=sent.length; W.__featsTick(); await wait(1200);
  ok(P(500).feats.dairy===4 && /Dairy IV/.test(all(n)) && P(500).ribbons===rb0+4, 'Dairy IV: announced, and 4 ribbons ('+(P(500).ribbons-rb0)+')');
  // ── perks switch off and on ──
  await say(500,'?perks off heavy udders'); ok(W.__perkLv(500,'dairy')===0 && W.__milkCapOf(500)<cap0*1.01, '?perks off Heavy Udders: back to plain');
  await say(500,'?perks on dairy'); ok(W.__perkLv(500,'dairy')===4, '?perks on: it\'s back');
  // ── eggs: bigger, sooner, but they pay less ──
  ok(K.perkEggX(500)>1.19 && K.perkEggDaysX(500)<0.85 && K.perkEggPayX(500)<0.71, 'Prolific Layer II: clutches +20%, 16% sooner, eggs fetch 30% less');
  ok(K.perkEggPayX(600)===1, 'somebody without it is paid in full');
  // ── the store, and the rest ──
  ok(W.__perkPrice(500,9)===8 && W.__perkPrice(500,1)===1, 'Favourite III: 6% off (9 → 8); a 1-ribbon thing stays 1');
  P(600).trapN=45; prod(600).totals.covers=60; W.__featCheck(600,true);
  ok(K.perkTrapX(600)>1.19 && K.perkLoadX(600)>1.09, 'Rex: Trap Magnet II and Prize Stud II');
  P(600).quotaBest=8; P(600).quotaGrace=0; W.__featCheck(600,true); W.__featsTick(); await wait(500);
  ok(P(600).feats.worker===2 && P(600).quotaGrace===1, 'Reliable II: a free quota grace for the week');
  // ── ?feats, and the nursery's gold stars stay private ──
  n=sent.length; await say(500,'?feats'); ok(/Dairy IV/.test(to(n,500)) && /Heavy Udders/.test(to(n,500)), '?feats shows her tracks and perks');
  ok(!/Gold stars/.test(to(n,500)), 'no Gold stars track for somebody outside the nursery');
  n=sent.length; W.__featCheck(700); await wait(800);
  ok(P(700).feats.goldstar===2 && K.perkStars(700)===1, 'Pip: Gold Star Little II, an extra star a day');
  n=sent.length; await say(600,'?feats Pip'); ok(!/Gold stars/.test(to(n,600)), 'Rex can\'t see Pip\'s gold stars');
  P(700).nursery.starsEver=60; n=sent.length; W.__featsTick(); await wait(800);
  ok(P(700).feats.goldstar===3 && !sent.slice(n).some(x=>/Gold star|gold-star/i.test(txt(x)) && x[1].Target!==700 && x[1].MemberNumber!==700), 'Gold stars III: never announced to the room');
  // ── the Companion's tab ──
  const s5=W.__stateFor(500); { const rp=(s5.store||[]).find(x=>x.id==='roampass'), base=W.__cfg.ROAM_PASS_PRICE; ok(rp && rp.price===W.__perkPrice(500,base) && rp.price<base, 'the panel store shows Moo her own price (Favourite): '+(rp&&rp.price)+' not '+base); }
  ok(s5.feats && s5.feats.tracks.length===9 && s5.feats.tracks.some(t=>t.key==='dairy'&&t.tier===4), 'the Feats tab: nine tracks (no gold stars for Moo)');
  const s7=W.__stateFor(700); ok(s7.feats && s7.feats.tracks.some(t=>t.key==='goldstar'), '...and Pip\'s has her gold stars');
  ok(!warns.some(w=>/TypeError|ReferenceError/.test(w) && !/Worker|CustomEvent/.test(w)), 'no errors ('+warns.filter(w=>/Error/.test(w)&&!/Worker|CustomEvent/.test(w)).slice(0,2).join(' / ')+')');
  out(fails ? 'FAILED '+fails : 'ALL PASSED'); process.exit(fails?1:0);
})();
