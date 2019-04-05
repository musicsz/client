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
}