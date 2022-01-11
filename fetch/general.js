$(document).ready(function () {
    console.log(localStorage.getItem('userGroup'))
    if (localStorage.getItem('userGroup') == 1 || localStorage.getItem('userGroup') == 2) {
        $('a.menu_item.admin').css('display', 'block')
    }

});

$('.logout').on('click', function () {
    localStorage.clear();
})

$('.menu_item').on('click', function () {
    $(this).css('background-color', '#FADCE6')
})

$('.nav').load('./navigation.html')

// Liste des vidéo à mettre online
$(document).ready(function () {
    const offlineNumber = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countOfflineVideos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseCountOfflineVideos = await response.json()
                if (responseCountOfflineVideos > 0) {
                    $('.offlineVideos').append('<a class="iconA" href="../views/adminLsf.html"><i class="fas fa-sign-language fa-2x icon" title="Vous avez ' + responseCountOfflineVideos + (responseCountOfflineVideos > 1 ? ' vidéos' : ' vidéo') + ' à contrôller et à mettre en ligne">' + responseCountOfflineVideos + '</i></a>')
                    $('.offlineVideosText').append('Vous avez ' + responseCountOfflineVideos + (responseCountOfflineVideos > 1 ? ' vidéos' : ' vidéo') + ' à contrôller et à mettre en ligne')
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    offlineNumber()
});
// Articles à mettre en ligne

$(document).ready(function () {
    const offlineNumber = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countOfflineArticle', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseCountOfflineArticle = await response.json()
                console.log(responseCountOfflineArticle)
                if (responseCountOfflineArticle > 0) {
                    $('.offlineVideos').append('<a class="iconA" href="../views/adminLsf.html"><i class="far fa-file-alt fa-2x icon" title="Vous avez ' + responseCountOfflineArticle + (responseCountOfflineArticle > 1 ? ' articles' : ' article') + ' à contrôller et à mettre en ligne">' + responseCountOfflineArticle + '</i></a>')
                    $('.offlineArticleText').append('Vous avez ' + responseCountOfflineArticle + (responseCountOfflineArticle > 1 ? ' articles' : ' article') + ' à contrôller et à mettre en ligne')
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    offlineNumber()
});
// Gestion de la fin de session
$(document).ready(function () {
    if (Date.now() > localStorage.getItem('logoutTime')) {
        console.log(Date.now())
        console.log(localStorage.getItem('logoutTime'))
        $('#logoutModal').modal('show')
        $('#modalBtn').on('click', function () {
            localStorage.clear();
            document.location.replace('./index.html');
        });
    }
})