let baseUrl = 'https://teremok.ru/';

describe('Теремок. Домашняя страница', () => {
    beforeEach(() => {
        cy.visit(baseUrl);
        cy.viewport(1920, 1080);
    });

    context('Домашняя страница', () => {
        it('Ответ 200', () => {
            cy.request('/').then((res) => {
                cy.expect(res.status).eq(200);
            });
        });

        it('Путь корректный', () => {
            cy.location('host').should('equal', 'teremok.ru');
            cy.location('pathname').should('equal', '/');
        });
    });

    context('Хедер', () => {
        it('Текст корректный', () => {
            cy.get('a[class="b-header__logo"]').should('exist');
            cy.get('a[href="/forum/"]').should('exist').contains('ваше мнение');
            cy.get('a[href="/menu/"]').should('exist').contains('наше меню');
            cy.get('a[href="/action/"]').should('exist').contains('акции');
            cy.get('a[href="/places/"]').should('exist').contains('наши теремки');
            cy.get('div[class="b-header__geo js-dropdown"]').should('exist');
        });

        it('Наше меню - выпадающий список', () => {
            cy.get('.b-header__main-menu-btn').should('exist').trigger('mouseover');
            cy.get('nav .b-main-menu').should('be.visible');
            cy.get('ul .b-main-menu-head__list li').should('length', 5);
            cy.get('ul .b-main-menu-head__list li').eq(0).contains('Новинки');
            cy.get('ul .b-main-menu-head__list li').eq(1).contains('Завтраки');
            cy.get('ul .b-main-menu-head__list li').eq(2).contains('Основное меню');
            cy.get('ul .b-main-menu-head__list li').eq(3).contains('Домашние обеды');
            cy.get('ul .b-main-menu-head__list li').eq(4).contains('Напитки');

        });

        it('Наше меню - выпадающий список - выпдающее меню', () => {
            cy.get('.b-header__main-menu-btn').should('exist').trigger('mouseover');
            cy.get('nav .b-main-menu').should('be.visible');

            // Новинки
            cy.get('ul .b-main-menu-head__list li').eq(0).contains('Новинки').trigger('mouseover');
            cy.wait(1000);
            cy.get('.b-main-menu-content').should('be.visible');

            // Завтраки
            cy.get('ul .b-main-menu-head__list li').eq(1).contains('Завтраки').trigger('mouseover');
            cy.wait(1000);
            cy.get('.b-main-menu-content').should('be.visible');
            cy.get('.b-main-menu-subcategories__item').should('exist').should('length', 4);
            cy.get('.b-main-menu-subcategories__item').eq(0).contains('Завтраки');
            cy.get('.b-main-menu-subcategories__item').eq(2).contains('Добавки к Омлету с зеленью');

            // Основное меню
            cy.get('ul .b-main-menu-head__list li').eq(2).contains('Основное меню').trigger('mouseover');
            cy.wait(1000);
            cy.get('.b-main-menu-content').should('be.visible');
            cy.get('.b-main-menu-subcategories__item').should('exist').should('length', 24);
            cy.get('.b-main-menu-subcategories__item').eq(0).contains('Блины сытные');
            cy.get('.b-main-menu-subcategories__item').eq(2).contains('Блины сладкие');
            cy.get('.b-main-menu-subcategories__item').eq(4).contains('Салаты');
            cy.get('.b-main-menu-subcategories__item').eq(6).contains('Супы');
            cy.get('.b-main-menu-subcategories__item').eq(8).contains('Вторые блюда');
            cy.get('.b-main-menu-subcategories__item').eq(10).contains('Пельмени');
            cy.get('.b-main-menu-subcategories__item').eq(12).contains('Вареники');
            cy.get('.b-main-menu-subcategories__item').eq(14).contains('Постное меню');
            cy.get('.b-main-menu-subcategories__item').eq(16).contains('Сырники');
            cy.get('.b-main-menu-subcategories__item').eq(18).should('not.visible');
            cy.get('.b-main-menu-subcategories__item').eq(14).contains('Постное меню').click();
            cy.wait(1000);
            cy.get('.b-main-menu-subcategories__item').eq(18).should('be.visible').contains('Десерты и гурьевские каши');
            cy.get('.b-main-menu-subcategories__item').eq(20).contains('Добавки в блины и каши');
            cy.get('.b-main-menu-subcategories__item').eq(22).contains('Хлеб');

            // Домашние обеды
            cy.get('ul .b-main-menu-head__list li').eq(3).contains('Домашние обеды').trigger('mouseover');
            cy.wait(1000);
            cy.get('.b-main-menu-content').should('be.visible');

            // Напитки
            cy.get('ul .b-main-menu-head__list li').eq(4).contains('Напитки').trigger('mouseover');
            cy.wait(1000);
            cy.get('.b-main-menu-content').should('be.visible');
            cy.get('.b-main-menu-subcategories__item').should('exist').should('length', 6);
            cy.get('.b-main-menu-subcategories__item').eq(0).should('be.visible').contains('Горячие напитки');
            cy.get('.b-main-menu-subcategories__item').eq(2).should('be.visible').contains('Фирменные напитки');
            cy.get('.b-main-menu-subcategories__item').eq(4).should('be.visible').contains('Холодные напитки');
        });
    });

    context('Бургер меню', () => {
        beforeEach('Открываем', () => {
            cy.get('a[href="#js-modal-menu"]').should('exist').click();
        });

        it('4 карточки - содержат корректный текст', () => {
            cy.get('.b-menu-card--products article h1').should('exist').contains('наше меню');
            cy.get('.b-menu-card--stocks article h1').should('exist').contains('Наши акции');
            cy.get('.b-menu-card--company article h1').should('exist').contains('о теремке');
            cy.get('.b-menu-card--forum article h1').should('exist').contains('ваше мнение');
        });

        it('4 карточки - ховер ээфект корректно отображается', () => {
            cy.get('.b-menu-card--products').should('be.visible').trigger('mouseover');
            cy.get('.b-menu-card--stocks').should('be.visible').trigger('mouseover');
            cy.get('.b-menu-card--company').should('be.visible').trigger('mouseover');
            cy.get('.b-menu-card--forum').should('be.visible').trigger('mouseover');
        });

        it('Правая навигация - крестик закрытия + лого видны', () => {
            cy.get('.b-menu__close span').should('be.visible');
            cy.get('.b-menu__body .b-menu__logo').should('be.visible');
        });

        it('Правая навигация - выбор городов виден + содержит корректный текст', () => {
            cy.get('.b-menu__body .b-menu__select').should('be.visible');
            cy.get('.b-menu__select').should('be.visible').click();
            cy.get('ul[class="select2-results__options"]').should('be.visible');
            cy.get('li[class="select2-results__option select2-results__option--highlighted"]').should('be.visible').contains('Москва');
            cy.get('li[class="select2-results__option"]').should('be.visible').contains('Санкт-Петербург');
            cy.get('li[class="select2-results__option"]').should('be.visible').contains('Краснодар');
            cy.get('.b-menu__select').should('be.visible').click();
        });

        it('Правая навигация - основное меню видно + содержит корректный текст', () => {
            cy.get('.b-menu__body .b-menu__list').should('be.visible');
            cy.get('.b-menu__list a[href="/events/"]').should('be.visible').contains('Новости');
            cy.get('.b-menu__list a[href="/places/"]').should('be.visible').contains('Наши заведения');
            cy.get('.b-menu__list a[href="http://rabota.teremok.ru"]').should('be.visible').contains('Работа у нас');
            cy.get('.b-menu__list a[href="/contacts/"]').should('be.visible').contains('Контакты');
            cy.get('.b-menu__list a[href="/calculator/"]').should('be.visible').contains('Калькулятор калорий');
            cy.get('.b-menu__list a[href="/partnership/?topic=partnership#topic"]').should('be.visible').contains('Партнерство в регионах');
        });

        it('Правая навигация - соц. сети видны + ссылки корректны', () => {
            cy.get('.b-social--red').should('be.visible');
            cy.get('.b-social--red .b-social__item .b-social__btn--vk').should('have.attr', 'href', 'https://vk.com/teremok');
            cy.get('.b-social--red .b-social__item .b-social__btn--ok').should('have.attr', 'href', 'https://ok.ru/teremok');
            cy.get('.b-social--red .b-social__item .b-social__btn--tg').should('have.attr', 'href', 'https://t.me/teremok_ru');
            cy.get('.b-social--red .b-social__item .b-social__btn--dzen').should('have.attr', 'href', 'https://zen.yandex.ru/id/62397d25fdc445587559d852');
        });

        it('Правая навигация - навигация доставки видна + текст и ссылки корректны', () => {
            cy.get('.b-menu__delivery').should('be.visible').contains('Доставка наших блюд в Москве:');

            cy.get('.b-menu__delivery a')
                .should('be.visible').eq(0)
                .should('have.attr', 'href', 'https://eda.yandex/landings/teremok')
                .contains('Яндекс.Еда');

            cy.get('.b-menu__delivery a')
                .should('be.visible').eq(1)
                .should('have.attr', 'href', 'https://www.delivery-club.ru/srv/Tjerjemok_msk')
                .contains('Delivery Club');
        });

        it('Правая навигация - закрывается и элементы не видны', () => {
            cy.get('.b-menu__close span').should('be.visible').click();
            cy.get('.b-menu-card--products article h1').should('not.visible');
            cy.get('.b-menu-card--stocks article h1').should('not.visible');
            cy.get('.b-menu-card--company article h1').should('not.visible');
            cy.get('.b-menu-card--forum article h1').should('not.visible');
        });
    });
});