const password = "Start123!";
let kunden = {};
let artikel = [];
let selectedChances = [];
let currentUser = "";

function login() {
  const user = document.getElementById("username").value.toLowerCase();
  const pw = document.getElementById("password").value;
  currentUser = user;

  if (pw === password) {
    Promise.all([
      fetch('kunden.json').then(res => res.json()),
      fetch('artikel.json').then(res => res.json())
    ])
    .then(([kundenData, artikelData]) => {
      kunden = kundenData;
      artikel = artikelData;
      if (!(user in kunden)) {
        showError("Kein Zugriff für diesen Nutzer.");
        return;
      }

      document.getElementById("login-container").style.display = "none";
      document.getElementById("form-container").style.display = "block";

      if (currentUser === "test") showTestBanner();

      loadCustomers(user);
      loadPreislisten();
      buildVerkaufschancenDropdowns();
    })
    .catch(() => showError("Daten konnten nicht geladen werden."));
  } else {
    showError("Login fehlgeschlagen.");
  }
}

function showError(msg) {
  document.getElementById("login-error").textContent = msg;
}

function showTestBanner() {
  const banner = document.createElement("div");
  banner.style.background = "#b30000";
  banner.style.color = "white";
  banner.style.padding = "0.5rem";
  banner.style.textAlign = "center";
  banner.textContent = "Testzugang – Änderungen werden nicht gespeichert";
  document.body.prepend(banner);
}

function loadCustomers(user) {
  const select = document.getElementById("customer-select");
  select.innerHTML = "";

  kunden[user].forEach(k => {
    const option = document.createElement("option");
    option.value = k.kundennummer;
    option.textContent = k.name;
    option.dataset.preisliste = k.preisliste;

    const key = `draft_${currentUser}_${k.kundennummer}`;
    if (localStorage.getItem(key)) {
      option.style.color = "green"; // bearbeitet
    } else {
      option.style.color = "red";   // offen
    }

    select.appendChild(option);
  });

  select.addEventListener("change", updateCustomerView);
  updateCustomerView();
}

function updateCustomerView() {
  const select = document.getElementById("customer-select");
  const selected = select.options[select.selectedIndex];
  if (!selected || !selected.value) {
    document.getElementById("preisliste-aktuell").value = "";
    document.getElementById("top-article-container").innerHTML = "";
    return;
  }

  document.getElementById("preisliste-aktuell").value = selected.dataset.preisliste;

  const kundeId = selected.value;
  const kunde = kunden[currentUser].find(k => k.kundennummer == kundeId);
  const container = document.getElementById("top-article-container");
  container.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.marginBottom = "0.5rem";

    const label = document.createElement("label");
    label.textContent = `Top ${i + 1}`;
    const input = document.createElement("input");
    input.setAttribute("placeholder", `Top Artikel ${i + 1}`);
    input.setAttribute("readonly", true);
    input.style.background = "#f0f0f0";
    input.style.border = "1px solid #ccc";
    input.value = kunde.top10[i] ? `${kunde.top10[i].artikelnummer} – ${kunde.top10[i].artikelbezeichnung}` : "";
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  }

  if (false) {
    const datalist = document.createElement("datalist");
    datalist.id = "artikel-liste";
    artikel.forEach(a => {
      const option = document.createElement("option");
      option.value = `${a.artikelnummer} – ${a.artikelbezeichnung}`;
      datalist.appendChild(option);
    });
    document.body.appendChild(datalist);
  }

  buildVerkaufschancenDropdowns();
}

function buildVerkaufschancenDropdowns() {
  const container = document.getElementById("verkaufschance-container");
  container.innerHTML = "";
  selectedChances = [];

  for (let i = 0; i < 5; i++) {
    const select = document.createElement("select");
    select.innerHTML = '<option value="">-- bitte wählen --</option>';
    artikel.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.artikelnummer;
      opt.textContent = `${a.artikelnummer} – ${a.artikelbezeichnung}`;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => {
      selectedChances[i] = select.value;
    });
    container.appendChild(select);
  }
}

function saveDraft() {
  if (currentUser === "test") {
    alert("Testnutzer kann keine Entwürfe speichern.");
    return;
  }

  const kunde = document.getElementById("customer-select").value;
  const draft = {
    neuer_preis: document.getElementById("preisliste-neu").value,
    artikel: Array.from(document.querySelectorAll("#top-article-container input")).map(i => i.value),
    chancen: selectedChances,
    kommentar: document.getElementById("kommentar").value
  };
  localStorage.setItem(`draft_${currentUser}_${kunde}`, JSON.stringify(draft));
  alert("Entwurf gespeichert.");
}

function submitForm() {
  if (currentUser === "test") {
    alert("Testnutzer kann keine Formulare abschicken.");
    return;
  }

  alert("Formular abgeschickt. (Später mit Mailversand/API)");
}

function nextCustomer() {
  const select = document.getElementById("customer-select");
  if (select.options.length > 1) {
    select.remove(select.selectedIndex);
    select.selectedIndex = -1;
    updateCustomerView();
    document.getElementById("kommentar").value = "";
  } else {
    alert("Alle Kunden bearbeitet.");
  }
}

function loadPreislisten() {
  const pl = ["TK Stufe 1", "TK Stufe 2", "TK Stufe 3", "TK Stufe 4", "TK Stufe 5", "TK Stufe 6"];
  const select = document.getElementById("preisliste-neu");
  select.innerHTML = "";
  pl.forEach(p => {
    const option = document.createElement("option");
    option.textContent = p;
    option.value = p;
    select.appendChild(option);
  });
}