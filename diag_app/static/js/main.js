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
function showModels(year){
    var brandId = $("#brandId").val()
    $.ajax({
        url: '/api/models?brand=' + brandId + '&year=' + year,
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


// load systems
function loadSystems(){
    $.ajax({
        url: '/api/systems/',
        type: 'GET',
    }).done(function(results){
        var systems = results.results
        console.log(systems)
        var source = $('#system-template').html()
        console.log(source)
        var template = Handlebars.compile(source)
        var html = template(systems)
        $('#systemSelect').append(html)
    })
}
$("#ask").click(loadSystems)


// post new problem
function postProblem(){
    var sys =  $("#probSystem option:selected").val()
    var text = $("#probText").val()
    var user = $("#userId").val()
    var bike = $("#bikeId").val()
    var header = $("#probTitle").val()
    var context = {
        system: sys,
        description: text,
        tech: user,
        model: bike,
        title: header,
    }
    $.ajax({
        url: '/api/post-problems/',
        type: 'POST',
        data: context,
    }).done(function(results){
        console.log(results)
    })
}

$("#newProbSubmit").click(postProblem)
