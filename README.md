### Тренировочные примеры автотестов для веб-сайтов и АПИ ###

*Для работы требуется два пакета:*

1. Фреймворк:

`npm install --save-dev cypress`

2. Плагин, опционально. Отрисовывает body запроса для АПИ:

`npm install --save-dev @bahmutov/cy-api`

Запуск в обычном режиме:

`npx cypress open`

*Папки с тестами:*

    cypress/
      e2e/
          qastudio-postcard/
              home-page.cy.js
              send.cy.js
          swapi/
              planet.cy.js
          teremok/
              home.cy.js
              header-pages.cy.js
          zemsBase-public/
              main.cy.js
