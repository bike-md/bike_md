// load database
function loadModels(){
    var url = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/suzuki/modelyear/2016/vehicletype/moto?format=json'
    $.ajax({
        url: url,
        type: 'GET'
    }).done(function(results){
        var bike = results.Results
        var year = parseInt(results.SearchCriteria.substring(24,28))
        for (var i=0; i < bike.length; i++){
            context = {
                name: bike[i].Model_Name,
                year: year,
                brand: 2,
            }
            // console.log(context)
            $.ajax({
                url: '/api/models/',
                type: 'POST',
                data: context,
            }).done(function(results){
            })
        }
    })
}
$("#loadBikes").click(loadModels)


$(document).ready(function(){
  $(".link3").click(function(){
    $(".dropdown").slideToggle();
  });
});
