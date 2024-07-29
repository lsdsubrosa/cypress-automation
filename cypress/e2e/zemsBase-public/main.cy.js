// import 'cypress-real-events/support'; // realHover

const baseUrl = 'https://zemsbaza.ru/'; // объект тестирования

// наименования категорий, которые должны быть на момент 07.2024
const catalogItemName = [
    'Окна и остекление', 'Кухни и мебель', 'Натяжные потолки', 'Электрика и электромонтаж',
    'Полы и покрытия', 'Сантехника и отопление', 'Кондиционеры и вентиляция', 'Плитка и керамогранит',
    'Стены и покрытия', 'Двери и перегородки', 'Свет и освещение', 'Декор и аксессуары',
    'Другие услуги'
];

// наименования иконок, которые должны быть на момент 07.2024
const catalogItemIcons = [
    '#window', '#kitchen', '#roof', '#electric',
    '#floor', '#plumbing', '#vent', '#tile',
    '#walls', '#door', '#light', '#decor', '#legal'
];

// ссылки оферов, которые должны быть на момент 07.2024
const offersItemHrefs = [
    ['/catalog/windows/4', '/catalog/windows/36', '/catalog/windows/42'],
    ['/catalog/kitchens/39', '/catalog/kitchens/17', '/catalog/kitchens/74'],
    ['/catalog/roofs/44', '/catalog/roofs/60', '/catalog/roofs/54'],
    ['/catalog/electrics/21', '/catalog/electrics/30', '/catalog/electrics/31', '/catalog/electrics/26', '/catalog/electrics/29'],
    ['/catalog/floors/25', '/catalog/floors/19', '/catalog/floors/24', '/catalog/floors/18'],
    ['/catalog/plumbing/33', '/catalog/plumbing/27', '/catalog/plumbing/16', '/catalog/plumbing/7', '/catalog/plumbing/6', '/catalog/plumbing/64'],
    ['/catalog/vent/66'],
    ['/catalog/tile/28', '/catalog/tile/38'],
    ['/catalog/walls/37', '/catalog/walls/65'],
    ['/catalog/doors/22', '/catalog/doors/69', '/catalog/doors/5'],
    ['/catalog/lights/63', '/catalog/lights/20'],
    ['/catalog/decor/41', '/catalog/decor/68'],
    ['/catalog/legal/72', '/catalog/legal/62', '/catalog/legal/70']
];

// функция возвращает координаты элемента
function getElementCoordinates(selector) {
    return cy.get(selector).then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        return rect.top;
    });
}

// функция для преобразования rgb в hex
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g).map(Number);
    return '#' + rgbValues.map((val) => {
        return ('0' + val.toString(16)).slice(-2);
    }).join('').toUpperCase();
}

// функция для генерации случайного индекса
function getRandomIndex(max) {
    // генерируем случайное число от 0 до max
    return Math.floor(Math.random() * max);
}

