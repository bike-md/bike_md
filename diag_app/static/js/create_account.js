function createUser(e){
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
        linkLogin()
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


function linkLogin(){
    url = '/login/'
    window.location = url;
}
