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
