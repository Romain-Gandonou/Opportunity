# Opportunity Trust — Plateforme Internationale d'Opportunités Vérifiées

> **Plateforme internationale de découverte, de vérification et de gestion des opportunités académiques et professionnelles.**  
> Point de départ : Bénin, Afrique francophone et international.

---

## 1. Problème résolu & Vision

Les opportunités d'études, de bourses d'excellence, de stages, d'emplois et de financements sont dispersées et polluées par des fausses annonces, des avis périmés et des arnaques au Mobile Money.

**Opportunity Trust** apporte une réponse structurelle :
- **100% de provenance identifiable :** Chaque annonce renvoie directement à son émetteur institutionnel officiel.
- **Protocole d'audit à 4 niveaux :**
  1. *Source non vérifiée* (instruction en attente)
  2. *Source identifiée* (nom de domaine et identité validés)
  3. *Source contrôlée* (contacts officiels et gratuité certifiés)
  4. *Informations recoupées* (au moins 2 sources institutionnelles concordantes).
- **Zéro fausse promesse :** Aucune date limite inventée. Les annonces dépassées sont automatiquement marquées *Expirées*.
- **Protection des candidats :** Espace personnel privé, suivi de candidatures avec checklist de documents et notes confidentielles.

---

## 2. Périmètre fonctionnel

- **Module A — Site public :** Accueil, Catalogue multi-critères, Fiche détaillée avec traçabilité et preuves d'audit, Méthode de vérification, Guide anti-arnaques, À propos, Centre d'aide / FAQ, Contact, CGU et Politique de confidentialité.
- **Module B & C — Authentification & Profil :** Inscription, connexion, réinitialisation de mot de passe, isolation stricte des données privées, gestion des préférences de notification et droit à l'effacement.
- **Module D & E — Catalogue & Recherche :** Mots-clés, filtrage combinable (Catégorie, Pays, Niveau d'études, Type de financement, Niveau de vérification), tri déterministe et pagination stable.
- **Module F — Candidatures & Pièces :** Tableau de bord candidat, statuts contrôlés (*À examiner*, *À préparer*, *En cours*, *Soumise*, *Acceptée*, *Refusée*, *Abandonnée*), checklists dynamiques et notes personnelles.
- **Module G — Alertes :** Centre de notifications in-app avec rappels d'échéances et alertes d'annonces vérifiées.
- **Module H — Administration & Audit :** Console de modération réservée aux auditeurs, file d'instruction, créateur d'annonces certifiées, gestion des signalements, outil de détection des doublons et journal immuable d'événements de sécurité.
- **Module I — Signalements :** Signalement d'arnaques, frais illicites ou liens rompus avec traitement prioritaire.

---

## 3. Architecture Technique & Choix de Conception

- **Frontend :** React 19 + TypeScript + Vite.
- **Design System :** Tailwind CSS v4, icônes Lucide, accessibilité native conforme WCAG 2.2 AA.
- **Logique métier découplée :** `src/utils/opportunityLogic.ts` regroupe les calculs purs, la normalisation d'URL, la similarité de titres, les règles d'éligibilité et l'isolation des permissions.
- **Tests unitaires :** Exécutés via `node:test` (`npx tsx --test src/utils/opportunityLogic.test.ts`).
- **Conformité juridique :** Respect de la Loi N° 2017-20 portant Code du Numérique en République du Bénin et des principes RGPD (portabilité des données en JSON, droit à l'effacement, minimisation).

---

## 4. Installation & Démarrage Local

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-organisation/opportunity-trust.git
cd opportunity-trust

# 2. Installer les dépendances
npm install

# 3. Exécuter la suite de tests unitaires
npx tsx --test src/utils/opportunityLogic.test.ts

# 4. Lancer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

---

## 5. Rôles de Démonstration Intégrés

Pour faciliter l'évaluation immédiate, un sélecteur de rôle en un clic est disponible dans la barre de navigation :
- **Visiteur :** Consultation publique du catalogue et des guides.
- **Candidat (Fatoumata Diallo) :** Accès à l'espace candidatures, favoris, checklist et profil.
- **Admin (Dr. Sylvain Dossou) :** Accès à la console d'audit, modération des signalements, publication et journal d'événements.

---

## 6. Sécurité & Signalement de Vulnérabilités

Pour tout signalement de faille de sécurité ou annonce suspecte :
- Utilisez le bouton « Signaler » présent sur chaque annonce.
- Ou contactez directement la cellule d'audit : `contact@opportunity-trust.org`.
