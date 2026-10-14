# Changelog - AL-AFNA Risk Manager

## État au 4 octobre 2026 (baseline, tag v1.0-baseline, commit 5d0fd95)
- 6 modules : contexte, actifs, menaces, analyse des risques, traitement, rapports
- Aide IA : suggestion de menaces et de mesures, synthèse managériale
- Exports PDF / Word / Excel, matrice des risques 5x5

## Pendant le projet APSI-NE
- 2026-10-09 : tag v1.0-baseline repositionné sur le commit 5d0fd95 (dernier commit avant le 4 octobre)
- 2026-10-09 : ajout du fichier .gitignore (captures d'écran exclues du dépôt)
- 2026-10-09 : module SoA, création des tables iso_controls, soa_entries, risk_controls avec règles de sécurité (sql/001_soa.sql)
- 2026-10-09 : ajout du référentiel des 93 mesures de l'Annexe A (sql/002_iso_controls_seed.sql)
- 2026-10-09 : page soa.html (évaluation par mesure, justification, état, écart)
- 2026-10-09 : refonte des rapports (page de garde, tableaux, sections SoA et traçabilité)
- 2026-10-10 : suggestions de mesures par règles, confirmation ou choix manuel
- 2026-10-12 : aide contextuelle IA avec contrôle des mesures citées (fonction ai-assistant, tâche aide_soa)
- 2026-10-12 : résumé du contexte par organisation dans la SoA
- 2026-10-12 : authentification (pages login et inscription, protection des pages)
- 2026-10-13 : tableau de bord administrateur (statistiques par compte, accès contrôlé côté serveur)
