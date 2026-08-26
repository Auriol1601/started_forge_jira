# 📝 Spécification Interface — Formulaire GIM Horizon 2026

## 🔷 Informations Générales

* **Type :** Formulaire de création / édition de programme et vue tabulaire
* **Fond global :** Bleu foncé (`rgb(40, 52, 120)`)

---

## 1. 🟡 Header (Barre Supérieure)

* **Fond :** Jaune vif (`rgb(255, 221, 0)`) sur toute la largeur
* **À gauche :** Icône menu hamburger (3 barres horizontales noires/bleu marine)
* **Badge :** Cartouche bleu marine avec le texte `"GIM-HZ 2026"` en blanc

---

## 2. 📝 Panneau Latéral Gauche (Formulaire)

Situé sur un fond bleu marine sombre (`rgb(20, 33, 61)`).

### Champs du formulaire
* **SELECTIONNER / AXE STRATEGIQUE :** Bouton jaune clair + champ texte à fond gris bleu
* **NOM DU PROGRAMME / NOM DU SPONSOR / SPONSOR AUTO :** Champs texte à fond gris bleu avec placeholders en majuscules
* **DEBUT & FIN :** Boutons jaunes avec icône calendrier
* **STATUS :** Bouton vert/sombre avec flèches
* **BUDGET & BUDGET CONSO :** Boutons jaunes
* **Description :** Zone de texte multiligne avec placeholder `"Description ......"`
* **Bouton d'action :** Bouton jaune vif arrondi avec le texte `"creer un programme"` en bleu

---

## 3. 📊 Panneau Central Droit (Tableau des Programmes)

Cadre blanc à bord bleu.

* **Instruction :** Texte blanc `"NB: cliquez sur un programme pour le modifiez"`
* **En-tête :** Bandeau jaune vif
* **Colonnes :** `nom du programme`, `status`, `budget conso`, `date debut`, `date fin`
* **Données :** Lignes d'enregistrements (ex. `Schema paiement`, `Gim trilogie`, status `encours`, budget `2000000FCFA`, dates `03/08/2026` et `04/08/2026`).
