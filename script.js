let users = {
  test: "Start123!"
};
let currentUser = null;

async function login() {
  const username = document.getElementById("username").value.toLowerCase();
  const password = document.getElementById("password").value;

  if (users[username] === password) {
    currentUser = username;
    document.getElementById("login-container").style.display = "none";
    document.getElementById("form-container").style.display = "block";
    loadData();
  } else {
    document.getElementById("login-error").textContent = "Falscher Login.";
  }
}

async function loadData() {
  const kunden = await fetch("kunden.json").then(res => res.json());
  const artikel = await fetch("artikel.json").then(res => res.json());
  const preise = await fetch("preise_vergleich.json").then(res => res.json());
  const preisnamen = await fetch("preislisten_namen.json").then(res => res.json());

  const kundenListe = kunden[currentUser] || [];
  const dropdown = document.getElementById("customer-select");
  dropdown.innerHTML = '<option selected disabled>-- bitte wählen --</option>';

  kundenListe.forEach((kunde, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    const pname = preisnamen[kunde.preisliste] || kunde.preisliste;
    opt.textContent = `${kunde.kundennummer} – ${kunde.name}`;
    dropdown.appendChild(opt);
  });

  const neuePreise = ["TK Stufe 1", "TK Stufe 2", "TK Stufe 3", "TK Stufe 4", "TK Stufe 5", "TK Stufe 6"];
  const npSelect = document.getElementById("preisliste-neu");
  npSelect.innerHTML = '<option selected disabled>-- bitte wählen --</option>';
  neuePreise.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    npSelect.appendChild(opt);
  });

  dropdown.addEventListener("change", () => updateCustomerView(kundenListe, preise, preisnamen));
  npSelect.addEventListener("change", () => updateCustomerView(kundenListe, preise, preisnamen));
}

function updateCustomerView(kundenListe, preise, preisnamen) {
  const index = document.getElementById("customer-select").value;
  if (!index) return;

  const kunde = kundenListe[index];
  document.getElementById("preisliste-aktuell").value = preisnamen[kunde.preisliste] || kunde.preisliste;

  const topContainer = document.getElementById("top-article-container");
  topContainer.innerHTML = "";
  kunde.top10.slice(0, 5).forEach((art, i) => {
    const div = document.createElement("div");
    div.textContent = `${i + 1}. ${art.artikelbezeichnung} (${art.absatz} Stück)`;
    topContainer.appendChild(div);
  });

  const neue = document.getElementById("preisliste-neu").value;
  const vergleich = document.getElementById("preisvergleich");
  vergleich.innerHTML = "";

  if (neue && preise && kunde.top10.length) {
    kunde.top10.slice(0, 5).forEach((art) => {
      const alt = preise[art.artikelnummer]?.alt?.[kunde.preisliste];
      const neu = preise[art.artikelnummer]?.neu?.[neue];
      if (alt && neu) {
        const altGes = alt * art.absatz;
        const neuGes = neu * art.absatz;
        const diff = neuGes - altGes;
        const p = document.createElement("p");
        p.innerHTML = `${art.artikelbezeichnung}: alt ${altGes.toFixed(2)} €, neu ${neuGes.toFixed(2)} €, Differenz: <b style="color:${diff > 0 ? 'green' : 'red'}">${diff.toFixed(2)} €</b>`;
        vergleich.appendChild(p);
      }
    });
  }
}