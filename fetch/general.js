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
                    if (localStorage.getItem('userGroup') == 1 || localStorage.getItem('userGroup') == 2) {
                        $('.offlineVideos').append('<a class="iconA" href="../views/adminLsf.html"><i class="fas fa-sign-language fa-2x icon" title="Vous avez ' + responseCountOfflineVideos + (responseCountOfflineVideos > 1 ? ' vidéos' : ' vidéo') + ' à contrôller et à mettre en ligne">' + responseCountOfflineVideos + '</i></a>')
                        $('.offlineVideosText').append('Vous avez ' + responseCountOfflineVideos + (responseCountOfflineVideos > 1 ? ' vidéos' : ' vidéo') + ' à contrôller et à mettre en ligne')
                    }
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
                    if (localStorage.getItem('userGroup') == 1 || localStorage.getItem('userGroup') == 2) {
                        $('.offlineVideos').append('<a class="iconA" href="../views/adminBlog.html"><i class="far fa-file-alt fa-2x icon" title="Vous avez ' + responseCountOfflineArticle + (responseCountOfflineArticle > 1 ? ' articles' : ' article') + ' à contrôller et à mettre en ligne">' + responseCountOfflineArticle + '</i></a>')
                        $('.offlineArticleText').append('Vous avez ' + responseCountOfflineArticle + (responseCountOfflineArticle > 1 ? ' articles' : ' article') + ' à contrôller et à mettre en ligne')
                    }
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

// Mes vidéos
$(document).ready(function () {
    const countMyVidéos = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countMyVideos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseMyVideos = await response.json()
                $('.myVideos').append('<span class="myvideos">Tu ' + (responseMyVideos.online == 0 ? 'n\'as pas' : 'as') + ' contribué à mettre en ligne <span class="' + (responseMyVideos.online == 0 ? '' : 'onlineNumber') + '">' + (responseMyVideos.online == 0 ? 'de' : responseMyVideos.online) +
                    '</span> ' + (responseMyVideos.online <= 1 ? 'vidéo ' : 'vidéos ') + 'LSF et ' + (responseMyVideos.offline == 0 ? 'tu n\'as ' : 'tu as ') + '<span class="' + (responseMyVideos.offline == 0 ? '' : 'offlineNumber') + '">' + (responseMyVideos.offline == 0 ? 'aucune' : responseMyVideos.offline) + '</span> ' + (responseMyVideos.offline <= 1 ? 'vidéo' : 'vidéos') + ' à faire contôler.</span>')
                const countVideos = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countVideos', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        if (response.ok) {
                            let responseVideos = await response.json()
                            $('.totalVideos').append('Le site Num & Rik contient à ce jour<br /> près de <span class="bold">' + responseVideos + '</span> vidéos LSF et')
                            if (responseMyVideos.online == 0) {
                                $('.myVideosPercent').append('')
                            } else {
                                var percent = Math.round(((responseMyVideos.online / responseVideos) * 100) * 100) / 100
                                $('.myVideosPercent').append('<span>Tu as contribué à mettre en ligne <span class="percent">' + percent + '%</span> des vidéos LSF de Num & Rik ! <span class="great">' + (percent < 5 ? ' Tu es en bonne voie !' : (percent < 15 ? ' Continue à alimenter le site !' : (percent < 35 ? ' N\'en fait pas trop !' : ' Sans toi Num & Rik n\'existerait pas !'))) + '</span></span>')
                            }
                        } else {
                            console.error('Retour : ', response.status)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                countVideos()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    countMyVidéos()
});

//Mes articles
$(document).ready(function () {
    const countArticles = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countMyArticle', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseMyArticles = await response.json()
                console.log(responseMyArticles)
                $('.myArticles').append('<span class="myarticles">Tu ' + (responseMyArticles.online == 0 ? 'n\'as pas encore' : 'as') + ' contribué à mettre en ligne <span class="' + (responseMyArticles.online == 0 ? '' : 'onlineNumber') + '">' + (responseMyArticles.online == 0 ? 'd\'' : responseMyArticles.online) +
                    '</span> ' + (responseMyArticles.online <= 1 ? 'article ' : 'articles ') + ' du blog et ' + (responseMyArticles.offline == 0 ? 'tu n\'as ' : 'tu as ') + '<span class="' + (responseMyArticles.offline == 0 ? '' : 'offlineNumber') + '">' + (responseMyArticles.offline == 0 ? 'aucun' : responseMyArticles.offline) + '</span> ' + (responseMyArticles.offline <= 1 ? 'article' : 'articles') + ' à faire contôler.</span>')
                const countArticles = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countOnlineArticle', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        if (response.ok) {
                            let responseArticles = await response.json()
                            $('.totalArticles').append(' près de <span class="bold">' + responseArticles + '</span> articles.')
                            if (responseMyArticles.online == 0) {
                                $('.myArticlesPercent').append('')
                            } else {
                                var percent = Math.round(((responseMyArticles.online / responseArticles) * 100) * 100) / 100
                                $('.myArticlesPercent').append('<span>Tu as contribué à mettre en ligne <span class="percent">' + percent + '%</span> des articles du blog de Num & Rik ! <span class="great">' + (percent < 5 ? ' Tu es en bonne voie !' : (percent < 15 ? ' Continue à alimenter le site !' : (percent < 35 ? ' N\'en fait pas trop !' : ' Sans toi Num & Rik n\'existerait pas !'))) + '</span></span>')
                            }
                        } else {
                            console.error('Retour : ', response.status)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                countArticles()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    countArticles()
});

// nombre d'utilisateurs
$(document).ready(function () {
    const countUsers = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countuser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseUsers = await response.json()
                $('.infosUsers').append('A ce jour, nous comptons <span class="bold">' + responseUsers.nombre + '</span> <br />utilisateurs enregistrés !')
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    countUsers()
});
// nombre d'utilisateurs pro
$(document).ready(function () {
    const countProUsers = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countprouser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseProUsers = await response.json()
                $('.infosProUsers').append('<span class="bold">' + responseProUsers.nombre + '</span> sont des professionnels <br />du service. ')
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    countProUsers()
});
// messages
$(document).ready(function () {
    const viewConversation = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countnomess', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseData = await response.json()
                console.log(responseData)
                if (responseData > 0) {
                    $('.offlineVideos').append('<a class="iconA" href="../views/message.html"><i class="far fa-envelope fa-2x" title="Vous avez ' + responseData + (responseData > 1 ? ' messages' : ' message') + ' à lire"></i></a>')
                }

            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    viewConversation()
})

$("#show_hide_password a").on('click', function (event) {
    event.preventDefault();
    if ($('#show_hide_password input').attr("type") == "text") {
        $('#show_hide_password input').attr('type', 'password');
        $('#show_hide_password i').addClass("fa-eye-slash");
        $('#show_hide_password i').removeClass("fa-eye");
    } else if ($('#show_hide_password input').attr("type") == "password") {
        $('#show_hide_password input').attr('type', 'text');
        $('#show_hide_password i').removeClass("fa-eye-slash");
        $('#show_hide_password i').addClass("fa-eye");
    }
});
