describe('Отправка открытки', () => {
    beforeEach(() => {
        cy.visit('https://kot.qa.studio/kot/edu/postcard/c28db484-454f-4450-bb46-60eddca1ebba/');
    });

    context('Главная страница', () => {
        it('путь корректный', () => {
           cy.location('pathname').should('eq', '/kot/edu/postcard/c28db484-454f-4450-bb46-60eddca1ebba/');
        });

        it('текст заголовков корректный', () => {
            cy.get('h1').should('exist').contains('Форма отправки открытки с поздравлениями');
            cy.get('h2').eq(0).should('exist').contains('Email кому дарим');
            cy.get('h2').eq(1).should('exist').contains('Выберите открытку');
            cy.get('h2').eq(2).should('exist').contains('Или загрузите свою');
            cy.get('h2').eq(3).should('exist').contains('Сообщение');
        });

        it('кнопка', () => {
            cy.get('#send').should('exist').contains('Отправить');
        });
    });
});