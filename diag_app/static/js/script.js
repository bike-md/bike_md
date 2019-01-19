//////////////////////////////////////////////////////////////////
// Set up Dom
//////////////////////////////////////////////////////////////////
function setupEvents() {
    $("#notify").click(loadNotificationsModal);
    $("#newProbSubmit").click(postProblem);
    $("#answer").click(loadUnsolvedProblemsModal);
    $("#searchButton").click(searchProblems);
    loadBrandsAskModal();
    charRemainingText();
    //Dropdown menu on nav bar
    $(document).ready(function(){
      $(".link4").click(function(){
        $(".dropdown").slideToggle();
      });
    });
}
setupEvents();
//////////////////////////////////////////////////////////////////
// function: loadBrandsAskModal
// parameters: none
// description: This function loads the brands currently in the DB
// return: none
//////////////////////////////////////////////////////////////////
function loadBrandsAskModal() {
    loadSystemsAskModal()
    $.ajax({
        url: '/api/brands/',
        type: 'GET',
    }).done(function(results) {
        $('#brandSelect').empty();
        var source = $('#brand-modal-template').html();
        var template = Handlebars.compile(source);
        var html = template(results.results);
        $('#brandSelect').append(html);
        var brand =  $("#probBrand option:selected").val();
        loadYearsAskModal(brand);
    })
}
//////////////////////////////////////////////////////////////////////////
// function: loadYearsAskModal
// parameters: brand id
// description: This function loads the years for the brand selected.
// return: none
//////////////////////////////////////////////////////////////////////////
function loadYearsAskModal(id) {
    $.ajax({
        url: '/api/models?brand=' + id,
        type: 'GET'
    }).done(function(results) {
        $('#yearSelect').empty()
        var bike = results.results
        var years = []
        for (var i=0; i < bike.length; i++) {
            if (!(years.includes(bike[i].year))) {
                years.push(bike[i].year);
            }
        }
        years.sort(function(a, b) { return b-a })
        var source = $('#year-modal-template').html();
        var template = Handlebars.compile(source);
        var html = template(years);
        $('#yearSelect').append(html);
        loadModelsAskModal();
    });
}
//////////////////////////////////////////////////////////////////////////
// function: loadModelsAskModal
// parameters: year
// description: This function loads the models for the brand/year selected.
// return: none
//////////////////////////////////////////////////////////////////////////3
function loadModelsAskModal(year) {
    var brandId =  $("#probBrand option:selected").val();
    $.ajax({
        url: '/api/models?brand=' + brandId + '&year=' + year,
        type: 'GET'
    }).done(function(results) {
        $('#modelSelect').empty();
        var bikes = results.results;
        var source = $('#model-modal-template').html();
        var template = Handlebars.compile(source);
        var html = template(bikes);
        $('#modelSelect').append(html);
    });
}
//////////////////////////////////////////////////////////////////////////
// function: loadSystemsAskModal
// parameters: none
// description: This function loads the systems for the select menu
// return: none
//////////////////////////////////////////////////////////////////////////
function loadSystemsAskModal() {
    $.ajax({
        url: '/api/systems/',
        type: 'GET',
    }).done(function(results) {
        $('#systemSelect').empty();
        var systems = results.results;
        var source = $('#system-modal-template').html();
        var template = Handlebars.compile(source);
        var html = template(systems);
        $('#systemSelect').append(html);
    })
}

//////////////////////////////////////////////////////////////////////////
// function: charRemainingText
// parameters: none
// description: This function displys chars remainging for problem text.
// return: none
//////////////////////////////////////////////////////////////////////////
function charRemainingText() {
    $('#probText').keyup(function () {
        var left = 500 - $(this).val().length;
        if (left < 0) {
            left = 0;
        }
        $('#counter').text('Characters left: ' + left);
    })
}
//////////////////////////////////////////////////////////////////////////
// function: postProblem
// parameters: none
// description: This function posts a problem to the DB via Ajax.
// return: none
//////////////////////////////////////////////////////////////////////////
function postProblem() {
    var modal = $('[data-remodal-id=askModal]').remodal();
    var bike =  $("#probModel option:selected");
    var sys =  $("#probSystem option:selected");
    var text = $("#probText");
    var user = $("#userId");
    var header = $("#probTitle");
    var context = {
        system: sys.val(),
        description: text.val(),
        tech: user.val(),
        model: bike.val(),
        title: header.val(),
    }
    $.ajax({
        url: '/api/post-problems/',
        type: 'POST',
        data: context,
        success: function (response) {
          modal.close();
          alert("Problem saved successfully!");
        },
        error: function (xhr, ajaxOptions, thrownError) {
          $("p.error-message").empty();
          if (thrownError === 'Bad Request') {
            $("p.error-message").append("All the fields are required to create a problem, please check if you've filled them properly and try again.");
          } else if (thrownError === 'Internal Server Error') {
            $("p.error-message").append("There were an internal error saving your problem. Please try again later or contact us describing your issue.");
          } else if (thrownError === 'Forbidden') {
            $("p.error-message").append("You don't have permissions to create a problem.");
          } else {
            $("p.error-message").append("Some weird problem occurred, the description is: Error code = " + xhr.status + " Error Message = " + thrownError + " please try again later or contact us!");
          }
        }
    }).done(function(){
      $('.newProblem').trigger('reset');
    });
}

