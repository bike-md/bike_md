// get current url
function currentURL(){
    var url = window.location.href
    showBike(url)

}
currentURL()


// get bike details
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


// load systems
function loadSystemModals(name){
    var model = name
    $.ajax({
        url: '/api/systems/',
        type: 'GET',
    }).done(function(results){
        var system = results.results
        var list = {}
        var index = 0;
        $.each(system, function() {
            list[index] = {
                system : system[index],
                model : model
            };
        index++;
        })
        var source = $('#system-template').html()
        var template = Handlebars.compile(source)
        var html = template(list)
        $('#system').append(html)

    })
}
