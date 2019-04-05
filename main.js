
$(document).ready(function () {
    if (localStorage.getItem('token')) {
        $('#registerForm').hide()
        $('#loginForm').hide()
        $('#googleOut').show()
    }
    else {
        $('#loginForm').show()
        $('#registerForm').hide()
        $('#googleOut').hide()
    }
    $('#login-form').submit(function () {
        event.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'http://localhost:5000/users/signin',
            data: {
                email: $('#emailLogin').val(),
                password: $('#passwordLogin').val()
            }
        })
            .done(uLogin => {
                console.log('signin')
                console.log(uLogin)
                // $('#name').val('')
                // $('#myRepo').append(`<li>${newRepo.full_name}</li>`)
            })
            .fail(err => {
                console.log(err)
            })
    })

    $('#register-form').submit(function () {
        event.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'http://localhost:5000/users/signup',
            data: {
                email: $('#emailRegister').val(),
                password: $('#passwordRegister').val()
            }
        })
            .done(uRegister => {
                console.log('signUp')
                console.log(uRegister)
                $('#emailRegister').val('')
                $('#passwordRegister').val('')
                $('#loginForm').show()
                $('#registerForm').hide()
                // $('#name').val('')
                // $('#myRepo').append(`<li>${newRepo.full_name}</li>`)
            })
            .fail(err => {
                console.log(err)
            })
    })
})

function changeToRegister() {
    console.log('masuk ke hide')
    $('#loginForm').hide()
    $('#registerForm').show()
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', 'http://localhost:5000/users');
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhr.onload = function () {
    //     console.log('Signed in as: ' + xhr.responseText);
    // };
    // xhr.send('idtoken=' + id_token);
    $.ajax({
        url: 'http://localhost:5000/users/googlesignin',
        method: 'POST',
        data: {
            idToken: id_token
        }
    })
        .done(function (data) {
            console.log('masuk ke done========================')
            let html = ''
            console.log('ini token')
            console.log(data)
            localStorage.setItem('token', data.token)
            // $('.classTodo').show()
            // $('.addTodo').show()
            // $('.updateTodo').show()
            // $('.user').hide()
            // $('.logout').show()
            // $('.google').hide()
            // $('#updateTodo').hide()
        })
        .fail(function (err) {
            console.log(err)
            console.log(err.response)
        })
}

function youtubeEmbeed() {
  $('#vid').empty()
  let input = $('#inputTitle').val()
  event.preventDefault()
  $.ajax({
    method: 'post',
    url: 'http://localhost:3000/getVideo',
    data: {title: input}
  })
  .done(res => {
    $('#vid').append(`
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${res}"></iframe>
    `)
  })
  .fail(err => {
    console.log(err)
  })

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        console.log(localStorage.getItem('token'))
        // localStorage.removeItem('token')
        localStorage.clear()
    });
}