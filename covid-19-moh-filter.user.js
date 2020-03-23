// ==UserScript==
// @name         COVID-19 MoH Table Filter (NZ)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make the NZ current cases table filterable.
// @author       You
// @match        https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-cases
// @downloadURL  https://github.com/finnito/nz-covid-19-cases-table-filter/raw/master/covid-19-moh-filter.user.js
// @updateURL    https://github.com/finnito/nz-covid-19-cases-table-filter/raw/master/covid-19-moh-filter.user.js
// @require      https://code.jquery.com/jquery-3.4.1.slim.min.js
// @require      https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js
// @grant        none
// ==/UserScript==

/*global $ */

(function () {
    'use strict';

    var places = {},
        ages = {},
        sexes = {};

    var table = document.querySelector(".table-style-two"),
        i,
        row,
        place,
        age,
        sex;
    for (i = 1; i < table.rows.length; i += 1) {
        row = table.rows[i];
        place = row.children[1].innerText.replace(/\s/g, '');
        age = row.children[2].innerText.replace(/\s/g, '');
        sex = row.children[3].innerText.replace(/\s/g, '');

        if (sex === "F") {
            sex = "Female";
        }

        if (sex === "M") {
            sex = "Male";
        }

        if (sex === "") {
            sex = "Unknown";
        }
        row.classList.add(place);
        row.classList.add("age-" + age);
        row.classList.add("sex-" + sex);
        if (!places.hasOwnProperty(place)) {
            places[place] = 1;
        } else {
            places[place] += 1;
        }

        if (!ages.hasOwnProperty(age)) {
            ages[age] = 1;
        } else {
            ages[age] += 1;
        }

        if (!sexes.hasOwnProperty(sex)) {
            sexes[sex] = 1;
        } else {
            sexes[sex] += 1;
        }
    }

    console.log(sexes);

    var totalCases = 0;

    for (prop in places) {
        if (Object.prototype.hasOwnProperty.call(places, prop)) {
            totalCases += places[prop];
        }
    }

    var orderedPlaces = [], p;
    for (place in places) {
        if (places.hasOwnProperty(place)) {
            orderedPlaces.push(place);
        }
    }
    orderedPlaces.sort();

    // Place Filters
    var placeFilterButtons = "",
        prop,
        placeFilter = document.createElement('div');
    placeFilterButtons += '<div class="button-group filter-button-group"><p>Filter by Location</p>';
    placeFilterButtons += '<button data-filter="*">All (' + totalCases + ')</button>';
    for (p = 0; p < orderedPlaces.length; p += 1) {
    //for (prop in places)
        //if (Object.prototype.hasOwnProperty.call(places, prop)) {
            placeFilterButtons += '<button data-filter=".' + orderedPlaces[p] + '">' + orderedPlaces[p] + ' (' + places[orderedPlaces[p]] + ')</button>';
        //}
    }
    placeFilter.innerHTML = placeFilterButtons;
    document.querySelector(".field-item").append(placeFilter);


    // Age Filters
    var ageFilterButtons = "",
        ageFilter = document.createElement('div');
    ageFilterButtons += '<div class="button-group filter-button-group"><p>Filter by Age</p>';
    ageFilterButtons += '<button data-filter="*">All (' + totalCases + ')</button>';
    for (prop in ages) {
        if (Object.prototype.hasOwnProperty.call(ages, prop)) {
            ageFilterButtons += '<button data-filter=".age-' + prop + '">' + prop + ' (' + ages[prop] + ')</button>';
        }
    }
    ageFilter.innerHTML = ageFilterButtons;
    document.querySelector(".field-item").append(ageFilter);


    // Sex Filters
    var sexFilterButtons = "",
        sexFilter = document.createElement('div');
    sexFilterButtons += '<div class="button-group filter-button-group"><p>Filter by Sex</p>';
    sexFilterButtons += '<button data-filter="*">All (' + totalCases + ')</button>';
    for (prop in sexes) {
        if (Object.prototype.hasOwnProperty.call(sexes, prop)) {
            sexFilterButtons += '<button data-filter=".sex-' + prop + '">' + prop + ' (' + sexes[prop] + ')</button>';
        }
    }
    sexFilter.innerHTML = sexFilterButtons;
    document.querySelector(".field-item").append(sexFilter);

    var grid = $('.table-style-two').isotope({
        itemSelector: 'tr',
        layoutMode: 'fitRows'
    });
    // filter items on button click
    $('.filter-button-group').on('click', 'button', function () {
        var filterValue = $(this).attr('data-filter');
        grid.isotope({filter: filterValue});
    });

    var style = '<style>' +
            'tr { display: flex; width: 100%; }' +
            'td:nth-child(1), td:nth-child(3),' +
            'th:nth-child(1), th:nth-child(3) {' +
            '    width: 5rem' +
            '}' +
            'td:nth-child(2), th:nth-child(2), td:nth-child(4), th:nth-child(4) {' +
            '    width: 7.5rem' +
            '}' +
            'td:last-child, th:last-child { flex-grow: 2; max-widtH: calc(100% - 10rem - 15rem); }' +
            '.filter-button-group > p {font-weight: 900; margin-bottom: 0; }' +
            '</style>';
    $('head').append(style);

    grid.isotope();
})();