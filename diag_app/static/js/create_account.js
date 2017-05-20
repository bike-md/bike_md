/*
This file needs to be re-worked. Currently the call to create a tech
does not succeed.
*/
// Click events
$("#createAccount").click(createUser)
//////////////////////////////////////////////////////////////////////
// function: createUser
// parameters: none
// description: creates basic django user object with username, password, email.
// Calls createTeach
// return: none
//////////////////////////////////////////////////////////////////////
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
        linkLogin()
    })
}
//////////////////////////////////////////////////////////////////////
// function: createTech
// parameters: user ID
// description: creates tech: yrs experience, job title, current shop.
// return: none
//////////////////////////////////////////////////////////////////////
function createTech(id){
    var yrsExperience = $("#yrsExperience").val();
    var jobTitle = $("#jobTitle").val();
    var currentShop = $("#currentShop").val();
    var userId = id;
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
    });
}
//////////////////////////////////////////////////////////////////////
// function: linkLogin
// parameters: none
// description: Attempt to redirect and login after user creation. Does not
// work as intended in current form.
// return: none
//////////////////////////////////////////////////////////////////////
function linkLogin(){
    url = '/login/';
    window.location = url;
}
