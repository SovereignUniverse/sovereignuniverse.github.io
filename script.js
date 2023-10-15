var webapp = window.Telegram.WebApp;
webapp.expand();
var brandsTag = document.getElementById('brands');
var modelsTag = document.getElementById('models');
var yearsTag = document.getElementById('years');
var distanceTag = document.getElementById('distance');
var zipCodeTag = document.getElementById('zipCode');
var searchTag = document.getElementById('search');

function get_json(url) {
    fetch('https://cors-anywhere.herokuapp.com/' + url).then(function(response) {
        if (response === 200) {
            return response.json();
        } else {
            // window.location.reload()
        }
    }).catch(function(error) {
        // window.location.reload()
    });
}

function fillSelectTag(selectTag, response) {
    response.forEach(element => {
        var option = document.createElement('option');
        option.value = element.id;
        option.text = element.name;
        selectTag.appendChild(option);
    });
}

fillSelectTag(brandsTag, get_json('https://www.picknpull.com/api/vehicle/makes'));


brandsTag.addEventListener('change', function() {
    var selectedOption = brandsTag.options[brandsTag.selectedIndex];
    var response = get_json('https://www.picknpull.com/api/vehicle/makes/${selectedOption.value}/models');
    fillSelectTag(modelsTag, response);
});

searchTag.addEventListener('click', function() {
    data = {'brand_id': brandsTag.options[brandsTag.selectedIndex].value, 
    'model_id': modelsTag.options[modelsTag.selectedIndex].value, 
    'years': yearsTag.value,
    'distance': distanceTag.value,
    'zip_code': zipCodeTag.value}
    webapp.sendData(data)
    webapp.close();
});