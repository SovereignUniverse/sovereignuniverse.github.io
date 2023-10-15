var webapp = window.Telegram.WebApp;
webapp.expand();
var brandsTag = document.getElementById('brands');
var modelsTag = document.getElementById('models');
var yearsTag = document.getElementById('years');
var distanceTag = document.getElementById('distance');
var zipCodeTag = document.getElementById('zipCode');
var searchTag = document.getElementById('search');

function get_json(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest(); 
        xhr.open('GET', 'https://cors-anywhere.herokuapp.com/' + url, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject('ERROR');
            }
        };
        xhr.onerror = function() {
            reject('ERROR');
        };
        xhr.send();
    });
}

function fillSelectTag(selectTag, response) {
    while (selectTag.options.length > 1)
        selectTag.remove(1);
    
    response.forEach(element => {
        var option = document.createElement('option');
        option.value = element.id;
        option.text = element.name;
        selectTag.appendChild(option);
    });
}

get_json('https://www.picknpull.com/api/vehicle/makes')
    .then(function(response) {
        fillSelectTag(brandsTag, response);
    })
    .catch(function(error) {
        console.error('Ошибка:', error);
    });

brandsTag.addEventListener('change', function () {
    var selectedOption = brandsTag.options[brandsTag.selectedIndex];
    get_json('https://www.picknpull.com/api/vehicle/makes/' + selectedOption.value + '/models')
        .then(function(response) {
            fillSelectTag(modelsTag, response);
        })
        .catch(function(error) {
            console.error('Ошибка:', error);
        });
});

searchTag.addEventListener('click', function () {
    data = {
        'brand_id': brandsTag.options[brandsTag.selectedIndex].value,
        'model_id': modelsTag.options[modelsTag.selectedIndex].value,
        'years': yearsTag.value,
        'distance': distanceTag.value,
        'zip_code': zipCodeTag.value};
    webapp.sendData(data);
    webapp.close();
});
