// ../../../../../packages/protocol/dist/version.js
var PROVIDER_GLOBAL = "claude";

// ../../../../../packages/protocol/dist/storage.js
var STORAGE_KEY_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
function isValidStorageKey(key) {
  return typeof key === "string" && STORAGE_KEY_RE.test(key);
}

// ../../../../../packages/protocol/dist/errors.js
var BYOPErrorCode = {
  /** User rejected the connect/consent request. (≈ 4001) */
  USER_REJECTED: 4001,
  /** Origin is not connected / has no grant for this method. (≈ 4100) */
  UNAUTHORIZED: 4100,
  /** Method exists but the origin's scope doesn't cover it (model/tool not granted). */
  SCOPE_EXCEEDED: 4110,
  /** A per-action write consent was denied by the user. */
  CONSENT_DENIED: 4120,
  /** Budget or rate limit hit (tokens/day or calls/min). */
  BUDGET_EXCEEDED: 4290,
  /** Unknown method. (≈ 4200) */
  UNSUPPORTED_METHOD: 4200,
  /** Bad params. (≈ -32602) */
  INVALID_PARAMS: -32602,
  /** The sidekick daemon is not installed / not reachable. The SDK maps this to its
   *  "install the sidekick" fallback. */
  PROVIDER_UNAVAILABLE: 4900,
  /** Backend error (model/tool failed for a non-policy reason). */
  BACKEND_ERROR: 4500
};

// ../../../../../packages/sdk/dist/connect-chip.js
function rungFromError(e) {
  if (e?.code !== BYOPErrorCode.PROVIDER_UNAVAILABLE)
    return null;
  return e?.data?.reason === "unpaired" ? { kind: "unpaired" } : { kind: "unreachable" };
}
var CHROME_STORE_URL = "https://chromewebstore.google.com/detail/injmjolmnekmahlnackakiamjepegagb";
var RELAY_DMG_URL = "https://github.com/sameeeeeeep/switchboard/releases/latest/download/Switchboard.dmg";
var STYLE = `
:host { all: initial; }
* { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
.chip, .btn { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; border: 0;
  font-size: 13px; font-weight: 600; line-height: 1; border-radius: 10px; }
/* The canonical connect lockup \u2014 the SAME mark + wordmark on every wrapp, so users recognize
   "Connect Switchboard" the way they knew the MetaMask button. Dark pill, lime glyph, locked in
   the shadow root so a host app can't restyle it away. */
.btn { padding: 9px 15px 9px 11px; background: #12151C; color: #E8EDF4; border: 1px solid #2C3444; }
.btn.connect:hover { background: #161B24; border-color: #3A4A18; }
.btn.get { color: #C3CAD6; border-color: #262C38; }
.btn.get:hover { color: #E8EDF4; border-color: #3A4353; }
.btn .arr { color: #6E7C90; font-weight: 500; margin-left: -2px; }
/* The Switchboard mark: lime rounded square with the top-right notch (matches the side-panel brand).
   Muted to slate when the sidekick isn't installed yet \u2014 the mark "lights up" once you can connect. */
.glyph { position: relative; width: 16px; height: 16px; border-radius: 5px; background: #C8F250;
  box-shadow: 0 0 12px rgba(200,242,80,.45); flex: none; }
.glyph::after { content: ""; position: absolute; top: 4px; right: 4px; width: 4px; height: 4px;
  border-radius: 50%; background: #0A0C10; }
.btn.get .glyph { background: #6E7C90; box-shadow: none; }
.wrap { position: relative; display: inline-block; }
.chip { background: #1A1F29; border: 1px solid #262C38; padding: 6px 10px 6px 7px; color: #E8EDF4; }
.chip:hover { border-color: #3A4353; }
.av { width: 26px; height: 26px; border-radius: 7px; background: #C8F250; color: #0A0C10; display: grid;
  place-items: center; font-weight: 700; font-size: 12px; overflow: hidden; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; }
.who { display: flex; flex-direction: column; gap: 3px; min-width: 0; text-align: left; }
.who .hi { font-size: 12.5px; font-weight: 600; white-space: nowrap; }
.who .proj { font-size: 10.5px; font-weight: 500; color: #99A3B7; white-space: nowrap; }
.caret { color: #6E7C90; font-size: 9px; margin-left: 2px; }
.menu { position: absolute; top: calc(100% + 6px); right: 0; z-index: 2147483000; width: 232px;
  background: #1A1F29; border: 1px solid #262C38; border-radius: 12px; padding: 7px;
  box-shadow: 0 18px 40px -20px rgba(0,0,0,.7); }
.menu .lbl { padding: 8px 10px 6px; font-size: 10px; font-weight: 600; letter-spacing: .06em;
  text-transform: uppercase; color: #6E7C90; }
.menu .proj-row { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 8px;
  background: #20262F; cursor: pointer; border: 0; width: 100%; color: #E8EDF4; font-size: 13px; font-weight: 600; }
.menu .proj-row:hover { background: #262d38; }
.menu .proj-row .go { margin-left: auto; color: #C8F250; font-size: 11px; font-weight: 600; }
.menu .sep { height: 1px; background: #262C38; margin: 6px 4px; }
.menu .item { display: block; width: 100%; text-align: left; padding: 8px 10px; border: 0; border-radius: 8px;
  background: transparent; color: #B4BECE; font-size: 13px; font-weight: 500; cursor: pointer; }
.menu .item:hover { background: #20262F; color: #E8EDF4; }
.menu .foot { padding: 8px 10px 4px; font-size: 11px; font-weight: 500; color: #6E7C90; line-height: 1.4; }
/* Setup-ladder pills (sidekick asleep / unpaired): quiet and informative, never red \u2014 nothing is
   broken. Amber only while the daemon is unreachable; the glyph stays muted until it's reachable. */
.dot { width: 7px; height: 7px; border-radius: 50%; background: #E8B84B; flex: none;
  box-shadow: 0 0 8px rgba(232,184,75,.45); }
.menu .body { padding: 8px 10px 2px; font-size: 12px; font-weight: 500; color: #B4BECE; line-height: 1.45; }
`;
function mountConnect(target, opts = {}) {
  const installUrl = opts.installUrl ?? "https://thelastprompt.ai/switchboard/";
  const host = document.createElement("div");
  host.style.display = "inline-block";
  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = STYLE;
  root.append(style);
  const mount = document.createElement("div");
  root.append(mount);
  target.append(host);
  let state = { kind: "booting" };
  let menuOpen = false;
  let destroyed = false;
  let relay2 = null;
  let seq = 0;
  let wasConnected = false;
  let lastProjectKey;
  let sessionDisconnected = false;
  const onDocClick = (e) => {
    if (menuOpen && !host.contains(e.target)) {
      menuOpen = false;
      render();
    }
  };
  document.addEventListener("click", onDocClick);
  const initEvent = `${PROVIDER_GLOBAL}#initialized`;
  let lateWatching = false;
  const onLateInit = () => {
    lateWatching = false;
    window.removeEventListener(initEvent, onLateInit);
    if (!destroyed)
      void refresh();
  };
  function watchForLateProvider() {
    if (lateWatching || destroyed)
      return;
    lateWatching = true;
    window.addEventListener(initEvent, onLateInit);
  }
  function el2(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
      n.className = cls;
    if (text != null)
      n.textContent = text;
    return n;
  }
  async function refresh() {
    const my = ++seq;
    const r = await whenRelayReady(2500, { installUrl });
    if (destroyed || my !== seq)
      return;
    if (!(r instanceof Relay)) {
      watchForLateProvider();
      state = { kind: "not-installed", installUrl };
      return render();
    }
    relay2 = r;
    subscribe(r);
    const h = await r.health();
    if (destroyed || my !== seq)
      return;
    if (h && !h.reachable) {
      state = { kind: "unreachable", appMissing: h.installedHere === false };
      emitTransition(false);
      return render();
    }
    if (h && !h.paired) {
      state = { kind: "unpaired" };
      emitTransition(false);
      return render();
    }
    let permErr = null;
    const grant = sessionDisconnected ? null : await r.permissions().catch((e) => {
      permErr = e;
      return null;
    });
    if (destroyed || my !== seq)
      return;
    if (!grant) {
      const rung = !h ? rungFromError(permErr) : null;
      if (rung) {
        state = rung;
        emitTransition(false);
        return render();
      }
      state = { kind: "disconnected", relay: r };
      emitTransition(false);
      return render();
    }
    const wantsContext = opts.context !== "none";
    const [user, project] = await Promise.all([
      r.identity(),
      wantsContext ? r.context.active().catch(() => null) : Promise.resolve(null)
    ]);
    if (destroyed || my !== seq)
      return;
    const wasAlreadyConnected = wasConnected;
    state = { kind: "connected", relay: r, user, project };
    emitTransition(true);
    const projKey = project ? project.id ?? project.name : null;
    if (wasAlreadyConnected && lastProjectKey !== void 0 && projKey !== lastProjectKey)
      opts.onProjectChange?.(project);
    lastProjectKey = projKey;
    render();
  }
  function emitTransition(connected) {
    if (connected === wasConnected)
      return;
    wasConnected = connected;
    if (connected && relay2)
      opts.onConnect?.(relay2);
    else if (!connected)
      opts.onDisconnect?.();
  }
  let subscribed = false;
  function subscribe(r) {
    if (subscribed)
      return;
    subscribed = true;
    r.on("permissionsChanged", () => {
      void refresh();
    });
    r.on("disconnect", () => {
      void refresh();
    });
    r.on("health", () => {
      void refresh();
    });
  }
  async function doConnect() {
    if (!relay2)
      return;
    try {
      sessionDisconnected = false;
      await relay2.connect(opts.scope);
      await refresh();
    } catch (e) {
      const err = e;
      if (err?.code !== BYOPErrorCode.PROVIDER_UNAVAILABLE)
        return;
      await refresh();
      if (state.kind === "disconnected") {
        const rung = rungFromError(err);
        if (rung) {
          state = rung;
          emitTransition(false);
          render();
        }
      }
    }
  }
  async function doPick() {
    if (!relay2)
      return;
    menuOpen = false;
    render();
    await relay2.context.pick().catch(() => null);
    await refresh();
  }
  async function doDisconnect() {
    if (!relay2)
      return;
    menuOpen = false;
    sessionDisconnected = true;
    await relay2.disconnect().catch(() => {
    });
    await refresh();
  }
  function render() {
    if (destroyed)
      return;
    mount.textContent = "";
    if (state.kind === "booting")
      return;
    if (state.kind === "not-installed") {
      const url = state.installUrl;
      const wrap2 = el2("div", "wrap");
      const b = el2("button", "btn get");
      b.append(el2("span", "glyph"), el2("span", void 0, "Get Switchboard"), el2("span", "arr", "\u2197"));
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el2("div", "menu");
        menu.append(el2("div", "body", "Two parts: the Chrome extension, then Switchboard for Mac."));
        const store = el2("button", "item", "1 \xB7 Add to Chrome \u2197");
        store.onclick = () => {
          menuOpen = false;
          render();
          window.open(CHROME_STORE_URL, "_blank", "noopener");
        };
        const guide = el2("button", "item", "2 \xB7 Get Switchboard for Mac \u2197");
        guide.onclick = () => {
          menuOpen = false;
          render();
          window.open(url, "_blank", "noopener");
        };
        menu.append(store, guide);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state.kind === "unreachable") {
      const appMissing = state.appMissing === true;
      const wrap2 = el2("div", "wrap");
      const b = el2("button", "btn get");
      b.append(el2("span", "glyph"), el2("span", void 0, appMissing ? "Get Switchboard for Mac" : "Your sidekick is asleep"), el2("span", appMissing ? "arr" : "dot", appMissing ? "\u2197" : void 0), ...appMissing ? [] : [el2("span", "caret", "\u25BE")]);
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el2("div", "menu");
        if (appMissing) {
          menu.append(el2("div", "body", "Extension \u2713 \u2014 now the other half: Switchboard, the Mac app that holds your Claude."));
          const dl = el2("button", "item", "Download Switchboard.dmg \u2197");
          dl.onclick = () => {
            menuOpen = false;
            render();
            window.open(RELAY_DMG_URL, "_blank", "noopener");
          };
          menu.append(dl, el2("div", "sep"));
        } else {
          menu.append(el2("div", "body", "Open the Switchboard menubar app to wake it."));
          const retry = el2("button", "item", "Retry");
          retry.onclick = () => {
            menuOpen = false;
            render();
            void refresh();
          };
          menu.append(retry, el2("div", "sep"));
        }
        const setup = el2("button", "item", "New here? Full setup \u2197");
        setup.onclick = () => {
          menuOpen = false;
          render();
          window.open(installUrl, "_blank", "noopener");
        };
        menu.append(setup);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state.kind === "unpaired") {
      const wrap2 = el2("div", "wrap");
      const b = el2("button", "btn connect");
      b.append(el2("span", "glyph"), el2("span", void 0, "Almost there \u2014 pair in the side panel"), el2("span", "caret", "\u25BE"));
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el2("div", "menu");
        menu.append(el2("div", "body", "Click the Switchboard icon in your Chrome toolbar and paste your pairing token."));
        const retry = el2("button", "item", "Retry");
        retry.onclick = () => {
          menuOpen = false;
          render();
          void refresh();
        };
        menu.append(retry);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state.kind === "disconnected") {
      const b = el2("button", "btn connect");
      b.append(el2("span", "glyph"), el2("span", void 0, "Connect Switchboard"));
      b.onclick = doConnect;
      mount.append(b);
      return;
    }
    const { user, project } = state;
    const rawName = user?.name?.trim();
    const collides = !!rawName && !!project?.name && rawName.toLowerCase() === project.name.toLowerCase();
    const name = !rawName || collides ? "there" : rawName;
    const wrap = el2("div", "wrap");
    const chip = el2("button", "chip");
    const av = el2("div", "av");
    if (user?.avatar) {
      const img = el2("img");
      img.src = user.avatar;
      img.alt = name;
      av.append(img);
    } else
      av.textContent = name.charAt(0).toUpperCase();
    const wantsContext = opts.context !== "none";
    const who = el2("div", "who");
    who.append(el2("div", "hi", `Hi ${name}`));
    who.append(el2("div", "proj", wantsContext ? project ? project.name : "No context lent" : "Connected"));
    chip.append(av, who, el2("span", "caret", "\u25BE"));
    chip.onclick = (e) => {
      e.stopPropagation();
      menuOpen = !menuOpen;
      render();
    };
    wrap.append(chip);
    if (menuOpen) {
      const menu = el2("div", "menu");
      if (wantsContext) {
        menu.append(el2("div", "lbl", "Working on"));
        const row = el2("button", "proj-row");
        row.append(el2("span", void 0, project ? project.name : "Choose a context"));
        row.append(el2("span", "go", project ? "Switch \u25B8" : "Choose \u25B8"));
        row.onclick = doPick;
        menu.append(row, el2("div", "sep"));
      }
      const dc = el2("button", "item", "Disconnect this app");
      dc.onclick = doDisconnect;
      menu.append(dc);
      menu.append(el2("div", "foot", "Connectors, budgets & activity live in the Switchboard toolbar panel."));
      wrap.append(menu);
    }
    mount.append(wrap);
  }
  render();
  void refresh();
  return {
    refresh: () => void refresh(),
    destroy: () => {
      destroyed = true;
      document.removeEventListener("click", onDocClick);
      window.removeEventListener(initEvent, onLateInit);
      host.remove();
    }
  };
}

// ../../../../../packages/sdk/dist/index.js
var warnedStorageKeys = /* @__PURE__ */ new Set();
function warnBadStorageKey(key) {
  if (isValidStorageKey(key) || warnedStorageKeys.has(key))
    return;
  warnedStorageKeys.add(key);
  const suggestion = String(key).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^[^A-Za-z0-9]+/, "") || "key";
  console.warn(`[relay.storage] invalid key ${JSON.stringify(key)} \u2014 this write/read WILL be rejected by the daemon and silently do nothing.
  Keys map 1:1 to files (<key>.json) in this origin's folder, so they must match ${STORAGE_KEY_RE}.
  ":" is not allowed (illegal on NTFS; "a:b" is Alternate Data Stream syntax on Windows). Try ${JSON.stringify(suggestion)}.`);
}
var Relay = class {
  provider;
  constructor(provider) {
    this.provider = provider;
  }
  get version() {
    return this.provider.version;
  }
  capabilities() {
    return this.provider.request({ method: "claude_capabilities" });
  }
  connect(scope) {
    return this.provider.request({ method: "claude_connect", params: scope });
  }
  /** Drop this app's connection for the current page session. The grant persists (a later connect()
   *  won't reprompt) — this is "disconnect from this tab", not "revoke". Full revoke lives in the panel. */
  disconnect() {
    return this.provider.request({ method: "claude_disconnect" });
  }
  permissions() {
    return this.provider.request({ method: "claude_permissions" });
  }
  /** The setup-ladder snapshot (reachable/paired/connected), answered by the EXTENSION from its
   *  own state — never the daemon — so it resolves fast (<1s) in every degraded state, including
   *  the ones where every other method would hang. Resolves null when the extension is too old to
   *  know `claude_health` (or its worker is unreachable): callers MUST treat null as "unknown"
   *  and fall back to probing permissions() exactly as before — that skew guard is load-bearing
   *  while store users run an older extension against newer app bundles. */
  health() {
    const answer = this.provider.request({ method: "claude_health" }).catch(() => null);
    const timer = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
    return Promise.race([answer, timer]);
  }
  /** The paired user's public identity (name/avatar), or null if unavailable. Convenience over
   *  capabilities().user — what the connect chip greets with ("Hi Sameep"). */
  identity() {
    return this.capabilities().then((c) => c.user ?? null).catch(() => null);
  }
  /** Synthesize speech ON-DEVICE via a local model/engine (no cloud, no connector, no credits).
   *  Returns audio as a playable data: URL, or null if no local TTS is available.
   *
   *    const clip = await relay.speak("hey, it's Maya");
   *    if (clip) new Audio(clip.audio).play();
   */
  speak(text, opts) {
    return this.provider.request({ method: "claude_speak", params: { text, voice: opts?.voice } }).catch(() => null);
  }
  listTools() {
    return this.provider.request({ method: "claude_listTools" }).then((r) => r.tools);
  }
  callTool(name, args) {
    const call = { name, arguments: args };
    return this.provider.request({ method: "claude_callTool", params: call });
  }
  complete(params) {
    return this.provider.request({ method: "claude_complete", params });
  }
  /** Streamed completion as an async iterator of deltas. Ends after a `done`/`error` delta. */
  async *stream(params) {
    const { streamId } = await this.provider.request({ method: "claude_stream", params });
    const queue = [];
    let notify = null;
    let ended = false;
    const handler = (payload) => {
      const p = payload;
      if (p.streamId !== streamId)
        return;
      queue.push(p);
      if (p.type === "done" || p.type === "error")
        ended = true;
      notify?.();
    };
    this.provider.on("delta", handler);
    try {
      while (true) {
        if (queue.length === 0) {
          if (ended)
            break;
          await new Promise((r) => notify = r);
          notify = null;
          continue;
        }
        yield queue.shift();
      }
    } finally {
      this.provider.removeListener("delta", handler);
    }
  }
  on(event, handler) {
    this.provider.on(event, handler);
  }
  /**
   * Per-origin local storage — a private on-disk key/value store for this app, plus `bind` to point
   * it at a real folder the user picks. Values are opaque strings (store JSON). Isolated per origin;
   * reads are free, writes need the site not to be read-only, and `bind` prompts for the exact path.
   *
   *   await relay.storage.set("workspace", JSON.stringify(data));
   *   const raw = await relay.storage.get("workspace");
   *   await relay.storage.bind("~/Documents/Projects/brandbrain/.data"); // existing files appear as records
   */
  get storage() {
    const req = (params) => this.provider.request({ method: "claude_storage", params });
    const k = (key) => {
      warnBadStorageKey(key);
      return key;
    };
    return {
      get: (key) => req({ op: "get", key: k(key) }).then((r) => r.value ?? null),
      set: (key, value) => req({ op: "set", key: k(key), value }).then(() => void 0),
      delete: (key) => req({ op: "delete", key: k(key) }).then((r) => r.ok),
      list: () => req({ op: "list" }).then((r) => r.keys ?? []),
      info: () => req({ op: "info" }).then((r) => r.info),
      /** Point this app's store at a real folder (triggers a path-consent click). */
      bind: (path) => req({ op: "bind", path }).then((r) => r.info),
      /** Open a NATIVE folder chooser on the daemon's machine (macOS today). The user picking a
       *  folder in an OS dialog that names this origin IS the path consent, so a successful pick
       *  comes back already bound. Resolves undefined on cancel or when no native picker exists —
       *  keep a typed-path `bind` as the fallback UI. */
      pick: (reason) => req({ op: "pick", reason }).then((r) => r.info).catch(() => void 0)
    };
  }
  /**
   * Shared, cross-app context — your portable brand knowledge. Publish a whole context; read the one
   * the user selected for this app; or open the picker. Selection happens in the side panel, so an
   * app only ever receives the context the user chose to lend it — never the whole library.
   *
   *   await relay.context.publish({ name: "Aamras", kind: "brand", data: brand });
   *   const active = await relay.context.active();   // the brand the user loaded for this app, or null
   */
  get context() {
    const req = (params) => this.provider.request({ method: "claude_context", params });
    return {
      publish: (context) => req({ op: "publish", context }).then((r) => r.id),
      list: () => req({ op: "list" }).then((r) => r.contexts ?? []),
      active: () => req({ op: "active" }).then((r) => r.context ?? null),
      pick: () => req({ op: "pick" }).then((r) => r.context ?? null),
      /** Read ONE context listed via `list()` in full, and make it this app's selection. Needs the
       *  kind granted at connect (ScopeRequest.contextKinds) — powers in-app brand dropdowns. */
      use: (id) => req({ op: "use", id }).then((r) => r.context ?? null)
    };
  }
};
var DEFAULT_INSTALL_URL = "https://thelastprompt.ai/switchboard/";
function getRelay(opts) {
  const provider = globalThis[PROVIDER_GLOBAL];
  if (provider?.isRelay)
    return new Relay(provider);
  return { installed: false, installUrl: opts?.installUrl ?? DEFAULT_INSTALL_URL };
}
function whenRelayReady(timeoutMs = 3e3, opts) {
  const now3 = getRelay(opts);
  if (now3 instanceof Relay)
    return Promise.resolve(now3);
  return new Promise((resolve) => {
    const onInit = () => {
      cleanup();
      resolve(getRelay(opts));
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve({ installed: false, installUrl: opts?.installUrl ?? DEFAULT_INSTALL_URL });
    }, timeoutMs);
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener(`${PROVIDER_GLOBAL}#initialized`, onInit);
    }
    window.addEventListener(`${PROVIDER_GLOBAL}#initialized`, onInit);
  });
}