// This function controls if the all the form fields have been filled and unblocks the submit button
$(".newProblem").on('change mouseover', function(){
  var bike =  $("#probModel option:selected").val();
  var sys =  $("#probSystem option:selected").val();
  var text = $("#probText").val();
  var user = $("#userId").val();
  var header = $("#probTitle").val();
  if ((bike === 'none') || (sys === 'none') || !(text) || !(user) || !(header)){
    $("input#newProbSubmit.submit-button").prop("disabled", true);
  } else {
    $("input#newProbSubmit.submit-button").prop("disabled", false);
  }
});
//////////////////////////////////////////////////////////////////////////
// function: loadUnsolvedProblemsModal
// parameters: none
// description: This functions pulls unsolved problems from the DB via Ajax.
// return: none
//////////////////////////////////////////////////////////////////////////
function loadUnsolvedProblemsModal() {
    console.log("loadUnsolvedProblemsModal");
    $.ajax({
        url: '/api/get-problems?no_solutions=True',
        type: 'GET',
    }).done(function(results) {
        var problems = results.results;
        var source = $('#unsolved-problem-template').html();
        var template = Handlebars.compile(source);
        var html = template(problems);
        $('#modalProblemList').empty();
        $('#modalProblemList').append(html);
    });
}
////////////////////////////////////////////////////////////////////////////////
// Helper: formatTime
// parameters: timestamp
// description: Formats timestamps to make them pretty and more human readable.
// return: String of month/day/year
////////////////////////////////////////////////////////////////////////////////
Handlebars.registerHelper('formatTime', function (posted) {
    var time = posted.replace('T', ':');
    var date = time.split(":")[0];
    var year = Number(date.split("-")[0]);
    var month = Number(date.split("-")[1]);
    var day = Number(date.split("-")[2]);
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
    for (var i in months) {
        if (month === months[i]) {
            month = i;
        }
    }
    return month + " " + day + " " + year;
})
////////////////////////////////////////////////////////////////////////////////
// Helper: linkURL
// parameters: problem object
// description: Formats URL for a given problem.
// return: String of URL for problem detail page.
////////////////////////////////////////////////////////////////////////////////
Handlebars.registerHelper('linkURL', function (object) {
    id = Handlebars.Utils.escapeExpression(object.id);
    title = Handlebars.Utils.escapeExpression(object.title);
    url = '/problem_detail/' + id;
    return '<a class="unsolved-problem-link" href="' +  url + '">' + title + '</a>';
});
////////////////////////////////////////////////////////////////////////////////
// Helper: searchProblems
// parameters: none
// description: Search function for nav bar.
// return: none
////////////////////////////////////////////////////////////////////////////////
function searchProblems() {
    var searchTerm = $("#searchBox").val();
    $.ajax({
        url: '/api/get-problems?search=' + searchTerm,
        type: 'GET'
    }).done(function(results) {
        var problems = results.results;
        var length = problems.length;
        var message = '<h5 class="no-result-text">' + "There are no problems that match your search."+ '</h5>' +
            '<a class="post-problem-button"  data-remodal-target="askModal" id="askSearch" class="link1" href="#askModal" >' + "Post a new problem here" + '</a>';
        var noResults = {
            message: message,
        }
        if (length == 0) {
            var source = $('#search-problem-template-two').html();
            var template = Handlebars.compile(source);
            var html = template(noResults);
            $('#searchProblemList').empty();
            $('#searchProblemList').append(html);
        } else {
            var source = $('#search-problem-template').html();
            var template = Handlebars.compile(source);
            var html = template(problems);
            $('#searchProblemList').empty();
            $('#searchProblemList').append(html);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////
// Helper: loadNotificationsModal
// parameters: tech id
// description: Load notifications for a given user via Ajax.
// return: String of month/day/year
////////////////////////////////////////////////////////////////////////////////
/*IN PROGRESS*/
function loadNotificationsModal() {
    $.ajax({
        url: '/api/notifications/',
        type: 'GET',
    }).done(function(results) {
        var notifications = results.results;
        var source = $('#notification-template').html();
        var template = Handlebars.compile(source);
        var html = template(notifications);
        $('#notifyList').empty();
        $('#notifyList').append(html);
    });
}
