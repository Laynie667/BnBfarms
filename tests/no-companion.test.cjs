// Without the Companion: every command in the shared lists (the same ones ?help me and the Guides tab show)
// and every add-on command, sent by whisper, by beep and by /bot, must get an answer the player can see
// (a whisper or beep back to them, or something in the room). Help must list and explain the add-ons.
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
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(require('path').join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const L=()=>W.FarmhandLedger();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
const path=require('path');
const gsrc=fs.readFileSync(path.join(__dirname,'../shared/guides.js'),'utf8').replace(/export const/g,'var');
const G=new Function(gsrc+';return {PUBLIC_GROUPS,STAFF_GROUPS,OWNER_GROUPS};')();
// what reached them in a way they'd see without the Companion
const seen=(k,mn)=>sent.slice(k).some(([ev,d])=>d&&((ev==='AccountBeep'&&d.MemberNumber===mn)||(d.Type==='Whisper'&&d.Target===mn)||(d.Type==='Emote'&&!d.Target)||(d.Type==='Chat'&&!d.Target)));
const viaCompanion=(k,mn)=>sent.slice(k).some(([ev,d])=>d&&d.Type==='Hidden'&&d.Content==='FarmhandMsg'&&d.Target===mn);
const drain=async(min)=>{ await wait(min||250); for(let i=0;i<300;i++){ const s=W.__st(); if(!s.queue.length&&!s.urgent.length&&!s.sending) break; await wait(50);} await wait(150); };
const fillIn=c=>c.replace('<who>','Moo').replace('<n>','1').replace('<name>','barn').replace('<tier>','silver').replace('<role>','farmhand').replace('<jar>','1')
  .replace('<hours>','2').replace('<text>','hello').replace('<word>','female').replace('<line>','hello').replace('<x> <y>','3 3').replace('<ax> <ay> <bx> <by>','1 1 4 4')
  .replace('<group>','barn').replace('<job>','sweep').replace('@<place>','').replace('<species>','cow').replace('<gender>','female').replace('<trough>','trough-1')
  .replace('<stud>','Rex').replace('<what happened>','late').replace('<zone>','barn').replace(/\[[^\]]*\]/g,'').replace(/ ([a-z]+)\|[a-z|]+/,' $1').trim();
const SKIP=/^(backup|safe|safeword|red|stuck|report|unregister|staffremove|appclear|keydump|apply|addons off|deny|stall punish|pen )/;
(async()=>{ await wait(3500);
  W.__cfg.USER_COOLDOWN_S=0;                 // no 5 s gap, so the whole list runs quickly
  chars[1].Name='Laynie'; chars[2].Name='Rex'; chars[4].Name='Moo';
  for (const f of fs.readdirSync(path.join(__dirname,'../dist')).filter(f=>/^farmhand-(?!bot|companion).*\.user\.js$/.test(f))) eval(fs.readFileSync(path.join(__dirname,'../dist/'+f),'utf8'));
  await wait(300);
  const addons=W.Farmhand.list(); out('add-ons loaded ->', addons.length>=8, addons.map(a=>a.name).join(' '));
  // help lists and explains them
  let k=sent.length; handlers.AccountBeep({MemberNumber:221397,Message:'help me'}); await drain(400);
  const me=sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===221397).map(([e,d])=>d.Message).join('\n');
  const missing=[].concat(...G.PUBLIC_GROUPS.concat(G.STAFF_GROUPS,G.OWNER_GROUPS).map(g=>g.cmds)).filter(c=>!me.includes(c));
  out('?help me lists every shared command ->', !missing.length, missing.slice(0,8).join(', '));
  out('?help me lists add-on commands ->', /FARM EXTRAS/.test(me) && /glory on\|off/.test(me) && /needs on\|off/.test(me));
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'help glory'}); await drain(400);
  out('?help <add-on> explains it ->', sent.slice(k).some(([e,d])=>e==='AccountBeep'&&/Glory stalls/.test(d.Message)));
  k=sent.length; handlers.AccountBeep({MemberNumber:500,Message:'help me'}); await drain(400);
  const stock=sent.slice(k).filter(([e,d])=>e==='AccountBeep'&&d.MemberNumber===500).map(([e,d])=>d.Message).join('\n');
  out('stock do not see staff-only add-on commands ->', !/(^|\s|·)top($|\s)|hyp <|insp /m.test(stock) && /glory on\|off/.test(stock));
  // every command, rotating whisper / beep / bot
  const cmds=[...new Set([].concat(...G.PUBLIC_GROUPS.concat(G.STAFF_GROUPS,G.OWNER_GROUPS).map(g=>g.cmds), ...addons.map(a=>[])))];
  // add-on commands, as ?help me shows them
  const extra=(me.split('FARM EXTRAS')[1]||'').split('\n').filter(l=>l.startsWith('  ')).flatMap(l=>l.trim().split(' · '));
  const all=[...new Set(cmds.concat(extra))].map(fillIn).filter(c=>c&&!SKIP.test(c));
  const silent=[], leaked=[]; let i=0;
  for (const c of all){
    const ch=['whisper','beep','bot'][i++%3];
    const k0=sent.length;
    if (ch==='whisper') handlers.ChatRoomMessage({Sender:221397,Type:'Whisper',Content:c,Target:260239});
    else if (ch==='beep') handlers.AccountBeep({MemberNumber:221397,Message:c});
    else handlers.ChatRoomMessage({Sender:221397,Type:'Hidden',Content:'ChatRoomBot '+c});
    await drain(120);
    if (!seen(k0,221397)) silent.push(ch+':'+c);
    if (viaCompanion(k0,221397)) leaked.push(c);
  }
  out('every command answered without the Companion ('+all.length+' tried) ->', !silent.length, silent.join(' | '));
  out('nothing sent only to a Companion they do not have ->', !leaked.length, leaked.join(' | '));
  const errs=warns.filter(w=>/add-on|msg:|heartbeat/.test(w)); out('no errors logged ->', !errs.length, errs.slice(0,3).join(' | '));
  process.exit(0);
})();
