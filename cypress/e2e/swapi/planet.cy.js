import '@bahmutov/cy-api'

const baseUrl = 'https://swapi.py4e.com/api/'

describe('SWAPI. Check planets', () => {
    beforeEach(() => {
        Cypress.config('baseUrl', baseUrl)
        cy.viewport(400, 600)
    })

    // just for example
    context('Try create pre-request for some data', () => {
        it('find planet number', () => {
            cy.request('GET', '/planets/').then((res) => {
                const planetName = 'Endor'
                for (let c = 0; c <= res.body.results.length; c++) {
                    if (res.body.results[c].name === planetName) {
                        console.log(`${planetName} number is ${c}`)
                        return c // planet number
                    }
                }
            })
        })
    })

    context('Checking response of planets data', () => {
        it('check response, body', () => {
            cy.request('/planets/').then((res) => {
                expect(res.status).to.eq(200) // check HTTP status
                expect(res.body.results).length(10) // check quantity of planet
            })
        })
    })

    context('Planets data', () => {
        it('the Tatooine data', () => {
            cy.request('GET', '/planets/1').then((res) => {
                expect(Object.keys(res.body).length).to.eq(14) // check quantity of properties

                expect(res.body).to.have.property('name')
                expect(res.body).to.have.property('diameter')
                expect(res.body).to.have.property('films')

                expect(res.body.name).to.be.a('string')
                expect(res.body.name).to.have.length(8)
                expect(res.body.name).to.eq('Tatooine')

                expect(res.body.diameter).to.be.a('string')
                expect(res.body.diameter).to.eq('10465')

                expect(res.body.films).length(5)
                expect(res.body.films[3]).to.eq('https://swapi.py4e.com/api/films/5/')
            })
        })

        it('the Endor data', () => {
            cy.request('GET', '/planets/7').then((res) => {
                expect(Object.keys(res.body).length).to.eq(14)

                expect(res.body).to.have.property('name')
                expect(res.body).to.have.property('gravity')
                expect(res.body).to.have.property('surface_water')
                expect(res.body).to.have.property('population')

                expect(res.body.name).to.be.a('string')
                expect(res.body.name).to.eq('Endor')
                expect(res.body.name).to.have.length(5)

                expect(res.body.gravity).to.be.a('string')
                expect(res.body.gravity).contains('0.85')

                expect(res.body.surface_water).to.be.a('string')
                expect(res.body.surface_water).to.eq('8')

                expect(res.body.population).to.be.a('string')
                expect(res.body.population).to.eq('30000000')
            })
        })
    })

    context('Use cy-api package to render output where the web application', () => {
        it('planets data render', () => {
            cy.api({
                method: 'GET',
                url: '/planets/7'
            })
        })
    })
})