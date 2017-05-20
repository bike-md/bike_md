import currentURL from current_url;
import formatTime from 'helpers/format_time';
//get url for the ajax call
var url = currentURL();
//kick off ajax
getProblem(url);
////////////////////////////////////////////////////////////////////////////////
// Helper: getProblem
// parameters: URL
// description: Ajax call for problem and it's solutions.
// return: none
////////////////////////////////////////////////////////////////////////////////
function getProblem(url){
    var id = url.split('/');
    var model = id[4];
    var id = id[5];
    var url = '/api/get-problems?system=' + id + '&model=' + model;
    $.ajax({
        url: url,
        type: 'GET',
    }).done(function(results){
        var problems = results.results;
        var source = $('#problem-list-template').html();
        var template = Handlebars.compile(source);
        var html = template(problems);
        var systemKey = problems[0].system;
        var context = {
            problem: problems,
            system: systemKey,
        };
        var source = $('#problem-list-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        $('#problemList').append(html);
            $.ajax({
                url: '/api/models/' + model,
                type: 'GET',
            }).done(function(results){
            var source2 = $('#model-template').html();
            var template2 = Handlebars.compile(source2);
            var html2 = template2(results);
            $('#model').append(html2);
        })
    })
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
    };
    for(var i in months){
        if(month == months[i]){
            month = i;
        }
    }
    return month + " " + day + " " + year;
})
////////////////////////////////////////////////////////////////////////////////
// Helper: linkURLModel
// parameters: model object
// description: Formats URL to link to detail page.
// return: String of URL for bike's detail page
////////////////////////////////////////////////////////////////////////////////
Handlebars.registerHelper('linkURLModel', function (object){
    id = Handlebars.Utils.escapeExpression(object.id)
    name = Handlebars.Utils.escapeExpression(object.name)
    url = '/model_detail/' + id
    return '<a href="' +  url + '">' + '<b>' + name + '</b>' + '</a>'

})
