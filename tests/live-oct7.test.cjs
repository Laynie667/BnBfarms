// From the Oct 7 watch: marion finished applyin', then tried ?breedable on and was told "Say ?apply first!"
// (her application was already in the queue); "?help glorty" found no guide instead of the glory stalls.
const fs=require('fs'), path=require('path');
const store={}; const sent=[]; const handlers={};
store.bnb_ledger_v1=JSON.stringify({v:4,people:{},applications:[{id:"a",mn:221990,name:"marion",at:1,staffTrack:false,answers:[],byKey:{name:"marion"}}],archive:{},log:[],stuckLog:[]});
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(){return null},visibilityState:'visible'};
const chars=[260239,221990,300].map(m=>({MemberNumber:m,Name:'N'+m,MapData:{Pos:{X:1,Y:1},PrivateState:{}}}));
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  Player:{MemberNumber:260239,FriendList:[]}, ChatRoomData:{Name:'B&B Farm',Admin:[260239]}, ChatRoomCharacter:chars,
  ChatRoomPlayerIsAdmin:()=>true, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
global.console={...console,log:()=>{},warn:()=>{}};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,m)=>{ out(m+' -> '+(c?'true':'false')); if(!c) fails++; };
const to=(mn,n)=>sent.slice(n).filter(([e,d])=>d&&d.Type==='Whisper'&&d.Target===mn).map(([e,d])=>String(d.Content)).join(' | ');
const say=async(mn,msg)=>{ handlers.ChatRoomMessage({Sender:mn,Type:'Whisper',Content:msg,Target:260239}); await wait(2500); };
(async()=>{ await wait(3500); W.__cfg.USER_COOLDOWN_S=0;
  let n=sent.length; await say(221990,'?breedable on');
  ok(/application's in/.test(to(221990,n)) && !/apply first/.test(to(221990,n)), 'somebody with an application waitin\' is told so, not to apply');
  n=sent.length; await say(300,'?breedable on');
  ok(/apply first/i.test(to(300,n)), 'somebody who never applied is still told to ?apply');
  n=sent.length; await say(300,'?help bodyu');
  ok(/BODY SIZES/.test(to(300,n)), '?help bodyu opens the body guide');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
