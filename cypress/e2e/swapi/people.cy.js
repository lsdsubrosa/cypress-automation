import '@bahmutov/cy-api';

const baseUrl = 'https://swapi.py4e.com/api/';

describe('SWAPI. People', () => {
    beforeEach(() => {
        Cypress.config('baseUrl', baseUrl);
        cy.viewport(400, 600);
    });

    context('Response /people', () => {
        it('status, body', () => {
            cy.request('/people/').then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.results).length(10);
            });
        });
    });

    context('People data', () => {
        it('c-3po data', () => {
            cy.request('/people/2/').then((res) => {
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('height');
                expect(res.body).to.have.property('mass');

                expect(res.body.name).to.be.a('string');
                expect(res.body.name).to.eq('C-3PO');
                expect(res.body.name).length(5);

                expect(res.body.height).to.be.a('string');
                expect(res.body.height).contains('167');

                expect(res.body.mass).to.be.a('string');
                expect(res.body.mass).contains('75');
            });
        });
    });

    context('cy-api', () => {
        it('render body', () => {
            cy.api({
                method: 'GET',
                url: '/people/2'
            });
        });
    });
});