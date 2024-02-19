let baseUrl = 'https://teremok.ru/';

describe('Теремок. Переход на другие страницы с главной', () => {
    beforeEach('Адрес + размер экрана', () => {
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
            cy.location('host').should('eq', 'teremok.ru');
            cy.location('pathname').should('eq', '/');
        });
    });

    context('Переход на другие адреса из хедера', () => {
        it('Ваше мнение', () => {
           cy.get('a[href="/forum/"]').should('exist').contains('ваше мнение').click();
           cy.location('pathname').should('eq', '/complain/');
        });

        it('Наше меню', () => {
            cy.get('a[href="/menu/"]').should('exist').contains('наше меню').click({force: true});
            cy.location('pathname').should('eq', '/menu/category/novinki/');
        });

        it.only('Акции', () => {
            cy.get('a[href="/action/"]').should('exist').contains('акции').click();
            cy.location('pathname').should('eq', '/action/');
        });

        it.only('Теремки', () => {
            cy.get('a[href="/places/"]').should('exist').contains('наши теремки').click();
            cy.location('pathname').should('eq', '/places/');
        });
    });
});