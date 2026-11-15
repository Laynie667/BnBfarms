/* WHAT'S IN THIS FILE (studio/map/src/main.tsx)
   THE B&B MAP STUDIO (Nov 14, 2026). Laynie: "similar to the outfit studio, could we make a map studio?", then "all of
   it", ".mappaste is fine", and event layouts: "maybe event swaps, like races or for trap mazes, etc. being able to swap
   the map as needed would be cool".
   Open http://localhost:4780/map with the studio running (Start the studio.bat). It waits for the game's own start-up
   to reach its sign-in screen (the map catalogue is loaded by then), puts its own screen in place of the game's, and
   shows the studio. Nothing is ever sent to the game's servers: the studio isn't signed in.
   Built from TypeScript by studio/server.mjs (esbuild) the first time the page asks for it.
*/
import { render } from "preact";
import { App } from "./ui/App";
import { gameReady, takeOverScreen } from "./game";
import * as game from "./game";
import { ed } from "./editor";

let tries = 0;
(function wait() {
  tries++;
  if (gameReady()) {
    try {
      takeOverScreen();
      document.body.classList.add("fh-map-on");
      const root = document.createElement("div"); root.id = "fh-map"; document.body.append(root);
      render(<App />, root);
      (window as any).FarmMapStudio = { ed, game };   // (for the console, and for checks: like the outfit studio's window.FarmStudio)
    } catch (e) {
      console.error("[map studio] couldn't start:", e);
      document.body.insertAdjacentHTML("beforeend", "<div id='fh-map' class='fail'><h1>B&amp;B map studio</h1><p>It couldn't start: " + String((e as Error).message || e).replace(/</g, "&lt;") + "</p></div>");
    }
    return;
  }
  if (tries > 600) { document.body.insertAdjacentHTML("beforeend", "<div id='fh-map' class='fail'><h1>B&amp;B map studio</h1><p>The game's own start-up never finished, so there's nothing to draw the map with. Is the internet on? Reload to try again.</p></div>"); return; }
  setTimeout(wait, 150);
})();
