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


function getTechInfo(){
    var id = $("#currentTech").val()
    $.ajax({
        url: '/api/techs/' + id,
        type: 'GET',
    }).done(function(results){
        console.log(results.experience)
        var source = $("#info-template").html()
        var template = Handlebars.compile(source)
        var html = template(results)
        console.log(html)
        $("#techInfo").append(html)
    })
}
getTechInfo()


function getTechProblems(){
    var id = $("#currentTech").val()
    $.ajax({
        url: '/api/get-problems?tech=' + id,
        type: 'GET',
    }).done(function(results){
        var source = $('#techProblem-template').html()
        var template = Handlebars.compile(source)
        var html = template(results.results)
        $('#techQuestions').append(html)
    })
}
getTechProblems()


function getTechSolutions(){
    var id = $("#currentTech").val()
    $.ajax({
        url: '/api/get-solutions?tech=' + id,
        type: 'GET',
    }).done(function(results){
        var source = $('#techSolution-template').html()
        var template = Handlebars.compile(source)
        var html = template(results.results)
        $('#techAnswers').append(html)
    })
}
getTechSolutions()


Handlebars.registerHelper('formatTime', function (posted) {
    var time = posted.replace('T', ':')
    // var hour = Number(time.split(":")[1])
    // var min = Number(time.split(":")[2])
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
    url = '/diag_app/problem_detail/' + id
    return '<a href="' +  url + '">' + '<b>' + title + '</b>' + '</a>'
})


Handlebars.registerHelper('linkURLAnswers', function (object){
    id = Handlebars.Utils.escapeExpression(object.problem)
    description = Handlebars.Utils.escapeExpression(object.description)
    url = '/diag_app/problem_detail/' + id
    return '<a href="' +  url + '">' + '<b>' + description + '</b>' + '</a>'
})


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
        var source = $('#year-modal-template').html()
        var template = Handlebars.compile(source)
        var html = template(years)
        $('#yearSelect').append(html)
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
    })
}

$("#newProbSubmit").click(postProblem)


// unsolved modal function
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
