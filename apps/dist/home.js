// ../../packages/protocol/dist/version.js
var PROVIDER_GLOBAL = "claude";

// ../../packages/sdk/dist/connect-chip.js
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
  let sessionDisconnected = false;
  let upgradeAsked = false;
  const onDocClick = (e) => {
    if (menuOpen && !host.contains(e.target)) {
      menuOpen = false;
      render();
    }
  };
  document.addEventListener("click", onDocClick);
  function el(tag, cls, text) {
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
      state = { kind: "not-installed", installUrl };
      return render();
    }
    relay2 = r;
    subscribe(r);
    let grant = sessionDisconnected ? null : await r.permissions().catch(() => null);
    if (destroyed || my !== seq)
      return;
    if (!grant) {
      state = { kind: "disconnected", relay: r };
      emitTransition(false);
      return render();
    }
    const wanted = opts.scope?.contextKinds ?? [];
    const granted = grant.contextKinds;
    const covered = Array.isArray(granted) && (granted.length === 0 || wanted.every((k) => granted.includes(k)));
    if (wanted.length && !covered && !upgradeAsked) {
      upgradeAsked = true;
      const upgraded = await r.connect(opts.scope).catch(() => null);
      if (destroyed || my !== seq)
        return;
      if (upgraded)
        grant = upgraded;
    }
    const wantsContext = opts.context !== "none";
    const [user, project] = await Promise.all([
      r.identity(),
      wantsContext ? r.context.active().catch(() => null) : Promise.resolve(null)
    ]);
    if (destroyed || my !== seq)
      return;
    state = { kind: "connected", relay: r, user, project };
    emitTransition(true);
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
  }
  async function doConnect() {
    if (!relay2)
      return;
    try {
      sessionDisconnected = false;
      await relay2.connect(opts.scope);
      await refresh();
    } catch {
    }
  }
  async function doPick() {
    if (!relay2)
      return;
    menuOpen = false;
    render();
    const project = await relay2.context.pick().catch(() => null);
    opts.onProjectChange?.(project);
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
      const b = el("button", "btn get");
      b.append(el("span", "glyph"), el("span", void 0, "Get Switchboard"), el("span", "arr", "\u2197"));
      b.onclick = () => window.open(state.kind === "not-installed" ? state.installUrl : installUrl, "_blank", "noopener");
      mount.append(b);
      return;
    }
    if (state.kind === "disconnected") {
      const b = el("button", "btn connect");
      b.append(el("span", "glyph"), el("span", void 0, "Connect Switchboard"));
      b.onclick = doConnect;
      mount.append(b);
      return;
    }
    const { user, project } = state;
    const rawName = user?.name?.trim();
    const collides = !!rawName && !!project?.name && rawName.toLowerCase() === project.name.toLowerCase();
    const name = !rawName || collides ? "there" : rawName;
    const wrap = el("div", "wrap");
    const chip = el("button", "chip");
    const av = el("div", "av");
    if (user?.avatar) {
      const img = el("img");
      img.src = user.avatar;
      img.alt = name;
      av.append(img);
    } else
      av.textContent = name.charAt(0).toUpperCase();
    const wantsContext = opts.context !== "none";
    const who = el("div", "who");
    who.append(el("div", "hi", `Hi ${name}`));
    who.append(el("div", "proj", wantsContext ? project ? project.name : "No context lent" : "Connected"));
    chip.append(av, who, el("span", "caret", "\u25BE"));
    chip.onclick = (e) => {
      e.stopPropagation();
      menuOpen = !menuOpen;
      render();
    };
    wrap.append(chip);
    if (menuOpen) {
      const menu = el("div", "menu");
      if (wantsContext) {
        menu.append(el("div", "lbl", "Working on"));
        const row = el("button", "proj-row");
        row.append(el("span", void 0, project ? project.name : "Choose a context"));
        row.append(el("span", "go", project ? "Switch \u25B8" : "Choose \u25B8"));
        row.onclick = doPick;
        menu.append(row, el("div", "sep"));
      }
      const dc = el("button", "item", "Disconnect this app");
      dc.onclick = doDisconnect;
      menu.append(dc);
      menu.append(el("div", "foot", "Connectors, budgets & activity live in the Switchboard toolbar panel."));
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
      host.remove();
    }
  };
}

