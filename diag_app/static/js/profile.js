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


function getTechInfo(){
    var id = $("#currentTech").val()
    $.ajax({
        url: '/api/techs/' + id,
        type: 'GET',
    }).done(function(results){
        console.log(results)
        var source = $("#info-template").html()
        var template = Handlebars.compile(source)
        var html = template(results)
        $("#techInfo").append(html)
    })
}
getTechInfo()


function getTechProblems(){
    var id = $("#currentTech").val()
    $.ajax({
        url: '/api/get-problems?tech=' + id,
        type: 'GET',
    }).done(function(results){
        console.log(results.results)
        // var source = $('#techProblem-template').html()
        // var template = Handlebars.compile(source)
        // var html = template(results.results)
        // $('#problemList').append(html)
    })
}
getTechProblems()
