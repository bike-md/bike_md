/*******************************************************************************
                                FILE SUMMARY
At base these functions all preform ajax calls in order to populate
Handlebars templates. After showBrands is kicked off the rest are triggered
by onclicks. Obviously this is outdated and sub par and needs to be refactored.
Also, one selection box should not require a seperate function for each step.
This same functionality will also need to be addressed in the model selection
for the problem posting modal.
*******************************************************************************/
//Start model select box
showBrands();
//////////////////////////////////////////////////////////////////
// function: showBrands
// parameters: none
// description: This function loads the brands currently in the DB
// This is first step of the model selection box
// return: none
//////////////////////////////////////////////////////////////////
function showBrands(){
    $.ajax({
        url: '/api/brands/',
        type: 'GET',
    }).done(function(results){
        var source = $('#brand-template').html();
        var template = Handlebars.compile(source);
        var html = template(results.results);
        $('#listing').empty();
        $('#listing').append(html);
        $('#brandStep').toggleClass('selected');
        $('#brand-number').toggleClass('selected-number');
    });
}
//////////////////////////////////////////////////////////////////////////
// function: showYears
// parameters: none
// description: This function loads the years for the brand selected.
// This is the second step of the model selection box
// return: none
//////////////////////////////////////////////////////////////////////////
function showYears(id){
    $.ajax({
        url: '/api/models?brand=' + id,
        type: 'GET'
    }).done(function(results){
        $('#listing').empty();
        var bike = results.results;
        var years = [];
        for(var i=0; i < bike.length; i++){
            if (!(years.includes(bike[i].year))){
                years.push(bike[i].year);
            }
        }
        years.sort(function(a, b){return b-a});
        var context = {
            modelYears : years,
            brandId : id,
        }
        var source = $('#year-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        $('#listing').empty();
        $('#listing').append(html);
        $('#yearStep').toggleClass('selected');
        $('#year-number').toggleClass('selected-number');
    });
}
//////////////////////////////////////////////////////////////////////////
// function: showModels
// parameters: none
// description: This function loads the models for the brand/year selected.
// This is the final step of the model selection box
// return: none
//////////////////////////////////////////////////////////////////////////
function showModels(year){
    var brandId = $("#brandId").val();
    $.ajax({
        url: '/api/models?brand=' + brandId + '&year=' + year,
        type: 'GET'
    }).done(function(results){
        var brandID = results.results[0].brand.id;
        var bikeList = results.results;
        var context = {
            brand: brandID,
            bikes: bikeList
        }
        var source = $('#model-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        $('#listing').empty();
        $('#listing').append(html);
        $('#modelStep').toggleClass('selected');
        $('#model-number').toggleClass('selected-number');
    });
}
//////////////////////////////////////////////////////////////////////////
// function: linkBike
// parameters: none
// description: This function loads the model page for the model selected.
// return: none
//////////////////////////////////////////////////////////////////////////
function linkBike (id){
    url = '/model_detail/' + id;
    window.location = url;
}
