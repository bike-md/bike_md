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
        $('#brandStep').toggleClass('selected')
        $('#brand-number').toggleClass('selected-number')
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
        $('#yearStep').toggleClass('selected')
        $('#year-number').toggleClass('selected-number')
    })
}


//model listing step 3
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
        $('#modelStep').toggleClass('selected')
        $('#model-number').toggleClass('selected-number')

    })
}


// link to specific model detail page
function linkBike (id){
    url = '/model_detail/' + id
    window.location = url;
}


// modal functions
function loadBrandsAskModal(){
    loadSystemsAskModal()
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
loadBrandsAskModal()

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
        years.sort(function(a, b){return b-a})
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


function charRemainingText(){
    $('#probText').keyup(function () {
        var left = 500 - $(this).val().length;
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
    $.ajax({
        url: '/api/post-problems/',
        type: 'POST',
        data: context,
    }).done(function(results){
        alert("Your problem was posted.")
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


// helpers
Handlebars.registerHelper('formatTime', function (posted) {
    var time = posted.replace('T', ':')
    var date = time.split(":")[0]
    var year = Number(date.split("-")[0])
    var month = Number(date.split("-")[1])
    var day = Number(date.split("-")[2])
    var months = {
        "January": 1,
        "February ": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12,
    }
    for(var i in months){
        if(month == months[i]){
            month = i
        }
    }
    return month + " " + day + " " + year
})


Handlebars.registerHelper('linkURL', function (object){
    id = Handlebars.Utils.escapeExpression(object.id)
    title = Handlebars.Utils.escapeExpression(object.title)
    url = '/problem_detail/' + id
    return '<a class="unsolved-problem-link" href="' +  url + '">' + title + '</a>'
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
        var message = '<h5 class="no-result-text">' + "There are no problems that match your search."+ '</h5>' +
            '<a class="post-problem-button"  data-remodal-target="askModal" id="askSearch" class="link1" href="#askModal" >' + "Post a new problem here" + '</a>';
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
