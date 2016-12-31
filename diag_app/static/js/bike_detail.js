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


function loadSystems(){
    var dropdown = $("#probSystem")
    $.ajax({
        url: '/api/systems/',
        type: 'GET',
    }).done(function(results){
        var source = $('#post-template').html()
        var template = Handlebars.compile(source)
        var html = template(results.results)
        $('#probSystem').append(html)
    })
}
loadSystems()


function postProblem(){
    var sys =  $("#probSystem option:selected").val()
    var text = $("#probText").val()
    var user = $("#userId").val()
    var bike = $("#bikeId").val()
    var header = $("#probTitle").val()
    console.log(header)
    var context = {
        system: sys,
        description: text,
        tech: user,
        model: bike,
        title: header,
    }
    console.log(context)
    $.ajax({
        url: '/api/problems/',
        type: 'POST',
        data: context,
    }).done(function(results){
        console.log(results)
    })

}
$("#newProbSubmit").click(postProblem)
