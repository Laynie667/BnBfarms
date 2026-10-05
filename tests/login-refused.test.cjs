// Seen live: the saved login was out of date and the bot tried it every 20 seconds, refused each time (how
// accounts get locked), filling the login boxes while somebody typed. Now a refused login isn't tried again
// until it's changed, typing isn't overwritten, and repeated tries slow down.
const fs=require('fs'), path=require('path');
const store={ bnb_user:'farmbot', bnb_pass:'old-password' }; const sent=[]; const handlers={};
global.GM_getValue=(k,d)=>k in store?store[k]:d; global.GM_setValue=(k,v)=>store[k]=v; global.GM_registerMenuCommand=()=>{};
const fields={ InputName:{id:'InputName',value:''}, InputPassword:{id:'InputPassword',value:''} };
const doc={body:{appendChild(){}},createElement(){return {style:{},addEventListener(){}}},addEventListener(){},getElementById(id){return fields[id]||null},visibilityState:'visible',activeElement:null};
let logins=0;
const W={document:doc,addEventListener(){},location:{reload(){}},alert(){},prompt(){},
  ServerSend:(ev,d)=>sent.push([ev,d]), ServerSocket:{connected:true,on:(e,f)=>handlers[e]=f},
  LoginDoLogin:()=>{ logins++; },
  Player:{}, Commands:[]};
global.unsafeWindow=W; global.window=W; global.Blob=class{}; global.URL={createObjectURL(){}};
const warns=[]; global.console={...console,log:()=>{},warn:(...a)=>warns.push(a.join(' '))};
W.__FARMHAND_TEST__=true; eval(fs.readFileSync(path.join(__dirname,'../dist/farmhand-bot.user.js'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const out=(...a)=>process.stdout.write(a.join(' ')+'\n');
let fails=0; const ok=(c,msg)=>{ out(msg+' -> '+(c?'true':'false')); if(!c) fails++; };
(async()=>{ await wait(3500);
  const realNow=Date.now; let skew=0; Date.now=()=>realNow()+skew;
  W.__st().loginTried=0; W.__st().lastLoginAttempt=0;
  const before=logins; W.__tryLogin();
  ok(logins===before+1, 'the bot tries its saved login');
  handlers.LoginResponse('InvalidNamePassword');
  ok(warns.some(w=>/refused the saved login/.test(w)), 'a refusal is noticed');
  skew+=5*60000; W.__tryLogin(); skew+=5*60000; W.__tryLogin();
  ok(logins===before+1, '...and the same login is not tried again');
  ok(!!store.bnb_login_bad && !/old-password/.test(store.bnb_login_bad), 'it remembers a fingerprint, never the password');
  // a new login is saved: tried again
  store.bnb_user='farmbot'; store.bnb_pass='new-password';
  skew+=60000; W.__tryLogin();
  ok(logins===before+2, 'a newly saved login is tried');
  // somebody typing in the login boxes is left alone
  doc.activeElement=fields.InputPassword; skew+=5*60000; W.__tryLogin();
  ok(logins===before+2, 'nothing happens while somebody types in the login boxes');
  doc.activeElement=null;
  // other failures: after three tries, one every two minutes
  W.__st().loginTried=3; W.__st().lastLoginAttempt=Date.now(); skew+=20000; W.__tryLogin();
  ok(logins===before+2, 'after three tries, not every 20 seconds');
  skew+=120000; W.__tryLogin();
  ok(logins===before+3, '...but every two minutes');
  // a successful login resets the count
  handlers.LoginResponse({ MemberNumber:260239 });
  ok(W.__st().loginTried===0, 'a login that works resets the count');
  out(fails ? fails+' FAILED' : 'ALL PASSED'); process.exit(fails?1:0);
})();