// src/store/catalog.js
var APPS = [
  // featured
  {
    id: "brandbrain",
    name: "brandbrain",
    href: "https://brandbrain.thelastprompt.ai/build",
    tokens: 48e5,
    updates: 61,
    pro: ["multi-brand portfolio", "competitor war-room refresh"]
  },
  {
    id: "ideabrain",
    name: "ideabrain",
    href: "https://brandbrain.thelastprompt.ai/build?studio=idea",
    tokens: 34e5,
    updates: 42,
    pro: ["multi-thesis compare", "investor-grade deck packs"]
  },
  {
    id: "bank",
    name: "Bank",
    href: "https://bank.thelastprompt.ai",
    tokens: 29e5,
    updates: 38,
    pro: ["recurring extractors", "cross-vault syntheses"]
  },
  // validate an idea (ideabrain templates — free-only presets)
  {
    id: "mkt",
    name: "Marketplace Validator",
    href: "https://brandbrain.thelastprompt.ai/build?studio=idea&template=marketplace",
    tokens: 26e4,
    updates: 8,
    pro: null
  },
  {
    id: "capp",
    name: "Consumer App Planner",
    href: "https://brandbrain.thelastprompt.ai/build?studio=idea&template=app",
    tokens: 23e4,
    updates: 7,
    pro: null
  },
  {
    id: "saas",
    name: "SaaS Thesis",
    href: "https://brandbrain.thelastprompt.ai/build?studio=idea&template=saas",
    tokens: 24e4,
    updates: 7,
    pro: null
  },
  {
    id: "retail",
    name: "Retail Concept",
    href: "https://brandbrain.thelastprompt.ai/build?studio=idea&template=retail",
    tokens: 21e4,
    updates: 6,
    pro: null
  },
  {
    id: "hardware",
    name: "Hardware Reality Check",
    href: "https://brandbrain.thelastprompt.ai/build?studio=idea&template=hardware",
    tokens: 22e4,
    updates: 6,
    pro: null
  },
  {
    id: "feature",
    name: "Feature Case",
    href: "https://brandbrain.thelastprompt.ai/build?studio=idea&template=feature",
    tokens: 19e4,
    updates: 5,
    pro: null
  },
  // the founder stack
  {
    id: "adpulse",
    name: "AdPulse",
    href: "https://adpulse.thelastprompt.ai",
    tokens: 14e5,
    updates: 22,
    pro: ["scheduled post-mortems", "multi-account rollups"]
  },
  {
    id: "adforge",
    name: "AdForge",
    href: "https://adforge.thelastprompt.ai",
    tokens: 21e5,
    updates: 34,
    pro: ["multi-variant matrices", "competitor-reactive refresh"]
  },
  {
    id: "shelf",
    name: "Shelf",
    href: "https://shelf.thelastprompt.ai",
    tokens: 86e4,
    updates: 14,
    pro: ["reorder automation", "supplier lead-time watch"]
  },
  {
    id: "studio",
    name: "Studio",
    href: "https://studio.thelastprompt.ai",
    tokens: 94e4,
    updates: 16,
    pro: ["batch shot lists", "white-label exports"]
  },
  {
    id: "aplus",
    name: "A-Plus",
    href: "https://aplus.thelastprompt.ai",
    tokens: 11e5,
    updates: 18,
    pro: ["bulk listing runs", "variant A/B stacks"]
  },
  {
    id: "batch",
    name: "Batch",
    href: "https://batch.thelastprompt.ai",
    tokens: 34e4,
    updates: 3,
    pro: null
  },
  {
    id: "take",
    name: "Take",
    href: "https://take.thelastprompt.ai",
    tokens: 12e4,
    updates: 2,
    pro: null
  },
  {
    id: "identity",
    name: "Identity",
    href: "https://identity.thelastprompt.ai",
    tokens: 18e4,
    updates: 2,
    pro: null
  },
  {
    id: "reel",
    name: "Reel",
    href: "https://reel.thelastprompt.ai",
    tokens: 26e4,
    updates: 2,
    pro: ["batch reels", "brand-kit auto-scenes"]
  },
  {
    id: "marquee",
    name: "Marquee",
    href: "https://marquee.thelastprompt.ai",
    tokens: 3e5,
    updates: 2,
    pro: ["multi-page sites", "publish to a domain"]
  },
  {
    id: "huddle",
    name: "Huddle",
    href: "https://huddle.thelastprompt.ai",
    tokens: 15e4,
    updates: 1,
    pro: null
  },
  // after hours
  {
    id: "natal",
    name: "NATAL",
    href: "https://natal.thelastprompt.ai",
    tokens: 48e4,
    updates: 9,
    pro: null
  },
  {
    id: "arcana",
    name: "Arcana",
    href: "https://arcana.thelastprompt.ai",
    tokens: 39e4,
    updates: 7,
    pro: null
  },
  // play & make
  {
    id: "redline",
    name: "Redline",
    href: "https://redline.thelastprompt.ai",
    tokens: 17e5,
    updates: 26,
    pro: ["whole-site crawls", "scheduled re-reviews + diffs"]
  },
  {
    id: "cartridge",
    name: "Cartridge",
    href: "https://cartridge.thelastprompt.ai",
    tokens: 72e4,
    updates: 12,
    pro: null
  },
  {
    id: "cast",
    name: "Cast",
    href: "https://cast.thelastprompt.ai",
    tokens: 13e5,
    updates: 21,
    pro: ["multi-persona rosters", "reel batching"]
  },
  {
    id: "prism",
    name: "Prism",
    href: "https://prism.thelastprompt.ai",
    tokens: 31e4,
    updates: 8,
    pro: null
  },
  {
    id: "adgen",
    name: "Adwall",
    href: "https://adgen.thelastprompt.ai",
    tokens: 54e4,
    updates: 11,
    pro: null
  }
];
var APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));
function fmtTok(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return Math.round(n / 1e3) + "K";
  return String(n);
}

// src/store/glyphs.js
var FAM = {
  gold: { ink: "#B4802A", soft: "#F2E8D2", light: "#E9C56B" },
  // ads / founder / commerce
  green: { ink: "#5E8B23", soft: "#E9F0DB", light: "#9FCB6E" },
  // build / brand
  pink: { ink: "#B54A78", soft: "#F0E7F1", light: "#E08CB0" },
  // studio / photo / persona
  blue: { ink: "#3A6EA5", soft: "#E7F0F6", light: "#7FB0E0" },
  // review / doc / validate
  teal: { ink: "#2E8B6A", soft: "#E7F1EC", light: "#7FC3AB" },
  // chat / make
  violet: { ink: "#7B5EA8", soft: "#EDE8F3", light: "#B49BD8" }
  // play / after-hours
};
var G = {
  spark: `<path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9Z"/>`,
  layers: `<path d="M12 3l8 4-8 4-8-4Z"/><path d="M4 12l8 4 8-4"/><path d="M4 16l8 4 8-4"/>`,
  bulb: `<path d="M9 18h6"/><path d="M10 21h4"/><path d="M8 14a6 6 0 1 1 8 0c-.8.8-1 1.4-1 2H9c0-.6-.2-1.2-1-2Z"/>`,
  doc: `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>`,
  chart: `<path d="M4 20V5M4 20h16"/><path d="M7 16l3.5-4 3 2.2L20 8"/>`,
  camera: `<path d="M4 8h3l1.5-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13" r="3.2"/>`,
  person: `<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>`,
  play: `<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5Z"/>`,
  box: `<path d="M4 8l8-4 8 4v8l-8 4-8-4Z"/><path d="M4 8l8 4 8-4M12 12v8"/>`,
  grid: `<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>`,
  chat: `<path d="M4 5h16v11H9l-4 4V16H4Z"/>`,
  moon: `<path d="M20 13.5A8 8 0 1 1 10.5 4a6.2 6.2 0 0 0 9.5 9.5Z"/>`,
  cards: `<rect x="4" y="5" width="10" height="14" rx="2"/><path d="M9 5.4l6 1.6a2 2 0 0 1 1.4 2.5L14 19"/>`,
  tag: `<path d="M4 11V5a1 1 0 0 1 1-1h6l9 9-7 7Z"/><circle cx="8" cy="8" r="1.4"/>`,
  pen: `<path d="M4 20l4-1L19 8a2 2 0 0 0-3-3L5 16Z"/><path d="M14 6l3 3"/>`,
  landing: `<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M8 13h8M8 16h5"/>`,
  huddle: `<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3Z"/>`,
  // ---- viral-wrapp factory glyphs (2026-07) ----
  pad: `<rect x="2.5" y="8" width="19" height="9" rx="4.5"/><path d="M7 12.5h3M8.5 11v3"/><circle cx="15.5" cy="11.5" r="1.1"/><circle cx="17.5" cy="13.5" r="1.1"/>`,
  panel: `<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16M13 4v8M11 12v8"/>`,
  book: `<path d="M12 6.5C10 4.8 7.2 4.6 4 5.5v13c3.2-.9 6-.7 8 1 2-1.7 4.8-1.9 8-1v-13c-3.2-.9-6-.7-8 1Z"/><path d="M12 7.5v11"/>`,
  note: `<circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="15" r="2.5"/><path d="M9.5 17V6l10-2v11"/>`,
  flame: `<path d="M12 3c1 3.2 4 4.2 4 8a4 4 0 0 1-8 0c0-1.2.6-2.2 1.2-2.8C10 9.8 12 8.6 12 3Z"/>`,
  smile: `<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4.2 4.2 0 0 0 7 0"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/>`,
  paw: `<circle cx="7" cy="9" r="1.7"/><circle cx="12" cy="7" r="1.7"/><circle cx="17" cy="9" r="1.7"/><path d="M12 12c-3 0-5 1.9-5 4.3S9 20 12 20s5-1 5-3.7S15 12 12 12Z"/>`,
  sofa: `<rect x="3" y="11" width="18" height="6.5" rx="2"/><path d="M5 11V8.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2V11M6 17.5v2M18 17.5v2"/>`,
  thumb: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.5l5 2.5-5 2.5Z"/>`,
  meme: `<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M7 8.5h10M8 16h8"/><circle cx="12" cy="12" r="2.1"/>`
};
var GLYPHS = {
  brandbrain: { fam: "green", glyph: G.layers, motif: "build" },
  ideabrain: { fam: "blue", glyph: G.bulb, motif: "chart" },
  bank: { fam: "teal", glyph: G.doc, motif: "doc" },
  mkt: { fam: "blue", glyph: G.chart, motif: "chart" },
  capp: { fam: "blue", glyph: G.play, motif: "chart" },
  saas: { fam: "blue", glyph: G.layers, motif: "chart" },
  retail: { fam: "blue", glyph: G.tag, motif: "chart" },
  hardware: { fam: "blue", glyph: G.box, motif: "chart" },
  feature: { fam: "blue", glyph: G.spark, motif: "chart" },
  adpulse: { fam: "gold", glyph: G.chart, motif: "chart" },
  adforge: { fam: "gold", glyph: G.spark, motif: "spark" },
  shelf: { fam: "gold", glyph: G.box, motif: "build" },
  studio: { fam: "pink", glyph: G.camera, motif: "shot" },
  aplus: { fam: "gold", glyph: G.tag, motif: "spark" },
  batch: { fam: "gold", glyph: G.doc, motif: "doc" },
  take: { fam: "teal", glyph: G.play, motif: "shot" },
  identity: { fam: "violet", glyph: G.person, motif: "shot" },
  reel: { fam: "pink", glyph: G.play, motif: "shot" },
  marquee: { fam: "blue", glyph: G.landing, motif: "doc" },
  huddle: { fam: "teal", glyph: G.huddle, motif: "chat" },
  natal: { fam: "violet", glyph: G.moon, motif: "grid" },
  arcana: { fam: "violet", glyph: G.cards, motif: "grid" },
  redline: { fam: "blue", glyph: G.pen, motif: "doc" },
  cartridge: { fam: "violet", glyph: G.grid, motif: "grid" },
  cast: { fam: "pink", glyph: G.person, motif: "shot" },
  prism: { fam: "pink", glyph: G.camera, motif: "shot" },
  adgen: { fam: "pink", glyph: G.grid, motif: "grid" },
  chat: { fam: "teal", glyph: G.chat, motif: "chat" },
  // viral-wrapp factory (2026-07)
  arcade: { fam: "violet", glyph: G.pad, motif: "grid" },
  yearbook: { fam: "pink", glyph: G.grid, motif: "grid" },
  toon: { fam: "violet", glyph: G.panel, motif: "grid" },
  storybook: { fam: "teal", glyph: G.book, motif: "doc" },
  anthem: { fam: "violet", glyph: G.note, motif: "spark" },
  roast: { fam: "gold", glyph: G.flame, motif: "spark" },
  emote: { fam: "pink", glyph: G.smile, motif: "grid" },
  inkling: { fam: "violet", glyph: G.pen, motif: "grid" },
  petrait: { fam: "pink", glyph: G.paw, motif: "shot" },
  rizz: { fam: "pink", glyph: G.chat, motif: "chat" },
  dreamlog: { fam: "violet", glyph: G.moon, motif: "grid" },
  roomify: { fam: "teal", glyph: G.sofa, motif: "shot" },
  thumbs: { fam: "gold", glyph: G.thumb, motif: "shot" },
  meme: { fam: "gold", glyph: G.meme, motif: "grid" },
  _default: { fam: "teal", glyph: G.doc, motif: "doc" }
};
var entry = (id) => GLYPHS[id] || GLYPHS._default;
function famOf(id) {
  return FAM[entry(id).fam] || FAM.teal;
}
function glyphSvg(id) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${entry(id).glyph}</svg>`;
}
var FAM_TILE = { gold: "#E5922B", green: "#3DA35D", pink: "#E93D82", blue: "#4C7EF3", teal: "#12A594", violet: "#8B5CF6" };
var TILE = {
  brandbrain: "#3DA35D",
  ideabrain: "#F2A03D",
  bank: "#12A594",
  // validate-an-idea presets — deliberately spread across the wheel
  mkt: "#4C7EF3",
  capp: "#E93D82",
  saas: "#5B5BD6",
  retail: "#E5732B",
  hardware: "#7C8CA5",
  feature: "#2E9E6E",
  // founder stack
  adpulse: "#3E63DD",
  adforge: "#EC6142",
  shelf: "#46A758",
  studio: "#D6409F",
  aplus: "#F5820A",
  batch: "#FF6B2C",
  take: "#2AA198",
  identity: "#8E4EC6",
  reel: "#7C3AED",
  marquee: "#6E56CF",
  huddle: "#0E9C8A",
  // after hours + play
  natal: "#5847C7",
  arcana: "#8B5CF6",
  redline: "#E5484D",
  cartridge: "#9A4EC6",
  cast: "#E5457E",
  prism: "#C13FAF",
  adgen: "#EC6142"
};
function tileColor(id) {
  return TILE[id] || FAM_TILE[entry(id).fam] || "#12A594";
}
function glyphTile(id, size = 34) {
  const c = tileColor(id);
  const s2 = document.createElement("span");
  s2.className = "ic";
  s2.style.width = s2.style.height = size + "px";
  s2.style.background = `linear-gradient(155deg, color-mix(in srgb, ${c} 76%, #fff 24%), ${c} 74%)`;
  s2.style.color = "#fff";
  s2.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.34), inset 0 0 0 1px rgba(255,255,255,.10), 0 3px 8px -3px rgba(0,0,0,.6)";
  s2.innerHTML = glyphSvg(id);
  return s2;
}
var MOTIF = {
  doc: (ink) => `<rect x="30" y="34" width="150" height="14" rx="5" fill="${ink}"/><rect x="30" y="60" width="220" height="9" rx="4" fill="${ink}" opacity=".38"/><rect x="30" y="80" width="180" height="9" rx="4" fill="${ink}" opacity=".38"/><rect x="30" y="118" width="150" height="9" rx="4" fill="${ink}" opacity=".55"/><path d="M252 120l7 7 13-13" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  chart: (ink) => `<circle cx="258" cy="152" r="60" fill="${ink}" opacity=".12"/><polyline points="24,150 78,132 130,138 180,104 232,112 300,58" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="300" cy="58" r="7" fill="${ink}"/>`,
  shot: (ink, soft) => `<rect x="118" y="48" width="84" height="128" rx="22" fill="${ink}" opacity=".9"/><circle cx="160" cy="102" r="24" fill="${soft}"/><rect x="128" y="140" width="64" height="12" rx="6" fill="${soft}" opacity=".8"/>`,
  grid: (ink) => `<g fill="${ink}"><rect x="86" y="52" width="26" height="26" rx="5"/><rect x="120" y="52" width="26" height="26" rx="5" opacity=".55"/><rect x="154" y="86" width="26" height="26" rx="5"/><rect x="120" y="86" width="26" height="26" rx="5"/><rect x="188" y="120" width="26" height="26" rx="5" opacity=".55"/><rect x="120" y="120" width="26" height="26" rx="5"/></g>`,
  spark: (ink) => `<circle cx="236" cy="104" r="72" fill="${ink}" opacity=".9"/><path d="M64 56l6.5 19 19 6.5-19 6.5-6.5 19-6.5-19-19-6.5 19-6.5Z" fill="${ink}" opacity=".5"/>`,
  chat: (ink) => `<rect x="34" y="44" width="150" height="56" rx="16" fill="${ink}" opacity=".85"/><path d="M60 100l0 22 22-22Z" fill="${ink}" opacity=".85"/><rect x="140" y="104" width="146" height="48" rx="16" fill="${ink}" opacity=".4"/>`,
  build: (ink) => `<path d="M160 40l90 44-90 44-90-44Z" fill="${ink}" opacity=".85"/><path d="M70 108l90 44 90-44" fill="none" stroke="${ink}" stroke-width="6" opacity=".5"/>`
};
function thumbArt(id) {
  const f = famOf(id);
  const motif = (MOTIF[entry(id).motif] || MOTIF.doc)(f.ink, f.soft);
  return `<svg viewBox="0 0 320 200" preserveAspectRatio="none"><rect width="320" height="200" fill="${f.soft}"/>${motif}</svg>`;
}

// src/store/taxonomy.js
var CATEGORIES = [
  "Brand & content",
  "Validate an idea",
  "Ads & growth",
  "Creative",
  "Commerce",
  "Viral",
  "Play & make",
  "After hours"
];
var CATEGORY_OF = {
  brandbrain: "Brand & content",
  bank: "Brand & content",
  redline: "Brand & content",
  marquee: "Brand & content",
  chat: "Brand & content",
  ideabrain: "Validate an idea",
  mkt: "Validate an idea",
  capp: "Validate an idea",
  saas: "Validate an idea",
  retail: "Validate an idea",
  hardware: "Validate an idea",
  feature: "Validate an idea",
  adpulse: "Ads & growth",
  adforge: "Ads & growth",
  adgen: "Ads & growth",
  aplus: "Ads & growth",
  batch: "Ads & growth",
  identity: "Creative",
  prism: "Creative",
  reel: "Creative",
  cast: "Creative",
  studio: "Commerce",
  shelf: "Commerce",
  // the viral drop — dupes of the AI tools people keep sharing, each on the /wrapp template
  arcade: "Viral",
  yearbook: "Viral",
  toon: "Viral",
  storybook: "Viral",
  petrait: "Viral",
  emote: "Viral",
  inkling: "Viral",
  roomify: "Viral",
  thumbs: "Viral",
  meme: "Viral",
  roast: "Viral",
  rizz: "Viral",
  anthem: "Viral",
  dreamlog: "Viral",
  take: "Play & make",
  cartridge: "Play & make",
  huddle: "Play & make",
  natal: "After hours",
  arcana: "After hours"
};
var CAT_META = {
  "Brand & content": { fam: "green", glyph: G.layers },
  "Validate an idea": { fam: "blue", glyph: G.bulb },
  "Ads & growth": { fam: "gold", glyph: G.chart },
  "Creative": { fam: "pink", glyph: G.camera },
  "Commerce": { fam: "gold", glyph: G.box },
  "Viral": { fam: "pink", glyph: G.flame },
  "Play & make": { fam: "violet", glyph: G.play },
  "After hours": { fam: "violet", glyph: G.moon }
};
var CATEGORY_BLURB = {
  "Brand & content": "brand systems, the knowledge bank, copy review",
  "Validate an idea": "ideabrain, opened to your kind of idea",
  "Ads & growth": "analyse, generate, and post the growth work",
  "Creative": "personas, images, reels \u2014 on your own models",
  "Commerce": "inventory and product photography",
  "Viral": "dupes of the tools people can't stop sharing",
  "Play & make": "record, build, and get on a call",
  "After hours": "the fun ones"
};
var categoryOf = (id) => CATEGORY_OF[id] || "Brand & content";
var categoryFam = (cat) => FAM[(CAT_META[cat] || {}).fam] || FAM.teal;
function categoryGlyphSvg(cat) {
  const glyph = (CAT_META[cat] || {}).glyph || G.layers;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyph}</svg>`;
}
function categoryCounts(apps) {
  const c = {};
  for (const a of apps) {
    const k = categoryOf(a.id);
    c[k] = (c[k] || 0) + 1;
  }
  return c;
}

