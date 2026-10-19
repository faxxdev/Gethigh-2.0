
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Chromium'da camın arkasındaki görüntü sıvı gibi kırılsın
  var ua = navigator.userAgent;
  if (/Chrome\//.test(ua) && !/Firefox|FxiOS/.test(ua)) root.classList.add("liquid-svg");

  // Kaydırınca açılan öğeler
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  // İmleci izleyen cam ışığı
  document.addEventListener("pointermove", function (e) {
    var g = e.target.closest ? e.target.closest(".glass") : null;
    if (!g) return;
    var r = g.getBoundingClientRect();
    g.style.setProperty("--mx", (e.clientX - r.left) + "px");
    g.style.setProperty("--my", (e.clientY - r.top) + "px");
  });

  // Adım çizgisi kaydırdıkça dolar
  var steps = document.querySelector(".steps");
  var nodes = steps ? steps.querySelectorAll(".node") : [];
  function update() {
    if (!steps) return;
    var r = steps.getBoundingClientRect();
    var mark = window.innerHeight * 0.62;
    var p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
    steps.style.setProperty("--p", p.toFixed(3));
    nodes.forEach(function (n) {
      var nr = n.getBoundingClientRect();
      n.classList.toggle("lit", nr.top + nr.height / 2 < mark);
    });
  }
  if (steps) {
    if (reduce) { nodes.forEach(function (n) { n.classList.add("lit"); }); }
    else {
      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { update(); ticking = false; });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    }
  }

  // Logo imlece göre hafifçe eğilir
  var stage = document.querySelector(".logo-stage");
  if (stage && !reduce && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", function (e) {
      var x = e.clientX / window.innerWidth - 0.5;
      var y = e.clientY / window.innerHeight - 0.5;
      stage.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg");
      stage.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
    });
  }
})();

// Site eklentileri: menü önizlemesi
(function () {
  var tabs = document.querySelectorAll(".side button");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.setAttribute("aria-selected", x === t ? "true" : "false"); });
      document.querySelectorAll(".pane").forEach(function (p) { p.classList.toggle("on", p.id === t.dataset.pane); });
    });
  });
  document.querySelectorAll(".sw").forEach(function (s) {
    s.addEventListener("click", function () { s.setAttribute("aria-checked", s.getAttribute("aria-checked") === "true" ? "false" : "true"); });
  });
  var th = document.querySelectorAll(".themes button");
  th.forEach(function (b) {
    b.addEventListener("click", function () { th.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); });
  });
})();
