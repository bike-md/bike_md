function getModels(){
    $.ajax({
        url: '/diag_app/model/2/',
        type: 'GET',
    }).done(function(results){
        console.log(results)
        console.log(results.results)
        // var source = $('#model-template').html()
        // var template = Handlebars.compile(source)
        // var html = template(results.results)
        // $('#modelList').append(html)

    })
}
getModels()
