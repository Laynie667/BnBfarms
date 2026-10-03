/* WHAT'S IN THIS FILE (00-open.js)
   Imports (the shared protocol, the BC+ contract engine, the version) and the start of the one big
   function the whole bot lives in.
*/
import { FARM_MSG, PROTOCOL, makeMsg, readMsg } from "../../shared/protocol.js";
import * as BCPLUS from "../../shared/bcplus.js";
import { VERSION } from "./version.js";

(function () {
  "use strict";

