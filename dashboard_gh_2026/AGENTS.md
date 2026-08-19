# Interface « Accueil — GIM Horizon 2026 »

## Informations générales

- **Type** : Tableau de bord (Dashboard) de suivi de projet
- **Dimensions** : 1440 × 1024 px (format desktop)
- **Fond général** : Bleu marine foncé (`#283478` — rgb 40, 52, 120)

---

## 1. Barre d'en-tête (Header)

- **Dimensions** : 1440 × 90 px
- **Couleur de fond** : Jaune vif (`#FFDD00` — rgb 255, 221, 0)

### Éléments du header (de gauche à droite) :

| Élément             | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Menu hamburger**  | 3 barres horizontales bleu foncé (`#14213D`), empilées verticalement        |
| **Logo / Titre**    | Cartouche arrondi bleu marine contenant « **GIM-HZ 2026** » en blanc, 17px |
| **Bouton d'action** | Bouton arrondi bleu marine avec texte « **creer programme** » en blanc, 15px|

---

## 2. Zone principale — Dashboard (Carte blanche)

- **Dimensions** : 1274 × 678 px
- **Couleur de fond** : Blanc (`#FFFFFF`)
- **Position** : Centrée sur le fond bleu marine

### 2.1 Menu contextuel (options)

- **Position** : Coin supérieur gauche du dashboard
- **Apparence** : 3 points ronds bleu foncé (`#14213D`) alignés horizontalement (14 × 14 px chacun)
- **Fonction** : Icône de menu contextuel « ••• »

---

### 2.2 Partie gauche — Graphique en bulles (Cercles de progression)

#### Cercle principal (avancement global)

- **Dimensions** : ≈ 379 × 372 px
- **Couleur de fond** : Bleu marine (`#283478`)
- **Contenu** :
  - **« 45 % »** — police 96 px, couleur blanche, centré
  - **« Horizon 2026 »** — police 32 px, couleur blanche, sous le pourcentage

> Représente le **pourcentage global d'avancement** du programme Horizon 2026.

#### Cercles satellites (avancement par axe)

Trois cercles plus petits (≈ 156 × 154 px), fond bleu marine, disposés autour du cercle principal :

| Position              | Axe       | Pourcentage | Police pourcentage | Police label |
|-----------------------|-----------|-------------|--------------------|--------------|
| En haut à droite      | **AXE 1** | **20 %**    | 36 px, blanc       | 16 px, blanc |
| Au milieu à droite    | **AXE 2** | **20 %**    | 36 px, blanc       | 16 px, blanc |
| En bas au centre      | **AXE 3** | **20 %**    | 36 px, blanc       | 16 px, blanc |

---

### 2.3 Partie droite — Liste des programmes (Barres de progression)

Liste verticale de **9 programmes**, chacun représenté par une barre horizontale (317 × 43 px) composée de :
- Un **fond bleu marine** (barre complète = 100 %)
- Une **barre jaune superposée** (largeur proportionnelle au pourcentage)
- Le **pourcentage** à gauche (police 24 px, blanc)
- Le **nom du programme** à droite (police 19 px, blanc)

| #  | Pourcentage | Barre jaune       | Nom du programme          |
|----|-------------|-------------------|---------------------------|
| 1  | **70 %**    | ████████████████░ | **GIM SCHEMA PAIEMENT**   |
| 2  | **70 %**    | ████████████████░ | **GIM TRILOGIE**          |
| 3  | **70 %**    | ████████████████░ | **GIM SOUVERA**           |
| 4  | **20 %**    | ████░░░░░░░░░░░░░ | **GIM TECHNOPOLE**        |
| 5  | **70 %**    | ████████████████░ | **GIMPAY**                |
| 6  | **65 %**    | ███████████████░░ | **GIM EXCELLENCE**        |
| 7  | **80 %**    | █████████████████ | **SIMULATION GAMIFI**     |
| 8  | **50 %**    | ██████████░░░░░░░ | **GIMPULSE**              |
| 9  | **70 %**    | ████████████████░ | **GIM TRANSFORM**         |

---

## 3. Palette de couleurs

| Couleur              | Code HEX   | RGB               | Utilisation                                  |
|----------------------|------------|-------------------|----------------------------------------------|
| Jaune vif            | `#FFDD00`  | rgb(255, 221, 0)  | Header, barres de progression, accents       |
| Bleu marine foncé    | `#283478`  | rgb(40, 52, 120)  | Fond principal, cercles, fond des barres     |
| Bleu très foncé      | `#14213D`  | rgb(20, 33, 61)   | Icônes hamburger, points du menu contextuel  |
| Blanc                | `#FFFFFF`  | rgb(255, 255, 255)| Textes, fond du dashboard                    |

---

## 4. Typographie

| Élément                    | Taille | Couleur | Style    |
|----------------------------|--------|---------|----------|
| Pourcentage global (45 %)  | 96 px  | Blanc   | Gras     |
| Label global (Horizon 2026)| 32 px  | Blanc   | Normal   |
| Pourcentages axes (20 %)   | 36 px  | Blanc   | Gras     |
| Labels axes (AXE 1, 2, 3) | 16 px  | Blanc   | Normal   |
| Pourcentages programmes    | 24 px  | Blanc   | Gras     |
| Noms programmes            | 19 px  | Blanc   | Majuscules |
| Titre header (GIM-HZ 2026)| 17 px  | Blanc   | Normal   |
| Bouton (creer programme)   | 15 px  | Blanc   | Normal   |

---

## 5. Résumé fonctionnel

L'interface est un **tableau de bord de pilotage stratégique** pour le programme 
« GIM Horizon 2026 ». Elle s'articule autour de deux visualisations :

1. **Graphique en bulles** (gauche) : affiche l'avancement global (**45 %**) 
   et la répartition par axe stratégique (3 axes à **20 %** chacun).

2. **Barres de progression** (droite) : détaille l'état d'avancement de 
   **9 sous-programmes** avec leur pourcentage respectif, allant de **20 %** 
   (GIM Technopole) à **80 %** (Simulation Gamifi).

Le schéma de couleurs **bleu marine / jaune** renvoie à une identité 
institutionnelle. L'en-tête propose un accès au **menu de navigation** 
(hamburger) et un bouton d'action « **créer programme** ».

