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


// brand listing step 1
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
// year listing step 2
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
        var source = $('#year-template').html()
        var template = Handlebars.compile(source)
        var html = template(context)
        $('#listing').append(html)
    })
}


// model listing step 3
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


// link to specific model detail page
function linkBike (id){
    url = '/diag_app/model_detail/' + id
    window.location = url;
}
