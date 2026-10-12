(function () {
  document.querySelectorAll("[data-dropdown]").forEach(function (item) {
    var btn = item.querySelector(".nav-link");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var open = item.classList.contains("open");
      document.querySelectorAll("[data-dropdown]").forEach(function (el) {
        el.classList.remove("open");
      });
      if (!open) item.classList.add("open");
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-dropdown]")) {
      document.querySelectorAll("[data-dropdown]").forEach(function (el) {
        el.classList.remove("open");
      });
    }
  });

  var burger = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".header-bottom");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var searchOpen = document.querySelectorAll("[data-open-search]");
  var searchModal = document.getElementById("search-modal");
  searchOpen.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (searchModal) searchModal.classList.add("open");
      var input = document.getElementById("search-q");
      if (input) input.focus();
    });
  });

  document.querySelectorAll("[data-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-close");
      var el = document.getElementById(id);
      if (el) el.classList.remove("open");
    });
  });

  document.querySelectorAll(".overlay").forEach(function (ov) {
    ov.addEventListener("click", function (e) {
      if (e.target === ov) ov.classList.remove("open");
    });
  });

  var preForm = document.getElementById("preapp-form");
  if (preForm) {
    preForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var tipo = document.getElementById("doc-type").value;
      var num = (document.getElementById("doc-num").value || "").trim();
      var box = document.getElementById("preapp-result");
      if (!num || num.length < 8) {
        box.className = "result show";
        box.style.background = "#fff4f0";
        box.style.color = "#b42318";
        box.textContent = "Ingresa un número de documento válido.";
        return;
      }
      box.className = "result show";
      box.style.background = "#eefaf0";
      box.style.color = "#1e7a32";
      box.textContent =
        "Encontramos ofertas preaprobadas para " + tipo + " " + num + ". Un asesor te contactará.";
    });
  }

  var login = document.getElementById("login-form");
  if (login) {
    login.addEventListener("submit", function (e) {
      e.preventDefault();
      var box = document.getElementById("login-result");
      box.className = "result show";
      box.textContent = "Esta es una demo visual. No se conecta a Banca por Internet real.";
    });
  }

  document.querySelectorAll(".login-tabs button").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".login-tabs button").forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");
      var target = tab.getAttribute("data-tab");
      document.querySelectorAll("[data-pane]").forEach(function (p) {
        p.style.display = p.getAttribute("data-pane") === target ? "block" : "none";
      });
    });
  });

  var cuenta = document.getElementById("cuenta-form");
  if (cuenta) {
    cuenta.addEventListener("submit", function (e) {
      e.preventDefault();
      var box = document.getElementById("cuenta-result");
      box.className = "result show";
      box.textContent = "Solicitud registrada. Te enviaremos el siguiente paso a tu correo.";
    });
  }

  var sim = document.getElementById("sim-form");
  if (sim) {
    sim.addEventListener("submit", function (e) {
      e.preventDefault();
      var monto = Number(document.getElementById("monto").value || 0);
      var anios = Number(document.getElementById("plazo").value || 1);
      var tea = 0.085;
      var n = anios * 12;
      var i = tea / 12;
      var cuota = i === 0 ? monto / n : (monto * i) / (1 - Math.pow(1 + i, -n));
      var box = document.getElementById("sim-result");
      box.className = "result show";
      box.textContent =
        "Cuota referencial: S/ " +
        cuota.toLocaleString("es-PE", { maximumFractionDigits: 2 }) +
        " al mes (TEA 8.50% referencial).";
    });
  }

  var tarjeta = document.getElementById("tarjeta-form");
  if (tarjeta) {
    tarjeta.addEventListener("submit", function (e) {
      e.preventDefault();
      document.getElementById("tarjeta-result").className = "result show";
      document.getElementById("tarjeta-result").textContent =
        "Solicitud de tarjeta enviada. Revisaremos tu perfil y te avisaremos.";
    });
  }
})();
