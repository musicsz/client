$(document).ready(function () {
    if (localStorage.getItem('token')) {
        $('#registerForm').hide()
        $('#loginForm').hide()
        $('#googleOut').show()
        $('#main').show()
    } else {
        $('#loginForm').show()
        $('#registerForm').hide()
        $('#googleOut').hide()
        $('#main').hide()
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
                localStorage.setItem('token', uLogin.token)
                $('#registerForm').hide()
                $('#loginForm').hide()
                $('#googleOut').show()
                $('#main').show()
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Success Login',
                    showConfirmButton: false,
                    timer: 1500
                })
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
            url: 'http://localhost:3000/users/googlesignin',
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

function getSong(songId) {
    event.preventDefault()
    $.ajax({
            method: 'get',
            url: `http://localhost:3000/${songId}`,
        })
        .done(data => {
            console.log(data, 'ini masuk done getsong')
            getLyrics(data.embed_content)
            youtubeEmbeed(data.full_title)
            getDetail(data)
            $('#detailVideo').show()
            $('#list').hide()
        })
        .fail(err => {
            console.log(err)
        })
}

function getLyrics(embed_content) {
    postscribe('#detailSong', embed_content)
}

function searchSong() {
    $('#list-song').empty()
    let tampung = $('#testTitle').val()
    event.preventDefault()
    $.ajax({
            method: 'post',
            url: 'http://localhost:3000/songs/search',
            data: {
                value: tampung
            }
        })
        .done(data => {
            //   console.log(data)
            //   youtubeEmbeed(data[0].result.full_title)
            data.forEach(song => {
                $('#list-song').append(`
            <div class="col-md-3">

            <div class="card" style="width: 18rem; height:28rem">
                <img class="img-fluid" style="min-height:300px; max-height:300px" src="${song.result.header_image_thumbnail_url}" alt="Card image cap">
                <div class="card-body">
                <h5 class="card-title">${song.result.title}</h5>
                <p class="card-text">${song.result.primary_artist.name}</p>
                <a href="#" onclick="getSong('${song.result.api_path.slice(1)}')" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
            </div>
            `)
            })

            $('#testTitle').val('')
            $('#detailVideo').hide()
            $('#list').show()
        })
        .fail(err => {
            console.log(err)
        })
}

function youtubeEmbeed(songName) {
    console.log('apakah masuk ke youtube embeed?')
    $('#vid').empty()
    let input = $('#inputTitle').val()
    event.preventDefault()
    $.ajax({
            method: 'post',
            url: 'http://localhost:3000/songs/getVideo',
            data: {
                title: songName
            }
        })
        .done(res => {
            console.log(res, 'ini res youtube embeed')
            $('#vid').append(`
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${res}"></iframe>
    `)
        })
        .fail(err => {
            console.log(err)
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        console.log(localStorage.getItem('token'))
        // localStorage.removeItem('token')
        $('#main').hide()
        $('#loginForm').show()
        $('#registerForm').hide()
        $('#googleOut').hide()
        localStorage.clear()
    });
}

function getDetail(data) {
    let location = data.recording_location
    if (!data.recording_location) {
        location = 'unknown recording location'
    }

    let releaseDate = data.release_date
    if (!data.release_date) {
        releaseDate = 'unknown release date'
    }
    // song_art_image_thumbnail_url
    $('#detailAlbum').append(`
    <div class="card d-flex align-items-center" style="max-width: 540px;">
    <div class="row no-gutters justify-content-center">
        <div class="col-md-4">
        <img src="${data.song_art_image_thumbnail_url}" class="card-img" alt="...">
        </div>
        <div class="col-md-8">
        <div class="card-body">
            <h5 class="card-title">${data.full_title}</h5>
            <p class="card-text">${location}</p>
            <p class="card-text"><small class="text-muted">${releaseDate}</small></p>
        </div>
        </div>
    </div>
    </div>
    `)
}