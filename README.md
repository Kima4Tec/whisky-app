# Whisky-app noter med screenshots og struktur

## Screenshots

<img src="image.png" width="200" />

<img src="IMG_9076.PNG" width="200" />

<img src="IMG_9077.PNG" width="200" />

<img src="IMG_9078.PNG" width="200" />

<img src="IMG_9080.PNG" width="200" />

<img src="IMG_9081.PNG" width="200" />

<img src="IMG_9082.PNG" width="200" />

<img src="IMG_9089.PNG" width="200" />

<img src="IMG_9090.PNG" width="200" />

<img src="IMG_9083.PNG" width="200" />

<img src="IMG_9084.PNG" width="200" />

<img src="IMG_9087.PNG" width="200" />

<img src="IMG_9088.PNG" width="200" />

## Struktur

### Tabs

- \_layout.tsx: Tab-navigation med tre skærme: Home, explore og destillerier.
- explore.tsx: explore-skærmen med info om klubber & events.
- whisky.tsx: Visning af destillerier i Japan og Skotland via externt api-kald.
- index.tsx: Hoved-skærm med info om tabs-navigationen og links til: Whisky-anmeldelser, egne anmeldelser, whisky-butikker, valg af favorit-whisky og ryst dig til et tema - links åbner modaler.

### Modaler

- \_layout.tsx: layout med stack-screen
- addReview.tsx: Skriv ny anmeldelse og gem på mobilen/tablet
- favourites: Stem på din favoritwhisky og se scoreboard
- modal.tsx: ikke brugt
- myReviews.tsx: Visning af mine anmeldelser.
- reviews.tsx: anmeldelser på nettet
- shake-theme.tsx: ryst mobilen og få et tilfældigt tema
- shops.tsx: links til butikker, hvor du kan købe whisky

### Api route

- distilleries_info+api.ts
