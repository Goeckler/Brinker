# Außendienst Kundenformular – Bäckerei Brinker

Statische Webanwendung (GitHub Pages), dient Außendienstmitarbeitern zur Preislisten- und Artikelabfrage.

## Funktionen

- **Login** per Nachname + Passwort `Start123!`
- **Kundenauswahl** im Dropdown (geladen aus `data/kunden.json`)
- **Top-5 Artikel** (vorausgefüllt, aus `data/artikel.json`)
- **Neue Preisliste** auswählen (`TK Stufe 1–6`)
- **Verkaufschancen**: 5 Dropdowns aus `data/artikel.json`
- **Kommentar**: Freitextfeld
- **Umsatzvergleich** Alt vs. Neu (Daten aus `data/preise_vergleich.json`)
- **Ampellogik**: Statusanzeige (rot/grün)
- **Adminpanel**: `admin.html` zeigt alle Einträge aus `localStorage`

## Setup & Deployment

1. Repository klonen
2. Auf GitHub Pages aktivieren (Branch `main`)
3. Fertig: reine statische Seite