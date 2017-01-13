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
        $('#listing').empty()
        $('#listing').append(html)

    })
}
showBrands()


// year listing step 2
function showYears(id){
    console.log(id)
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
        years.sort(function(a, b){return b-a})
        var context = {
            modelYears : years,
            brandId : id,
        }
        var source = $('#year-template').html()
        var template = Handlebars.compile(source)
        var html = template(context)
        $('#listing').empty()
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
        var brandID = results.results[0].brand.id
        var bikeList = results.results
        var context = {
            brand: brandID,
            bikes: bikeList
        }
        var source = $('#model-template').html()
        var template = Handlebars.compile(source)
        var html = template(context)
        $('#listing').empty()
        $('#listing').append(html)
    })
}


// link to specific model detail page
function linkBike (id){
    url = '/model_detail/' + id
    window.location = url;
}


// modal functions
function loadBrandsAskModal(){
    $.ajax({
        url: '/api/brands/',
        type: 'GET',
    }).done(function(results){
        $('#brandSelect').empty()
        var source = $('#brand-modal-template').html()
        var template = Handlebars.compile(source)
        var html = template(results.results)
        $('#brandSelect').append(html)
        var brand =  $("#probBrand option:selected").val()
        loadYearsAskModal(brand)
    })

}
$("#ask").click(loadBrandsAskModal)


// year select step modal
function loadYearsAskModal(id){
    $.ajax({
        url: '/api/models?brand=' + id,
        type: 'GET'
    }).done(function(results){
        $('#yearSelect').empty()
        var bike = results.results
        var years = []
        for(var i=0; i < bike.length; i++){
            if (!(years.includes(bike[i].year))){
                years.push(bike[i].year)
            }
        }
        console.log(years)
        years.sort(function(a, b){return b-a})
        console.log(years)
        var source = $('#year-modal-template').html()
        var template = Handlebars.compile(source)
        var html = template(years)
        $('#yearSelect').append(html)
        loadModelsAskModal()
    })
}


// model step 3
function loadModelsAskModal(year){
    var brandId =  $("#probBrand option:selected").val()
    $.ajax({
        url: '/api/models?brand=' + brandId + '&year=' + year,
        type: 'GET'
    }).done(function(results){
        $('#modelSelect').empty()
        var bikes = results.results
        var source = $('#model-modal-template').html()
        var template = Handlebars.compile(source)
        var html = template(bikes)
        $('#modelSelect').append(html)
    })
}


// load systems modal
function loadSystemsAskModal(){
    $.ajax({
        url: '/api/systems/',
        type: 'GET',
    }).done(function(results){
        $('#systemSelect').empty()
        var systems = results.results
        var source = $('#system-modal-template').html()
        var template = Handlebars.compile(source)
        var html = template(systems)
        $('#systemSelect').append(html)
    })
}
$("#ask").click(loadSystemsAskModal)


function charRemainingText(){
    $('#probText').keyup(function () {
        var left = 1000 - $(this).val().length;
        if (left < 0) {
            left = 0;
        }
        $('#counter').text('Characters left: ' + left);
    })
}
charRemainingText()

// post new problem modal
function postProblem(){
    var bike =  $("#probModel option:selected").val()
    var sys =  $("#probSystem option:selected").val()
    var text = $("#probText").val()
    var user = $("#userId").val()
    var header = $("#probTitle").val()
    var context = {
        system: sys,
        description: text,
        tech: user,
        model: bike,
        title: header,
    }
    console.log(context)
    $.ajax({
        url: '/api/post-problems/',
        type: 'POST',
        data: context,
    }).done(function(results){
    })
}
$("#newProbSubmit").click(postProblem)


// unsolved modal functions
function loadUnsolvedProblemsModal(){
    $.ajax({
        url: '/api/get-problems?no_solutions=True',
        type: 'GET',
    }).done(function(results){
        var problems = results.results
        var source = $('#unsolved-problem-template').html()
        var template = Handlebars.compile(source)
        var html = template(problems)
        $('#modalProblemList').empty()
        $('#modalProblemList').append(html)
    })
}
$("#answer").click(loadUnsolvedProblemsModal)


Handlebars.registerHelper('linkURL', function (object){
    id = Handlebars.Utils.escapeExpression(object.id)
    title = Handlebars.Utils.escapeExpression(object.title)
    url = '/problem_detail/' + id
    return '<a href="' +  url + '">' + '<b>' + title + '</b>' + '</a>'
})


// search function
function searchProblems(){
    var searchTerm = $("#searchBox").val()
    $.ajax({
        url: '/api/get-problems?search=' + searchTerm,
        type: 'GET'
    }).done(function(results){
        var problems = results.results
        var length = problems.length
        var message = '<h5>' + "There are no problems that match your search. Add one" +
            '<a  data-remodal-target="askModal" id="ask" class="link1" href="#askModal" >'  + " here" + '</a>' + '</h5>';
        var noResults = {
            message: message,
        }
        if (length == 0){
            var source = $('#search-problem-template-two').html()
            var template = Handlebars.compile(source)
            var html = template(noResults)
            $('#searchProblemList').empty()
            $('#searchProblemList').append(html)
        }else{
            var source = $('#search-problem-template').html()
            var template = Handlebars.compile(source)
            var html = template(problems)
            $('#searchProblemList').empty()
            $('#searchProblemList').append(html)
        }
    })
}
$("#searchButton").click(searchProblems)
