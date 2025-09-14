# Diagramme de Séquence - Processus de Réservation

## Vue d'ensemble

Ce diagramme illustre le processus complet de réservation d'un trajet avec paiement en escrow.

```mermaid
sequenceDiagram
    participant P as Passager
    participant W as Web/Mobile App
    participant API as API SafarGo
    participant DB as Database
    participant PAY as Stripe/Adyen
    participant EMAIL as SendGrid
    participant SMS as Twilio
    participant D as Conducteur

    Note over P,D: Phase 1 - Recherche et Réservation
    
    P->>W: Recherche trajets
    W->>API: GET /trips?origin=X&destination=Y
    API->>DB: Query trips avec filtres
    DB-->>API: Liste des trajets
    API-->>W: Trajets disponibles
    W-->>P: Affiche résultats

    P->>W: Sélectionne trajet
    W->>API: GET /trips/{id}
    API->>DB: Get trip details
    DB-->>API: Détails du trajet
    API-->>W: Infos complètes
    W-->>P: Page de réservation

    Note over P,D: Phase 2 - Paiement (Hold)
    
    P->>W: Confirme réservation
    W->>API: POST /bookings
    API->>DB: Check disponibilité
    DB-->>API: Places disponibles
    
    API->>PAY: Create payment intent
    PAY-->>API: Intent ID + client secret
    
    W->>PAY: Confirm payment (3DS si nécessaire)
    PAY-->>W: Payment confirmed
    
    W->>API: POST /bookings/{id}/confirm
    API->>PAY: Capture authorization (HOLD)
    PAY-->>API: Hold successful
    
    API->>DB: Create booking (status=HELD)
    DB-->>API: Booking created
    
    API->>EMAIL: Send confirmation email
    API->>SMS: Send SMS to passenger
    API->>D: Notification nouvelle réservation
    
    API-->>W: Booking confirmed
    W-->>P: Confirmation affichée

    Note over P,D: Phase 3 - Jour du trajet
    
    P->>W: Check-in trajet
    W->>API: POST /trips/{id}/checkin
    API->>DB: Update passenger status
    API->>D: Notification passager présent

    Note over P,D: Phase 4 - Après le trajet
    
    D->>W: Marque trajet terminé
    W->>API: POST /trips/{id}/complete
    API->>DB: Update trip status=DONE
    
    API->>PAY: Capture payment (final)
    PAY-->>API: Payment captured
    
    API->>DB: Update booking status=FINISHED
    API->>DB: Update payment status=CAPTURED
    
    API->>EMAIL: Send receipt to passenger
    API->>D: Notification paiement reçu
    
    Note over P,D: Phase 5 - Évaluations
    
    P->>W: Laisse un avis
    W->>API: POST /reviews
    API->>DB: Create review
    API->>D: Notification nouvel avis
    
    D->>W: Évalue passager
    W->>API: POST /reviews
    API->>DB: Create review
    API->>P: Notification nouvelle évaluation
```

## États de la Réservation

1. **PENDING**: Réservation initiée, en attente de paiement
2. **HELD**: Paiement autorisé (hold), en attente du trajet
3. **CONFIRMED**: Réservation confirmée par le conducteur
4. **CANCELLED**: Annulée (remboursement automatique si HELD)
5. **FINISHED**: Trajet terminé, paiement capturé

## Gestion des Erreurs

### Échec du Paiement
- Annulation automatique de la réservation
- Libération des places
- Notification au passager

### Annulation par le Conducteur
- Remboursement automatique du hold
- Notification au passager
- Proposition de trajets alternatifs

### Annulation par le Passager
- Si > 24h avant: Remboursement complet
- Si < 24h: Frais d'annulation (10%)
- Si < 2h: Pas de remboursement

### Litige
- Gel du paiement
- Ouverture d'un ticket support
- Médiation entre les parties
- Décision finale de l'admin