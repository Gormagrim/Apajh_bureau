$(document).ready(function () {
    const getWordList = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/getVideos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseGetVideos = await response.json()
                for (var resp in responseGetVideos) {
                    if (responseGetVideos[resp].contentIsOnline == 1) {
                        var btn = '<button type="button" data-id="' + responseGetVideos[resp].id + '" data-online="' + responseGetVideos[resp].contentIsOnline +
                            '" class="btn btn-outline-success btn-sm isOnline">Online</button>'
                    } else {
                        var btn = '<button type="button" data-id="' + responseGetVideos[resp].id + '" data-online="' + responseGetVideos[resp].contentIsOnline +
                            '" class="btn btn-outline-danger btn-sm isOffline">Offline</button>'
                    }
                    var date = new Date(responseGetVideos[resp].contentDate)
                    var options = { weekday: "short", year: "numeric", month: "long", day: "2-digit" };
                    var fullDate = date.toLocaleDateString("fr-FR", options)
                    var display = '<div class="row oneArticle"><div class="col-3 text-center"><span>' + responseGetVideos[resp].contentTitle + '</span></div><div class="col-3 text-center"><span>' +
                        responseGetVideos[resp].category[0].category + '</span></div><div class="col-2 text-center"><span>' + fullDate + '</span></div><div class="col-2 text-center">' + btn +
                        '</div><div class="col-2 text-center"><i class="fas fa-eye fa-2x voir" data-id="' + responseGetVideos[resp].id + '" data-bs-toggle="modal" data-bs-target="#videoModal"></i></div></div>'
                    $('.listWord').append(display)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getWordList()
});

$(document).on('click', '.isOffline', function (event) {
    event.preventDefault();
    $(this).addClass('isOnline')
    $(this).addClass('btn-outline-success')
    $(this).removeClass('btn-outline-danger')
    $(this).removeClass('isOffline')
    $(this).html('Online')
    const ContentIsOnline = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/online', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseContentOnline = await response.json()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    ContentIsOnline({
        id: $(this).attr('data-id')
    })
});

$(document).on('click', '.isOnline', function (event) {
    event.preventDefault();
    $(this).addClass('isOffline')
    $(this).addClass('btn-outline-danger')
    $(this).removeClass('btn-outline-success')
    $(this).removeClass('isOnline')
    $(this).html('Offline')
    const ContentIsOffline = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/offline', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseContentOnline = await response.json()

            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    ContentIsOffline({
        id: $(this).attr('data-id')
    })
});

$(document).on('mouseover', '.isOffline', function () {
    var surLine = '#FADCE6'
    $(this).parent().prev().css('background-color', surLine)
    $(this).parent().prev().prev().css('background-color', surLine)
    $(this).parent().prev().prev().prev().css('background-color', surLine)
})
$(document).on('mouseout', '.isOffline', function () {
    $('div.col-3').css('background-color', 'initial')
    $('div.col-2').css('background-color', 'initial')
})
$(document).on('mouseover', '.isOnline', function () {
    var surLine = '#677DB7'
    $(this).parent().prev().css('background-color', surLine)
    $(this).parent().prev().prev().css('background-color', surLine)
    $(this).parent().prev().prev().prev().css('background-color', surLine)
})
$(document).on('mouseout', '.isOnline', function () {
    $('div.col-3').css('background-color', 'initial')
    $('div.col-2').css('background-color', 'initial')
})
// Voir la vidéo dans la modale
$(document).on('click', '.voir', function (event) {
    event.preventDefault();
    $('.videoTitle').empty()
    $('.videoBody').empty()
    var videoId = $(this).attr('data-id')
    const getThisVideo = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/videos/' + videoId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseGetThisVideos = await response.json()
                console.log(responseGetThisVideos)
                var thisVideoTitle = '<h3>' + responseGetThisVideos[0].contentTitle + '</h3>'
                $('.videoTitle').append(thisVideoTitle)
                var thisVideo = '<video id="ldsVideo" class="ldsVideo" contextmenu="return false;" oncontextmenu="return false;" controls muted autoplay loop><source src="https://www.api.apajh-num-et-rik.fr/public' + responseGetThisVideos[0].video[0].videoLink + '" type="video/mp4"></video>'
                $('.videoBody').append(thisVideo)
                $('.deleteThisVideo').attr('data-videoId', responseGetThisVideos[0].video[0].id)
                $('.deleteThisVideo').attr('data-vl', responseGetThisVideos[0].video[0].videoLink)
                $('.deleteThisVideo').attr('data-contentId', responseGetThisVideos[0].id)
                $('.deleteThisVideo').attr('data-online', responseGetThisVideos[0].contentIsOnline)
            } else {
                console.error('Retour : ', response.status)
                console.log(localStorage.getItem('token'))
            }
        } catch (e) {
            console.log(e)
        }
    }
    getThisVideo()
})
//suppression d'une vidéo
$(document).on('click', '.deleteThisVideo', function (event) {
    event.preventDefault();
    var isOnline = $('.deleteThisVideo').attr('data-online')
    if (isOnline == 1) {
        $('.errorMessage').append('<p>Vous ne pouvez pas supprimer une vidéo en ligne.</p>')
    } else {
        const deleteThisVideo = async function (data) {
            try {
                let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/video', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                })
                if (response.ok) {
                    let deleteVideo = await response.json()
                    const deleteThisArticleVideo = async function (data) {
                        try {
                            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/article', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                },
                                body: JSON.stringify(data)
                            })
                            if (response.ok) {
                                let deleteVideo = await response.json()
                                window.location.reload();

                            } else {
                                console.error('Retour : ', response.status)
                                console.log(localStorage.getItem('token'))
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    deleteThisArticleVideo({
                        id: $('.deleteThisVideo').attr('data-contentId')
                    })
                   
                } else {
                    console.error('Retour : ', response.status)
                    console.log(localStorage.getItem('token'))
                }
            } catch (e) {
                console.log(e)
            }
        }
        deleteThisVideo({
            id: $(this).attr('data-videoId')
        })
    }
})
