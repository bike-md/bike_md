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


function currentURL(){
    var url = window.location.href
    showProblem(url)

}
currentURL()


function showProblem(url){
    var id = url.split('/')
    id = id[4]
    var url = '/api/get-problems/' + id
    $.ajax({
        url: url,
        type: 'GET',
    }).done(function(results){
        var source1 = $("#problem-template").html()
        var template1 = Handlebars.compile(source1)
        var html1 = template1(results)
        $("#problemDetail").append(html1)

        var source2 = $("#solution-template").html()
        var template2 = Handlebars.compile(source2)
        var html2 = template2(results.solutions)
        $("#solutions").append(html2)

    })
}

function charRemainingProb(){
    $('#solutionText').keyup(function () {
    var left = 1000 - $(this).val().length;
    if (left < 0) {
        left = 0;
    }
    $('#counterSolution').text('Characters left: ' + left);
    })
}
charRemainingSolution()


function charRemainingSolution(){
    $('#probText').keyup(function () {
    var left = 1000 - $(this).val().length;
    if (left < 0) {
        left = 0;
    }
    $('#counterProb').text('Characters left: ' + left);
})
}
charRemainingProb()


function postSolution(){
    var text = $("#solutionText").val()
    var user = $("#userId").val()
    var issue = $("#problemId").val()
    var time = $("#solutionTime").val()
    var cost = $("#partsCost").val()
    var context = {
        time_required: time,
        description: text,
        tech: user,
        parts_cost: cost,
        problem: issue,
    }
    $.ajax({
        url: '/api/post-solutions/',
        type: 'POST',
        data: context,
    }).done(function(results){
        // fix this: reload just solution container.
        location.reload()
    })

}
$("#newSolutionSubmit").click(postSolution)


// better way to do this?
function validateVote(solutionId, value){
    var user = $("#userId").val()
    var voted = []
    var vote = {}
    $.ajax({
        url: '/api/votes?solution=' + solutionId,
        type: 'GET',
    }).done(function(results){
        var votes = results.results
        for (var i=0; i < votes.length; i++){
            if(user == votes[i].tech){
                vote['tech'] = user
                voted.push(vote)
            }
        }
        if(voted.length > 0){
            alert("You've already voted for that one!")
        }else{
            postVote(solutionId, value)
        }
    })
}


function postVote(id, value){
    var user = $("#userId").val()
    var voteValue = value
    var votedFor = id
    var context = {
        tech: user,
        value: voteValue,
        solution: votedFor,
    }
    $.ajax({
        url: '/api/votes/',
        type: 'POST',
        data: context,
    }).done(function(results){
        updateScore(id, value)
    })
}


function updateScore(id, voteValue){
    $.ajax({
        url: '/api/get-solutions/' + id ,
        type: 'GET',
    }).done(function(results){
        var tech = results.tech.id
        updateRating(tech, voteValue)
        var currentScore = results.score
        var newScore = currentScore + voteValue
        var context = {
            score: newScore
        }
        $.ajax({
            url: '/api/post-solutions/' + id + '/',
            type: 'PATCH',
            data: context,
        }).done(function(results){
            var id_container = '#solutionScore' + results.id
            $(id_container).html('Score: ' + results.score)
        })
    })
}


function updateRating(tech, voteValue){
    $.ajax({
        url: '/api/get-techs/' + tech,
        type: 'GET',
    }).done(function(results){
        var currentRating = results.tech_rating
        var newRating = currentRating + (voteValue * 5)
        context = {
            tech_rating: newRating
        }
        $.ajax({
            url: '/api/post-techs/' + tech + '/',
            type: 'PATCH',
            data: context,
        }).done(function(results){
        })

    })

}


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
