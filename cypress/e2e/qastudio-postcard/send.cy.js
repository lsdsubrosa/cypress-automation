describe('Проверка сайта для поздравлений', () => {
    beforeEach(() => {
        cy.visit('https://kot.qa.studio/kot/edu/postcard/c28db484-454f-4450-bb46-60eddca1ebba/')
    })

    context('Отправка открытки', () => {
        // плавность добавлена для примера
        it('Валидная почта + открытка выбрана', () => {
            cy.get('#email')
                .scrollIntoView({duration: 500})
                .should('exist')
                .type('simple@example.com', { delay: 50 })
            cy.get(':nth-child(1) > .photo-input__photo')
                .scrollIntoView({duration: 500})
                .should('exist').click()
            cy.get('#send')
                .scrollIntoView({duration: 500})
                .should('exist').click()
            cy.get('.modal').should('exist')
            cy.get('#cross').should('exist').click()
        })

        it('Валидная почта + кастомная открытка выбрана', () => {
            cy.get('#email').should('exist').type('simple@example.com')
            cy.get('#file').should('exist')
                .selectFile('cypress/fixtures/postcard.png', { force: true})
            cy.get('img').eq(2).should('exist').click()
            cy.get('#send').should('exist').click()
            cy.get('.modal').should('exist')
            cy.get('#cross').should('exist').click()
        })

        it('Валидная почта + открытка не выбрана', () => {
            cy.get('#email').should('exist').type('simple@example.com')
            cy.get('#send').should('exist').click()
            cy.get('.modal').should('not.be.visible')
        })

        it('Невалидная почта + открытка выбрана', () => {
            cy.get('#email').should('exist').type('simple@example.')
            cy.get('#send').should('exist').click()
            cy.get('.modal').should('not.be.visible')
        })

        it('Пустая почта + открытка выбрана', () => {
            cy.get(':nth-child(2) > .photo-input__photo').click()
            cy.get('#send').should('exist').click()
            cy.get('.modal').should('not.be.visible')
        })
    })
})