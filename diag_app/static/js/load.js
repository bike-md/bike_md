function getCookie(name) {
   var cookieValue = null;
   if (document.cookie && document.cookie !== '') {
       var cookies = document.cookie.split(';');
       for (var i = 0; i < cookies.length; i++) {
           var cookie = jQuery.trim(cookies[i]);
           if (cookie.substring(0, name.length + 1) === (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
           }
       }
   }
   return cookieValue;
}


var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
   return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

// load database
function loadModels(){
    var url = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/suzuki/modelyear/2016/vehicletype/moto?format=json'
    $.ajax({
        url: url,
        type: 'GET'
    }).done(function(results){
        var bike = results.Results
        var year = parseInt(results.SearchCriteria.substring(24,28))
        console.log(year)
        for (var i=0; i < bike.length; i++){
            context = {
                name: bike[i].Model_Name,
                year: year,
                brand: 2,
            }
            // console.log(context)
            $.ajax({
                url: '/api/models/',
                type: 'POST',
                data: context,
            }).done(function(results){
                console.log(results)
            })
        }
    })
}
$("#loadBikes").click(loadModels)


// brand/model listing
function showBrands(){
    $.ajax({
        url: '/api/brands/',
        type: 'GET',
    }).done(function(results){
        var source = $('#brand-template').html()
        var template = Handlebars.compile(source)
        var html = template(results.results)
        $('#listing').append(html)

    })
}
showBrands()


function showYears(id){
    $.ajax({
        url: '/api/models?brand=' + id,
        type: 'GET'
    }).done(function(results){
        $('#listing').empty()
        var bike = results.results
        var years = []
        for(var i=0; i < bike.length; i++){
            if (!(years.includes(bike[i].year))){
                years.push(bike[i].year)
            }
        }
        var context = {
            modelYears : years,
            brandId : id,
        }
        console.log(context)
        var source = $('#year-template').html()
        var template = Handlebars.compile(source)
        var html = template(context)
        $('#listing').append(html)
    })
}


function showModels(id){
    var year = $("#selectedYear")
    year = year[0].innerHTML
    $.ajax({
        url: '/api/models?brand=' + id + '&year=' + year ,
        type: 'GET'
    }).done(function(results){
        $('#listing').empty()
        var bikes = results.results
        var source = $('#model-template').html()
        var template = Handlebars.compile(source)
        var html = template(bikes)
        $('#listing').append(html)
    })
}

Handlebars.registerHelper('linkURL', function (object){
    id = Handlebars.Utils.escapeExpression(object.id)
    name = Handlebars.Utils.escapeExpression(object.name)
    url = '/diag_app/model_detail/' + id 
    console.log(url)
    return '<a href="' +  url + '">' + '<b>' + name + '</b>' + '</a>'
})
