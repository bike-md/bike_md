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


function createUser(){
    var userName = $("#newUsername").val()
    var userPassword = $("#userPassword").val()
    var emailAddress = $("#emailAddress").val()
    var context = {
        username: userName,
        password: userPassword,
        email: emailAddress,
    }
    $.ajax({
        url: '/api/accounts/',
        type: 'POST',
        data: context
    }).done(function(results){
        createTech(results.id)
    })
}
$("#createAccount").click(createUser)


function createTech(id){
    var yrsExperience = $("#yrsExperience").val()
    var jobTitle = $("#jobTitle").val()
    var currentShop = $("#currentShop").val()
    var userId = id
    var context = {
        experience: yrsExperience,
        job_title: jobTitle,
        shop: currentShop,
        user: userId,
    }
    $.ajax({
        url: '/api/post-techs/',
        type: 'POST',
        data: context
    }).done(function(results){
    })
}
