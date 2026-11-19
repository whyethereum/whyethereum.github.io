// Copy-to-clipboard buttons for share posts
document.querySelectorAll("[data-copy]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var text = document.getElementById(btn.dataset.copy).textContent.trim();
    var link = location.origin + "/";
    navigator.clipboard.writeText(text + " " + link).then(function () {
      btn.textContent = "Copied";
      setTimeout(function () { btn.textContent = "Copy post"; }, 2000);
    }).catch(function () { btn.textContent = "Select the text to copy"; });
  });
});

// Live ETH stats (CoinGecko for price, a public Ethereum node for gas)
(function () {
  var box = document.getElementById("live");
  if (!box) return;
  function set(id, text, cls) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    if (cls) el.className = cls;
  }
  var usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true&include_market_cap=true")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var e = d.ethereum;
      set("eth-price", usd.format(e.usd));
      var ch = e.usd_24h_change;
      set("eth-change", (ch >= 0 ? "+" : "") + ch.toFixed(2) + "%", ch >= 0 ? "up" : "down");
      set("eth-cap", "$" + (e.usd_market_cap / 1e9).toFixed(0) + "B");
      set("live-time", "Prices from CoinGecko, as of " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".");
    })
    .catch(function () { set("live-time", "Live prices are unavailable right now. Try refreshing in a minute."); });
  fetch("https://ethereum-rpc.publicnode.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_gasPrice", params: [] })
  })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var gwei = parseInt(d.result, 16) / 1e9;
      set("eth-gas", (gwei < 1 ? gwei.toFixed(2) : gwei.toFixed(1)) + " gwei");
    })
    .catch(function () {});
})();
