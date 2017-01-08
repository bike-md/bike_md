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
        var source = $("#info-template").html()
        var template = Handlebars.compile(source)
        var html = template(results)
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
