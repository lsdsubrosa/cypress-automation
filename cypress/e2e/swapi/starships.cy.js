import '@bahmutov/cy-api';

const baseUrl = 'https://swapi.py4e.com/api/';

describe('SWAPI. Starships', () => {
    beforeEach(() => {
       Cypress.config('baseUrl', baseUrl);
       cy.viewport(400, 600);
    });

    context('Response /starships', () => {
        it('status, body', () => {
            cy.request('/starships/').then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.results).length(10);
            });
        });
    });

    context('Starships data', () => {
        it('millennium data', () => {
            cy.request('/starships/10/').then((res) => {
                expect(Object.keys(res.body).length).to.eq(18);
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('model');
                expect(res.body).to.have.property('manufacturer');
                expect(res.body).to.have.property('crew');
                expect(res.body).to.have.property('cargo_capacity');
                expect(res.body).to.have.property('hyperdrive_rating');

                expect(res.body.name).to.be.a('string');
                expect(res.body.model).to.be.a('string');
                expect(res.body.manufacturer).to.be.a('string');
                expect(res.body.cargo_capacity).to.be.a('string');
                expect(res.body.hyperdrive_rating).to.be.a('string');


                expect(res.body.name).to.eq('Millennium Falcon');
                expect(res.body.name).length(17);

                expect(res.body.model).contains('YT-1300');
                expect(res.body.manufacturer).contains('Corellian');
                expect(res.body.cargo_capacity).to.eq('100000');
                expect(res.body.hyperdrive_rating).to.eq('0.5');
            });
        });
    });

    context('cy-api', () => {
        it('render body', () => {
            cy.api({
                method: 'GET',
                url: '/starships/10/'
            });
        });
    });
});