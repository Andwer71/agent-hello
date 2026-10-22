# Lugn lista

En liten svensk att göra-lista byggd med vanlig HTML, CSS och JavaScript. Appen behöver ingen backend eller byggprocess och kan publiceras som en statisk webbplats på GitHub Pages. Uppgifterna sparas i webbläsarens `localStorage` på den enhet och i den webbläsare där du använder appen.

## Starta lokalt

Öppna `index.html` direkt i en webbläsare, eller starta en enkel lokal webbserver i projektmappen:

```sh
python -m http.server 8000
```

Öppna sedan <http://localhost:8000>.

## Tester

Öppna `core.test.html` i webbläsaren för att köra de automatiska testerna utan extra verktyg. Med Node.js 18 eller senare kan du även köra samma kärntester i terminalen:

```sh
npm test
```

## Publicera på GitHub Pages

Workflowen i `.github/workflows/pages.yml` kör `npm test` vid varje push och pull request. Endast en push till `main` som klarar testerna publiceras. Den kopierar bara appens HTML-, CSS- och JavaScript-filer till publiceringsartefakten. Appens resurslänkar är relativa, så de fungerar både på en egen domän och under repositoryts sökväg på GitHub Pages.

När repositoryt har skapats och pushats till GitHub, välj **Settings → Pages → Build and deployment → Source → GitHub Actions**. Ingen backend eller byggkonfiguration behövs.
