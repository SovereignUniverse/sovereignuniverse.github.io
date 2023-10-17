var webapp = window.Telegram.WebApp;
var brandsTag = document.getElementById('brands');
var modelsTag = document.getElementById('models');
var yearsTag = document.getElementById('years');
var distanceTag = document.getElementById('distance');
var zipCodeTag = document.getElementById('zipCode');
var searchTag = document.getElementById('search');
var spanTag = document.getElementById('span');
webapp.expand();


function get_json(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest(); 
        xhr.open('GET', 'https://cors-anywhere.herokuapp.com/' + url, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                window.location.reload();
            }
        };
        xhr.onerror = function() {
            window.location.reload();
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
        window.location.reload();
    });

brandsTag.addEventListener('change', function () {
    var selectedOption = brandsTag.options[brandsTag.selectedIndex];
    get_json('https://www.picknpull.com/api/vehicle/makes/' + selectedOption.value + '/models')
        .then(function(response) {
            fillSelectTag(modelsTag, response);
        })
        .catch(function(error) {
            window.location.reload();
        });
});

function isFillTags() {
    if (brandsTag.options[brandsTag.selectedIndex].value !== '')
        if (modelsTag.options[modelsTag.selectedIndex].value !== '')
            if (yearsTag.value !== '')
                if (distanceTag.value !== '')
                    if (zipCodeTag.value !== '')
                        return true
    return false
}

searchTag.addEventListener('click', function () {
    if (isFillTags()) {
        data = {
            'brand_id': brandsTag.options[brandsTag.selectedIndex].value,
            'model_id': modelsTag.options[modelsTag.selectedIndex].value,
            'years': yearsTag.value,
            'distance': distanceTag.value,
            'zip_code': zipCodeTag.value};
    
        webapp.sendData(JSON.stringify(data));
        webapp.close();
    } else {
        spanTag.classList.remove('hide')
    }
});

distanceTag.addEventListener('input', function() {
    this.value = distanceTag.value.replace(/\s/g, '');
    if (this.value.startsWith('0') && this.value.length > 1)
        this.value = this.value.slice(1);
    if (this.value < 0)
        this.value = 0;
    if (this.value > 99999)
        this.value = 99999;
});

yearsTag.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9,-]/g, '');
    if (this.value.startsWith('0') && this.value.length > 1)
        this.value = this.value.slice(1);
    if (this.value.length > 22)
        this.value = this.value.slice(0, 22);
});

zipCodeTag.addEventListener('input', function() {
    this.value = this.value.replace(/\s/g, '');
    if (this.value.length > 8)
        this.value = this.value.slice(0, 8);
});