describe('Zemsbaza. Публичка. Проверяем главную и смежные страницы', () => {
    // перед каждым запросом выполняем следующее:
    beforeEach('настройка адреса и размера экрана', () => {
        cy.visit(baseUrl); // посещаем этот url
        cy.viewport(1920, 1080); // в fullHD
    });

    context('Статус ответа и путь', () => {
        it('код 200', () => {
            cy.request('/').then((res) => {
                cy.expect(res.status).eq(200);
            });
        });

        it('путь корректный', () => {
            cy.location('host').should('eq', 'zemsbaza.ru');
            cy.location('pathname').should('eq', '/');
        });
    }); // context "Статус ответа и путь"

    context('Главная страница', () => {
        // реализовал через сравнение координат
        it('ZBPUBLIC-2. Хэдер главной страницы не фиксирован при прокрутке', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // получаем координаты хедера до прокрутки страницы
            getElementCoordinates('.header').then((positionBefore) => {
                cy.scrollTo('bottom'); // прокручиваем страницу вниз до конца
                cy.wait(500);

                // получаем координаты хедера после прокрутки
                getElementCoordinates('.header').then((positionAfter) => {
                    // преобразуем координаты в абсолютные значения, чтобы убрать минус
                    const absPositionBefore = Math.abs(positionBefore);
                    const absPositionAfter = Math.abs(positionAfter);

                    // сравниваем координаты
                    expect(absPositionBefore).to.be.lessThan(absPositionAfter);
                });
            });
        });

        it('ZBPUBLIC-3. Переход на главную по клику на логотип', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            cy.get('a[href="/catalog/kitchens/39"]').should('exist').click(); // переходим на первый офер
            cy.location('pathname').should('eq', '/catalog/kitchens/39'); // сравниваем путь

            cy.wait(1000); // ожидаем полной загрузки офера

            cy.get('.logo').should('exist').click(); // кликаем на логотип

            cy.wait(500); // на всякий случай

            cy.location('pathname').should('eq', '/'); // сравниваем путь
        });

        it('ZBPUBLIC-97. Открытие модалки по кнопке "гарантия 100% на все работы"', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            cy.get('.guarantee').should('exist').click(); // нажимаем на кнопку
            cy.get('.popup__wrap').should('exist'); // проверяем, что модальное окно появилось
            cy.get('.popup__text').should('exist').contains('Проверенные подрядчики с гарантией');
        });

        it('ZBPUBLIC-4. Псевдоссылка геолокации', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            cy.get('.city-changer__tooltip-btn').should('exist').click(); // нажимаем на геолокацию

            // проверка цвета не работает
            // cy.get('.city-changer__tooltip-btn').should('have.css', 'color', 'rgb(236, 182, 62)');

            cy.get('.city-changer__tooltip-btn').should('have.css', 'color').then((color) => {
                const hexColor = rgbToHex(color);
                expect(hexColor).to.equal('#ECB63E'); // медово-горчичный из макета
            });

            cy.get('.txt').should('exist').contains(' На данный момент мы работаем');
        });

        it('ZBPUBLIC-9. Псевдоссылка в хедере "О проекте"', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // не работает, даже с realHover()
            /* cy.get('.links a:eq(1)').trigger('mouseover').should('have.css', 'color').then((color) => {
                const hexColor = rgbToHex(color);
                expect(hexColor).to.equal('#ECB63E');
            }); */

            cy.get('.links a:first').should('exist').should('have.text', 'о проекте').click();
            cy.get('.popup__wrap').should('exist');
            cy.get('.popup__text').should('exist').contains('Проверенные подрядчики с гарантией');

            // получаем координаты крестика до прокрутки модального окна
            getElementCoordinates('.popup__close').then((positionBefore) => {
                cy.get('.popup__wrap > .footer').scrollIntoView();

                // получаем координаты крестика после прокрутки модального окна
                getElementCoordinates('.popup__close').then((positionAfter) => {
                    // преобразуем координаты в абсолютные значения, чтобы убрать минус
                    const absPositionBefore = Math.abs(positionBefore);
                    const absPositionAfter = Math.abs(positionAfter);

                    expect(absPositionBefore).to.be.eq(absPositionAfter); // сравниваем координаты
                });
            });
        });

        it('ZBPUBLIC-10. Псевдоссылка в хедере "Контакты"', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // не работает, даже с realHover()
            /* cy.get('.links a:eq(1)').trigger('mouseover').should('have.css', 'color').then((color) => {
                const hexColor = rgbToHex(color);
                expect(hexColor).to.equal('#ECB63E');
            }); */

            cy.get('.links a:eq(1)').should('exist').should('have.text', 'контакты').click();
            cy.get('.popup__wrap').should('exist');
            cy.get('.popup__text').should('exist').contains('Контактная информация');

            // получаем координаты крестика до прокрутки модального окна
            getElementCoordinates('.popup__close').then((positionBefore) => {
                cy.get('.popup__wrap > .footer').scrollIntoView();

                // получаем координаты крестика после прокрутки модального окна
                getElementCoordinates('.popup__close').then((positionAfter) => {
                    expect(positionBefore).to.be.eq(positionAfter); // сравниваем координаты
                });
            });
        });

        it('ZBPUBLIC-27. Псевдоссылка в футере "Договор оферты"', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // не работает, даже с realHover()
            /* cy.get('.l a:eq(1)').trigger('mouseover').should('have.css', 'color').then((color) => {
                const hexColor = rgbToHex(color);
                expect(hexColor).to.equal('#939393');
            }); */

            cy.get('.l a:eq(1)').should('exist').should('have.text', ' Договор оферты ').click();
            cy.get('.popup__wrap').should('exist');
            cy.get('.popup__text').should('exist').contains(' Договор оферты ');

            // получаем координаты крестика до прокрутки модального окна
            getElementCoordinates('.popup__close').then((positionBefore) => {
                cy.get('.popup__wrap > .footer').scrollIntoView();

                // получаем координаты крестика после прокрутки модального окна
                getElementCoordinates('.popup__close').then((positionAfter) => {
                    expect(positionBefore).to.be.eq(positionAfter); // сравниваем координаты
                });
            });
        });
        it('ZBPUBLIC-99. Псевдоссылка в футере "Политика обработки персональных данных"', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // не работает, даже с realHover()
            /* cy.get('.l a:eq(1)').trigger('mouseover').should('have.css', 'color').then((color) => {
                const hexColor = rgbToHex(color);
                expect(hexColor).to.equal('#939393');
            }); */

            cy.get('.l a:eq(2)').should('exist').should('have.text', ' Политика обработки персональных данных ').click();
            cy.get('.popup__wrap').should('exist');
            cy.get('.popup__text').should('exist').contains(' политика обработки персональных данных ');

            // получаем координаты крестика до прокрутки модального окна
            getElementCoordinates('.popup__close').then((positionBefore) => {
                cy.get('.popup__wrap > .footer').scrollIntoView();

                // получаем координаты крестика после прокрутки модального окна
                getElementCoordinates('.popup__close').then((positionAfter) => {
                    expect(positionBefore).to.be.eq(positionAfter); // сравниваем координаты
                });
            });
        });

        it('ZBPUBLIC-34. Заглушка 404 на несуществующий офер', () => {
            cy.on('uncaught:exception', () => false); // игнорируем ошибки в консоли

            cy.visit('https://zemsbaza.ru/catalog/kitchens/9999'); // несуществующий id офера
            cy.wait(1500); // ожидаем полной загрузки страницы

            cy.location('pathname').should('eq', '/404page'); // сравниваем путь
            cy.get('.title').should('exist').contains(' 404 ');
            cy.get('.subtitle').should('exist').contains(' Страница не найдена ');

            cy.request('/catalog/kitchens/9999').then((res) => {
                cy.expect(res.status).eq(200); // статус должен быть равен 200
            });

            cy.get('.go-main').should('exist').click(); // переход на главную
            cy.location('pathname').should('eq', '/'); // сравниваем путь
        });

        it('ZBPUBLIC-100. Заглушка 404 на неопубликованный офер', () => {
            cy.on('uncaught:exception', () => false); // игнорируем ошибки в консоли

            cy.visit('https://zemsbaza.ru/catalog/decor/61'); // неопубликованный id офера
            cy.wait(1500); // ожидаем полной загрузки страницы

            cy.location('pathname').should('eq', '/404page'); // сравниваем путь
            cy.get('.title').should('exist').contains(' 404 ');
            cy.get('.subtitle').should('exist').contains(' Страница не найдена ');

            cy.request('/catalog/kitchens/9999').then((res) => {
                cy.expect(res.status).eq(200); // статус должен быть равен 200
            });

            cy.get('.go-main').should('exist').click(); // переход на главную
            cy.location('pathname').should('eq', '/'); // сравниваем путь
        });
    }); // context "Главная страница"

    context('Каталог. Оферы', () => {
        it('ZBPUBLIC-17. Выбор категории каталога. Подсчёт оферов', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // проходим по каждой категории и проверяем её данные
            cy.get('.catalog__item')
                .should('have.length', catalogItemName.length).each(($el, index) => {
                const categoryName = catalogItemName[index]; // берём название категории из массива
                const categoryIcon = catalogItemIcons[index]; // берём название иконки из массива
                const offerHrefs = offersItemHrefs[index]; // берём ссылки из массива

                // кол-во оферов выбранной категории, которое отображается в каталоге (сбоку справа)
                const offersCountInCategory = cy.get('.catalog__item').find('.count');

                // перед нажатием на категорию должна быть соответсвующая выбранной категории иконка
                cy.wrap($el).find('svg use')
                    .should('have.attr', 'xlink:href', `/img/sprite.0f225fd1.svg${categoryIcon}`);
                // проверка наименования категории и переход на категорию
                cy.wrap($el).find('.name').should('contain', categoryName).click();

                // проверяем цвет активной категории (контейнер надписи)
                // (НЕ РАБОТАЕТ, находит #00000000)
                /* cy.get('#windows > .name-wrapper').should('exist')
                    .should('have.css', 'background-color').then((backgroundColor) => {
                    const hexColor = rgbToHex(backgroundColor);
                    expect(hexColor).to.equal('#ECB63E'); // медово-горчичный из макета
                }); */

                // проверяем цвет активной категории (контейнер иконки)
                // (НЕ РАБОТАЕТ, находит #00000000)
                /* cy.get('#windows > .icon').should('exist')
                    .should('have.css', 'background-color').then((backgroundColor) => {
                    const hexColor = rgbToHex(backgroundColor);
                    expect(hexColor).to.equal('#ECB63E'); // медово-горчичный из макета
                }); */

                // после перехода на категорию иконка меняется на "стрелку", проверяем это
                cy.get('#windows > .icon > .arrow').should('exist');

                cy.wait(500); // ожидаем, пока загрузятся оферы выбранной категории

                // далее проверяем оферы
                cy.get('.offers__item').then($offers => {
                    // берём значение загруженных оферов и
                    // сравниваем с изначальным значением (offersCountInCategory)
                    console.assert($offers.length === offersCountInCategory);

                    // каждая карточка(офер) принадлежит выбранной категории,
                    // то есть имеет соответсвующую ссылку,
                    // а вместо перехода по оферу проверяем его href
                    cy.get('.offers__item a').each(($offer, i) => {
                        cy.wrap($offer).should('have.attr', 'href', offerHrefs[i]);
                    });
                });
                // далее переходим к следующей категории
            });
        });
    }); // context "Каталог. Оферы"

    context('Карточка офера', () => {
        it('ZBPUBLIC-26. Корректное отображение карточки всех оферов', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                // используем случайное число для выбора офера и извлекаем его название
                cy.get('h3.title').eq(randomIndex).invoke('text').then(text => {
                    cy.wrap(text).as('offerTitleText'); // и сохраняем в alias
                });

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // извлекаем текст заголовка карточки для сравнения
                cy.get('h1').invoke('text').then(headerText => {
                    // берём alias
                    cy.get('@offerTitleText').then(offerTitleText => {
                        // и сравниваем с заголовком карточки
                        expect(headerText).to.equal(offerTitleText);
                    });
                });
                // кнопка оставить заявку на месте, нажимаем
                cy.get('.info > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                // появляется модальное окно для заявки
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку');
            });
        });
    }); // context "Карточка офера"

    context('Деталка офера', () => {
        it('ZBPUBLIC-36. Хэдер карточки офера фиксирован при прокрутке', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы
            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // получаем координаты хедера карточки до прокрутки страницы
                getElementCoordinates('.--detail-header').then((positionBefore) => {
                    cy.scrollTo('bottom'); // прокручиваем страницу вниз до конца
                    cy.wait(500);

                    // получаем координаты хедера карточки после прокрутки
                    getElementCoordinates('.--detail-header').then((positionAfter) => {
                        // преобразуем координаты в абсолютные значения, чтобы убрать минус
                        const absPositionBefore = Math.abs(positionBefore);
                        const absPositionAfter = Math.abs(positionAfter);

                        // сравниваем координаты
                        expect(absPositionBefore).to.be.eq(absPositionAfter);
                    });
                });
            });
        });

        it('ZBPUBLIC-39. Карточка офера. Кнопки "Оставить заявку" отображаются корректно', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы
            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // кнопки оставить заявку, после клика открывается модальное окно
                // в хэдере
                cy.get('.r > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно
                cy.get('.popup__close').click(); // закрываем модальное окно

                // в сабхэдере
                cy.get('.info > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно
                cy.get('.popup__close').click(); // закрываем модальное окно

                // внизу
                cy.get('.inner-wrapper > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.wait(1000); // ожидаем полной загрузки карточки офера
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно
            });
        });

        it('ZBPUBLIC-46. Карточка офера. Кнопки "Оставить заявку" отображаются корректно', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы
            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                cy.get('.offer-detail__contractor > a').should('exist').click(); // подрядчик
                cy.get('p > a').should('exist').click(); // сайт подрядчика
                cy.wait(500); // ожидаем полной загрузки модального окна
                cy.get('.popup__header > h2').should('exist').contains('Внимание!'); // модальное окно
                // Проверяем статус ответа сайта подрядчика
                cy.get('.popup__text > .btn').should('exist').invoke('attr', 'href').then(href => {
                    cy.request(href).then((res) => {
                        cy.expect(res.status).eq(200);
                    });
                });
            });
        });

        it('ZBPUBLIC-61. Порядок блоков в карточке офера', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // проверка всех блоков и их содержимого
                cy.get('.--detail-header').should('exist');
                cy.get('.info').should('exist');
                cy.get('h1').should('exist');
                cy.get('.offer-detail__description > p').should('exist');

                // блок "Бонусов"
                cy.get('.offer-detail__presents').within(() => {
                    cy.get('h2').contains('БОНУСЫ ОТ zemsbaza.RU').should('exist');
                    cy.get('ul > li').should('have.length', 4);
                });

                // блок "Описание партнёра"
                cy.get(':nth-child(3) > .inner-wrapper').within(() => {
                    cy.get('h2').contains('Описание ПАРТНЁРА').should('exist');
                    cy.get('p').should('exist');
                });

                // блок "Портфолио"
                cy.get(':nth-child(4) > .inner-wrapper').within(() => {
                    cy.get('h2').contains('Портфолио').should('exist');
                    cy.get('.image').should('have.length', 4);
                    cy.get('.thumb__overlay').should('exist');
                });

                // блок "Преимущества"
                cy.get(':nth-child(5) > .inner-wrapper').within(() => {
                    cy.get('h2').contains('ПРЕИМУЩЕСТВА ПАРТНЁРА').should('exist');
                    cy.get('ul').should('exist'); // Прокомментировано, так как не используется
                });

                // блок "Цены"
                cy.get(':nth-child(6) > .inner-wrapper').within(() => {
                    cy.get('h2').contains('Цены').should('exist');
                    cy.get('.name').should('exist');
                });

                // блок "Как оформить"
                cy.get('.--how-to-order').within(() => {
                    cy.get('h2').contains('Как оформить заказ?').should('exist');
                    cy.get('span').eq(0).contains('Нажмите на кнопку «Оставить заявку», а затем укажите имя и номер телефона').should('exist');
                    cy.get('span').eq(1).contains('Наш партнёр сам с вами свяжется, проконсультирует и поможет оформить заказ').should('exist');
                    cy.get('span').eq(2).contains('Время работы партнёра').should('exist');
                    cy.get('span').eq(4).contains('Реквизиты партнёра').should('exist');
                });

                cy.get('.footer').should('exist');
            });
        });
    }); // context "Деталка офера"

    context('Оформление заявки', () => {
        it('ZBPUBLIC-64. Шапка и крестик не фиксированы в модальном окне заявки', () => {
            cy.viewport(1000, 660); // меняем масштаб, чтобы точно прокрутить модальное окно

            cy.wait(1500); // ожидаем полной загрузки страницы

            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // кнопки оставить заявку, после клика открывается модальное окно
                // в хэдере
                cy.get('.r > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно
                // получаем координаты хедера до прокрутки страницы
                getElementCoordinates('.popup__close').then((positionBefore) => {
                    cy.get('.text-center > .btn').scrollIntoView(); // прокручиваем вниз до конца
                    cy.wait(500);

                    // получаем координаты хедера после прокрутки
                    getElementCoordinates('.popup__close').then((positionAfter) => {
                        // преобразуем координаты в абсолютные значения, чтобы убрать минус
                        const absPositionBefore = Math.abs(positionBefore);
                        const absPositionAfter = Math.abs(positionAfter);

                        // сравниваем координаты
                        expect(absPositionBefore).to.be.lessThan(absPositionAfter);
                    });
                });
                cy.get('.popup__close').click(); // закрываем модальное окно

                // в сабхэдере
                cy.get('.info > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно
                getElementCoordinates('.popup__close').then((positionBefore) => {
                    cy.get('.text-center > .btn').scrollIntoView(); // прокручиваем вниз до конца
                    cy.wait(500);

                    // получаем координаты хедера после прокрутки
                    getElementCoordinates('.popup__close').then((positionAfter) => {
                        // преобразуем координаты в абсолютные значения, чтобы убрать минус
                        const absPositionBefore = Math.abs(positionBefore);
                        const absPositionAfter = Math.abs(positionAfter);

                        // сравниваем координаты
                        expect(absPositionBefore).to.be.lessThan(absPositionAfter);
                    });
                });
                cy.get('.popup__close').click(); // закрываем модальное окно

                // внизу
                cy.get('.inner-wrapper > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.wait(1000); // ожидаем полной загрузки карточки офера
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно
                getElementCoordinates('.popup__close').then((positionBefore) => {
                    cy.get('.text-center > .btn').scrollIntoView(); // прокручиваем вниз до конца
                    cy.wait(500);

                    // получаем координаты хедера после прокрутки
                    getElementCoordinates('.popup__close').then((positionAfter) => {
                        // преобразуем координаты в абсолютные значения, чтобы убрать минус
                        const absPositionBefore = Math.abs(positionBefore);
                        const absPositionAfter = Math.abs(positionAfter);

                        // сравниваем координаты
                        expect(absPositionBefore).to.be.lessThan(absPositionAfter);
                    });
                });
            });
        });

        it('ZBPUBLIC-65. Название офера в карточке и на странице офера', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                // КОПИЯ ZBPUBLIC-26
                // используем случайное число для выбора офера и извлекаем его название
                cy.get('h3.title').eq(randomIndex).invoke('text').then(text => {
                    cy.wrap(text).as('offerTitleText'); // и сохраняем в alias
                });

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // извлекаем текст заголовка карточки для сравнения
                cy.get('h1').invoke('text').then(headerText => {
                    // берём alias
                    cy.get('@offerTitleText').then(offerTitleText => {
                        // и сравниваем с заголовком карточки
                        expect(headerText).to.equal(offerTitleText);
                    });
                });
            });
        });

        it('ZBPUBLIC-66. Обязательность полей в модальном окне заявки', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // кнопка "оставить заявку"
                cy.get('.r > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно

                // классы обязательных полей до отправки
                cy.get('.inp-s-wrap.full').should('exist'); // ФИО
                cy.get('.inp-s-wrap.full.phone-field').should('exist'); // телефон
                cy.get('.check-item.checkbox-agree').should('exist'); // чекбокс

                cy.get('.text-center > .btn').click(); // отправляем пустую заявку

                // после
                cy.get('.inp-s-wrap.full.error').should('exist'); // ФИО
                cy.get('.inp-s-wrap.full.error.phone-field').should('exist'); // телефон
                cy.get('.check-item.checkbox-agree > input[class="error"]').should('exist'); // чекбокс
            });
        });

        it('ZBPUBLIC-98. Блок "Выберете местоположение"', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // кнопка "оставить заявку"
                cy.get('.r > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно

                cy.get('.text-center').should('exist'); // блок с чекбоксом и кнопкой отправки

                // блок "недоступный регион" отсутствует
                cy.get('.unavailable-region').should('not.exist');

                // выбираем "Другой регион"
                cy.get('label[for="region-radio2"]').should('exist').click();

                // блок с чекбоксом и кнопкой отправки отсутствует
                cy.get('.text-center').should('not.exist');

                // блок "недоступный регион" присутствует
                cy.get('.unavailable-region').should('exist')
                    .contains('К сожалению, проект ЗемсБаза работает только в Москве и МО');
            });
        });

        it('ZBPUBLIC-67. Валидация ФИО', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // кнопка "оставить заявку"
                cy.get('.r > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно

                // функция для проверки поля ФИО
                const checkNameField = (value, expectedLength, shouldError = false) => {
                    const nameField = cy.get('.form .inp-s-wrap.full > input[type="text"]').first();
                    nameField.should('exist').clear().type(value);
                    nameField.invoke('val').then(val => {
                        expect(val.length).to.be.eq(expectedLength);
                    });

                    cy.get('.text-center > .btn').click(); // отправляем заявку

                    if (shouldError) {
                        cy.get('.inp-s-wrap.full.error').should('exist'); // класс ФИО с ошибкой
                    } else {
                        cy.get('.inp-s-wrap.full').should('exist'); // класс ФИО без ошибок
                    }
                };

                // проверка поля ФИО
                checkNameField('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 50);
                checkNameField('8978975641651897', 16);
                checkNameField(':?%"!;(*!"?(;"!*_', 17);

                // проверка пустого поля ФИО
                const nameFieldContainer = cy.get('.form .inp-s-wrap.full').first();
                nameFieldContainer.find('input[type="text"]').clear(); // очищаем поле
                cy.get('.text-center > .btn').click(); // отправляем заявку

                // делаем проверку так, иначе ищет класс ошибки у кнопки
                cy.get('.form .inp-s-wrap.full').first().should('have.class', 'error');
            });
        });

        it('ZBPUBLIC-69. Валидация телефона', () => {
            cy.wait(1500); // ожидаем полной загрузки страницы

            // ищем все оферы, считаем их количество и генерируем случайный индекс
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);

                cy.get('.offers__item').eq(randomIndex).click(); // переходим по случайному оферу
                cy.wait(1000); // ожидаем полной загрузки карточки офера

                // кнопка "оставить заявку"
                cy.get('.r > .btn').should('exist').contains('ОСТАВИТЬ ЗАЯВКУ').click();
                cy.get('.popup__wrap').should('exist').contains('Оставить заявку'); // модальное окно

                // функция для проверки поля телефон
                const checkPhoneField = (value, expectedLength, shouldError = false) => {
                    const phoneField = cy.get('input[type="tel"]');
                    phoneField.should('exist').clear().type(value);
                    phoneField.invoke('val').then(val => {
                        expect(val.length).to.be.eq(expectedLength);
                    });

                    cy.get('.text-center > .btn').click(); // отправляем заявку

                    if (shouldError) {
                        phoneField.should('have.class', 'error'); // класс телефона с ошибкой
                    } else {
                        phoneField.should('not.have.class', 'error'); // класс телефона без ошибок
                    }
                };

                // проверка поля телефон (символы формата поля тоже ожидаются в количестве +7 () - -)
                checkPhoneField('1234567890', 16);
                checkPhoneField('abcd', 0); // буквы не вводятся
                checkPhoneField('12345678901234567890', 16);

                // проверка пустого поля телефон
                const phoneContainer = cy.get('.inp-s-wrap.full.phone-field');
                phoneContainer.clear(); // очищаем поле
                cy.get('.text-center > .btn').click(); // отправляем заявку

                // делаем проверку так, иначе ищет класс ошибки у кнопки
                cy.get('.inp-s-wrap.full.phone-field').should('have.class', 'error');
            });
        });

        it('ZBPUBLIC-70. Валидация чекбокса', () => {
            // ожидаем полной загрузки страницы и получения оферов
            cy.wait(1500);

            // выбираем случайный офер и переходим к его карточке
            cy.get('.offers__item').its('length').then(numberOfOffers => {
                const randomIndex = getRandomIndex(numberOfOffers);
                cy.get('.offers__item').eq(randomIndex).click();
            });

            // ожидаем загрузки карточки офера и кликаем по кнопке "Оставить заявку"
            cy.get('.r > .btn').should('contain', 'ОСТАВИТЬ ЗАЯВКУ').click();
            cy.get('.popup__wrap').should('contain', 'Оставить заявку');

            // определяем чекбокс и кнопку отправки заявки
            const checkbox = cy.get('input[type="checkbox"]').should('exist');
            const submitButton = cy.get('.text-center > .btn');

            // проверяем, что чекбокс без ошибок, когда он отмечен
            checkbox.check({force: true});
            submitButton.click();
            cy.get('input[type="checkbox"]').should('not.have.class', 'error');

            // проверяем, что чекбокс с ошибкой, когда он не отмечен
            checkbox.uncheck({force: true});
            submitButton.click();
            cy.get('input[type="checkbox"]').should('have.class', 'error'); // чекбокс с ошибкой
        });

    }); // context "Оформление заявки"
}); // describe

// запустить в режиме терминала
// посмотреть про Jenkins