# VCH · Hijsseinen oefenen
Versie V01.00.00. Individuele oefenapp voor de klassikale training Veilig hijsen in de haven.

## Starten
Open `dist/index.html` in een browser. Kies de vier kernseinen (hijsen, vieren, gevaar – noodstop en stop beweging) of alle twaalf seinen. Bij iedere foto staat een beschrijving van de beweging. Kies uit vijf antwoorden. Na een fout oefen je hetzelfde sein opnieuw. Alleen een goed antwoord brengt de container hoger. Aan het einde kun je de seinen die extra oefening vroegen herhalen.

De seinenkaart bevat per sein een fotorealistische illustratie, de officiële tekening en de beschrijving. Je kunt vanuit een oefenronde de kaart bekijken en via Oefenen teruggaan. De voortgang geldt voor de geopende ronde en vervalt bij vernieuwen of afsluiten.

## In het lokaal
Open de gepubliceerde app. Kies rechtsboven **QR-code** en daarna **Vergroot QR-code**. Deelnemers die de code scannen openen ieder hun eigen oefenronde. De QR-code wordt in de browser gemaakt voor het huidige webadres.

## Publiceren via Cloudflare Workers
Koppel deze repository en kies de branch `main`. De map `dist` bevat de complete website. Er is geen buildopdracht nodig. Gebruik als deployopdracht `npx wrangler deploy` vanuit de hoofdmap. In `wrangler.jsonc` staat de assetmap `./dist`. Als de Worker eerder is gekoppeld, kan een commit naar de gekoppelde branch de bestaande automatische publicatie starten.

Alle paden zijn relatief. De app heeft geen database, accounts, API-sleutels of externe diensten nodig. Rechtstreeks openen vanaf schijf werkt ook. Het delen via QR gebruikt het adres van de gepubliceerde app.

## Bron
De hand- en armseinen en de schematische tekeningen zijn gebaseerd op Richtlijn 92/58/EEG, bijlage IX, onderdeel 3. De fotorealistische afbeeldingen zijn illustraties voor de training. Links en rechts gelden vanuit de seingever.

https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:31992L0058

De QR-codegenerator is gebaseerd op QRCode for JavaScript, copyright Kazuhiko Arase, MIT-licentie. Zie dist/vendor.