// src/store/point.js
var $ = (id) => document.getElementById(id);
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
var msg = (e) => String(e?.message || e).slice(0, 200);
var now = () => (/* @__PURE__ */ new Date()).getTime();
var str = (v) => typeof v === "string" ? v.trim() : "";
var arr = (v, cap = 12) => Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean).slice(0, cap) : [];
var resultText = (d) => (d?.result?.content ?? []).map((c) => c?.text ?? "").join("");
var kb = (n) => n < 1024 ? `${n} b` : `${Math.round(n / 1024)} kb`;
function slug(s2) {
  return String(s2 || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
function basename(p) {
  return String(p || "").replace(/[\\/]+$/, "").split(/[\\/]/).filter(Boolean).pop() || "folder";
}
function parseJson(text) {
  const t = String(text || "").replace(/```[a-z]*\n?/gi, "").trim();
  const s2 = t.indexOf("{"), e = t.lastIndexOf("}");
  if (s2 === -1 || e <= s2) return null;
  try {
    return JSON.parse(t.slice(s2, e + 1));
  } catch {
    return null;
  }
}
var PT_GLYPH = {
  site: `<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.6 3.6 5.4 3.6 8.5S14.4 18.4 12 20.5C9.6 18.4 8.4 15.1 8.4 12S9.6 6.1 12 3.5z"/>`,
  repo: `<path d="M5 4.5h11l3 3V19a.5.5 0 0 1-.5.5h-13A.5.5 0 0 1 5 19z"/><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4"/>`,
  folder: `<path d="M3.5 7.5a1 1 0 0 1 1-1H9l2 2.2h8.5a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"/>`
};
var TILES = [
  {
    id: "site",
    kind: "brand",
    name: "Website",
    sub: "a live site \u2192 a brand",
    ph: "yourbrand.com",
    hint: "your Claude reads the page you name \u2014 and at most one more page on the same site. Nothing off that host."
  },
  {
    id: "repo",
    kind: "project",
    name: "GitHub repo",
    sub: "a repo \u2192 a project",
    ph: "github.com/you/repo",
    hint: "your Claude reads the README and package.json as an anonymous visitor \u2014 so this works on public repos."
  },
  {
    id: "folder",
    kind: "project",
    name: "Folder on this Mac",
    sub: "a directory \u2192 a project, and apps open the real files",
    ph: "~/Projects/yourthing",
    hint: "no fetch, no network \u2014 your files are read on this Mac and go straight into your own Claude."
  }
];
var TILE_BY_ID = Object.fromEntries(TILES.map((t) => [t.id, t]));
var PRIVACY = "Runs on your Claude through Switchboard. The site is read by your model, the folder is read on this machine, and nothing is uploaded \u2014 the operator never sees it. This page writes to your library; it never opens what's inside your other contexts.";
var SITE_FIELDS = [
  { key: "oneLine", label: "In one line", multiline: false },
  { key: "positioning", label: "Positioning", multiline: true },
  { key: "voice", label: "Voice", multiline: true },
  { key: "audience", label: "Audience", multiline: true }
];
var PROJ_FIELDS = [
  { key: "summary", label: "What it is", multiline: true },
  { key: "state", label: "Where it is right now", multiline: true },
  { key: "nextSteps", label: "Next steps", multiline: true, list: true }
];
var fieldsFor = (kind) => kind === "brand" ? SITE_FIELDS : PROJ_FIELDS;
var STEER_CHIPS = {
  site: ["more specific", "less marketing-speak", "name the buyer"],
  repo: ["more technical", "what's unfinished", "shorter"],
  folder: ["more technical", "what's unfinished", "shorter"]
};
var READY = {
  brand: [
    ["adforge", "three Meta ad concepts in your voice, not a stranger's"],
    ["adgen", "six ad directions at once off your positioning"],
    ["aplus", "Amazon A+ content written from your own product list"],
    ["studio", "product shots that sit in your palette"],
    ["prism", "on-brand images, no prompt-engineering required"],
    ["shelf", "inventory triage against the products it just read"]
  ],
  project: [
    ["redline", "review your landing page knowing what this project actually is"],
    ["bank", "notes and tasks in plain .md beside the work"],
    ["huddle", "get on a call with your Claude about these exact files"],
    ["chat", "chat grounded in this project instead of from scratch"],
    ["cartridge", "spin the project into a playable artifact"],
    ["batch", "draft your YC application from what already exists"]
  ]
};
function siteUrl(raw) {
  let t = String(raw || "").trim();
  if (!t) return null;
  if (!/^https?:\/\//i.test(t)) t = "https://" + t;
  try {
    const u = new URL(t);
    if (!u.hostname.includes(".")) return null;
    return u;
  } catch {
    return null;
  }
}
function parseRepo(raw) {
  const t = String(raw || "").trim().replace(/\/+$/, "");
  if (!t) return null;
  const ssh = t.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/i);
  if (ssh) return { owner: ssh[1], repo: ssh[2].split("/")[0] };
  const bare = t.match(/^([A-Za-z0-9_-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?$/);
  if (bare) return { owner: bare[1], repo: bare[2] };
  const u = siteUrl(t);
  if (!u) return null;
  if (!/^(www\.)?github\.com$/i.test(u.hostname)) return { bad: true };
  const parts = u.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return { bad: true };
  return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
}
function detectPointer(v) {
  const t = String(v || "").trim();
  if (!t) return null;
  if (/^[~/]/.test(t) || /^[A-Za-z]:[\\/]/.test(t)) return "folder";
  if (/^git@github\.com:/i.test(t) || /(^|\/\/|\.)github\.com\//i.test(t)) return "repo";
  return null;
}
function verifyHexes(list, corpus) {
  const hay = String(corpus || "").toLowerCase();
  const out = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const v = str(raw).toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(v)) continue;
    if (!hay.includes(v)) continue;
    if (!out.includes(v)) out.push(v);
  }
  return out.slice(0, 6);
}
var SHARED_RULES = [
  "RULES \u2014 all of them matter:",
  "\xB7 `facts` is extracted ONCE and is identical no matter which reading is picked. Never vary a fact between readings.",
  "\xB7 The three readings differ ONLY in interpretation \u2014 the lens they are read through. Same facts, three honest angles.",
  '\xB7 Exactly one reading has "recommended": true.',
  "\xB7 Absent is not invented: if the source does not say, return an empty string. Do not infer a founder story, a funding stage, a team size, or a price.",
  "\xB7 Respond with ONLY the JSON object. No prose before it, no fences around it."
].join("\n");
var SITE_SHAPE = `{
  "facts": {
    "name": "<the brand name as the site writes it>",
    "domain": "<host, no protocol>",
    "category": "<the dominant product type, or \\"\\">",
    "products": ["<real product titles you saw, max 8>"],
    "priceBand": "<flat display string like \\"INR 449-INR 999\\", or \\"\\">",
    "paletteRaw": ["#rrggbb"]
  },
  "readings": [
    { "lens": "How they describe themselves", "oneLine": "", "positioning": "", "voice": "", "audience": "", "recommended": true },
    { "lens": "What the catalogue says", "oneLine": "", "positioning": "", "voice": "", "audience": "", "recommended": false },
    { "lens": "How a buyer would describe it", "oneLine": "", "positioning": "", "voice": "", "audience": "", "recommended": false }
  ]
}`;
function sitePrompt(url, cached, priorLenses) {
  return [
    "You are Switchboard's setup reader. Someone just pointed their own store home at their own website. You are running on THEIR Claude, on THEIR machine \u2014 nothing you read is uploaded anywhere.",
    cached ? `Here is the page content you already read \u2014 do NOT call WebFetch or any other tool:
"""
${cached}
"""` : `Use WebFetch to read ${url}. If that page names an obvious about page or product index on the SAME host, you may WebFetch ONE more. Do not fetch anything off this host. Two fetches maximum.`,
    "Extract ONE set of facts, then read those same facts three ways.",
    "Respond with ONLY a JSON object in exactly this shape:",
    SITE_SHAPE,
    SHARED_RULES,
    "\xB7 `products` are REAL product titles you saw on the page \u2014 flat strings, max 8. If you saw no catalogue, return [].",
    "\xB7 `paletteRaw`: return ONLY colour values that appear VERBATIM in the page text you were given. If you cannot see any, return []. Never approximate a colour from a description of one \u2014 a guessed hex is worse than no hex, because it ends up in every ad this person generates.",
    "\xB7 Recommend reading A when the site has real written copy; recommend B when the copy is thin but the products are rich.",
    "\xB7 Every field must be traceable to something you actually read.",
    priorLenses ? `These lenses were already used: ${priorLenses}. Produce three fresh readings of the SAME facts.` : ""
  ].filter(Boolean).join("\n\n");
}
var PROJ_SHAPE = `{
  "facts": {
    "name": "<the project name \u2014 the README H1, before any em-dash tagline>",
    "stack": ["<real languages/tools you saw evidence of>"],
    "packages": ["<workspace or package names>"],
    "docs": ["<Title - path/to/doc.md>"],
    "links": [{ "label": "repo", "url": "" }],
    "notableFiles": ["<path/you/saw.ts - what it is>"],
    "status": "<version (omit when 0.0.0) \xB7 license, or \\"\\">"
  },
  "readings": [
    { "lens": "What the README claims", "summary": "", "state": "", "nextSteps": [""], "recommended": true },
    { "lens": "What the code actually is", "summary": "", "state": "", "nextSteps": [""], "recommended": false },
    { "lens": "Where it is right now", "summary": "", "state": "", "nextSteps": [""], "recommended": false }
  ]
}`;
function repoPrompt(owner, repo, cached, priorLenses) {
  const base = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD`;
  return [
    "You are Switchboard's setup reader. Someone just pointed their own store home at a GitHub repository. You are running on THEIR Claude \u2014 nothing you read is uploaded anywhere.",
    cached ? `Here is the repository material you already read \u2014 do NOT call WebFetch or any other tool:
"""
${cached}
"""` : [
      "Use WebFetch on these, in this order:",
      `1. ${base}/README.md`,
      `2. ${base}/package.json`,
      `3. ONLY if BOTH of the above failed: https://github.com/${owner}/${repo}`,
      "A 404 on any one of these is normal \u2014 continue with what you did get. Fetch nothing else."
    ].join("\n"),
    "Extract ONE set of facts, then read those same facts three ways.",
    "Respond with ONLY a JSON object in exactly this shape:",
    PROJ_SHAPE,
    SHARED_RULES,
    "\xB7 Derive `stack` from real dependency names and file extensions you saw \u2014 not from how the project describes itself.",
    "\xB7 `notableFiles` must be paths you actually saw named. If you saw none, return [].",
    "\xB7 `nextSteps` are flat strings \u2014 real open work the source names (a roadmap, a TODO, an unchecked task). Return [] rather than inventing a plan.",
    priorLenses ? `These lenses were already used: ${priorLenses}. Produce three fresh readings of the SAME facts.` : ""
  ].filter(Boolean).join("\n\n");
}
function folderPrompt(path, corpus, priorLenses) {
  return [
    "You are Switchboard's setup reader. Someone pointed their own store home at a folder on their own machine. These files were read on that machine and handed straight to you \u2014 no network request was made and nothing left the disk.",
    `THE FOLDER: ${path}`,
    `Here is what was read \u2014 work only from this. Do NOT call any tool:
"""
${corpus}
"""`,
    "Extract ONE set of facts, then read those same facts three ways.",
    "Respond with ONLY a JSON object in exactly this shape:",
    PROJ_SHAPE,
    SHARED_RULES,
    "\xB7 Derive `stack` from real dependency names and file extensions in the material above \u2014 not from how the project describes itself.",
    "\xB7 `notableFiles` must be paths that actually appear above. If none do, return [].",
    "\xB7 `nextSteps` are flat strings \u2014 real open work the material names. Return [] rather than inventing a plan.",
    priorLenses ? `These lenses were already used: ${priorLenses}. Produce three fresh readings of the SAME facts.` : ""
  ].filter(Boolean).join("\n\n");
}
function createPoint(host) {
  const STATE_KEY = "point-state";
  let relay2 = null;
  let connected = false;
  let libraryEmpty = true;
  let collapsed = false;
  let grantOk = { models: false, webfetch: false };
  let liveIter = null;
  let cancelled = false;
  let busy = false;
  let bindStuck = false;
  let resumed = false;
  const blank = () => ({
    pointer: "site",
    input: "",
    phase: "pointer",
    siteRead: "",
    facts: null,
    readings: [],
    picked: 0,
    lenses: [],
    edits: {},
    name: "",
    dropped: {},
    // fact key -> [removed values]
    folderPath: "",
    published: null,
    blocked: null,
    steps: []
  });
  let pt = blank();
  const sec = () => $("point-sec");
  const stage = () => $("pt-stage");
  const kindOf = () => TILE_BY_ID[pt.pointer].kind;
  async function persist() {
    if (!relay2 || host.isFrozen()) return;
    try {
      await relay2.storage.set(STATE_KEY, JSON.stringify({
        pointer: pt.pointer,
        input: pt.input,
        phase: pt.phase,
        siteRead: pt.siteRead.slice(0, 16e3),
        facts: pt.facts,
        readings: pt.readings,
        picked: pt.picked,
        lenses: pt.lenses,
        edits: pt.edits,
        name: pt.name,
        dropped: pt.dropped,
        folderPath: pt.folderPath
      }));
    } catch {
    }
  }
  async function clearPersisted() {
    if (!relay2 || host.isFrozen()) return;
    try {
      await relay2.storage.delete(STATE_KEY);
    } catch {
    }
  }
  async function restoreDraft() {
    if (!relay2) return;
    let saved = null;
    try {
      saved = JSON.parse(await relay2.storage.get(STATE_KEY) || "null");
    } catch {
      saved = null;
    }
    if (!saved || !TILE_BY_ID[saved.pointer]) return;
    if (saved.phase !== "found" && saved.phase !== "confirm") return;
    if (!saved.facts || !Array.isArray(saved.readings) || !saved.readings.length) return;
    pt = { ...blank(), ...saved, steps: [], published: null, blocked: null };
    resumed = true;
    collapsed = false;
  }
  function setPhase(p) {
    pt.phase = p;
    render();
    void persist();
  }
  function step(line, tone) {
    pt.steps.push({ line, tone });
    const box = $("pt-reading-steps");
    if (box) {
      const row = el("div", "pt-step" + (tone ? " " + tone : ""), line);
      box.append(row);
      box.scrollTop = box.scrollHeight;
    }
  }
  function setLive(text) {
    const l = $("pt-reading-line");
    if (l) l.textContent = text;
  }
  async function runStream({ prompt, agentic, onTool, onResult, onText }) {
    const it = relay2.stream(agentic ? { prompt, agentic: true } : { prompt });
    liveIter = it;
    let acc = "";
    try {
      for await (const d of it) {
        if (cancelled) break;
        if (d.type === "text") {
          acc += d.text;
          onText && onText(acc);
        } else if (d.type === "tool_proposed") onTool && onTool(d.call?.name || "tool", d);
        else if (d.type === "tool_result") onResult && onResult(d);
        else if (d.type === "error") throw new Error(d.error?.message || "stream error");
      }
    } finally {
      liveIter = null;
    }
    return acc;
  }
  function abort() {
    cancelled = true;
    try {
      liveIter?.return?.();
    } catch {
    }
    liveIter = null;
  }
  function blocked(why, opts = {}) {
    pt.blocked = { why, ...opts };
    busy = false;
    setPhase("blocked");
  }
  async function go() {
    if (!relay2 || busy) return;
    const input = str($("pt-input")?.value ?? pt.input);
    pt.input = input;
    if (!input) {
      flashHint("Give it something to point at first.");
      return;
    }
    if (!grantOk.models) {
      flashHint("Your Claude isn't lent to this page yet \u2014 re-approve above.");
      return;
    }
    if (pt.pointer !== "folder" && !grantOk.webfetch) {
      flashHint("This page can't read the web yet \u2014 re-approve above.");
      return;
    }
    cancelled = false;
    busy = true;
    pt.steps = [];
    pt.facts = null;
    pt.readings = [];
    pt.siteRead = "";
    pt.edits = {};
    pt.dropped = {};
    pt.lenses = [];
    pt.published = null;
    pt.blocked = null;
    resumed = false;
    setPhase("reading");
    try {
      if (pt.pointer === "site") await readSite();
      else if (pt.pointer === "repo") await readRepo();
      else await readFolder();
    } catch (e) {
      if (!cancelled) blocked(`Your Claude stopped partway through \u2014 ${msg(e)}`);
    } finally {
      busy = false;
    }
  }
  function landReadings(raw, corpus) {
    const parsed = parseJson(raw);
    if (!parsed || !parsed.facts || !Array.isArray(parsed.readings) || !parsed.readings.length) {
      blocked("Your Claude answered, but not with a card \u2014 the reply wasn't the shape this page expects.");
      return false;
    }
    const kind = kindOf();
    const f = parsed.facts || {};
    pt.facts = kind === "brand" ? {
      name: str(f.name),
      domain: str(f.domain),
      category: str(f.category),
      products: arr(f.products, 8),
      priceBand: str(f.priceBand),
      // Only hexes that appear verbatim in the bytes we read survive. `paletteClaimed` keeps
      // the count the model offered, so the empty state can say WHY it's empty.
      palette: verifyHexes(f.paletteRaw, corpus),
      paletteClaimed: arr(f.paletteRaw, 8).length
    } : {
      name: str(f.name),
      stack: arr(f.stack, 10),
      packages: arr(f.packages, 10),
      docs: arr(f.docs, 8),
      links: (Array.isArray(f.links) ? f.links : []).map((l) => ({ label: str(l?.label) || "link", url: str(l?.url) })).filter((l) => /^https?:\/\//i.test(l.url)).slice(0, 6),
      notableFiles: arr(f.notableFiles, 8),
      status: str(f.status)
    };
    const fields = fieldsFor(kind);
    pt.readings = parsed.readings.slice(0, 3).map((r, i) => {
      const out = { lens: str(r?.lens) || `Reading ${i + 1}`, recommended: !!r?.recommended };
      for (const fd of fields) out[fd.key] = fd.list ? arr(r?.[fd.key], 6) : str(r?.[fd.key]);
      return out;
    });
    if (!pt.readings.some((r) => r.recommended)) pt.readings[0].recommended = true;
    let seen = false;
    for (const r of pt.readings) {
      if (r.recommended && seen) r.recommended = false;
      else if (r.recommended) seen = true;
    }
    pt.picked = pt.readings.findIndex((r) => r.recommended);
    if (pt.picked < 0) pt.picked = 0;
    pt.lenses = pt.readings.map((r) => r.lens);
    pt.name = pt.facts.name || defaultName();
    setPhase("found");
    return true;
  }
  function defaultName() {
    if (pt.pointer === "site") return siteUrl(pt.input)?.hostname.replace(/^www\./, "") || "Brand";
    if (pt.pointer === "repo") {
      const r = parseRepo(pt.input);
      return r && !r.bad ? r.repo : "Project";
    }
    return basename(pt.folderPath || pt.input);
  }
  async function readSite() {
    const u = siteUrl(pt.input);
    if (!u) {
      blocked("That doesn't look like a web address \u2014 try something like yourbrand.com.");
      return;
    }
    const hostName = u.hostname.replace(/^www\./, "");
    setLive(`reading ${hostName} on your Claude\u2026`);
    step(`reading ${hostName} on your Claude\u2026`);
    let fetches = 0, okFetches = 0;
    const raw = await runStream({
      prompt: sitePrompt(u.href, null, null),
      agentic: true,
      onTool: (name) => {
        if (name === "WebFetch") {
          fetches++;
          step(fetches === 1 ? `fetching ${hostName}\u2026` : "one more page on the same site\u2026");
        } else step("tool \u2192 " + name);
      },
      onResult: (d) => {
        const t = resultText(d);
        if (d.result?.ok && t && t.length > 40) {
          okFetches++;
          if (!pt.siteRead) pt.siteRead = t.slice(0, 16e3);
          else if (pt.siteRead.length < 16e3) pt.siteRead = (pt.siteRead + "\n\n" + t).slice(0, 16e3);
          step(`page read \xB7 ${kb(t.length)}`, "good");
        } else {
          step("blocked: " + (d.result?.error?.message || "that page wouldn't open"), "bad");
        }
      },
      onText: (acc) => setLive(`drafting three readings\u2026 ${(acc.length / 1024).toFixed(1)} kb`)
    });
    if (cancelled) return;
    if (!okFetches) {
      blocked(`${hostName} wouldn't let your Claude read it \u2014 some sites block automated readers.`, { transfer: "folder" });
      return;
    }
    landReadings(raw, pt.siteRead);
  }
  async function readRepo() {
    const r = parseRepo(pt.input);
    if (!r || r.bad) {
      blocked("That isn't a GitHub repo URL \u2014 try github.com/you/repo.", { keepInput: true });
      return;
    }
    setLive(`reading ${r.owner}/${r.repo} on your Claude\u2026`);
    step(`reading ${r.owner}/${r.repo} as an anonymous visitor\u2026`);
    let okFetches = 0, attempts = 0;
    const raw = await runStream({
      prompt: repoPrompt(r.owner, r.repo, null, null),
      agentic: true,
      onTool: (name, d) => {
        if (name !== "WebFetch") {
          step("tool \u2192 " + name);
          return;
        }
        attempts++;
        const url = str(d.call?.arguments?.url || d.call?.input?.url);
        step(url ? `fetching ${url.replace(/^https?:\/\//, "")}\u2026` : "fetching\u2026");
      },
      onResult: (d) => {
        const t = resultText(d);
        const notFound = /^\s*404: Not Found/i.test(t) || /\b404\b/.test(str(d.result?.error?.message));
        if (d.result?.ok && t && t.length > 40 && !notFound) {
          okFetches++;
          if (pt.siteRead.length < 16e3) pt.siteRead = (pt.siteRead + "\n\n" + t).slice(0, 16e3);
          step(`read \xB7 ${kb(t.length)}`, "good");
        } else {
          step("not there \u2014 that's fine, continuing", "dim");
        }
      },
      onText: (acc) => setLive(`drafting three readings\u2026 ${(acc.length / 1024).toFixed(1)} kb`)
    });
    if (cancelled) return;
    if (!okFetches && attempts) {
      blocked(
        "GitHub returned 404 \u2014 that repo is private or doesn't exist. Your Claude reads GitHub as an anonymous visitor, so private repos aren't reachable.",
        { transfer: "folder", prefill: `~/Projects/${r.repo}` }
      );
      return;
    }
    landReadings(raw, pt.siteRead);
  }
  const FOLDER_PRIORITY = ["README.md", "readme.md", "Readme.md", "package.json", "ROADMAP.md", "CLAUDE.md"];
  async function readFolder() {
    const path = pt.input;
    let before = null;
    try {
      before = await relay2.storage.info();
    } catch {
      before = null;
    }
    host.freeze(true);
    step(`asking to bind ${path} \u2014 approve the path in Switchboard`);
    setLive("waiting for you to approve the folder\u2026");
    let info = null;
    try {
      info = await relay2.storage.bind(path);
    } catch (e) {
      info = null;
    }
    if (!info || cancelled) {
      await restoreBind(before);
      if (!cancelled) blocked("You didn't approve that folder, so nothing was read.");
      return;
    }
    pt.folderPath = info.folder || path;
    step(`bound \xB7 ${pt.folderPath}`, "good");
    let keys = [];
    try {
      keys = await relay2.storage.list();
    } catch {
      keys = [];
    }
    const picked = pickFiles(keys);
    if (!picked.length) {
      await restoreBind(before);
      blocked(`${basename(pt.folderPath)} has no README, package.json or docs \u2014 there's nothing here to read yet.`, { transfer: "site" });
      return;
    }
    step(`${keys.length} file${keys.length === 1 ? "" : "s"} \xB7 reading ${picked.length} of them`);
    let corpus = "";
    for (const k of picked) {
      if (corpus.length > 24e3) {
        corpus += "\n[\u2026truncated]";
        break;
      }
      let body = null;
      try {
        body = await relay2.storage.get(k);
      } catch {
        body = null;
      }
      if (!body) continue;
      corpus += `
--- ${k} ---
${body}
`;
    }
    corpus = corpus.slice(0, 24e3);
    if (!corpus.trim()) {
      await restoreBind(before);
      blocked(`${basename(pt.folderPath)} has no README, package.json or docs \u2014 there's nothing here to read yet.`, { transfer: "site" });
      return;
    }
    pt.siteRead = corpus;
    await restoreBind(before);
    step("drafting\u2026 (nothing left this machine)");
    setLive("drafting three readings\u2026 0.0 kb");
    let raw = "";
    try {
      raw = await runStream({
        prompt: folderPrompt(pt.folderPath, corpus, null),
        onText: (acc) => setLive(`drafting three readings\u2026 ${(acc.length / 1024).toFixed(1)} kb`)
      });
    } catch (e) {
      if (!cancelled) blocked(`Your Claude stopped partway through \u2014 ${msg(e)}`);
      return;
    }
    if (cancelled) return;
    landReadings(raw, corpus);
  }
  function pickFiles(keys) {
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    const take = (k) => {
      if (k && !seen.has(k)) {
        seen.add(k);
        out.push(k);
      }
    };
    for (const p of FOLDER_PRIORITY) {
      const hit = keys.find((k) => k === p);
      if (hit) take(hit);
    }
    for (const k of keys.filter((x) => /^docs\/.+\.md$/i.test(x)).slice(0, 6)) take(k);
    for (const k of keys.filter((x) => /^[^/]+\.md$/i.test(x)).slice(0, 6)) take(k);
    return out.slice(0, 14);
  }
  async function restoreBind(before) {
    if (!before || !before.folder) {
      host.freeze(false);
      return;
    }
    try {
      await relay2.storage.bind(before.folder);
      host.freeze(false);
      bindStuck = false;
    } catch {
      bindStuck = true;
    }
  }
  function cachedPrompt(priorLenses, steer) {
    const kind = kindOf();
    const base = pt.pointer === "site" ? sitePrompt(pt.input, pt.siteRead, priorLenses) : pt.pointer === "repo" ? (() => {
      const r = parseRepo(pt.input) || {};
      return repoPrompt(r.owner, r.repo, pt.siteRead, priorLenses);
    })() : folderPrompt(pt.folderPath, pt.siteRead, priorLenses);
    void kind;
    return steer ? base + `

The person asked for this specifically: "${steer}". Apply it to all three readings.` : base;
  }
  async function regenerate(steer) {
    if (!relay2 || busy || !pt.siteRead) return;
    busy = true;
    cancelled = false;
    pt.steps = [];
    resumed = false;
    setPhase("reading");
    setLive(steer ? `re-reading through: \u201C${steer}\u201D\u2026` : "three fresh readings\u2026");
    step("using the read it already has \u2014 nothing is fetched again", "good");
    try {
      const raw = await runStream({
        prompt: cachedPrompt(pt.lenses.join(", "), steer),
        onText: (acc) => setLive(`drafting three readings\u2026 ${(acc.length / 1024).toFixed(1)} kb`)
      });
      if (cancelled) return;
      pt.edits = {};
      landReadings(raw, pt.siteRead);
    } catch (e) {
      if (!cancelled) blocked(`Your Claude stopped partway through \u2014 ${msg(e)}`);
    } finally {
      busy = false;
    }
  }
  async function refield(key) {
    if (!relay2 || busy || !pt.siteRead) return;
    const fd = fieldsFor(kindOf()).find((f) => f.key === key);
    if (!fd) return;
    const btn = $("pt-refield-" + key);
    if (btn) {
      btn.disabled = true;
      btn.textContent = "\u2026";
    }
    busy = true;
    try {
      const shape = fd.list ? `{"${key}": ["\u2026"]}` : `{"${key}": "\u2026"}`;
      const raw = await runStream({
        prompt: [
          "You already read this source. Re-draft ONE field of the reading, nothing else.",
          `Here is the source you read \u2014 do NOT call any tool:
"""
${pt.siteRead}
"""`,
          `The reading as it stands (lens: ${current().lens}):
${JSON.stringify(viewReading())}`,
          `Re-draft ONLY "${key}" \u2014 ${fd.label}. A genuinely different phrasing, same facts, same lens. If the source doesn't say, return an empty string.`,
          `Respond with ONLY a JSON object: ${shape}`
        ].join("\n\n")
      });
      const v = parseJson(raw);
      if (v && v[key] !== void 0) {
        pt.edits[key] = fd.list ? arr(v[key], 6) : str(v[key]);
        void persist();
      }
    } catch {
    } finally {
      busy = false;
      render();
    }
  }
  const current = () => pt.readings[pt.picked] || pt.readings[0] || {};
  function viewReading() {
    const out = { lens: current().lens };
    for (const fd of fieldsFor(kindOf())) {
      out[fd.key] = pt.edits[fd.key] !== void 0 ? pt.edits[fd.key] : current()[fd.key];
    }
    return out;
  }
  function factList(key) {
    const all = pt.facts && pt.facts[key] || [];
    const gone = pt.dropped[key] || [];
    return all.filter((x) => !gone.includes(typeof x === "string" ? x : x.url));
  }
  function dropFact(key, value) {
    pt.dropped[key] = [...pt.dropped[key] || [], value];
    void persist();
    render();
  }
  async function publish() {
    if (!relay2 || busy || !pt.facts) return;
    busy = true;
    render();
    const kind = kindOf();
    const r = viewReading();
    const name = str(pt.name) || defaultName();
    try {
      let id, data;
      if (kind === "brand") {
        const u = siteUrl(pt.input);
        id = slug(pt.facts.domain || u?.hostname || name) || slug(name) || void 0;
        data = {
          oneLine: r.oneLine,
          positioning: r.positioning,
          voice: r.voice,
          audience: r.audience,
          products: factList("products"),
          palette: factList("palette"),
          category: pt.facts.category,
          priceRange: pt.facts.priceBand,
          domain: pt.facts.domain || u?.hostname.replace(/^www\./, "") || "",
          source: { kind: "site", url: u ? u.href : pt.input, readAt: now(), by: "switchboard-home" }
        };
      } else {
        id = slug(pt.facts.name || name) || slug(name) || void 0;
        const isRepo = pt.pointer === "repo";
        data = {
          summary: r.summary,
          status: pt.facts.status,
          stack: factList("stack"),
          links: factList("links"),
          packages: factList("packages"),
          docs: factList("docs"),
          roadmap: Array.isArray(r.nextSteps) ? r.nextSteps : [],
          state: r.state,
          files: factList("notableFiles"),
          source: isRepo ? { kind: "github", url: repoUrl(), readAt: now(), by: "switchboard-home" } : { kind: "folder", path: pt.folderPath, readAt: now(), by: "switchboard-home" }
        };
        if (!isRepo && pt.folderPath) data.folder = pt.folderPath;
      }
      await relay2.context.publish({ id, name, kind, data });
      pt.published = { id, name, kind, folder: data.folder || "" };
      await clearPersisted();
      busy = false;
      setPhase("ready");
      await host.onPublished();
      render();
    } catch (e) {
      busy = false;
      blocked(`Your library didn't take it \u2014 ${msg(e)}`);
    }
  }
  function repoUrl() {
    const r = parseRepo(pt.input);
    return r && !r.bad ? `https://github.com/${r.owner}/${r.repo}` : pt.input;
  }
  async function discard() {
    abort();
    await clearPersisted();
    const keepPointer = pt.pointer;
    pt = blank();
    pt.pointer = keepPointer;
    resumed = false;
    setPhase("pointer");
  }
  function flashHint(text) {
    const h = $("pt-hint");
    if (!h) return;
    h.textContent = text;
    h.classList.add("warn");
    setTimeout(() => {
      h.classList.remove("warn");
      paintHint();
    }, 2600);
  }
  function paintHint() {
    const h = $("pt-hint");
    if (h) h.textContent = TILE_BY_ID[pt.pointer].hint;
  }
  function render() {
    const s2 = sec();
    if (!s2) return;
    s2.hidden = false;
    s2.classList.toggle("pt-connected", connected);
    const wall = $("pt-reconnect");
    const needs = connected && (!grantOk.models || !grantOk.webfetch);
    if (wall) wall.hidden = !needs;
    const bar = $("pt-bar");
    const body = $("pt-body");
    const showCollapsed = connected && collapsed && pt.phase === "pointer";
    if (bar) bar.hidden = !showCollapsed;
    if (body) body.hidden = showCollapsed;
    const zone = $("pt-zone");
    if (zone) zone.hidden = showCollapsed;
    const hide = $("pt-collapse");
    if (hide) hide.hidden = !connected || pt.phase !== "pointer";
    const st = stage();
    if (!st || showCollapsed) return;
    st.textContent = "";
    if (pt.phase === "pointer") st.append(screenPointer());
    else if (pt.phase === "reading") st.append(screenReading());
    else if (pt.phase === "found") st.append(screenFound());
    else if (pt.phase === "confirm") st.append(screenConfirm());
    else if (pt.phase === "ready") st.append(screenReady());
    else if (pt.phase === "blocked") st.append(screenBlocked());
  }
  function pointerReady(id) {
    if (!connected || !grantOk.models) return false;
    return id === "folder" ? true : grantOk.webfetch;
  }
  function screenPointer() {
    const wrap = el("div", "pt-screen");
    const tiles = el("div", "pt-pointers");
    tiles.id = "pt-pointers";
    for (const t of TILES) {
      const b = el("button", "pt-tile" + (t.id === pt.pointer ? " on" : ""));
      b.type = "button";
      b.id = "pt-tile-" + t.id;
      const f = famOf(t.id === "site" ? "adforge" : t.id === "repo" ? "redline" : "bank");
      const ic = el("span", "pt-ic");
      ic.style.background = f.soft;
      ic.style.color = f.ink;
      ic.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${PT_GLYPH[t.id]}</svg>`;
      const tx = el("span", "pt-tt");
      tx.append(el("span", "pt-tn", t.name), el("span", "pt-ts", t.sub));
      b.append(ic, tx);
      b.onclick = () => {
        if (!connected) {
          host.clickConnect();
          pt.pointer = t.id;
          render();
          return;
        }
        pt.pointer = t.id;
        render();
        setTimeout(() => $("pt-input")?.focus(), 20);
      };
      tiles.append(b);
    }
    wrap.append(tiles);
    const row = el("div", "pt-inrow");
    const input = el("input", "pt-input");
    input.id = "pt-input";
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = TILE_BY_ID[pt.pointer].ph;
    input.value = pt.input;
    input.disabled = !pointerReady(pt.pointer);
    input.addEventListener("input", () => {
      pt.input = input.value;
      const guess = detectPointer(input.value);
      if (guess && guess !== pt.pointer) {
        pt.pointer = guess;
        const caret = input.selectionStart;
        render();
        const next = $("pt-input");
        if (next) {
          next.focus();
          try {
            next.setSelectionRange(caret, caret);
          } catch {
          }
        }
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        void go();
      }
    });
    const btn = el("button", "pt-go", "Read it \u25B8");
    btn.id = "pt-go";
    btn.type = "button";
    btn.disabled = !pointerReady(pt.pointer);
    btn.onclick = () => void go();
    row.append(input, btn);
    wrap.append(row);
    const hint = el("div", "pt-hint");
    hint.id = "pt-hint";
    hint.textContent = !connected ? "connect Switchboard and your own Claude reads it" : !grantOk.models ? "your Claude isn't lent to this page yet \u2014 re-approve above and all three work" : pt.pointer !== "folder" && !grantOk.webfetch ? "this page can't read the web yet \u2014 re-approve above, or point at a folder instead (that needs no web access at all)" : TILE_BY_ID[pt.pointer].hint;
    wrap.append(hint);
    const priv = el("div", "pt-privacy");
    priv.id = "pt-privacy";
    priv.textContent = PRIVACY;
    wrap.append(priv);
    if (bindStuck) wrap.append(el("div", "pt-quiet", "this page's own scratch state is paused until you reload"));
    return wrap;
  }
  function screenReading() {
    const wrap = el("div", "pt-screen");
    const box = el("div", "pt-reading");
    box.id = "pt-reading";
    const head = el("div", "pt-scanrow");
    head.append(el("span", "pt-scan"));
    const line = el("span", "pt-live", "reading\u2026");
    line.id = "pt-reading-line";
    head.append(line);
    box.append(head);
    const steps = el("div", "pt-steps");
    steps.id = "pt-reading-steps";
    for (const s2 of pt.steps) steps.append(el("div", "pt-step" + (s2.tone ? " " + s2.tone : ""), s2.line));
    box.append(steps);
    const hasDraft = !!(pt.facts && pt.readings.length);
    const cancel = el("button", "pt-ghost", hasDraft ? "cancel \u2014 keep what I had" : "cancel");
    cancel.id = "pt-cancel";
    cancel.type = "button";
    cancel.onclick = () => {
      abort();
      busy = false;
      if (hasDraft) setPhase("found");
      else void discard();
    };
    box.append(cancel);
    wrap.append(box);
    return wrap;
  }
  function screenFound() {
    const kind = kindOf();
    const wrap = el("div", "pt-screen");
    const h = el("div", "pt-h");
    h.append(el("h3", null, "Here's what it found \u2014 pick the one that reads truest."));
    h.append(el("span", "pt-hs", kind === "brand" ? "Same facts in all three. Only the reading differs." : "Same facts in all three. Only the reading of them differs."));
    wrap.append(h);
    if (resumed) wrap.append(el("div", "pt-quiet", "picked up where you left off \u2014 this draft was already read, nothing was fetched again"));
    const cards = el("div", "pt-cards");
    pt.readings.forEach((r, i) => {
      const c = el("div", "pt-card" + (i === pt.picked ? " sel" : ""));
      c.id = "pt-card-" + i;
      c.onclick = () => {
        pt.picked = i;
        pt.edits = {};
        void persist();
        render();
      };
      if (r.recommended) c.append(el("span", "pt-rec", "\u2605 recommended"));
      c.append(el("span", "pt-lens", r.lens));
      for (const fd of fieldsFor(kind)) {
        const v = r[fd.key];
        const has = fd.list ? Array.isArray(v) && v.length : str(v);
        const row = el("div", "pt-frow");
        row.append(el("span", "pt-fk", fd.label));
        if (!has) row.append(el("span", "pt-fv muted", pt.pointer === "site" ? "the site doesn't say" : "the source doesn't say"));
        else if (fd.list) {
          const ul = el("div", "pt-flist");
          for (const x of v) ul.append(el("div", null, "\xB7 " + x));
          row.append(ul);
        } else row.append(el("span", "pt-fv", v));
        c.append(row);
      }
      cards.append(c);
    });
    wrap.append(cards);
    wrap.append(factsStrip(false));
    const steer = el("div", "pt-steer");
    steer.id = "pt-steer";
    const chips = el("div", "pt-chips");
    for (const s2 of STEER_CHIPS[pt.pointer]) {
      const c = el("button", "pt-chip", s2);
      c.type = "button";
      c.onclick = () => void regenerate(s2);
      chips.append(c);
    }
    steer.append(chips);
    const srow = el("div", "pt-inrow small");
    const si = el("input", "pt-input");
    si.type = "text";
    si.placeholder = "tell it what to change\u2026";
    si.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && si.value.trim()) {
        const v = si.value.trim();
        si.value = "";
        void regenerate(v);
      }
    });
    const sb = el("button", "pt-ghost", "send");
    sb.type = "button";
    sb.onclick = () => {
      const v = si.value.trim();
      if (v) {
        si.value = "";
        void regenerate(v);
      }
    };
    srow.append(si, sb);
    steer.append(srow);
    wrap.append(steer);
    const acts = el("div", "pt-acts");
    const use = el("button", "pt-go", "Use this reading \u25B8");
    use.type = "button";
    use.onclick = () => setPhase("confirm");
    const regen = el("button", "pt-ghost", "\u21BB three fresh readings");
    regen.id = "pt-regen";
    regen.type = "button";
    regen.onclick = () => void regenerate(null);
    const cancel = el("button", "pt-ghost", "discard");
    cancel.type = "button";
    cancel.onclick = () => void discard();
    acts.append(use, regen, cancel);
    wrap.append(acts);
    return wrap;
  }
  function factsStrip(removable) {
    const kind = kindOf();
    const box = el("div", "pt-facts");
    box.id = "pt-facts";
    box.append(el("span", "pt-fk pt-fk-top", "what it read \u2014 the same in all three"));
    const body = el("div", "pt-fbody");
    const chipRow = (label, values, dropKey) => {
      if (!values.length) return;
      const r = el("div", "pt-fline");
      r.append(el("span", "pt-flk", label));
      const c = el("div", "pt-fchips");
      for (const v of values) {
        const chip = el("span", "pt-fchip", v);
        if (removable && dropKey) {
          const x = el("button", "pt-x", "\xD7");
          x.type = "button";
          x.title = "remove \u2014 it doesn't belong to this";
          x.onclick = (e) => {
            e.stopPropagation();
            dropFact(dropKey, v);
          };
          chip.append(x);
        }
        c.append(chip);
      }
      r.append(c);
      body.append(r);
    };
    if (kind === "brand") {
      const pal = factList("palette");
      const palRow = el("div", "pt-fline");
      palRow.append(el("span", "pt-flk", "palette"));
      if (pal.length) {
        const c = el("div", "pt-fchips");
        for (const hex of pal) {
          const chip = el("span", "pt-swatch");
          const dot = el("i");
          dot.style.background = hex;
          chip.append(dot, el("span", null, hex));
          if (removable) {
            const x = el("button", "pt-x", "\xD7");
            x.type = "button";
            x.onclick = (e) => {
              e.stopPropagation();
              dropFact("palette", hex);
            };
            chip.append(x);
          }
          c.append(chip);
        }
        palRow.append(c);
        const note = el("span", "pt-fnote", "read from the page");
        palRow.append(note);
      } else {
        const n = el("div", "pt-fnote wide");
        n.append(document.createTextNode(
          pt.facts.paletteClaimed ? "no colours read \u2014 your Claude offered some, but none of them appear in the page text it was given, so they were dropped. This page can only see the text of the site. " : "no colours read \u2014 this page can only see the text of the site, not the CSS it serves. "
        ));
        const a = el("a", null, "Bank's extractor reads the real CSS your site serves \u2192");
        a.href = APP_BY_ID.bank?.href || "https://bank.thelastprompt.ai";
        a.target = "_blank";
        a.rel = "noreferrer";
        n.append(a);
        palRow.append(n);
      }
      body.append(palRow);
      chipRow("products", factList("products"), "products");
      if (pt.facts.priceBand) chipRow("prices", [pt.facts.priceBand], null);
      if (pt.facts.category) chipRow("category", [pt.facts.category], null);
      if (pt.facts.domain) {
        const r = el("div", "pt-fline");
        r.append(el("span", "pt-flk", "domain"));
        const a = el("a", "pt-flink", pt.facts.domain);
        a.href = "https://" + pt.facts.domain.replace(/^https?:\/\//, "");
        a.target = "_blank";
        a.rel = "noreferrer";
        r.append(a);
        body.append(r);
      }
    } else {
      chipRow("stack", factList("stack"), "stack");
      chipRow("packages", factList("packages"), "packages");
      chipRow("docs", factList("docs"), "docs");
      chipRow("files", factList("notableFiles"), "notableFiles");
      const links = factList("links");
      if (links.length) {
        const r = el("div", "pt-fline");
        r.append(el("span", "pt-flk", "links"));
        const c = el("div", "pt-fchips");
        for (const l of links) {
          const chip = el("span", "pt-fchip");
          const a = el("a", "pt-flink", l.label);
          a.href = l.url;
          a.target = "_blank";
          a.rel = "noreferrer";
          chip.append(a);
          if (removable) {
            const x = el("button", "pt-x", "\xD7");
            x.type = "button";
            x.onclick = (e) => {
              e.stopPropagation();
              dropFact("links", l.url);
            };
            chip.append(x);
          }
          c.append(chip);
        }
        r.append(c);
        body.append(r);
      }
      if (pt.facts.status) chipRow("status", [pt.facts.status], null);
      if (pt.pointer === "folder" && pt.folderPath) {
        const r = el("div", "pt-fline");
        r.append(el("span", "pt-flk", "folder"), el("span", "pt-fmono", pt.folderPath));
        body.append(r);
      }
    }
    box.append(body);
    if (removable) box.append(el("div", "pt-fnote wide", "facts can be removed, never typed in \u2014 that's what keeps them traceable to what was actually read."));
    return box;
  }
  function screenConfirm() {
    const kind = kindOf();
    const wrap = el("div", "pt-screen");
    const h = el("div", "pt-h");
    h.append(el("h3", null, "Confirm what it found."));
    h.append(el("span", "pt-hs", "Click any line to edit it. \u21BB re-drafts just that line from the read it already has."));
    wrap.append(h);
    const card = el("div", "pt-confirm");
    const top = el("div", "pt-crow");
    const nameIn = el("input", "pt-name");
    nameIn.id = "pt-name";
    nameIn.type = "text";
    nameIn.value = pt.name;
    nameIn.placeholder = "name";
    nameIn.addEventListener("input", () => {
      pt.name = nameIn.value;
      void persist();
    });
    const pill = el("span", "pt-kind", kind);
    pill.id = "pt-kind";
    pill.title = pt.pointer === "site" ? 'A live site describes a brand \u2014 so this banks as kind "brand", which every ad, image and listing wrapp already knows how to read.' : 'A repo or a folder describes a unit of work \u2014 so this banks as kind "project", which Bank, Redline and Huddle already know how to read.';
    top.append(nameIn, pill);
    card.append(top);
    for (const fd of fieldsFor(kind)) {
      const v = pt.edits[fd.key] !== void 0 ? pt.edits[fd.key] : current()[fd.key];
      const row = el("div", "pt-erow");
      row.id = "pt-field-" + fd.key;
      const k = el("div", "pt-ek");
      k.append(el("span", null, fd.label));
      const re = el("button", "pt-re", "\u21BB");
      re.id = "pt-refield-" + fd.key;
      re.type = "button";
      re.title = "re-draft just this line";
      re.onclick = () => void refield(fd.key);
      k.append(re);
      row.append(k);
      row.append(editable(fd, v));
      card.append(row);
    }
    wrap.append(card);
    wrap.append(factsStrip(true));
    const acts = el("div", "pt-acts");
    const pub = el("button", "pt-go", busy ? "banking\u2026" : "Bank it \u2014 every app can borrow it");
    pub.id = "pt-publish";
    pub.type = "button";
    pub.disabled = busy;
    pub.onclick = () => void publish();
    const back = el("button", "pt-ghost", "\u2190 other readings");
    back.type = "button";
    back.onclick = () => setPhase("found");
    const cancel = el("button", "pt-ghost", "discard");
    cancel.id = "pt-cancel";
    cancel.type = "button";
    cancel.onclick = () => void discard();
    acts.append(pub, back, cancel);
    wrap.append(acts);
    const note = el("div", "pt-privacy", "Publishing puts this in your own library on your machine. It stays yours; each app still asks you before it can borrow it. " + PRIVACY);
    note.id = "pt-publish-note";
    wrap.append(note);
    return wrap;
  }
  function editable(fd, value) {
    const holder = el("div", "pt-ev");
    const text = fd.list ? Array.isArray(value) ? value.join("\n") : "" : str(value);
    const show = () => {
      holder.textContent = "";
      if (!text) {
        const em = el("span", "pt-fv muted", pt.pointer === "site" ? "the site doesn't say \u2014 click to add it yourself" : "the source doesn't say \u2014 click to add it yourself");
        holder.append(em);
      } else if (fd.list) {
        const l = el("div", "pt-flist");
        for (const line of text.split("\n").filter(Boolean)) l.append(el("div", null, "\xB7 " + line));
        holder.append(l);
      } else {
        holder.append(el("span", "pt-fv", text));
      }
    };
    holder.onclick = () => {
      holder.textContent = "";
      const input = fd.multiline ? el("textarea", "pt-edit") : el("input", "pt-edit");
      input.value = text;
      if (fd.multiline) input.rows = fd.list ? 4 : 3;
      const commit = () => {
        const v = input.value;
        pt.edits[fd.key] = fd.list ? v.split("\n").map((x) => x.replace(/^[-·*]\s*/, "").trim()).filter(Boolean).slice(0, 6) : v.trim();
        void persist();
        render();
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          render();
        }
        if (e.key === "Enter" && !fd.multiline) {
          e.preventDefault();
          commit();
        }
      });
      holder.append(input);
      input.focus();
    };
    show();
    return holder;
  }
  function screenReady() {
    const p = pt.published || {};
    const kind = p.kind || kindOf();
    const wrap = el("div", "pt-screen");
    const h = el("div", "pt-h");
    const t = el("h3", null, `${p.name || "It"} is banked.`);
    t.id = "pt-ready-name";
    h.append(t);
    h.append(el("span", "pt-hs", "It's in your library on this machine. Every app below can borrow it \u2014 you approve each lend once."));
    wrap.append(h);
    const chips = el("div", "pt-ready-apps");
    chips.id = "pt-ready-apps";
    for (const [id, line] of READY[kind] || READY.project) {
      const app = APP_BY_ID[id];
      if (!app) continue;
      const a = el("a", "pt-app");
      a.href = app.href;
      a.dataset.app = app.id;
      if (/^https:/.test(app.href)) {
        a.target = "_blank";
        a.rel = "noreferrer";
      }
      const f = famOf(app.id);
      const ic = el("span", "pt-ic sm");
      ic.style.background = f.soft;
      ic.style.color = f.ink;
      ic.innerHTML = glyphSvg(app.id);
      const tx = el("span", "pt-tt");
      tx.append(el("span", "pt-tn", app.name), el("span", "pt-ts", line));
      a.append(ic, tx);
      chips.append(a);
    }
    wrap.append(chips);
    const top = host.buildActions({ name: p.name, kind })[0];
    if (top && APP_BY_ID[top.app]) {
      const app = APP_BY_ID[top.app];
      const a = el("a", "pt-go pt-primary");
      a.id = "pt-ready-open";
      a.href = app.href;
      a.dataset.app = app.id;
      if (/^https:/.test(app.href)) {
        a.target = "_blank";
        a.rel = "noreferrer";
      }
      a.textContent = `${top.label} \u2192 in ${app.name}`;
      wrap.append(a);
    }
    if (p.folder) {
      const f = el(
        "div",
        "pt-folder-note",
        `Because you pointed at a folder, lending this project to an app opens the real files in ${basename(p.folder)} \u2014 not a copy.`
      );
      f.id = "pt-ready-folder";
      wrap.append(f);
    }
    if (bindStuck) wrap.append(el("div", "pt-quiet", "this page's own scratch state is paused until you reload"));
    const acts = el("div", "pt-acts");
    const again = el("button", "pt-ghost", "point at something else");
    again.id = "pt-ready-another";
    again.type = "button";
    again.onclick = () => {
      pt = blank();
      collapsed = false;
      setPhase("pointer");
    };
    acts.append(again);
    wrap.append(acts);
    return wrap;
  }
  function screenBlocked() {
    const b = pt.blocked || {};
    const wrap = el("div", "pt-screen");
    const box = el("div", "pt-blocked");
    box.append(el("span", "pt-blk", "didn't land"));
    const why = el("div", "pt-blocked-why", b.why || "That didn't work.");
    why.id = "pt-blocked-why";
    box.append(why);
    const next = el("div", "pt-acts");
    next.id = "pt-blocked-next";
    const retry = el("button", "pt-go", "\u21BB try that again");
    retry.id = "pt-retry";
    retry.type = "button";
    retry.onclick = () => {
      pt.blocked = null;
      void go();
    };
    next.append(retry);
    const others = TILES.filter((t) => t.id !== pt.pointer).sort((x, y) => (y.id === b.transfer ? 1 : 0) - (x.id === b.transfer ? 1 : 0));
    for (const t of others) {
      const btn = el("button", "pt-ghost", t.id === "folder" ? "point at the folder instead \u2192" : t.id === "site" ? "point at the site instead \u2192" : "point at the repo instead \u2192");
      btn.type = "button";
      btn.onclick = () => {
        pt.pointer = t.id;
        pt.input = t.id === b.transfer && b.prefill ? b.prefill : "";
        pt.blocked = null;
        setPhase("pointer");
        setTimeout(() => $("pt-input")?.focus(), 20);
      };
      next.append(btn);
    }
    box.append(next);
    if (b.transfer === "folder") {
      box.append(el("div", "pt-quiet", "If it's yours and it's cloned locally, the folder pointer reads it without any network at all \u2014 and apps then open the real files."));
    }
    wrap.append(box);
    return wrap;
  }
  async function probeGrant() {
    if (!relay2) {
      grantOk = { models: false, webfetch: false };
      return;
    }
    const g = await relay2.permissions().catch(() => null);
    grantOk = {
      models: !!(g && Array.isArray(g.models) && g.models.length),
      webfetch: !!(g && Array.isArray(g.tools) && g.tools.some((t) => (typeof t === "string" ? t : t?.name) === "WebFetch"))
    };
  }
  return {
    /** Called once at first paint — wires the static controls that live in index.html. */
    mount() {
      const bar = $("pt-bar");
      if (bar) bar.onclick = () => {
        collapsed = false;
        render();
        setTimeout(() => $("pt-input")?.focus(), 20);
      };
      const hide = $("pt-collapse");
      if (hide) hide.onclick = () => {
        collapsed = true;
        render();
      };
      const re = $("pt-reconnect-go");
      if (re) {
        re.onclick = async () => {
          if (!relay2) return;
          re.disabled = true;
          try {
            await relay2.connect(host.scope);
          } catch {
          }
          await probeGrant();
          re.disabled = false;
          render();
        };
      }
      render();
    },
    async onConnect(r) {
      relay2 = r;
      connected = true;
      await probeGrant();
      await restoreDraft();
      render();
    },
    onDisconnect() {
      abort();
      relay2 = null;
      connected = false;
      grantOk = { models: false, webfetch: false };
      pt = blank();
      collapsed = false;
      render();
    },
    /** The library decides whether this opens wide or sits as a one-line bar. */
    setLibrary(metas) {
      libraryEmpty = !metas || metas.length === 0;
      if (pt.phase === "pointer" && !resumed) collapsed = !libraryEmpty;
      render();
    },
    /** Entry points elsewhere in the page (+ New project, the empty card, the way-stepper). */
    open(pointer) {
      collapsed = false;
      if (pointer && TILE_BY_ID[pointer]) pt.pointer = pointer;
      if (pt.phase === "ready" || pt.phase === "blocked") pt = { ...blank(), pointer: pt.pointer };
      render();
      sec()?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => $("pt-input")?.focus(), 260);
    },
    isEmptyLibrary: () => libraryEmpty,
    render
  };
}

// src/home.js
var $2 = (id) => document.getElementById(id);
var INSTALL_URL = "https://thelastprompt.ai/switchboard/";
var KINDS = ["brand", "personal", "project", "csv", "gsheet", "note"];
var SCOPE = {
  reason: "your Switchboard home \u2014 greet you, show your library, and set up your first project: your Claude reads the site, repo, or folder you point at, and banks what it finds. This page publishes what you point it at; it still never opens the contents of your other contexts.",
  models: ["sonnet"],
  tools: ["WebFetch"],
  contextKinds: KINDS
};
var isDemo = new URLSearchParams(location.search).has("demo") && /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
var isDemoEmpty = isDemo && new URLSearchParams(location.search).get("demo") === "empty";
var demoTasks = isDemo && !isDemoEmpty;
var RECENTLY_ADDED = ["huddle", "reel", "identity", "take", "batch", "marquee", "redline"];
var TASKS_KEY = "tasks.md";
var WRAPP_TAG_RE = /\s+@([a-z][a-z0-9-]{0,47})\s*$/i;
var TASK_DUE_RE = /^(.*?)\s+—\s+by\s+(.+)$/;
var escapeTaskRe = (x) => String(x).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var normTask = (x) => String(x || "").toLowerCase().replace(WRAPP_TAG_RE, "").replace(/\s+—\s+by\s+.*$/i, "").replace(/\s+/g, " ").trim();
var tasksRaw = "";
var relay = null;
var booted = false;
var way = { installed: false, connected: false, brands: 0 };
var recents = [];
var plan = "free";
var wallet = { balance: 0, ledger: [] };
var metasCache = [];
var userName = "";
var promotedAction = null;
var storageFrozen = false;
var vaultBound = false;
var ctx = {
  list: () => relay.context.list(),
  publish: (c) => relay.context.publish(c)
};
var pointRelay = (r) => ({
  stream: (p) => r.stream(p),
  permissions: () => r.permissions(),
  connect: (sc) => r.connect(sc),
  storage: r.storage,
  context: { publish: (c) => ctx.publish(c) }
});
var now2 = () => (/* @__PURE__ */ new Date()).getTime();
var s = (n) => n === 1 ? "" : "s";
var NUMWORD = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
var word = (n) => n >= 0 && n < NUMWORD.length ? NUMWORD[n] : String(n);
var low = (w) => w.charAt(0).toLowerCase() + w.slice(1);
function listNames(names, max = 3) {
  const l = names.filter(Boolean).slice(0, max);
  if (!l.length) return "";
  if (l.length === 1) return l[0];
  return `${l.slice(0, -1).join(", ")} and ${l[l.length - 1]}`;
}
function mk(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function ago(ts) {
  const sec = Math.max(0, (now2() - ts) / 1e3);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}
function kindCounts() {
  const c = {};
  for (const m of metasCache) {
    const k = (m.kind || "other").toLowerCase();
    c[k] = (c[k] || 0) + 1;
  }
  return c;
}
function firstOf(kind) {
  return metasCache.find((m) => (m.kind || "").toLowerCase() === kind)?.name;
}
var isVerified = (app) => !!app && /^https:/.test(app.href);
var detailHref = (id) => `./${id}-landing.html`;
function pointAtDetail(a, app) {
  a.href = detailHref(app.id);
  a.removeAttribute("target");
  a.removeAttribute("rel");
  a.dataset.detail = "1";
}
var verifyBadge = () => `<span class="verify" title="Verified \u2014 published to a live domain"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7.5 12.4l3 3 6-6.4" fill="none" stroke="#0A0A0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
var FAMILIES = [FAM.gold, FAM.green, FAM.blue, FAM.pink, FAM.teal, FAM.violet];
function hashInt(str2) {
  let h = 0;
  for (let i = 0; i < str2.length; i++) h = h * 31 + str2.charCodeAt(i) >>> 0;
  return h;
}
function isHex(x) {
  return typeof x === "string" && /^#?[0-9a-fA-F]{6}$/.test(x.trim());
}
function normHex(x) {
  x = x.trim();
  return x[0] === "#" ? x : "#" + x;
}
function rgbOf(hex) {
  const h = normHex(hex).slice(1);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function hexLum(hex) {
  const [r, g, b] = rgbOf(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function mixToward(hex, target, amt) {
  const [r, g, b] = rgbOf(hex);
  const m = (c) => Math.round(c + (target - c) * amt);
  return `#${[m(r), m(g), m(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
var lighten = (hex, amt) => mixToward(hex, 255, amt);
var darken = (hex, amt) => mixToward(hex, 0, amt);
function colorFor(meta) {
  const swatch = Array.isArray(meta.swatches) ? meta.swatches.find(isHex) : null;
  let base, light;
  if (swatch) {
    base = normHex(swatch);
    light = lighten(base, 0.5);
  } else {
    const f = FAMILIES[hashInt(`${meta.name || ""}|${meta.kind || ""}`) % FAMILIES.length];
    base = f.ink;
    light = f.light;
  }
  const mono = hexLum(base) > 0.62 ? "#1A1206" : "#FFFFFF";
  return { base, light, mono, pav: darken(base, 0.12) };
}
var NAV_GLYPH = {
  home: `<path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/>`,
  explore: `<circle cx="12" cy="12" r="8"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>`,
  following: `<path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z"/>`
};
function renderNav() {
  const box = $2("nav-primary");
  box.textContent = "";
  const rows = [
    { id: "home", label: "Home", target: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { id: "explore", label: "Explore", target: () => $2("store").scrollIntoView({ behavior: "smooth", block: "start" }) },
    { id: "following", label: "Following", connectedOnly: true, target: () => ($2("dash").hidden ? $2("recent-sec") : $2("dash")).scrollIntoView({ behavior: "smooth", block: "start" }) }
  ];
  for (const r of rows) {
    if (r.connectedOnly && !way.connected) continue;
    const el2 = mk("button", "nav-row" + (r.id === "home" ? " active" : ""));
    el2.type = "button";
    el2.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${NAV_GLYPH[r.id]}</svg>`;
    el2.append(mk("span", null, r.label));
    el2.onclick = () => {
      box.querySelectorAll(".nav-row").forEach((x) => x.classList.toggle("active", x === el2));
      r.target();
      closeSide();
    };
    box.append(el2);
  }
}
function renderCats() {
  const box = $2("cats-list");
  box.textContent = "";
  const counts = categoryCounts(APPS);
  for (const cat of CATEGORIES) {
    if (!(counts[cat] || 0)) continue;
    const f = categoryFam(cat);
    const row = mk("button", "cat-row");
    row.type = "button";
    row.title = CATEGORY_BLURB[cat] || cat;
    const ic = mk("span", "cat-ic");
    ic.style.background = f.soft;
    ic.style.color = f.ink;
    ic.innerHTML = categoryGlyphSvg(cat);
    row.append(ic, mk("span", "cat-lbl", cat), mk("span", "cat-count", String(counts[cat] || 0)));
    row.onclick = () => {
      const h = [...document.querySelectorAll("#store .sec-h")].find((x) => x.dataset.cat === cat);
      h?.scrollIntoView({ behavior: "smooth", block: "start" });
      closeSide();
    };
    box.append(row);
  }
}
function renderBrands(metas) {
  const group = $2("brands-group");
  const box = $2("brands-list");
  box.textContent = "";
  let rows = metas.filter((m) => (m.kind || "").toLowerCase() === "brand");
  if (!rows.length) rows = metas.filter((m) => (m.kind || "").toLowerCase() === "project");
  if (!rows.length) {
    group.hidden = true;
    return;
  }
  group.hidden = false;
  for (const m of rows.slice(0, 8)) {
    const c = colorFor(m);
    const row = mk("div", "brand-row");
    const mkm = mk("span", "brand-mk", (m.name || "\u2022")[0].toUpperCase());
    mkm.style.background = c.base;
    mkm.style.color = c.mono;
    row.append(mkm, mk("span", "brand-nm", m.name || "Untitled"));
    row.onclick = () => {
      $2("projects").scrollIntoView({ behavior: "smooth", block: "center" });
      closeSide();
    };
    box.append(row);
  }
}
function closeSide() {
  document.body.classList.remove("side-open");
}
$2("side-toggle").onclick = () => document.body.classList.toggle("side-open");
$2("side-scrim").onclick = closeSide;
$2("side-search").onclick = () => {
  $2("search").focus();
  $2("search").scrollIntoView({ block: "center" });
};
var DESIGN_W = 1440;
function fitOne(thumb, fr) {
  const w = thumb.clientWidth;
  if (!w) return;
  const scale = w / DESIGN_W;
  fr.style.width = DESIGN_W + "px";
  fr.style.height = Math.round(w / (16 / 10)) / scale + "px";
  fr.style.transform = `scale(${scale})`;
  fr.style.transformOrigin = "top left";
}
var thumbInfo = /* @__PURE__ */ new WeakMap();
function mountThumb(thumb, info) {
  if (info.fr) return;
  const fr = document.createElement("iframe");
  fr.src = `./${info.app.id}-landing.html`;
  fr.loading = "lazy";
  fr.setAttribute("scrolling", "no");
  fr.setAttribute("tabindex", "-1");
  fr.setAttribute("aria-hidden", "true");
  fr.setAttribute("title", `${info.app.name} preview`);
  fr.addEventListener("load", () => fr.classList.add("ready"));
  info.fr = fr;
  thumb.appendChild(fr);
  requestAnimationFrame(() => info.fr && fitOne(thumb, info.fr));
}
function unmountThumb(info) {
  if (!info.fr) return;
  info.fr.remove();
  info.fr = null;
}
var thumbObserver = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver((entries) => {
  for (const e of entries) {
    const info = thumbInfo.get(e.target);
    if (!info) continue;
    if (e.isIntersecting) mountThumb(e.target, info);
    else if (!info.keep) unmountThumb(info);
  }
}, { rootMargin: "1200px 0px" }) : null;
function makeThumb(app, keep = false) {
  const thumb = mk("span", "thumb");
  const ph = mk("span", "thumb-ph");
  ph.style.setProperty("--fam", famOf(app.id).ink);
  ph.innerHTML = thumbArt(app.id);
  thumb.appendChild(ph);
  const info = { app, fr: null, keep };
  thumbInfo.set(thumb, info);
  const refit = () => info.fr && fitOne(thumb, info.fr);
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(refit).observe(thumb);
  else window.addEventListener("resize", refit);
  if (keep) requestAnimationFrame(() => mountThumb(thumb, info));
  if (thumbObserver) thumbObserver.observe(thumb);
  else if (!keep) requestAnimationFrame(() => mountThumb(thumb, info));
  return thumb;
}
function decorateCards() {
  document.querySelectorAll("a.featured[data-app]").forEach((card) => {
    const app = APP_BY_ID[card.dataset.app];
    if (!app) return;
    pointAtDetail(card, app);
    const cat = categoryOf(app.id);
    const f = categoryFam(cat);
    const desc = card.querySelector("p")?.textContent || "";
    const left = mk("span", "feat-l");
    left.append(mk("span", "fk", "Featured wrapp"));
    const head = mk("span", "feat-head");
    head.append(glyphTile(app.id, 56));
    const h = mk("h2");
    h.append(document.createTextNode(app.name));
    if (isVerified(app)) h.insertAdjacentHTML("beforeend", verifyBadge());
    head.append(h);
    left.append(head, mk("p", null, desc));
    const tag = mk("span", "feat-tag");
    const tic = mk("span", "cat-ic");
    tic.style.background = f.soft;
    tic.style.color = f.ink;
    tic.innerHTML = categoryGlyphSvg(cat);
    tag.append(tic, document.createTextNode(cat));
    left.append(tag);
    const acts = mk("span", "feat-actions");
    const open = mk("span", "feat-open");
    open.append(document.createTextNode("See the wrapp"), Object.assign(document.createElement("span"), { textContent: "\u2192" }));
    acts.append(open, mk("span", "feat-cost", `built with ${fmtTok(app.tokens)} tokens`));
    left.append(acts);
    const right = mk("span", "feat-r");
    right.append(makeThumb(app, true));
    card.textContent = "";
    card.append(left, right);
  });
  document.querySelectorAll("a.card[data-app]").forEach((card) => {
    const app = APP_BY_ID[card.dataset.app];
    const body = card.querySelector(".body");
    const txt = card.querySelector(".txt") || body;
    if (!app || !body) return;
    pointAtDetail(card, app);
    card.insertBefore(makeThumb(app), card.firstChild);
    if (isVerified(app)) card.querySelector("h4")?.insertAdjacentHTML("beforeend", verifyBadge());
    body.insertBefore(glyphTile(app.id, 34), body.firstChild);
    const tags = mk("span", "cat-line");
    tags.append(mk("span", "cat-tag", categoryOf(app.id)));
    if (app.pro) {
      const pp = mk("span", "pro-pill", "Pro");
      pp.title = `Pro tier: ${app.pro.join(" \xB7 ")}. Free core is always complete and never gated.`;
      tags.append(pp);
    }
    txt.append(tags);
    const cost = mk("span", "cost");
    cost.innerHTML = `<b>${fmtTok(app.tokens)}</b> tokens \xB7 dev-reported`;
    cost.title = "Build-cost receipt \u2014 reported by the developer. Broker-metered receipts land with the creator pipeline; only measured numbers will ever drop this tag.";
    txt.append(cost);
    if (isDemo) {
      const pl = mk("span", "pl");
      pl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l14 8-14 8z"/></svg>`;
      pl.append(document.createTextNode(`${fmtTok(Math.round(app.tokens * 0.9))} plays \xB7 illustrative`));
      txt.append(pl);
    }
  });
}
function renderBoardCounts() {
  const n = String(APPS.length);
  for (const id of ["board-count", "toll-count", "hero-count"]) {
    const el2 = $2(id);
    if (el2) el2.textContent = n;
  }
}
var HERO_ART = ["brandbrain", "adforge", "arcana", "bank"];
function renderHeroArt() {
  const box = $2("hero-art");
  if (!box) return;
  box.textContent = "";
  for (const id of HERO_ART) {
    const app = APP_BY_ID[id];
    if (!app) continue;
    const a = mk("a");
    a.href = detailHref(app.id);
    a.title = app.name;
    a.dataset.app = app.id;
    const cap = mk("span", "cap");
    cap.append(glyphTile(app.id, 22), mk("span", "nm", app.name));
    a.append(makeThumb(app, true), cap);
    box.append(a);
  }
}
function renderBoardStrip() {
  const box = $2("board-strip");
  if (!box) return;
  const counts = categoryCounts(APPS);
  box.textContent = "";
  for (const cat of CATEGORIES) {
    const n = counts[cat] || 0;
    if (!n) continue;
    const b = mk("button");
    b.type = "button";
    b.append(document.createTextNode(cat), mk("span", "n", String(n)));
    b.onclick = () => {
      [...box.children].forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      [...document.querySelectorAll("#store .sec-h")].find((x) => x.dataset.cat === cat)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    box.append(b);
  }
}
function renderRecent() {
  const box = $2("recent-list");
  box.textContent = "";
  for (const id of RECENTLY_ADDED) {
    const app = APP_BY_ID[id];
    if (!app) continue;
    const row = mk("a", "recent-row");
    row.dataset.app = id;
    pointAtDetail(row, app);
    row.append(glyphTile(id, 34));
    const t = mk("span", "rr-t");
    const n = mk("span", "rr-n");
    n.append(document.createTextNode(app.name));
    if (isVerified(app)) n.insertAdjacentHTML("beforeend", verifyBadge());
    t.append(n, mk("span", "rr-c", firstLine(app)));
    row.append(t, mk("span", "rr-cat", categoryOf(id)));
    box.append(row);
  }
}
function firstLine(app) {
  const card = document.querySelector(`a.card[data-app="${app.id}"] p`);
  return card ? card.textContent : categoryOf(app.id);
}
var STEPS = [
  {
    title: "Get Switchboard",
    sub: "the extension + sidekick that lend apps your Claude",
    done: () => way.installed,
    act: () => window.open("https://thelastprompt.ai/switchboard/", "_blank", "noreferrer"),
    doneSub: "installed \u2014 your AI has a body"
  },
  {
    title: "Connect this page",
    sub: "one consent \u2014 then this home shows what you own",
    done: () => way.connected,
    act: () => clickConnect(),
    doneSub: "connected \u2014 this page is your dashboard now"
  },
  // Step 3 used to send people to brandbrain for a full brand build. Leaving the store to do
  // onboarding somewhere else is exactly the gap the pointer flow closes, so it opens inline now.
  {
    title: "Point at your first project",
    sub: "a site, a repo, or a folder \u2014 your Claude reads it and banks what it finds",
    done: () => way.brands > 0 || metasCache.some((m) => (m.kind || "").toLowerCase() === "project"),
    act: () => point.open(),
    doneSub: () => `${way.brands || metasCache.length} banked \u2014 every app below can borrow it`
  },
  {
    title: "Point an app at it",
    sub: "open any app \u2014 it asks for what it needs, you approve once",
    done: () => false,
    act: () => document.querySelector('a.card[data-app="adforge"]')?.scrollIntoView({ behavior: "smooth", block: "center" }),
    currentSub: "the founder stack below runs on the brand you just banked"
  }
];
function renderWay() {
  const box = $2("way");
  box.textContent = "";
  let currentMarked = false;
  STEPS.forEach((st, i) => {
    const done = st.done();
    const isCurrent = !done && !currentMarked;
    if (isCurrent) currentMarked = true;
    const card = mk("div", "step " + (done ? "done" : isCurrent ? "current" : "todo"));
    const p = mk(
      "p",
      null,
      done ? typeof st.doneSub === "function" ? st.doneSub() : st.doneSub || st.sub : isCurrent && st.currentSub ? st.currentSub : st.sub
    );
    card.append(mk("div", "n", `STEP ${i + 1}`), mk("h5", null, st.title), p, mk("div", "state", done ? "\u2713" : isCurrent ? "\u2192" : ""));
    card.onclick = () => st.act();
    box.append(card);
  });
}
function clickConnect() {
  $2("chip-dock").firstElementChild?.shadowRoot?.querySelector("button")?.click();
}
var point = createPoint({
  scope: SCOPE,
  clickConnect: () => clickConnect(),
  isFrozen: () => storageFrozen,
  // Flipping the freeze flag must also refresh the already-rendered task checkboxes: they were painted
  // with cb.disabled=storageFrozen and there's no re-render otherwise, so without this they'd look
  // enabled during a folder-point freeze (clicks correctly no-op but the box flips and snaps back).
  freeze: (on) => {
    storageFrozen = !!on;
    syncFrozenUI();
  },
  buildActions: (focus) => buildActions(focus),
  onPublished: () => refreshLibrary()
});
function syncFrozenUI() {
  const list = $2("next-list");
  if (!list) return;
  list.setAttribute("aria-disabled", storageFrozen ? "true" : "false");
  list.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.disabled = storageFrozen;
  });
}
function movePoint(toDash) {
  const s2 = $2("point-sec");
  if (!s2) return;
  if (toDash) $2("dash").insertBefore(s2, $2("next-sec"));
  else $2("call-sec").appendChild(s2);
}
mountConnect($2("chip-dock"), {
  scope: SCOPE,
  context: "none",
  installUrl: INSTALL_URL,
  onConnect: (r) => onConnected(r),
  onDisconnect: () => onDisconnected()
});
function demoRelay() {
  const store = /* @__PURE__ */ new Map();
  const t = (/* @__PURE__ */ new Date()).getTime();
  if (!isDemoEmpty) store.set("recents", JSON.stringify([
    { app: "adforge", when: t - 36e5 },
    { app: "bank", when: t - 26e6 },
    { app: "redline", when: t - 9e7 },
    { app: "shelf", when: t - 12e7 }
  ]));
  const metas = isDemoEmpty ? [] : [
    { id: "aamras", name: "Aamras", kind: "brand", swatches: ["#C97A1E", "#8C1E1E"] },
    { id: "haazma", name: "Haazma", kind: "brand", swatches: ["#3A6EA5", "#1C3E63"] },
    { id: "piqual", name: "Piqual", kind: "brand", swatches: ["#5E8B23", "#385516"] },
    { id: "me", name: "Sameep", kind: "personal" },
    { id: "relay", name: "Relay", kind: "project", folder: "~/Projects/relay" },
    { id: "vendors", name: "Vendor book", kind: "gsheet", sourceKind: "gsheet", rowCount: 42 },
    { id: "n1", name: "Launch notes", kind: "note" },
    { id: "n2", name: "Pricing ideas", kind: "note" }
  ];
  const DEMO_SITE_READ = "Northbound Studio \u2014 small-batch outerwear made in Portland.\nShop: The Cascade Parka $389, The Foghorn Shell $265, The Basin Fleece $148.\n:root{--color-primary:#1F3D2B;--color-accent:#D9743F;--color-ink:#141614}";
  const DEMO_REPO_READ = '# Switchboard \u2014 a BYO-Claude consent broker\n\nA local sidekick brokers your model and tools to any site.\nPackages: sdk, sidekick, extension, protocol.\n{"name":"switchboard","version":"1.0.0","license":"MIT","devDependencies":{"typescript":"^5.4.0","esbuild":"^0.21.0"}}';
  const demoSite = {
    facts: {
      name: "Northbound Studio",
      domain: "northbound.studio",
      category: "Outerwear",
      products: ["The Cascade Parka", "The Foghorn Shell", "The Basin Fleece"],
      priceBand: "$148\u2013$389",
      paletteRaw: ["#1F3D2B", "#D9743F", "#141614"]
    },
    readings: [
      {
        lens: "How they describe themselves",
        oneLine: "Small-batch outerwear made in Portland.",
        positioning: "Technical shells and parkas built in small runs, sold direct, made to be repaired rather than replaced.",
        voice: "Plain, unhurried, quietly proud of the making.",
        audience: "People who walk to work in the rain and keep a coat for a decade.",
        recommended: true
      },
      {
        lens: "What the catalogue says",
        oneLine: "Three coats, built for wet cities.",
        positioning: "A tight range \u2014 one parka, one shell, one fleece \u2014 priced $148 to $389, layering into each other.",
        voice: "Spec-first: fabric, seams, weight.",
        audience: "Buyers comparing on construction, not on logo.",
        recommended: false
      },
      {
        lens: "How a buyer would describe it",
        oneLine: "The coat you buy once.",
        positioning: "The alternative to a $900 technical jacket and a $60 one that dies in a season.",
        voice: "Reassuring, a little anti-fashion.",
        audience: "Thirty-somethings replacing a coat that failed them.",
        recommended: false
      }
    ]
  };
  const demoProject = {
    facts: {
      name: "Switchboard",
      stack: ["TypeScript", "esbuild", "MCP"],
      packages: ["sdk", "sidekick", "extension", "protocol"],
      docs: ["Vision Spec \u2014 docs/VISION.md", "Context Kinds \u2014 docs/CONTEXT-KINDS.md"],
      links: [{ label: "repo", url: "https://github.com/sameeeeeeep/switchboard" }],
      notableFiles: ["packages/sdk/src/index.ts \u2014 the developer-facing SDK"],
      status: "v1.0.0 \xB7 MIT"
    },
    readings: [
      {
        lens: "What the README claims",
        summary: "A BYO-Claude consent broker \u2014 a local sidekick lends your model and tools to any site.",
        state: "v1.0.0, MIT, four packages published.",
        nextSteps: ["Ship the creator pipeline", "Meter real build-cost receipts"],
        recommended: true
      },
      {
        lens: "What the code actually is",
        summary: "A TypeScript monorepo: an MCP-speaking daemon, a browser extension, a protocol package and an SDK.",
        state: "esbuild bundles, no framework, no server.",
        nextSteps: ["Type the storage protocol end to end", "Cover the broker with tests"],
        recommended: false
      },
      {
        lens: "Where it is right now",
        summary: "Public, MIT, and shipping \u2014 the catalog is live and the broker is stable.",
        state: "Working end to end; the economics layer is still simulated.",
        nextSteps: ["Replace simulated wallet with real metering", "Open the wrapp submission path"],
        recommended: false
      }
    ]
  };
  async function* demoStream({ prompt }) {
    const p = String(prompt || "");
    const isRepo = /raw\.githubusercontent|github\.com/.test(p);
    const isFolder = /THE FOLDER:/.test(p);
    const isField = /Re-draft ONLY/.test(p);
    const body = isRepo || isFolder ? demoProject : demoSite;
    if (!/do NOT call/i.test(p) && !isFolder) {
      const url = isRepo ? "https://raw.githubusercontent.com/o/r/HEAD/README.md" : "https://northbound.studio/";
      yield { type: "tool_proposed", call: { name: "WebFetch", arguments: { url } } };
      await new Promise((res) => setTimeout(res, 420));
      yield { type: "tool_result", call: { name: "WebFetch" }, result: { ok: true, content: [{ text: isRepo ? DEMO_REPO_READ : DEMO_SITE_READ }] } };
    }
    if (isField) {
      const key = (p.match(/Re-draft ONLY "([a-zA-Z]+)"/) || [])[1] || "summary";
      yield { type: "text", text: JSON.stringify({ [key]: "A fresh take on the same fact, drafted from the read it already has." }) };
      yield { type: "done", result: {} };
      return;
    }
    const out = JSON.stringify(body);
    for (let i = 0; i < out.length; i += 220) {
      await new Promise((res) => setTimeout(res, 34));
      yield { type: "text", text: out.slice(i, i + 220) };
    }
    yield { type: "done", result: {} };
  }
  const files = /* @__PURE__ */ new Map([
    ["README.md", DEMO_REPO_READ],
    ["package.json", '{"name":"switchboard","version":"1.0.0","license":"MIT"}'],
    ["docs/VISION.md", "# Vision Spec\nThe broker is the product."]
  ]);
  let bound = null;
  return {
    permissions: async () => ({ origin: location.origin, models: ["sonnet"], tools: [{ name: "WebFetch", access: "read" }], contextKinds: KINDS }),
    identity: async () => ({ name: "Sameep" }),
    connect: async () => ({ origin: location.origin, models: ["sonnet"], tools: [{ name: "WebFetch", access: "read" }] }),
    stream: (params) => demoStream(params),
    storage: {
      get: async (k) => bound ? files.get(k) ?? null : store.get(k) ?? null,
      set: async (k, v) => {
        store.set(k, String(v));
      },
      delete: async (k) => store.delete(k),
      list: async () => bound ? [...files.keys()] : [...store.keys()],
      info: async () => ({ folder: bound || "~/Library/Switchboard/sandbox/store", autoAssigned: !bound, count: 3 }),
      bind: async (path) => {
        bound = /sandbox/.test(path) ? null : path;
        return { folder: path, autoAssigned: !bound, count: 3 };
      }
    },
    context: {
      list: async () => metas.slice(),
      publish: async (c) => {
        const id = c.id || String(metas.length + 1);
        const swatches = Array.isArray(c.data?.palette) ? c.data.palette : void 0;
        const i = metas.findIndex((m) => m.id === id);
        const meta = { id, name: c.name, kind: c.kind, ...swatches ? { swatches } : {}, ...c.data?.folder ? { folder: c.data.folder } : {} };
        if (i >= 0) metas[i] = meta;
        else metas.push(meta);
        return id;
      }
    }
  };
}
if (isDemo) {
  $2("chip-dock").hidden = true;
  onConnected(demoRelay());
} else {
  (async () => {
    const r = await whenRelayReady(2e3, { installUrl: INSTALL_URL });
    if (r && "connect" in r) {
      way.installed = true;
      const grant = await r.permissions().catch(() => null);
      if (grant) {
        onConnected(r);
        return;
      }
    }
    renderWay();
  })();
}
renderWay();
function onConnected(r) {
  relay = r;
  way.installed = true;
  way.connected = true;
  renderWay();
  renderNav();
  movePoint(true);
  void point.onConnect(pointRelay(r));
  if (booted) return;
  booted = true;
  void initDash(r);
}
function onDisconnected() {
  relay = null;
  booted = false;
  way.connected = false;
  storageFrozen = false;
  renderWay();
  renderNav();
  $2("brands-group").hidden = true;
  hideDash();
  movePoint(false);
  point.onDisconnect();
}
function showDash() {
  $2("hero").hidden = true;
  if ($2("pitch")) $2("pitch").hidden = true;
  $2("dash").hidden = false;
  $2("wallet-chip").hidden = false;
  $2("dock").hidden = false;
  document.body.classList.toggle("is-demo", isDemo);
  $2("ws").hidden = !demoTasks;
  $2("autorun").hidden = !demoTasks;
  $2("stat-tiles").hidden = !demoTasks;
  $2("demo-ribbon").hidden = !isDemo;
}
function hideDash() {
  $2("dash").hidden = true;
  $2("dash-body").classList.remove("on");
  promotedAction = null;
  $2("hero").hidden = false;
  if ($2("pitch")) $2("pitch").hidden = false;
  $2("wallet-chip").hidden = true;
  $2("dock").hidden = true;
  document.body.classList.remove("plan-pro", "is-demo");
}
async function initDash(r) {
  try {
    const [recRaw, planRaw, walRaw] = await Promise.all([
      r.storage.get("recents"),
      r.storage.get("plan"),
      r.storage.get("wallet")
    ]);
    const rec = safeParse(recRaw, []);
    recents = Array.isArray(rec) ? rec.filter((x) => x && typeof x.app === "string" && typeof x.when === "number") : [];
    plan = planRaw === "pro" ? "pro" : "free";
    const w = safeParse(walRaw, null);
    wallet = w && typeof w.balance === "number" ? { balance: w.balance, ledger: Array.isArray(w.ledger) ? w.ledger : [] } : { balance: 0, ledger: [] };
  } catch {
  }
  if (!relay) return;
  document.body.classList.toggle("plan-pro", plan === "pro");
  const d = /* @__PURE__ */ new Date();
  $2("dash-date").textContent = d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  showDash();
  if (demoTasks) applyDemoChrome();
  renderPlan();
  renderWallet();
  renderTaskOS();
  renderDock();
  const user = await r.identity().catch(() => null);
  if (!relay) return;
  userName = user?.name?.trim() || "";
  await refreshLibrary();
}
async function refreshLibrary() {
  if (!relay) return;
  const metas = await ctx.list().catch(() => []);
  if (!relay) return;
  metasCache = metas;
  way.brands = metas.filter((m) => (m.kind || "").toLowerCase() === "brand").length;
  renderWay();
  renderHero();
  void renderNext();
  renderProjects(metas);
  renderBrands(metas);
  renderActions();
  renderRecs();
  point.setLibrary(metas);
  if (metas.length) renderLibrary(metas);
  else renderLibraryEmpty("No contexts yet \u2014 point this page at a site, a repo, or a folder above and your Claude will read it.");
}
function applyDemoChrome() {
  $2("search").placeholder = "Tell Switchboard what to do, or search\u2026";
  const ws = $2("ws");
  ws.textContent = "";
  const m = mk("span", "m", "N");
  m.style.background = "linear-gradient(135deg,#3E7D6A,#1C4A3C)";
  ws.append(m, document.createTextNode("Northbound Studio "));
  ws.insertAdjacentHTML("beforeend", `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>`);
}
var DEMO_REVIEW = [
  {
    brand: "Aamras",
    base: "#C97A1E",
    title: "Diwali gift-box ad set",
    app: "adforge",
    name: "AdForge",
    btn: "Review",
    pv: `<rect width="300" height="74" fill="#2A2410"/><circle cx="250" cy="37" r="26" fill="#B4802A"/><rect x="22" y="22" width="120" height="11" rx="4" fill="#B4802A"/><rect x="22" y="42" width="70" height="14" rx="7" fill="#E9C56B"/>`
  },
  {
    brand: "Haazma",
    base: "#3A6EA5",
    title: "Yesterday's spend \u2014 digest",
    app: "adpulse",
    name: "AdPulse",
    btn: "Open",
    pv: `<rect width="300" height="74" fill="#101B2A"/><polyline points="14,56 60,48 106,52 152,34 198,38 288,16" fill="none" stroke="#7FB0E0" stroke-width="3"/><circle cx="288" cy="16" r="4" fill="#7FB0E0"/>`
  },
  {
    brand: "Piqual",
    base: "#5E8B23",
    title: "Low-stock \u2014 reorder 4 SKUs",
    app: "shelf",
    name: "Shelf",
    btn: "Review",
    pv: `<rect width="300" height="74" fill="#16220E"/><rect x="18" y="14" width="130" height="9" rx="4" fill="#9FCB6E"/><rect x="18" y="32" width="90" height="9" rx="4" fill="#9FCB6E" opacity=".8"/><rect x="18" y="50" width="160" height="9" rx="4" fill="#9FCB6E" opacity=".6"/>`
  }
];
var DEMO_TASKS = { inflight: 5, automations: 3, done: 12, routine: 4 };
function brandNames() {
  return metasCache.filter((m) => (m.kind || "").toLowerCase() === "brand").map((m) => m.name).filter(Boolean);
}
function shelfExtras(c) {
  const bits = [];
  if (c.project) bits.push(`${c.project} project${s(c.project)}`);
  if (c.note) bits.push(`${c.note} note${s(c.note)}`);
  const live = (c.csv || 0) + (c.gsheet || 0);
  if (live) bits.push(`${live} live source${s(live)}`);
  return bits;
}
function renderHero() {
  const c = kindCounts();
  const who = userName ? `, ${userName}` : "";
  const brands = brandNames();
  const head = $2("dash-greeting");
  const sub = $2("dash-line");
  const link = $2("dash-cta");
  const run = $2("autorun");
  const facts = $2("stat-tiles");
  const inNote = $2("dash-in");
  inNote.textContent = "";
  if (demoTasks) {
    const ready = DEMO_REVIEW.length;
    const readyBrands = [...new Set(DEMO_REVIEW.map((x) => x.brand))];
    const across = listNames(brands.length ? brands : readyBrands);
    if (ready === 0) {
      head.textContent = `Nothing needs you${who}. Everything's running.`;
      sub.textContent = `${word(DEMO_TASKS.inflight)} in flight across ${across} \u2014 Switchboard is carrying them; nothing is waiting on a decision.`;
    } else if (readyBrands.length === 1) {
      head.textContent = `${word(ready)} draft${s(ready)} ${ready === 1 ? "is" : "are"} waiting on ${readyBrands[0]}.`;
      sub.textContent = `${word(DEMO_TASKS.inflight)} in flight across ${across} \u2014 Switchboard ran ${low(word(ready))} already; ${ready === 1 ? "it just needs" : "they just need"} a look.`;
    } else {
      head.textContent = `${word(ready)} thing${s(ready)} need${ready === 1 ? "s" : ""} you${who}.`;
      sub.textContent = `${word(DEMO_TASKS.inflight)} in flight across ${across} \u2014 Switchboard ran ${low(word(ready))} already; ${ready === 1 ? "it just needs" : "they just need"} a look.`;
    }
    link.hidden = true;
    run.hidden = false;
    run.lastChild.textContent = ready > 0 ? `Review the ${low(word(ready))} waiting` : `Auto-run ${DEMO_TASKS.routine} routine tasks`;
    run.onclick = () => (ready > 0 ? $2("review-sec") : $2("actions")).scrollIntoView({ behavior: "smooth", block: "start" });
    facts.hidden = false;
    facts.innerHTML = `<span><b>${DEMO_TASKS.automations}</b> automations live</span><span class="sep"></span><span><b>${DEMO_TASKS.done}</b> done this week</span>`;
    $2("dash-body").classList.add("on");
    return;
  }
  const extras = shelfExtras(c);
  const tail = extras.length ? `, alongside ${listNames(extras)}` : "";
  if (brands.length) {
    const n = brands.length;
    head.textContent = n === 1 ? `${brands[0]} is banked${who}. Nothing's waiting on you.` : `${word(n)} brand${s(n)} banked${who}. Nothing's waiting on you.`;
    sub.textContent = `${listNames(brands)} ${n === 1 ? "sits" : "sit"} on your shelf${tail}. Every app below can borrow ${n === 1 ? "it" : "them"} \u2014 you approve each lend once, and nothing else ever sees it.`;
  } else if (c.project || c.note) {
    const k = (c.project || 0) + (c.note || 0);
    head.textContent = `Nothing's waiting on you${who}. Your shelf is still thin.`;
    sub.textContent = `${k} item${s(k)} in the bank and no brand yet \u2014 bank one and the founder stack below starts working on real ground instead of guesses.`;
  } else if (metasCache.length) {
    head.textContent = `Nothing's waiting on you${who}.`;
    sub.textContent = `${listNames(metasCache.map((m) => m.name))} ${metasCache.length === 1 ? "is" : "are"} all that's on the shelf so far. Bank a brand and every app below can borrow it \u2014 you approve each lend once.`;
  } else {
    head.textContent = `Nothing's on your shelf yet${who}.`;
    sub.textContent = "Bank one brand and every app below stops asking you questions \u2014 it just knows who you are and what you sell. You approve each lend, once.";
  }
  const top = buildActions()[0];
  promotedAction = top || null;
  facts.hidden = true;
  run.hidden = true;
  if (top && top.point) {
    link.hidden = false;
    link.textContent = top.label;
    link.href = "#point-sec";
    link.removeAttribute("target");
    delete link.dataset.app;
    link.onclick = (e) => {
      e.preventDefault();
      point.open(top.point);
    };
    inNote.textContent = "right here \u2014 nothing leaves this page";
  } else if (top && APP_BY_ID[top.app]) {
    link.onclick = null;
    const app = APP_BY_ID[top.app];
    link.hidden = false;
    link.textContent = top.label;
    link.href = app.href;
    link.dataset.app = app.id;
    if (/^https:/.test(app.href)) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    inNote.textContent = `in ${app.name}`;
  } else {
    link.hidden = true;
  }
  $2("dash-body").classList.add("on");
}
var PROJ_KINDS = /* @__PURE__ */ new Set(["brand", "project"]);
function kindLabel(kind) {
  if (kind === "brand") return "Brand";
  if (kind === "project") return "Project";
  return kind ? kind[0].toUpperCase() + kind.slice(1) : "Context";
}
function renderProjects(metas) {
  const box = $2("projects");
  box.textContent = "";
  const projs = metas.filter((m) => PROJ_KINDS.has((m.kind || "").toLowerCase()));
  $2("projects-sub").textContent = projs.length ? `${projs.length} in your workspace` : "";
  if (!projs.length) {
    const a = mk("div", "proj new");
    a.style.cursor = "pointer";
    a.onclick = () => point.open();
    const npb = mk("div", "npb");
    npb.append(
      mk("div", "plus", "+"),
      mk("div", "nt", "No projects yet"),
      mk("div", "ns", "Point at a site, a repo, or a folder \u2014 every app below can borrow what it finds.")
    );
    a.append(npb);
    box.append(a);
    return;
  }
  for (const m of projs) {
    const c = colorFor(m);
    const kind = (m.kind || "").toLowerCase();
    const card = mk("div", "proj");
    const ph = mk("div", "ph");
    ph.style.background = `linear-gradient(120deg, ${c.light}, ${c.base})`;
    const pav = mk("span", "pav", (m.name || "\u2022")[0].toUpperCase());
    pav.style.background = c.pav;
    pav.style.color = c.mono;
    ph.append(pav);
    const pb = mk("div", "pb");
    pb.append(mk("div", "nm", m.name || "Untitled"), mk("div", "ty", kindLabel(kind)));
    if (demoTasks) {
      const h = hashInt(m.name || "");
      const tasks = 3 + h % 4, rev = 1 + h % 2, pct = 30 + h % 45;
      const stats = mk("div", "stats");
      const st1 = mk("span", "st");
      const d1 = mk("span", "d");
      d1.style.background = c.base;
      st1.append(d1, document.createTextNode(`${tasks} tasks`));
      const st2 = mk("span", "st");
      const d2 = mk("span", "d");
      d2.style.background = "var(--ok)";
      st2.append(d2, document.createTextNode(`${rev} to review`));
      stats.append(st1, st2);
      const bar = mk("div", "bar");
      const fill = mk("i");
      fill.style.width = pct + "%";
      fill.style.background = c.base;
      bar.append(fill);
      pb.append(stats, bar, mk("div", "barl", `${pct}% of this sprint`));
    } else {
      if (m.sourceKind) {
        const det = mk("div", "det");
        const live = mk("span", "live");
        live.append(mk("span", "d"), document.createTextNode(`live \xB7 ${m.rowCount ?? 0} rows`));
        det.append(live);
        pb.append(det);
      } else if (Array.isArray(m.swatches) && m.swatches.some(isHex)) {
        const dots = mk("div", "dots");
        for (const sw of m.swatches.filter(isHex).slice(0, 4)) {
          const i = mk("i");
          i.style.background = normHex(sw);
          dots.append(i);
        }
        pb.append(dots);
      } else if (m.folder) {
        pb.append(mk("div", "det", `folder \xB7 ${m.folder.split("/").filter(Boolean).pop() || "bound"}`));
      } else {
        pb.append(mk("div", "det", "in your library"));
      }
    }
    card.append(ph, pb);
    box.append(card);
  }
}
function renderTaskOS() {
  const review = $2("review");
  if (demoTasks) {
    $2("review-sub").textContent = "Switchboard ran these \u2014 just approve or tweak";
    review.innerHTML = DEMO_REVIEW.map(reviewCard).join("");
  } else {
    $2("review-sub").textContent = "your tasks, auto-extracted, will land here";
    review.innerHTML = `<div class="coming"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l2 2 4-4"/><rect x="4" y="4" width="16" height="16" rx="3"/></svg></span><div><h4>taskOS is coming</h4><p>Your tasks \u2014 auto-extracted from what you tell Switchboard and the connectors you allow \u2014 will surface here for one-tap review. Nothing is invented.</p><span class="tag">Your real projects are below \xB7 nothing fabricated</span></div></div>`;
  }
}
function reviewCard(it) {
  return `<div class="rv"><div class="pv"><svg viewBox="0 0 300 74" preserveAspectRatio="none">${it.pv}</svg></div><div class="b"><div class="top"><span class="bav" style="background:${it.base}">${it.brand[0]}</span><span class="bname">${it.brand}</span><span class="sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg></span></div><div class="nm">${it.title}</div><div class="foot"><span class="wtag"><span class="wi" style="background:${tileColor(it.app)};color:#fff">${glyphSvg(it.app)}</span>${it.name}</span><button class="rvbtn" type="button">${it.btn}</button></div></div></div>`;
}
var DOCK_FALLBACK = ["adforge", "redline", "bank", "cast", "cartridge"];
function renderDock() {
  const box = $2("dock");
  box.textContent = "";
  let ids = [...new Set(recents.map((r) => r.app).filter((id) => APP_BY_ID[id]))].slice(0, 6);
  if (!ids.length) ids = DOCK_FALLBACK.filter((id) => APP_BY_ID[id]);
  for (const id of ids) {
    const app = APP_BY_ID[id];
    const a = mk("a", "di");
    a.href = app.href;
    a.dataset.app = id;
    a.title = app.name;
    a.style.background = tileColor(id);
    a.style.color = "#fff";
    a.innerHTML = glyphSvg(id);
    box.append(a);
  }
  box.append(mk("div", "sep"));
  const add = mk("button", "add");
  add.type = "button";
  add.title = "Explore the store";
  add.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg>`;
  add.onclick = () => $2("store").scrollIntoView({ behavior: "smooth", block: "start" });
  box.append(add);
}
async function recordRecent(id) {
  if (!relay || !APP_BY_ID[id]) return;
  if (storageFrozen || vaultBound) return;
  try {
    const raw = await relay.storage.get("recents");
    let list = safeParse(raw, []);
    if (!Array.isArray(list)) list = [];
    list = list.filter((r) => r && r.app !== id);
    list.unshift({ app: id, when: now2() });
    list = list.slice(0, 12);
    recents = list;
    await relay.storage.set("recents", JSON.stringify(list));
    renderDock();
  } catch {
  }
}
document.addEventListener("click", (e) => {
  const a = e.target.closest?.("a[data-app]");
  if (!a || !relay) return;
  if (a.dataset.detail) return;
  const id = a.dataset.app;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
    void recordRecent(id);
    return;
  }
  e.preventDefault();
  const href = a.href;
  const go = () => {
    window.location.href = href;
  };
  Promise.race([recordRecent(id), new Promise((res) => setTimeout(res, 450))]).then(go, go);
});
function buildRecs() {
  const c = kindCounts();
  const tried = new Set(recents.map((r) => r.app));
  const out = [];
  const push = (id, why) => {
    if (!APP_BY_ID[id] || out.some((o) => o.app === id)) return;
    out.push({ app: id, why, tried: tried.has(id) });
  };
  if (c.brand) {
    const why = c.brand === 1 ? `you banked \u201C${firstOf("brand")}\u201D` : `you banked ${c.brand} brands`;
    for (const id of ["adforge", "adpulse", "redline"]) push(id, why);
  }
  const knowledge = (c.note || 0) + (c.project || 0);
  if (knowledge) {
    const bits = [];
    if (c.note) bits.push(`${c.note} note${s(c.note)}`);
    if (c.project) bits.push(`${c.project} project${s(c.project)}`);
    push("bank", `you keep ${bits.join(" and ")}`);
  }
  if (c.personal) {
    const why = `your personal card (\u201C${firstOf("personal")}\u201D) is on the shelf`;
    for (const id of ["cast", "natal", "arcana"]) push(id, why);
  }
  const live = (c.csv || 0) + (c.gsheet || 0);
  if (live) {
    push("adpulse", `you connected ${live} live data source${s(live)}`);
    push("shelf", `you connected ${live} live data source${s(live)}`);
  }
  if (!out.length) {
    push("brandbrain", "your library is empty \u2014 this is the app that fills it");
    push("ideabrain", "not a company yet? validate the idea first");
  }
  out.sort((a, b) => (a.tried ? 1 : 0) - (b.tried ? 1 : 0));
  return out.slice(0, 4);
}
function renderRecs() {
  const box = $2("recs");
  box.textContent = "";
  for (const r of buildRecs()) {
    const app = APP_BY_ID[r.app];
    const a = mk("a", "rec");
    a.href = app.href;
    a.dataset.app = app.id;
    const h = mk("h5", null, app.name);
    if (!r.tried) h.append(mk("span", "new", "not tried yet"));
    a.append(h, mk("span", "why", `because ${r.why}`));
    box.append(a);
  }
}
function buildActions(focus) {
  const c = kindCounts();
  const brand = focus?.kind === "brand" && focus.name || firstOf("brand");
  const project = focus?.kind === "project" && focus.name || firstOf("project");
  const personal = firstOf("personal");
  const knowledge = (c.note || 0) + (c.project || 0);
  const acts = [];
  if (focus?.kind === "project" && project) {
    acts.push({ app: "redline", label: `Review ${project}'s landing page against what it actually is` });
    acts.push({ app: "bank", label: `Open ${project} as a vault \u2014 notes and tasks beside the work` });
  }
  if (brand) acts.push({ app: "adforge", label: `Generate this week's ads for ${brand}` });
  if (knowledge) acts.push({ app: "bank", label: `Ask your second brain \u2014 ${knowledge} item${s(knowledge)} in the vault` });
  if (brand) acts.push({ app: "adpulse", label: `Find the wasted Meta spend behind ${brand}` });
  if (personal) acts.push({ app: "arcana", label: `Pull three cards on today for ${personal}` });
  if (brand) acts.push({ app: "redline", label: `Redline ${brand}'s landing page before the next push` });
  if (!acts.length) {
    acts.push({ point: "site", label: "Point at your site \u2014 about a minute" });
    acts.push({ app: "brandbrain", label: "Bank your first brand \u2014 about twenty minutes" });
    acts.push({ app: "cartridge", label: "Make a game instead \u2014 describe it, keep the cartridge" });
  }
  return acts.slice(0, 5);
}
function renderActions() {
  const box = $2("actions");
  box.textContent = "";
  const acts = buildActions().filter((a) => !a.point).filter((a) => !(promotedAction && a.app === promotedAction.app && a.label === promotedAction.label)).filter((a) => APP_BY_ID[a.app]).slice(0, 4);
  for (const act of acts) {
    const app = APP_BY_ID[act.app];
    const a = mk("a", "act");
    a.href = app.href;
    a.dataset.app = app.id;
    a.append(mk("span", "o", act.label), mk("span", "in", app.name), mk("span", "go", "open \u25B8"));
    box.append(a);
  }
}
function parseTasksMd(raw) {
  const lines = String(raw || "").split("\n");
  const tasks = [];
  let section = "";
  lines.forEach((l, i) => {
    const hs = /^##\s+(.+)$/.exec(l);
    if (hs) {
      section = hs[1].trim();
      return;
    }
    const m = /^\s*- \[( |x|X)\] (.+)$/.exec(l);
    if (!m) return;
    const text = m[2].trim();
    const tag = WRAPP_TAG_RE.exec(text);
    const id = tag ? tag[1].toLowerCase() : null;
    const wrapp = id && APP_BY_ID[id] ? id : null;
    const untagged = wrapp ? text.slice(0, tag.index).trim() : text;
    const dm = TASK_DUE_RE.exec(untagged);
    tasks.push({
      line: i,
      done: m[1] !== " ",
      text,
      section: section || "Inbox",
      wrapp,
      clean: dm ? dm[1].trim() : untagged,
      due: dm ? dm[2].trim() : ""
    });
  });
  return tasks;
}
function catalogDigest() {
  return APPS.map((app) => {
    const category = categoryOf(app.id);
    return {
      id: app.id,
      name: app.name,
      category,
      blurb: CATEGORY_BLURB[category] || "",
      // the SAME data-tags the search index reads (applyFilters over #store a.card) — scoped to the
      // catalog card, not the tag-less recently-added row / featured slide that share the same id.
      tags: document.querySelector(`#store a.card[data-app="${app.id}"]`)?.dataset.tags || "",
      pro: !!app.pro
    };
  });
}
function keywordMatch(query) {
  const toks = [...new Set(String(query || "").toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2))];
  if (!toks.length) return [];
  const scored = catalogDigest().map((d) => {
    const name = d.name.toLowerCase();
    const hay = `${name} ${d.category.toLowerCase()} ${d.blurb.toLowerCase()} ${d.tags.toLowerCase()}`;
    let score = 0;
    const hit = [];
    for (const t of toks) {
      if (name.includes(t)) {
        score += 3;
        hit.push(t);
      } else if (hay.includes(t)) {
        score += 1;
        hit.push(t);
      }
    }
    return { id: d.id, category: d.category, score, hit };
  }).filter((x) => x.score >= 2).sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((x) => ({ id: x.id, why: `keyword match on ${x.hit.slice(0, 3).join(", ")} \xB7 ${x.category}` }));
}
async function matchIntent(query) {
  if (!relay) return { matches: [], none: true, reason: "not connected" };
  const digest = catalogDigest();
  const lib = metasCache.map((m) => `${m.name} (${m.kind || "context"})`).filter(Boolean).join(", ") || "(empty)";
  const catalog = digest.map((d) => `${d.id} \xB7 ${d.name} \xB7 ${d.category}${d.tags ? " \xB7 " + d.tags : ""}`).join("\n");
  const system = "You match ONE user task to wrapps in this exact catalog. You MUST choose only from the given ids. If nothing genuinely fits, say so \u2014 do not force a match.";
  const prompt = [
    "CATALOG (id \xB7 name \xB7 category \xB7 tags):",
    catalog,
    "",
    `THE USER'S LIBRARY (names + kinds, for grounding only \u2014 never invent from it): ${lib}`,
    "",
    `THE TASK: ${String(query || "").slice(0, 400)}`,
    "",
    "Reply with ONLY JSON \u2014 no prose, no code fence. Either:",
    '{"matches":[{"id":"<catalog id>","why":"<one short reason, second person>"}],"none":false}',
    "with 1\u20133 matches, best first \u2014 or, if nothing genuinely fits:",
    '{"matches":[],"none":true,"reason":"<one short honest line>"}'
  ].join("\n");
  let acc = "";
  try {
    for await (const d of relay.stream({ system, prompt, model: "sonnet", maxTokens: 400 })) {
      if (d.type === "text") acc += d.text;
      else if (d.type === "error") throw new Error(d.error?.message || "stream error");
    }
  } catch (e) {
    return { matches: [], none: true, reason: "Couldn't check that right now \u2014 try again in a moment." };
  }
  const parsed = safeParse(firstJsonBlob(acc), null);
  const matches = parsed && Array.isArray(parsed.matches) ? parsed.matches.filter((m) => m && APP_BY_ID[m.id]).map((m) => ({ id: m.id, why: String(m.why || "").slice(0, 160) })) : [];
  if (!parsed || parsed.none === true || !matches.length) {
    const reason = parsed && String(parsed.reason || "").slice(0, 160) || "No wrapp in the catalog clearly fits that yet.";
    return { matches: [], none: true, reason };
  }
  return { matches: matches.slice(0, 3), none: false };
}
function firstJsonBlob(str2) {
  const t = String(str2 || "");
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  return a >= 0 && b > a ? t.slice(a, b + 1) : t;
}
function buildTaskLine(text, wrappId) {
  let body = String(text || "").trim();
  if (wrappId && APP_BY_ID[wrappId]) body += ` @${wrappId}`;
  return `- [ ] ${body}`;
}
async function appendTaskTagged(text, wrappId, list = "Inbox") {
  const clean = String(text || "").trim();
  if (!clean || !relay || storageFrozen) return false;
  const existing = await relay.storage.get(TASKS_KEY).catch(() => null) || "";
  const exLines = existing.split("\n");
  for (let li = 0; li < exLines.length; li++) {
    const m = /^\s*- \[( |x|X)\] (.+)$/.exec(exLines[li]);
    if (!m || normTask(m[2]) !== normTask(clean)) continue;
    const twin = m[2].trim();
    const tg = WRAPP_TAG_RE.exec(twin);
    const routed = tg && APP_BY_ID[tg[1].toLowerCase()];
    if (wrappId && APP_BY_ID[wrappId] && !routed) {
      exLines[li] = exLines[li].replace(/^(\s*- \[(?: |x|X)\] )(.+)$/, (_, mark, body) => `${mark}${body.trim()} @${wrappId}`);
      const rewritten = exLines.join("\n");
      try {
        await relay.storage.set(TASKS_KEY, rewritten);
        tasksRaw = rewritten;
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }
  const line = buildTaskLine(clean, wrappId);
  let doc = existing.trim() ? existing.replace(/\n+$/, "\n") : "# Tasks\n";
  const lines = doc.split("\n");
  const hi = lines.findIndex((l) => new RegExp(`^##\\s+${escapeTaskRe(list)}\\s*$`, "i").test(l));
  let next;
  if (hi === -1) {
    if (!doc.endsWith("\n")) doc += "\n";
    next = `${doc}
## ${list}
${line}
`;
  } else {
    let j = hi + 1;
    while (j < lines.length && !/^##\s+/.test(lines[j])) j++;
    let at = j;
    while (at - 1 > hi && lines[at - 1].trim() === "") at--;
    lines.splice(at, 0, line);
    next = lines.join("\n");
  }
  try {
    await relay.storage.set(TASKS_KEY, next);
    tasksRaw = next;
    return true;
  } catch {
    return false;
  }
}
async function toggleTaskLine(task, cb) {
  if (!relay || storageFrozen) {
    cb.checked = task.done;
    return;
  }
  const fresh = await relay.storage.get(TASKS_KEY).catch(() => null) || "";
  const lines = fresh.split("\n");
  const want = String(task.text || "").trim();
  const idx = lines.findIndex((l) => {
    const m = /^\s*- \[( |x|X)\] (.+)$/.exec(l);
    return m && m[2].trim() === want && m[1] !== " " === task.done;
  });
  if (idx === -1) {
    tasksRaw = fresh;
    void renderNext();
    return;
  }
  lines[idx] = task.done ? lines[idx].replace(/- \[[xX]\]/, "- [ ]") : lines[idx].replace("- [ ]", "- [x]");
  const next = lines.join("\n");
  try {
    await relay.storage.set(TASKS_KEY, next);
    tasksRaw = next;
    await renderNext();
  } catch {
    cb.checked = task.done;
  }
}
function launchAnchor(wrappId, text, label) {
  const app = APP_BY_ID[wrappId];
  const a = mk("a", "nt-open");
  const base = app.href;
  a.href = base + (base.includes("?") ? "&" : "?") + "task=" + encodeURIComponent(text);
  a.dataset.app = wrappId;
  const wi = mk("span", "nt-wi");
  wi.style.background = tileColor(wrappId);
  wi.style.color = "#fff";
  wi.innerHTML = glyphSvg(wrappId);
  a.append(wi, document.createTextNode(label), Object.assign(document.createElement("span"), { textContent: "\u2192" }));
  return a;
}
function launchPill(wrappId, text, label) {
  const app = APP_BY_ID[wrappId];
  const a = mk("a", "nm-go");
  const base = app.href;
  a.href = base + (base.includes("?") ? "&" : "?") + "task=" + encodeURIComponent(text);
  a.dataset.app = wrappId;
  a.textContent = label;
  return a;
}
function renderNextVault(info) {
  const el2 = $2("next-vault");
  if (!el2) return;
  const shared = !!info && info.autoAssigned === false;
  el2.textContent = "";
  el2.className = "next-vault" + (shared ? "" : " sandbox");
  el2.append(mk("span", "nv-dot"));
  if (shared) {
    const folder = String(info.folder || "");
    const name = folder.split("/").filter(Boolean).pop() || "your folder";
    const isBank = /SwitchboardBrain$/.test(folder);
    el2.append(document.createTextNode(
      isBank ? `shared with your Bank \xB7 ${name}` : `saved to your folder \xB7 ${name}`
    ));
  } else {
    el2.append(document.createTextNode("Saved here in the store for now \u2014 connect your Bank to keep all your tasks in one place."));
    const bind = mk("button", "nv-bind", "Connect Bank");
    bind.type = "button";
    bind.onclick = () => {
      const row2 = $2("next-bindrow");
      if (!row2) return;
      row2.hidden = false;
      const i = $2("next-bind-path");
      if (i) {
        if (!i.value.trim()) i.value = "~/SwitchboardBrain";
        i.focus();
        i.select();
      }
    };
    el2.append(bind);
  }
  const row = $2("next-bindrow");
  if (row && shared) row.hidden = true;
}
async function bindNextVault() {
  if (!relay || storageFrozen) return;
  const path = ($2("next-bind-path")?.value || "").trim();
  if (!path) return;
  const go = $2("next-bind-go");
  if (go) {
    go.disabled = true;
    go.textContent = "connecting\u2026";
  }
  try {
    const info = await relay.storage.bind(path).catch(() => null);
    if (info) {
      vaultBound = true;
      $2("next-bindrow").hidden = true;
      await renderNext();
    }
  } finally {
    if (go) {
      go.disabled = false;
      go.textContent = "Connect \u25B8";
    }
  }
}
async function renderNext() {
  const sec = $2("next-sec");
  if (!sec) return;
  if (!relay) {
    sec.hidden = true;
    return;
  }
  sec.hidden = false;
  const raw = await relay.storage.get(TASKS_KEY).catch(() => null);
  if (!relay) return;
  tasksRaw = raw || "";
  const info = await relay.storage.info().catch(() => null);
  if (!relay) return;
  vaultBound = !!info && info.autoAssigned === false;
  renderNextVault(info);
  renderNextList(parseTasksMd(tasksRaw));
}
function renderNextList(tasks) {
  const box = $2("next-list");
  if (!box) return;
  box.textContent = "";
  if (!tasks.length) {
    box.append(mk(
      "div",
      "nl-empty",
      "No tasks yet \u2014 type what you need above and your Claude routes it here, or send tasks in from any Claude thread and they land on this same list."
    ));
    return;
  }
  const groups = /* @__PURE__ */ new Map();
  for (const t of tasks) {
    const g = t.section || "Inbox";
    (groups.get(g) ?? groups.set(g, []).get(g)).push(t);
  }
  for (const [section, list] of groups) {
    const open = list.filter((t) => !t.done), done = list.filter((t) => t.done);
    const wrap = mk("div", "next-group");
    wrap.append(mk("div", "ng-k", `${section} \xB7 ${open.length} open`));
    for (const t of open.concat(done)) wrap.append(nextTaskRow(t));
    box.append(wrap);
  }
}
function nextTaskRow(t) {
  const row = mk("div", "trow-n" + (t.done ? " done" : ""));
  const main = mk("label", "nt-main");
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = t.done;
  cb.disabled = storageFrozen;
  cb.onchange = () => void toggleTaskLine(t, cb);
  main.append(cb, mk("span", "nt-label", t.clean));
  row.append(main);
  if (t.due && !t.done) row.append(mk("span", "nt-due", t.due));
  if (t.wrapp && APP_BY_ID[t.wrapp]) row.append(launchAnchor(t.wrapp, t.clean, `complete with ${APP_BY_ID[t.wrapp].name}`));
  return row;
}
async function runConnectedIntent(q, input, go) {
  if (!q) return;
  const suggest = $2("next-suggest");
  if (!suggest) return;
  suggest.hidden = false;
  suggest.textContent = "";
  suggest.append(mk("div", "next-thinking", "finding the right wrapp\u2026"));
  if (go) go.disabled = true;
  const res = await matchIntent(q);
  if (go) go.disabled = false;
  suggest.textContent = "";
  if (res.none || !res.matches.length) {
    renderNoMatch(suggest, q, res.reason);
    return;
  }
  const top = res.matches[0];
  const saved = await appendTaskTagged(q, top.id);
  if (input) input.value = "";
  const app = APP_BY_ID[top.id];
  const card = mk("div", "next-match");
  card.append(glyphTile(top.id, 34));
  const b = mk("span", "nm-b");
  const n = mk("span", "nm-n");
  n.append(document.createTextNode(saved ? `Saved \xB7 routed to ${app.name}` : `Routed to ${app.name}`));
  n.append(mk("span", "nm-cat", categoryOf(top.id)));
  b.append(n, mk("span", "nm-why", top.why || ""));
  card.append(b, launchPill(top.id, q, `Open ${app.name} \u25B8`));
  suggest.append(card);
  if (res.matches.length > 1) {
    const alt = mk("div", "next-alts");
    alt.append(mk("span", "na-k", "also fits:"));
    for (const m of res.matches.slice(1)) {
      const p = launchPill(m.id, q, APP_BY_ID[m.id].name);
      p.classList.add("ghost");
      alt.append(p);
    }
    suggest.append(alt);
  }
  await renderNext();
}
function renderNoMatch(holder, q, reason) {
  const box = mk("div", "next-empty");
  box.append(mk("h5", null, "No wrapp fits that yet"));
  box.append(mk("p", null, (reason || "Nothing in the catalog clearly matches that.") + " Forcing a bad match would waste your time \u2014 two honest moves instead:"));
  const fb = mk("div", "next-fallbacks");
  const p1 = mk("button", "next-fb", "Add your website \u2014 it helps match the right app");
  p1.type = "button";
  p1.onclick = () => point.open("site");
  const p2 = mk("button", "next-fb", "Save it anyway (unrouted)");
  p2.type = "button";
  p2.onclick = async () => {
    const ok = await appendTaskTagged(q, null);
    if (!ok) return;
    const i = $2("next-input");
    if (i) i.value = "";
    holder.textContent = "";
    const card = mk("div", "next-match");
    const b = mk("span", "nm-b");
    b.append(
      mk("span", "nm-n", "Saved to your list"),
      mk("span", "nm-why", "no wrapp routed \u2014 it's on your one list, ready when you are")
    );
    card.append(b);
    holder.append(card);
    await renderNext();
  };
  fb.append(p1, p2);
  box.append(fb);
  holder.append(box);
}
function runPreIntent(q) {
  const holder = $2("next-pre-suggest");
  if (!holder) return;
  if (!q) {
    holder.hidden = true;
    holder.textContent = "";
    return;
  }
  holder.hidden = false;
  holder.textContent = "";
  const matches = keywordMatch(q);
  if (!matches.length) {
    const box = mk("div", "next-empty");
    box.append(mk("h5", null, "No obvious match"));
    box.append(mk("p", null, "Nothing in the catalog jumps out for those words. Connect Switchboard and your own Claude routes it properly \u2014 and saves it as a task."));
    const fb = mk("div", "next-fallbacks");
    const c = mk("button", "next-fb", "Connect Switchboard");
    c.type = "button";
    c.onclick = () => clickConnect();
    fb.append(c);
    box.append(fb);
    holder.append(box);
    return;
  }
  for (const m of matches) {
    const app = APP_BY_ID[m.id];
    const a = mk("a", "next-match");
    a.href = detailHref(m.id);
    a.dataset.detail = "1";
    a.append(glyphTile(m.id, 34));
    const b = mk("span", "nm-b");
    const n = mk("span", "nm-n");
    n.append(document.createTextNode(app.name));
    n.append(mk("span", "nm-cat", categoryOf(m.id)));
    b.append(n, mk("span", "nm-why", "connect to save this as a task"));
    a.append(b, Object.assign(document.createElement("span"), { className: "nm-go ghost", textContent: "See it \u25B8" }));
    holder.append(a);
  }
}
function renderIntentBar(inputId, goId, run) {
  const input = $2(inputId), go = $2(goId);
  if (!input || !go) return;
  go.onclick = () => run(input.value.trim(), input, go);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input.value.trim(), input, go);
    }
  });
}
function renderPlan() {
  const el2 = $2("plan-card");
  el2.textContent = "";
  const k = mk("div", "sc-k");
  k.append(mk("span", null, "your plan"));
  if (plan === "pro") k.append(mk("span", "sim", "simulated"));
  el2.append(k);
  el2.append(mk("div", "sc-big", plan === "pro" ? "Pro" : "Free"));
  if (plan === "pro") {
    el2.append(mk("p", "sc-copy", "Pro tier unlocked in every wrapp \u2014 one sub for the whole catalog. 75% of it is paid to the developers of what you actually run, metered by the broker."));
  } else {
    el2.append(mk("p", "sc-copy", "The complete core of every wrapp, forever. Your data and your exports are never gated."));
    el2.append(mk("p", "sc-copy dim", "Pro \u2014 one $20/mo sub \u2014 unlocks the pro tier of EVERY wrapp at once. 75% of it goes to the developers you actually use."));
  }
  const btn = mk("button", "sc-btn", plan === "pro" ? "Back to Free \xB7 simulated" : "Upgrade to Pro \xB7 simulated");
  btn.type = "button";
  btn.onclick = () => void togglePlan();
  el2.append(btn);
  el2.append(mk("p", "sc-foot", "No payment rails yet \u2014 this toggle is a labeled simulation of the entitlement flag."));
}
async function togglePlan() {
  plan = plan === "pro" ? "free" : "pro";
  document.body.classList.toggle("plan-pro", plan === "pro");
  renderPlan();
  if (storageFrozen || vaultBound) return;
  try {
    await relay?.storage.set("plan", plan);
  } catch {
  }
}
function renderWallet() {
  $2("wallet-bal").textContent = wallet.balance.toLocaleString("en-US");
  const el2 = $2("wallet-card");
  el2.textContent = "";
  const k = mk("div", "sc-k");
  k.append(mk("span", null, "wallet"), mk("span", "sim", "simulated"));
  el2.append(k);
  el2.append(mk("div", "sc-big num", `${wallet.balance.toLocaleString("en-US")} SB`));
  el2.append(mk("p", "sc-copy", "You run on your own Claude \u2014 nothing burns, this stays at zero and everything still works. Packs are the on-ramp for people with no AI set up."));
  const btn = mk("button", "sc-btn", "Get tokens \u25B8");
  btn.type = "button";
  btn.onclick = openPacks;
  el2.append(btn);
  const led = mk("div", "ledger");
  led.append(mk("div", "led-k", "ledger"));
  if (!wallet.ledger.length) {
    led.append(mk("div", "led-empty", "no entries \u2014 you're BYO; nothing mints, nothing burns"));
  } else {
    for (const e of wallet.ledger.slice(0, 4)) {
      const row = mk("div", "led-row");
      row.append(mk("span", null, `${e.t} \xB7 ${e.ref} \xB7 ${ago(e.when)}`), mk("span", "amt", `+${fmtTok(e.amount)}`));
      led.append(row);
    }
  }
  el2.append(led);
}
function openPacks() {
  $2("pack-note").textContent = "Checkout here is a labeled simulation \u2014 no card, no charge; it credits a preview balance in your local wallet stub.";
  $2("pack-overlay").hidden = false;
}
function closePacks() {
  $2("pack-overlay").hidden = true;
}
async function buyPack(amt, price) {
  wallet.balance += amt;
  wallet.ledger.unshift({ t: "mint:pack", amount: amt, when: now2(), ref: `audit:sim-${wallet.ledger.length + 1}` });
  wallet.ledger = wallet.ledger.slice(0, 20);
  renderWallet();
  $2("pack-note").textContent = `SIMULATED checkout complete \u2014 ${amt.toLocaleString("en-US")} SB credited to the preview stub. ${price} was NOT charged; no card exists here. Packs never expire.`;
  if (storageFrozen || vaultBound) return;
  try {
    await relay?.storage.set("wallet", JSON.stringify(wallet));
  } catch {
  }
}
$2("pack-close").onclick = closePacks;
$2("pack-overlay").addEventListener("click", (e) => {
  if (e.target === $2("pack-overlay")) closePacks();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$2("pack-overlay").hidden) closePacks();
});
document.querySelectorAll(".pack").forEach((b) => {
  b.addEventListener("click", () => void buyPack(Number(b.dataset.amt), b.dataset.price));
});
$2("wallet-chip").onclick = () => {
  $2("wallet-card").scrollIntoView({ behavior: "smooth", block: "center" });
};
var KIND_LABEL = { brand: "Brands", personal: "You", project: "Projects", csv: "Data sources", gsheet: "Data sources", note: "Notes" };
var KIND_ORDER = ["Brands", "You", "Projects", "Data sources", "Notes"];
function renderLibrary(metas) {
  const box = $2("library");
  box.textContent = "";
  const groups = /* @__PURE__ */ new Map();
  for (const m of metas) {
    const label = KIND_LABEL[(m.kind || "").toLowerCase()] || "Other";
    (groups.get(label) ?? groups.set(label, []).get(label)).push(m);
  }
  const names = [...groups.keys()].sort((a, b) => {
    const ia = KIND_ORDER.indexOf(a), ib = KIND_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });
  for (const g of names) {
    box.append(mk("div", "lib-kicker", g));
    const row = mk("div", "lib-row");
    for (const m of groups.get(g)) {
      const card = mk("div", "lib-card");
      card.append(mk("span", "lib-mk", (m.name || "\u2022")[0].toUpperCase()), mk("span", "lib-nm", m.name));
      if (m.sourceKind) card.append(mk("span", "lib-badge", `live \xB7 ${m.rowCount ?? 0} rows`));
      row.append(card);
    }
    box.append(row);
  }
  box.append(mk("div", "lib-foot", "Lending happens per app \u2014 each app you connect asks for what it needs, and remembers its own pick."));
  $2("library-sec").hidden = false;
}
function renderLibraryEmpty(text) {
  const box = $2("library");
  box.textContent = "";
  box.append(mk("div", "lib-empty", text));
  $2("library-sec").hidden = false;
}
var search = $2("search");
var tierFilter = "all";
var sortKey = "trending";
var gridOrder = /* @__PURE__ */ new Map();
document.querySelectorAll("#store .grid").forEach((g) => gridOrder.set(g, [...g.querySelectorAll("a.card")]));
var catIndex = Object.fromEntries(APPS.map((a, i) => [a.id, i]));
function sortCards(key) {
  sortKey = key;
  for (const [grid, original] of gridOrder) {
    let cards = [...original];
    if (key === "trending") cards.sort((a, b) => (APP_BY_ID[b.dataset.app]?.updates || 0) - (APP_BY_ID[a.dataset.app]?.updates || 0));
    else if (key === "newest") cards.sort((a, b) => (catIndex[b.dataset.app] ?? 0) - (catIndex[a.dataset.app] ?? 0));
    else if (key === "cost") cards.sort((a, b) => (APP_BY_ID[b.dataset.app]?.tokens || 0) - (APP_BY_ID[a.dataset.app]?.tokens || 0));
    for (const c of cards) grid.append(c);
  }
}
function applyFilters() {
  const q = search.value.trim().toLowerCase();
  let shown = 0;
  document.querySelectorAll("#store a.card").forEach((card) => {
    const app = APP_BY_ID[card.dataset.app];
    const hasPro = !!(app && app.pro);
    const tierOk = tierFilter === "all" || (tierFilter === "pro" ? hasPro : !hasPro);
    const hit = tierOk && (!q || (card.textContent + " " + (card.dataset.tags || "")).toLowerCase().includes(q));
    card.style.display = hit ? "" : "none";
    if (hit) shown++;
  });
  document.querySelectorAll("#store .sec-h").forEach((h) => {
    let el2 = h.nextElementSibling;
    let hasCards = false, visible = false;
    while (el2 && !el2.classList.contains("sec-h")) {
      if (el2.classList?.contains("grid")) {
        el2.querySelectorAll("a.card").forEach((c) => {
          hasCards = true;
          if (c.style.display !== "none") visible = true;
        });
      }
      el2 = el2.nextElementSibling;
    }
    h.style.display = hasCards && !visible ? "none" : "";
  });
  $2("no-hits").hidden = shown > 0;
  $2("showing-count").textContent = `Showing ${shown} wrapp${s(shown)}`;
}
search.addEventListener("input", applyFilters);
document.querySelectorAll("#tier-bar .tf").forEach((b) => {
  b.addEventListener("click", () => {
    tierFilter = b.dataset.tier;
    document.querySelectorAll("#tier-bar .tf").forEach((x) => x.classList.toggle("on", x === b));
    applyFilters();
  });
});
document.querySelectorAll("#view-tabs .vt").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll("#view-tabs .vt").forEach((x) => x.classList.toggle("on", x === b));
    const view = b.dataset.view;
    if (view === "latest") {
      sortCards("newest");
      $2("sort").value = "newest";
    } else {
      sortCards("curated");
    }
    $2("store").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
$2("sort").addEventListener("change", (e) => {
  document.querySelectorAll("#view-tabs .vt").forEach((x) => x.classList.remove("on"));
  sortCards(e.target.value);
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    search.focus();
  }
});
$2("hero-connect").onclick = () => clickConnect();
if ($2("toll-connect")) $2("toll-connect").onclick = () => clickConnect();
$2("projects-new").onclick = () => point.open();
renderIntentBar("next-input", "next-go", (q, input, go) => void runConnectedIntent(q, input, go));
renderIntentBar("next-pre-input", "next-pre-go", (q) => runPreIntent(q));
$2("next-bind-go")?.addEventListener("click", () => void bindNextVault());
$2("next-bind-cancel")?.addEventListener("click", () => {
  $2("next-bindrow").hidden = true;
});
$2("next-bind-path")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    void bindNextVault();
  } else if (e.key === "Escape") $2("next-bindrow").hidden = true;
});
point.mount();
renderNav();
renderCats();
decorateCards();
renderRecent();
renderBoardCounts();
renderBoardStrip();
renderHeroArt();
sortCards("trending");
applyFilters();
//# sourceMappingURL=home.js.map
