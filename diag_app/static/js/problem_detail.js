import currentURL from current_url;
/*******************************************************************************
                                FILE SUMMARY
This file handles the problem detail page as well as posting sloutions, voting
for the best solution and updating the rating for the tech that posted that
solution. There are a couple of repetitive functions here such as the char
counter and there are also helpers here that could be split out into a help file.
*******************************************************************************/
///get url for the ajax call to display problem details///
var url = currentURL();
getProblem(url);
///start char counter///
charRemaining()
//////////////////////////////////////////////////////////////////
// function: showProblem
// parameters: URL
// description: This function loads the problem detail page for
// a given problem.
// return: none
//////////////////////////////////////////////////////////////////
function showProblem(url){
    var id = url.split('/');
    id = id[4];
    var url = '/api/get-problems/' + id;
    $.ajax({
        url: url,
        type: 'GET',
    }).done(function(results){
        var source1 = $("#problem-template").html();
        var template1 = Handlebars.compile(source1);
        var html1 = template1(results);
        $("#problemDetail").append(html1);

        var source2 = $("#solution-template").html();
        var template2 = Handlebars.compile(source2);
        var html2 = template2(results.solutions);
        $("#solutions").append(html2);

    });
}
//////////////////////////////////////////////////////////////////
// function: charRemaining
// parameters: none
// description: Displays Chars remaining for text fields
// return: none
//////////////////////////////////////////////////////////////////

// TEST THIS

function charRemaining(){
    $('#solutionText').keyup(function () {
        var left = 500 - $(this).val().length;
        if (left < 0) {
            left = 0;
        }
        $('#counterSolution').text('Characters left: ' + left);
    });
    $('#probText').keyup(function () {
        var left = 500 - $(this).val().length;
        if (left < 0) {
            left = 0;
        }
        $('#counterProb').text('Characters left: ' + left);
    });

}
//////////////////////////////////////////////////////////////////
// function: postSolution
// parameters: none
// description: Posts a new solution to the DB
// return: none
//////////////////////////////////////////////////////////////////
function postSolution(){
    var text = $("#solutionText").val();
    var user = $("#userId").val();
    var issue = $("#problemId").val();
    var time = $("#solutionTime").val();
    var cost = $("#partsCost").val();
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
        location.reload();
    })

}
$("#newSolutionSubmit").click(postSolution)
//////////////////////////////////////////////////////////////////
// function: postSolution
// parameters: none
// description: Validates vote so user can not vote multiple times.
// Should keep user from voting on their own solutions.
// return: none
//////////////////////////////////////////////////////////////////
// better way to validate votes?
function validateVote(solutionId, value){
    var user = $("#userId").val();
    var voted = [];
    var vote = {};
    $.ajax({
        url: '/api/votes?solution=' + solutionId,
        type: 'GET',
    }).done(function(results){
        var votes = results.results;
        for (var i=0; i < votes.length; i++){
            if(user == votes[i].tech){
                vote['tech'] = user;
                voted.push(vote);
            }
        }
        if(voted.length > 0){
            alert("You've already voted for that one!");
        }else{
            postVote(solutionId, value);
        }
    });
}
//////////////////////////////////////////////////////////////////////
// function: postVote
// parameters: Vote ID and Vote value(default is 1)
// description: Posts new vote to DB. Calls updateScore for solution.
// return: none
//////////////////////////////////////////////////////////////////////
function postVote(id, value){
    var user = $("#userId").val();
    var voteValue = value;
    var votedFor = id;
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
        updateScore(id, value);
    });
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
