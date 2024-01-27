import '@bahmutov/cy-api'

const baseUrl = 'https://swapi.py4e.com/api/' // адрес апи

describe('SWAPI', () => {
    beforeEach(() => {
        Cypress.config('baseUrl', baseUrl) // добавляем адрес апи в конфиг
        cy.viewport(400, 600) // настраиваем размер экрана
    })

    // контейнер для планет
    context('planets data', () => {
        it('check response, body', () => {
            cy.request('/planets/').then((res) => {
                // console.log('отладка', res.body.results.length) // отладка в консоли
                expect(res.status).to.eq(200) // проверка статутса ответа
                expect(res.body.results).length(10) // проверка кол-ва планет
            })
        })

        it('tatooine data', () => {
            cy.request('GET', '/planets/1').then((res) => {
                // console.log('отладка', res.body.results[0]) // отладка в консоли
                expect(res.body).to.have.property('name')
                expect(res.body.name).to.be.a('string')
                expect(res.body.name).to.have.length(8)
                expect(res.body.name).to.eq('Tatooine')

                expect(res.body).to.have.property('diameter')
                expect(res.body.diameter).to.be.a('string')
                expect(res.body.diameter).to.eq('10465')

                expect(res.body.films).length(5)
                expect(res.body.films[3]).to.eq('https://swapi.py4e.com/api/films/5/')
            })
        })

        // плагин cy-api позволяет вывести тело ответа как в постмане или сделать POST запрос с телом
        it('planets response json', () => {
            cy.api({
                method: 'GET', // POST
                url: '/planets/1',
                // body: {planetName: 'planet1'} // пример как могло бы быть
            })
        })
    })
})