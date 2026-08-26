/*!
 * open-in-switchboard.js — the ONE canonical "Open in Switchboard" button.
 * https://thelastprompt.ai/switchboard/open-in-switchboard.js
 *
 * Every wrapp uses THIS, never its own copy, so the affordance looks and behaves identically
 * everywhere and can be improved in one place. Drop it in:
 *
 *   <script src="https://thelastprompt.ai/switchboard/open-in-switchboard.js" defer></script>
 *   <div data-switchboard-open></div>
 *
 * What it does:
 *   • already inside Switchboard (window.claude) → renders nothing, your app just works
 *   • installed  → switchboard://open hands THIS page to the Mac app (native window, any origin,
 *                  no Chrome extension, no origin allowlist). The user is asked first.
 *   • not installed → falls back to the download page after ~1.2s of nothing happening
 *
 * Options via data-attributes on the mount element:
 *   data-name="My App"     label shown in Switchboard's consent card (default: document.title)
 *   data-url="https://…"   page to open (default: this page)
 *   data-label="…"         button text (default: "Open in Switchboard")
 *   data-theme="dark|light"  (default: dark)
 */
(function () {
  "use strict";
  var DOWNLOAD = "https://thelastprompt.ai/switchboard/";
  var LIME = "#C8F250";

  function inSwitchboard() { try { return !!(window.claude && window.claude.isRelay); } catch (e) { return false; } }

  function handoff(target, name, onMissing) {
    var left = false;
    var mark = function () { left = true; };
    document.addEventListener("visibilitychange", mark, { once: true });
    window.addEventListener("blur", mark, { once: true });
    try {
      window.location.href = "switchboard://open?url=" + encodeURIComponent(target) +
                             "&name=" + encodeURIComponent(name);
    } catch (e) { /* scheme unavailable — the timer below handles it */ }
    window.setTimeout(function () {
      document.removeEventListener("visibilitychange", mark);
      if (!left) onMissing();
    }, 1200);
  }

  function build(mount) {
    if (inSwitchboard()) { mount.textContent = ""; return; }   // already home — no button needed
    var target = mount.getAttribute("data-url") || window.location.href;
    var name   = mount.getAttribute("data-name") || document.title || window.location.hostname;
    var label  = mount.getAttribute("data-label") || "Open in Switchboard";
    var light  = mount.getAttribute("data-theme") === "light";

    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", label + " — opens this page as a Mac app on your own AI");
    b.style.cssText = [
      "display:inline-flex", "align-items:center", "gap:8px", "cursor:pointer",
      "font:600 13px/1 ui-monospace,'JetBrains Mono',SFMono-Regular,Menlo,monospace",
      "letter-spacing:.02em", "padding:10px 16px", "border-radius:8px",
      "background:" + LIME, "color:#0B0E08", "border:none",
      "box-shadow:" + (light ? "0 1px 2px rgba(0,0,0,.12)" : "0 6px 20px rgba(200,242,80,.22)"),
      "transition:transform .12s ease,box-shadow .12s ease",
    ].join(";");
    b.onmouseenter = function () { b.style.transform = "translateY(-1px)"; };
    b.onmouseleave = function () { b.style.transform = "none"; };

    // the patch-bay jack — the Switchboard mark
    var jack = document.createElement("span");
    jack.setAttribute("aria-hidden", "true");
    jack.style.cssText = "width:11px;height:11px;border:1.7px solid #0B0E08;border-radius:50%;position:relative;flex:none";
    var dot = document.createElement("span");
    dot.style.cssText = "position:absolute;inset:2.4px;border-radius:50%;background:#0B0E08";
    jack.appendChild(dot);

    b.append(jack, document.createTextNode(label));
    b.addEventListener("click", function () {
      handoff(target, name, function () { window.open(DOWNLOAD, "_blank", "noopener"); });
    });
    mount.textContent = "";
    mount.appendChild(b);
  }

  function init() {
    var mounts = document.querySelectorAll("[data-switchboard-open]");
    for (var i = 0; i < mounts.length; i++) build(mounts[i]);
  }

  // The provider is injected at document start, but a late injection is possible — re-render then.
  window.addEventListener("claude#initialized", init);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // Programmatic escape hatch for apps that render their own UI.
  window.openInSwitchboard = function (opts) {
    opts = opts || {};
    handoff(opts.url || window.location.href,
            opts.name || document.title || window.location.hostname,
            opts.onMissing || function () { window.open(DOWNLOAD, "_blank", "noopener"); });
  };
})();
