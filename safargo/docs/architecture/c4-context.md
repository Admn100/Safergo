# SafarGo - Diagramme de Contexte C4

## Vue d'ensemble

SafarGo est une plateforme de covoiturage avec module tourisme pour l'Algérie.

```mermaid
C4Context
    title Diagramme de Contexte - SafarGo

    Person(passenger, "Passager", "Utilisateur recherchant un trajet")
    Person(driver, "Conducteur", "Utilisateur proposant des trajets")
    Person(admin, "Administrateur", "Gestionnaire de la plateforme")
    
    System(safargo, "SafarGo", "Plateforme de covoiturage et tourisme")
    
    System_Ext(payment, "Stripe/Adyen", "Système de paiement")
    System_Ext(email, "SendGrid", "Service d'email")
    System_Ext(sms, "Twilio", "Service SMS")
    System_Ext(maps, "Mapbox", "Service de cartographie")
    System_Ext(storage, "S3/MinIO", "Stockage d'objets")
    
    Rel(passenger, safargo, "Recherche et réserve des trajets")
    Rel(driver, safargo, "Publie des trajets")
    Rel(admin, safargo, "Gère la plateforme")
    
    Rel(safargo, payment, "Traite les paiements")
    Rel(safargo, email, "Envoie des emails")
    Rel(safargo, sms, "Envoie des SMS")
    Rel(safargo, maps, "Affiche les cartes")
    Rel(safargo, storage, "Stocke les fichiers")
```

## Acteurs

### Passager
- Recherche des trajets
- Réserve des places
- Paie après le trajet
- Évalue les conducteurs
- Explore les destinations touristiques

### Conducteur
- Publie des trajets
- Gère ses véhicules
- Reçoit les paiements
- Communique avec les passagers
- Crée des trajets touristiques

### Administrateur
- Modère le contenu
- Gère les litiges
- Import/export des POI
- Analyse les métriques
- Configure la plateforme

## Systèmes Externes

### Paiement (Stripe/Adyen)
- Gestion des paiements sécurisés
- Système d'escrow (hold/capture)
- Remboursements automatiques
- Conformité PCI-DSS

### Communications
- **Email (SendGrid)**: Notifications transactionnelles
- **SMS (Twilio)**: Codes OTP, rappels

### Cartographie (Mapbox)
- Cartes interactives
- Géocodage/reverse géocodage
- Calcul d'itinéraires
- Clustering des POI

### Stockage (S3/MinIO)
- Photos de profil
- Documents KYC
- Images des lieux touristiques
- Galeries de véhicules