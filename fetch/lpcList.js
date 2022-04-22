$(document).ready(function() {
    const getWordList = async function(data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/lpcvideo', {
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
                        var btn = '<span data-id="' + responseGetVideos[resp].id + '" data-online="' + responseGetVideos[resp].contentIsOnline +
                        '" class="isOnline">Online</span>'
                    } else {
                        var btn = '<span data-id="' + responseGetVideos[resp].id + '" data-online="' + responseGetVideos[resp].contentIsOnline +
                        '" class="isOffline">Offline</span>'
                    }
                    var date = new Date(responseGetVideos[resp].contentDate)
                    var options = {weekday: "short", year: "numeric", month: "long", day: "2-digit"};
                    var fullDate = date.toLocaleDateString("fr-FR", options)
                    var display = '<div class="row oneArticle"><div class="col-3 text-center"><span>' + responseGetVideos[resp].contentTitle + '</span></div>' +
                    '<div class="col-3 text-center"><span>' + fullDate + '</span></div><div class="col-3 text-center">' + btn +
                    '</div><div class="col-3 text-center"><i class="fas fa-eye fa-2x voir" data-id="' + responseGetVideos[resp].id + '" data-bs-toggle="modal" data-bs-target="#videoModal"></i></div></div>'
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
// Voir la vidéo dans la modale
$(document).on('click', '.voir', function(event) {
    event.preventDefault();
    $('.videoTitle').empty()
    $('.videoBody').empty()
    var videoId = $(this).attr('data-id')
    const getThisVideo = async function(data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/lpcvideo/' + videoId , {
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
                var thisVideo = '<video id="ldsVideo" class="ldsVideo" contextmenu="return false;" oncontextmenu="return false;" controls><source src="https://www.api.apajh.jeseb.fr/public'+ responseGetThisVideos[0].long_video[0].videoLink + '" type="video/mp4"></video>'
                $('.videoBody').append(thisVideo)
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