import currentURL from current_url;
//get url for the ajax call
var url = currentURL();
getProblem(url);
//////////////////////////////////////////////////////////////////
// function: showBike
// parameters: URL of current page
// description: preforms ajax call to get info for curent bike.
//////////////////////////////////////////////////////////////////
function showBike(url){
    var id = url.split('/')
    id = id[4]
    var url = '/api/models/' + id
    $.ajax({
        url: url,
        type: 'GET',
    }).done(function(results){
        var source = $("#bike-template").html()
        var template = Handlebars.compile(source)
        var html = template(results)
        $("#bikeSpecs").append(html)
        loadSystemModals(results.id)

    })
}
//////////////////////////////////////////////////////////////////
// function: loadSystemModals
// parameters: model ID
// description: load system modals on bike detail page.
//////////////////////////////////////////////////////////////////
function loadSystemModals(modelID){
    console.log("model id");
    console.log(modelID);
    var model = modelID;
    $.ajax({
        url: '/api/systems/',
        type: 'GET',
    }).done(function(results){
        var system = results.results;
        var list = {};
        var index = 0;
        $.each(system, function() {
            list[index] = {
                system : system[index],
                model : model
            };
            index++;
        });
        var source = $('#system-template').html();
        var template = Handlebars.compile(source);
        var html = template(list);
        $('#system').append(html);
    });
}