// ../../packages/sdk/dist/index.js
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
    return {
      get: (key) => req({ op: "get", key }).then((r) => r.value ?? null),
      set: (key, value) => req({ op: "set", key, value }).then(() => void 0),
      delete: (key) => req({ op: "delete", key }).then((r) => r.ok),
      list: () => req({ op: "list" }).then((r) => r.keys ?? []),
      info: () => req({ op: "info" }).then((r) => r.info),
      /** Point this app's store at a real folder (triggers a path-consent click). */
      bind: (path) => req({ op: "bind", path }).then((r) => r.info)
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
  const now = getRelay(opts);
  if (now instanceof Relay)
    return Promise.resolve(now);
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

// src/home.js
var $ = (id) => document.getElementById(id);
var INSTALL_URL = "https://thelastprompt.ai/switchboard/";
var KINDS = ["brand", "personal", "project", "csv", "gsheet", "note"];
var relay = null;
var way = { installed: false, connected: false, brands: 0, checkedLibrary: false };
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
    act: () => document.querySelector("#chip-dock button")?.click(),
    doneSub: "connected \u2014 the shelf below is live"
  },
  {
    title: "Put a brand in the bank",
    sub: "build one in brandbrain \u2014 or import your existing site",
    done: () => way.brands > 0,
    act: () => window.open("https://brandbrain.thelastprompt.ai/build", "_blank", "noreferrer"),
    doneSub: () => `${way.brands} brand${way.brands === 1 ? "" : "s"} banked \u2014 every app below can borrow them`
  },
  {
    title: "Point an app at it",
    sub: "open any app \u2014 it asks for what it needs, you approve once",
    done: () => false,
    // always the standing invitation
    act: () => document.querySelector('a.card[href*="adpulse"]')?.scrollIntoView({ behavior: "smooth", block: "center" }),
    currentSub: "the founder stack below runs on the brand you just banked"
  }
];
function renderWay() {
  const box = $("way");
  box.textContent = "";
  let currentMarked = false;
  STEPS.forEach((s, i) => {
    const done = s.done();
    const isCurrent = !done && !currentMarked;
    if (isCurrent) currentMarked = true;
    const card = document.createElement("div");
    card.className = "step " + (done ? "done" : isCurrent ? "current" : "todo");
    const n = document.createElement("div");
    n.className = "n";
    n.textContent = `STEP ${i + 1}`;
    const h = document.createElement("h5");
    h.textContent = s.title;
    const p = document.createElement("p");
    p.textContent = done ? typeof s.doneSub === "function" ? s.doneSub() : s.doneSub || s.sub : isCurrent && s.currentSub ? s.currentSub : s.sub;
    const st = document.createElement("div");
    st.className = "state";
    st.textContent = done ? "\u2713" : isCurrent ? "\u2192" : "";
    card.append(n, h, p, st);
    card.onclick = () => s.act();
    box.append(card);
  });
}
mountConnect($("chip-dock"), {
  scope: { reason: "your Switchboard home \u2014 show your library on the shelf", contextKinds: KINDS },
  context: "none",
  installUrl: INSTALL_URL,
  onConnect: (r) => {
    relay = r;
    way.installed = true;
    way.connected = true;
    renderWay();
    void renderLibrary();
  },
  onDisconnect: () => {
    relay = null;
    way.connected = false;
    renderWay();
    renderLibraryEmpty("Connect Switchboard (top right) and your brands appear here.");
  }
});
(async () => {
  const r = await whenRelayReady(2e3, { installUrl: INSTALL_URL });
  if (r && "connect" in r) {
    way.installed = true;
    const grant = await r.permissions().catch(() => null);
    if (grant) {
      relay = r;
      way.connected = true;
      renderWay();
      void renderLibrary();
      return;
    }
    renderLibraryEmpty("Connect Switchboard (top right) and your brands appear here.");
  } else {
    renderLibraryEmpty("Everything below works as a catalog. With Switchboard installed, this shelf shows your own brands.");
  }
  renderWay();
})();
renderWay();
var KIND_LABEL = { brand: "Brands", personal: "You", project: "Projects", csv: "Data sources", gsheet: "Data sources", note: "Notes" };
var KIND_ORDER = ["Brands", "You", "Projects", "Data sources", "Notes"];
async function renderLibrary() {
  if (!relay) return;
  let metas = [];
  try {
    metas = await relay.context.list();
  } catch {
  }
  way.brands = metas.filter((m) => (m.kind || "").toLowerCase() === "brand").length;
  way.checkedLibrary = true;
  renderWay();
  if (!metas.length) {
    renderLibraryEmpty("No contexts yet \u2014 build a brand in brandbrain, or add your details in the Switchboard panel.");
    return;
  }
  const box = $("library");
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
    const kicker = document.createElement("div");
    kicker.className = "lib-kicker";
    kicker.textContent = g;
    box.append(kicker);
    const row = document.createElement("div");
    row.className = "lib-row";
    for (const m of groups.get(g)) {
      const card = document.createElement("div");
      card.className = "lib-card";
      const mk = document.createElement("span");
      mk.className = "lib-mk";
      mk.textContent = (m.name || "\u2022")[0].toUpperCase();
      const nm = document.createElement("span");
      nm.className = "lib-nm";
      nm.textContent = m.name;
      card.append(mk, nm);
      if (m.sourceKind) {
        const b = document.createElement("span");
        b.className = "lib-badge";
        b.textContent = `live \xB7 ${m.rowCount ?? 0} rows`;
        card.append(b);
      }
      row.append(card);
    }
    box.append(row);
  }
  const foot = document.createElement("div");
  foot.className = "lib-foot";
  foot.textContent = "Lending happens per app \u2014 each app you connect asks for what it needs, and remembers its own pick.";
  box.append(foot);
  $("library-sec").hidden = false;
}
function renderLibraryEmpty(text) {
  const box = $("library");
  box.textContent = "";
  const d = document.createElement("div");
  d.className = "lib-empty";
  d.textContent = text;
  box.append(d);
  $("library-sec").hidden = false;
}
var search = $("search");
search.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();
  let any = false;
  document.querySelectorAll("a.card, a.featured").forEach((card) => {
    const hit = !q || (card.textContent + " " + (card.dataset.tags || "")).toLowerCase().includes(q);
    card.style.display = hit ? "" : "none";
    if (hit) any = true;
  });
  document.querySelectorAll(".sec-h").forEach((h) => {
    let el = h.nextElementSibling;
    let visible = false;
    while (el && !el.classList.contains("sec-h")) {
      if (el.matches("a.card, a.featured") && el.style.display !== "none" || el.querySelector?.("a.card:not([style*='none'])")) visible = true;
      el = el.nextElementSibling;
    }
    h.style.display = visible ? "" : "none";
  });
  $("no-hits").hidden = any;
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    search.focus();
  }
});
//# sourceMappingURL=home.js.map
