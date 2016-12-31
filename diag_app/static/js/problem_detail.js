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


function postSolution(){
    var text = $("#solutionText").val()
    var user = $("#userId").val()
    var issue = $("#problemId").val()
    var time = $("#solutionTime").val()
    var cost = $("#partsCost").val()
    var context = {
        time_required: time,
        description: text,
        tech: user,
        parts_cost: cost,
        problem: issue,
    }
    console.log(context)
    $.ajax({
        url: '/api/solutions/',
        type: 'POST',
        data: context,
    }).done(function(results){
        console.log(results)
    })

}
$("#newSolutionSubmit").click(postSolution)
