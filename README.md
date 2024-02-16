### Тренировочные примеры автотестов для веб-сайтов и АПИ ###

*Для работы тербуется два пакета:*

`npm install --save-dev cypress`

`npm install --save-dev @bahmutov/cy-api`

*Запуск в обычном режиме:*

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
