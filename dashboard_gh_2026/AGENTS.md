# Interface « Accueil — GIM Horizon 2026 »

## Informations générales

- **Type** : Tableau de bord (dashboard) de pilotage de programme
- **Format cible** : Desktop, responsive sur écrans larges
- **Fond global** : bleu marine profond (`#101B42` ou équivalent dans la charte visuelle appliquée)
- **Objet de ce document** : documenter le design final effectivement mis en place dans l’interface, y compris les dimensions, couleurs et composants visuels ajustés.

---

## 1. Structure générale

### 1.1 Contexte de mise en page

- **Cadre global** : app affichée sur fond sombre bleu profond, avec une zone principale claire et centrée
- **Disposition** : header en haut, side panel masqué / rétractable, contenu principal centré sur la page
- **Comportement** : panneau latéral actionnable via le bouton hamburger, menu contextuel avec options sur le dashboard

### 1.2 Dimensions de référence

- **Hauteur de page** : variable selon contenu, avec une composition verticale structurée
- **Largeur principale du dashboard** : environ 1200–1300 px selon résolution
- **Header** : hauteurs ajustées pour laisser une zone de navigation nette et lisible
- **Éléments centraux** : dimensionnés pour rester proportionnels à la largeur de la carte principale

> Ce document reflète les dimensions et proportions appliquées à la maquette telle qu’elle a été réalisée dans l’UI, sans se limiter à une grille figée de 1440×1024.

---

## 2. Header

- **Couleur de fond** : jaune vif ou doré clair (`#F4D235` / ton proche de la charte actuelle)
- **Hauteur** : adaptée pour un rendu visuel compact mais lisible
- **Alignement** : éléments disposés horizontalement, avec espace propre entre gauche, centre et droite

### Éléments du header

| Élément | Description |
|--------|-------------|
| **Menu hamburger** | bouton rond ou rectangulaire avec barres de navigation, couleur sombre pour contraste |
| **Brand / titre** | libellé visible du programme, sur fond sombre ou sur badge coloré |
| **Bouton d’action** | bouton d’action principal avec mise en relief, couleur marine ou foncée |

### Palette header

- **Jaune** : accent principal
- **Bleu foncé / marine** : fond des badges, boutons et éléments structurants
- **Blanc** : texte sur fond sombre et sur éléments colorés

---

## 3. Dashboard principal

### 3.1 Zone globale

- **Fond** : blanc cassé / très clair, avec marge autour pour accentuer la carte centrale
- **Contour / ombre** : légère profondeur visuelle pour donner un rendu d’interface professionnelle
- **Positionnement** : centrée sur la page, avec marges latérales visibles

### 3.2 Menu contextuel

- **Position** : haut gauche du bloc principal
- **Apparence** : bouton d’options sous forme de 3 points alignés
- **Couleur** : marine sombre pour un contraste net
- **Comportement** : ouverture d’un menu contextuel avec actions `OPTION`, `EXPORTER`, `AFFICHAGE`, `PARTAGER`

---

## 4. Partie gauche — visualisation globale

### 4.1 Cercle principal

- **Forme** : cercle de forte présence visuelle
- **Couleur de fond** : bleu marine / indigo
- **Contenu** :
  - pourcentage central très grand
  - libellé secondaire sous le chiffre
- **Style visuel** : texte blanc, centré, lisibilité renforcée par l’espace interne important

### 4.2 Cercles satellites

- **Forme** : cercles plus petits, répartis autour du cercle central
- **Palette** : identique au fond principal de l’interface
- **Contenu** : pourcentage et libellé court par axe
- **Rôle** : compléter la vue globale et souligner la représentation de progressions par dimension / axe

### 4.3 Paramètres visuels appliqués

- **Rayon / taille** : ajustés pour équilibrer l’espace du bloc et éviter la saturation visuelle
- **Espacement** : marges internes / externes soigneusement calculées pour donner un rendu aérien
- **Textes** : proportionnés pour rester lisibles dans les cercles en fonction de leur taille

---

## 5. Partie droite — liste des programmes

