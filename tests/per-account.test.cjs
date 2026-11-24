// EVERY ACCOUNT ITS OWN (Nov 24). Laynie: "per account config, users are reporting their alt characters receiving the
// sizes of their farm character, and marks on other accounts". What the Companion remembers is kept per account now
// (extension/src/acct.js): an alt on the same browser starts from its own, a tab that switches accounts forgets the last
// one's farm, and what was saved before goes to the first account that reads it after the update.
const fs = require('fs'), path = require('path'), os = require('os');
const out = (...a) => process.stdout.write(a.join(' ') + '\n');
let fails = 0; const ok = (c, msg) => { out(msg + ' -> ' + (c ? 'true' : 'false')); if (!c) fails++; };
(async () => {
  const esbuild = require('esbuild'), tmp = path.join(os.tmpdir(), 'fh-acct-' + process.pid + '.cjs');
  await esbuild.build({ entryPoints: [path.join(__dirname, '../extension/src/acct.js')], bundle: true, format: 'cjs', outfile: tmp, logLevel: 'silent' });
  const ls = {};
  global.window = { localStorage: { getItem: (k) => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: (k) => { delete ls[k]; } } };
  // saved before the update, under the shared names
  ls['farmhand-drawn-body'] = '{"on":true,"cup":17}'; ls['fhc-shape'] = '{"BodyUpper":{"own":"Small","set":"XLarge"}}'; ls['farmhand-chatlog'] = '[1,2]';
  const A = require(tmp);
  const seen = []; A.onAccount((mn, first) => seen.push([mn, first]));
  ok(A.LS.getItem('farmhand-drawn-body') === null, 'nobody logged in yet: nothin\' of anybody\'s is read');
  window.Player = { MemberNumber: 1001 }; A.accountCheck();
  ok(seen.length === 1 && seen[0][0] === 1001 && seen[0][1] === true, 'the first account to log in: everybody who keeps things loads theirs');
  ok(A.LS.getItem('farmhand-drawn-body') === '{"on":true,"cup":17}' && ls['farmhand-drawn-body@1001'] && !('farmhand-drawn-body' in ls), 'what was saved before goes to the first account that reads it, and off the shared name');
  ok(A.LS.getItem('farmhand-chatlog') === '[1,2]' && 'farmhand-chatlog' in ls, 'the computer\'s own things stay shared (the chat log)');
  A.LS.setItem('fhc-marks', '{"splatGroup":"Mask"}');
  ok(ls['fhc-marks@1001'] === '{"splatGroup":"Mask"}' && !('fhc-marks' in ls), 'saved from now on: under the account\'s own name');
  // the alt logs in on the same tab
  window.Player = { MemberNumber: 2002 }; A.accountCheck();
  ok(seen.length === 2 && seen[1][0] === 2002 && seen[1][1] === false, 'a different account on the same tab: everybody loads theirs again');
  ok(A.LS.getItem('farmhand-drawn-body') === null && A.LS.getItem('fhc-marks') === null, 'the alt gets none of the main\'s drawn body, its sizes or its marks');
  A.LS.setItem('farmhand-drawn-body', '{"on":false}');
  window.Player = { MemberNumber: 1001 }; A.accountCheck();
  ok(A.LS.getItem('farmhand-drawn-body') === '{"on":true,"cup":17}', 'back on the main: their own, just as they left it');
  ok(A.accountCheck() === false, '...and nothin\' fires again while it\'s the same account');
  // every module that keeps somethin' of an account's uses it
  const src = (f) => fs.readFileSync(path.join(__dirname, '../extension/src/' + f), 'utf8');
  const mods = ['drawnbody.js', 'marks.js', 'outfits.js', 'messes.js', 'nursery.js', 'homeward.js', 'keys.js', 'panel.js'];
  const raw = mods.filter((f) => /\b(W|window)\.localStorage\b/.test(src(f)));
  ok(!raw.length && mods.every((f) => /from "\.\/acct\.js"/.test(src(f))), 'the drawn body, marks, gear, shape, outfits, messes, nursery, the whistle, wards and toggles: all per account (' + (raw.join(', ') || 'none left shared') + ')');
  const idx = src('index.js');
  ok(/onAccount\(\(mn, first\) => \{ if \(first\) return; st\.gotState = false;/.test(idx) && /initAcct\(\)/.test(idx), 'a different account on the tab forgets the last one\'s farm: roles, gear, sizes, till the farm girl says what this one\'s are');
  ok(/onAccount\(\(\) => \{ load\(\); farmMe = null; mine\.E = null;/.test(src('drawnbody.js')), '...and the drawn body loads the new account\'s own, with none of the last one\'s farm sizes');
  out(fails ? 'FAIL ' + fails : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