### 5.1 Structure

- **Liste verticale** de programmes sous forme de lignes de progression
- **Chaque ligne contient** :
  - un pourcentage sur la gauche
  - un nom de programme
  - une barre de progression colorée

### 5.2 Barres de progression

- **Fond** : bleu profond / marine
- **Remplissage** : jaune vif, avec largeur variable selon le pourcentage
- **Style visuel** : bord arrondi, légère différenciation de niveaux, proportion adaptée à l’interface

### 5.3 Typographie appliquée

- **Pourcentage** : texte lisible, assez grand pour se distinguer immédiatement
- **Nom du programme** : texte de taille intermédiaire, avec forte lisibilité sur fond sombre
- **Alignement** : proportions et espacement recalés pour éviter un rendu serré

---

## 6. Palette de couleurs actuelle

| Couleur | Code | Usage principal |
|--------|------|----------------|
| **Jaune vif / doré** | `#F4D235` | accents, barres, éléments de mise en avant |
| **Bleu marine profond** | `#101B42` | fond principal, éléments structurants, cercles |
| **Bleu foncé / indigo** | `#1B2A5E` ou tonalité proche | fond des cartes, contrastes secondaires |
| **Blanc** | `#FFFFFF` | texte, zones claires, contraste maximal |
| **Blanc cassé / gris très clair** | `#F5F7FB` | fond de cartes / bloc d’interface |

> Les valeurs peuvent légèrement varier selon la version exacte du thème appliqué, mais la logique visuelle est bien définie : bleu profond + jaune comme couleur d’accent dominant.

---

## 7. Typographie

### 7.1 Styles de base

- **Titres / libellés principaux** : police forte, visuellement nette, haute lisibilité
- **Pourcentages centraux** : plus grands que les labels secondairess, pour assurer un impact visuel immédiat
- **Noms de programmes** : confortables, lisibles, sans surcharge visuelle

### 7.2 Hiérarchie recommandée

| Élément | Rôle |
|--------|------|
| **Très gros** | pourcentage global central |
| **Gros** | libellés principaux / axes |
| **Moyen** | noms de programmes et labels de section |
| **Petit** | micro-labels, actions secondaires |

---

## 8. Composants UI mis en place

### 8.1 Header
- bouton hamburger
- badge / titre du programme
- bouton d’action principal

### 8.2 Sidebar
- panneau latéral rétractable
- navigation ou actions complémentaires
- fermeture via clic ou bouton dédié

### 8.3 Dashboard
- carte principale avec visualisations centrées
- graphiques circulaires
- liste des projets / programmes avec barres de progression

### 8.4 Menu d’options
- actions `OPTION`, `EXPORTER`, `AFFICHAGE`, `PARTAGER`
- déclenché via bouton contextuel en haut du dashboard

---

## 9. Règles de design à conserver

1. Maintenir un contraste fort entre fonds sombres et éléments en jaune/blanc.
2. Ne pas surcharge visuelle : l’interface doit rester lisible, même avec plusieurs niveaux de données.
3. Conserver les proportions généreuses autour du cercle principal pour préserver l’impact visuel.
4. Les barres de progression doivent rester lisibles sans sembler trop compactes.
5. Les actions doivent avoir un rendu premium et professionnel, sans excès d’ornement.
6. Toute évolution de dimension ou couleur doit rester cohérente avec la palette principale bleu marine + jaune.

---

## 10. Résumé fonctionnel

L’interface est conçue comme un tableau de bord stratégique de pilotage de programme. Elle combine une vue synthétique centralisée avec une liste détaillée des initiatives ou sous-programmes.

La charte visuelle actuelle privilégie :
- un fond sombre et structurant,
- un contraste affirmé avec des éléments jaunes,
- une hiérarchie claire et des proportions généreuses,
- une expérience de dashboard premium et lisible pour le suivi de projets.

Cette version documentaire reflète les changements visuels réellement implémentés dans l’interface, notamment les dimensions ajustées, la palette de couleurs actuelle et l’organisation modulée du dashboard.

