$(document).ready(function () {
    const getMyArticles = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articleAdmin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseData = await response.json()
                console.log(responseData)
                for (var resp in responseData) {
                    if (responseData[resp].contentIsOnline == 1) {
                        var contentIsOnline = '<button type="button" data-id="' + responseData[resp].id + '" data-online="' + responseData[resp].contentIsOnline + '" class="btn btn-outline-success btn-sm isOnline">Online</button>'
                        var statusClass = 'onlineArticle'
                    } else if (responseData[resp].contentIsOnline == 0) {
                        var contentIsOnline = '<button type="button" data-id="' + responseData[resp].id + '" data-online="' + responseData[resp].contentIsOnline + '" class="btn btn-outline-danger btn-sm isOffline">Offline</button>'
                        var statusClass = 'offlineArticle'
                    }
                    var status = '<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"><button class="btn btn-primary btn-sm modif" data-bs-toggle="modal" data-bs-target="#modalModif" data-id="' + responseData[resp].id + '" type="button">Modifier</button></div>' +
                        '<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"><button class="btn btn-danger btn-sm delete" data-deleteId="' + responseData[resp].id + '" type="button">Supprimer</button></div>'
                    var date = new Date(responseData[resp].contentDate)
                    var options = { weekday: "short", year: "numeric", month: "long", day: "2-digit" };
                    var fullDate = date.toLocaleDateString("fr-FR", options)
                    var display = '<div class="row oneArticle"><div class="col-1"><span class="oeilSpan" title="Voir l\'article ' + (responseData[resp].id_contentType == 1 ? "IME" : "") + '" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fas fa-eye fa-2x oeil' + (responseData[resp].id_contentType == 1 ? " imeBlog" : " blog") + '" data-id="' + responseData[resp].id +
                        '"></i></span></div><div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 myTitle" title="' + responseData[resp].contentTitle + ' -> par ' + responseData[resp].user_description.firstname + ' ' +
                        responseData[resp].user_description.lastname + '">' +
                        ((responseData[resp].contentTitle.length <= 30) ? responseData[resp].contentTitle : responseData[resp].contentTitle.substr(0, 30) + '...') + '</div><div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">' + fullDate + '</div>' +
                        '<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 ' + statusClass + '">' + contentIsOnline + '</div>' + status + '</div>'
                    $('.articles').append(display)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getMyArticles({
        id_users: localStorage.getItem('id')
    })
})
$(document).on('click', '.isOffline', function (event) {
    event.preventDefault();
    $(this).addClass('isOnline')
    $(this).addClass('btn-outline-success')
    $(this).removeClass('btn-outline-danger')
    $(this).removeClass('isOffline')
    $(this).html('Online')
    const ContentIsOnline = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/online', {
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
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/offline', {
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

$(document).on('click', '.oeil', function (event) {
    event.preventDefault();
    $('.allPara').empty()
    $('.articleModal').empty()
    $('.carousel-inner').empty()
    var articleId = $(this).attr('data-id')
    const getAllArticles = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/' + articleId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseData = await response.json()
                var myArticle = '<div class="col-12 text-center"><p>' + responseData.contentTitle + '</p></div><div class="col-12 modalPhoto mb-3"><img class="img-fluid"' +
                    'src="https://www.api.apajh.jeseb.fr/public' + responseData.photo[0].photoLink + '" alt="' + responseData.photo[0].photoText + '"><br /><span class="">' + responseData.photo[0].photoText + '</span></div>'
                for (var para in responseData.paragraph) {
                    if (responseData.paragraph[para].title != null) {
                        var title = '<div class="title"><p>' + responseData.paragraph[para].title + '</p></div>'
                    } else {
                        var title = null
                    }
                    var allPara = '<div class="col-12 onePara">' + responseData.paragraph[para].text + '</div>'
                    $('.allPara').append(title)
                    for (var paraphoto in responseData.paragraph_photos) {
                        var allPara = '<div class="col-12 onePara">' + responseData.paragraph[para].text + '</div>'
                        if (responseData.paragraph_photos != null) {
                            if (responseData.paragraph_photos[paraphoto].id_paragraph == responseData.paragraph[para].id) {
                                var allPara = '<div class="row"><div class="col-6 semiPara"><img class="img-fluid photoP" src="https://www.api.apajh.jeseb.fr/public' + responseData.paragraph_photos[paraphoto].photoLink + '" alt="' + responseData.paragraph_photos[paraphoto].photoText + '"></div><div class="col-6 semiPara semi">' + responseData.paragraph[para].text + '</div></div>'
                            } else {
                                var allPara = '<div class="col-12 onePara">' + responseData.paragraph[para].text + '</div>'
                            }
                        }
                    }
                    $('.allPara').append(allPara)
                }
                $('.articleModal').append(myArticle)
                if (responseData.carousel == '1') {
                    $('.carousel').css('display', 'block')
                    var firstImg = '<div class="carousel-item active"><img src="https://www.api.apajh.jeseb.fr/public' + responseData.photo[0].photoLink + '" class="d-block w-100" alt="' + responseData.photo[0].photoText + '" title="' + responseData.photo[0].photoTitle + '"></div>'
                    for (var car in responseData.photo) {
                        var otherImg = '<div class="carousel-item"><img src="https://www.api.apajh.jeseb.fr/public' + responseData.photo[car].photoLink + '" class="d-block w-100" alt="' + responseData.photo[car].photoText + '" title="' + responseData.photo[car].photoTitle + '"></div>'
                        $('.carousel-inner').append(otherImg)
                    }
                    $('.carousel-inner').append(firstImg)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getAllArticles({
        id: $(this).attr('data-id')
    })
})
$(document).on('click', '.modif', function (event) {
    event.preventDefault();
    $('.allParaModif').empty()
    $('.articleModalModif').empty()
    $('.photos').empty()
    var articleId = $(this).attr('data-id')
    const getThisArticles = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/' + articleId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseThisArticle = await response.json()
                if (responseThisArticle.contentIsOnline == 1) {
                    $('.articleModalModif').append('<h3>Vous ne pouvez pas modifier un article qui est en ligne.</h3>')
                } else {
                    var myArticleModif = '<div class="col-12 text-center"><p class="mod">Titre de l\'article</p><input class="form-control mainTitle" type="text" value="' +
                        responseThisArticle.contentTitle + '" /></div><div class="text-center"><button class="btn btn-primary btn-sm modifValid mainTitleValid" data-id="' +
                        responseThisArticle.id + '" type="button">Valider la modification</button></div><div class="mainTitleValidation text-center"></div><div class="col-12 modalPhoto mb-3"><img class="img-fluid"' +
                        'src="https://www.api.apajh.jeseb.fr/public' + responseThisArticle.photo[0].photoLink + '" alt="' + responseThisArticle.photo[0].photoText +
                        '"><br /><p class="mod">Titre de la photo</p><input class="form-control" type="text" value="' + responseThisArticle.photo[0].photoText +
                        '" /></div><div class="text-center"><button class="btn btn-primary btn-sm modifValid" data-id="' + responseThisArticle.photo[0].id +
                        '" type="button">Valider la modification</button></div><div class="validationOk"></div>'
                    for (var para in responseThisArticle.paragraph) {
                        var allParaModif = '<div class="title"><p class="mod">Titre du paragraphe (facultatif)</p><input class="form-control paraTitle" type="text" value="' +
                            (responseThisArticle.paragraph[para].title == null ? '' : responseThisArticle.paragraph[para].title) + '" /></div>' +
                            '<div class="text-center"><button class="btn btn-primary btn-sm paraTitleModifValid" data-id="' + responseThisArticle.paragraph[para].id +
                            '" type="button">Valider la modification</button></div><div class="paraTitleValidation text-center"></div>' +
                            '<div class="col-12 onePara"><p class="mod">paragraphe :</p><textarea id="myModif" class="form-control">' + responseThisArticle.paragraph[para].text + '</textarea></div>' +
                            '<div class="text-center"><button class="btn btn-primary btn-sm paraTextModifValid" data-id="' + responseThisArticle.paragraph[para].id +
                            '" type="button">Valider la modification</button></div><div class="paraTextValidation text-center"></div>'
                        for (var paraphoto in responseThisArticle.paragraph_photos) {
                            var allParaModif = '<div class="title"><p class="mod">Titre du paragraphe (facultatif)</p><input class="form-control paraTitle" type="text" value="' +
                                (responseThisArticle.paragraph[para].title == null ? '' : responseThisArticle.paragraph[para].title) + '" /></div>' +
                                '<div class="text-center"><button class="btn btn-primary btn-sm paraTitleModifValid" data-id="' + responseThisArticle.paragraph[para].id +
                                '" type="button">Valider la modification</button></div><div class="paraTitleValidation text-center"></div>' +
                                '<div class="col-12 onePara"><p class="mod">paragraphe :</p><textarea id="myModif" class="form-control">' + responseThisArticle.paragraph[para].text + '</textarea></div>' +
                                '<div class="text-center"><button class="btn btn-primary btn-sm paraTextModifValid" data-id="' + responseThisArticle.paragraph[para].id +
                                '" type="button">Valider la modification</button></div><div class="paraTextValidation text-center"></div>'
                            if (responseThisArticle.paragraph_photos != null) {
                                if (responseThisArticle.paragraph_photos[paraphoto].id_paragraph == responseThisArticle.paragraph[para].id) {
                                    var allParaModif = '<div class="row"><div class="col-6 semiPara"><img class="img-fluid photoP" src="https://www.api.apajh.jeseb.fr/public' +
                                        responseThisArticle.paragraph_photos[paraphoto].photoLink + '" alt="' +
                                        responseThisArticle.paragraph_photos[paraphoto].photoText + '"></div><div class="col-6 semiPara semi"><p class="mod">demi-paragraphe :</p><textarea id="myModif" class="form-control">' +
                                        responseThisArticle.paragraph[para].text + '</textarea>' +
                                        '<button class="btn btn-primary btn-sm paraSemiTextModifValid" data-id="' + responseThisArticle.paragraph[para].id +
                                        '" type="button">Valider la modification</button></div><div class="paraSemiTextValidation text-center"></div></div>'
                                } else {
                                    var allParaModif = '<div class="title"><p class="mod">Titre du paragraphe (facultatif)</p><input class="form-control paraTitle" type="text" value="' +
                                        (responseThisArticle.paragraph[para].title == null ? '' : responseThisArticle.paragraph[para].title) + '" /></div>' +
                                        '<div class="text-center"><button class="btn btn-primary btn-sm paraTitleModifValid" data-id="' + responseThisArticle.paragraph[para].id +
                                        '" type="button">Valider la modification</button></div><div class="paraTitleValidation text-center"></div>' +
                                        '<div class="col-12 onePara"><p class="mod">paragraphe :</p><textarea id="myModif" class="form-control">' + responseThisArticle.paragraph[para].text + '</textarea></div>' +
                                        '<div class="text-center"><button class="btn btn-primary btn-sm paraTextModifValid" data-id="' + responseThisArticle.paragraph[para].id +
                                        '" type="button">Valider la modification</button></div><div class="paraTextValidation text-center"></div>'
                                }
                            }
                        }
                        $('.allParaModif').append(allParaModif)
                    }
                    $('.articleModalModif').append(myArticleModif)
                    if (responseThisArticle.carousel == '1') {
                        for (var car in responseThisArticle.photo) {
                            var otherImgModif = '<div class="photosModif text-center"><img src="https://www.api.apajh.jeseb.fr/public' + responseThisArticle.photo[car].photoLink + '" class="d-block w-100" alt="' + responseThisArticle.photo[car].photoText + '" title="' + responseThisArticle.photo[car].photoTitle + '"></div>'
                            $('.photos').append(otherImgModif)
                        }
                    }
                }
            } else {
                console.error('Retour : ', response.status)
                console.log('toto')
            }
        } catch (e) {
            console.log(e)
        }
    }
    getThisArticles()
})

// Modification du titre de l'article
$(document).on('click', '.mainTitleValid', function (event) {
    event.preventDefault();
    var articleIdd = $(this).attr('data-id')
    async function modifTitle(data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/article/' + articleIdd, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseDataArticle = await response.json()
                $('.mainTitleValidation').append('<p class="isOk">La modification du titre à bien été prise en compte.</p>')
                setTimeout(function () {
                    $('.mainTitleValidation').fadeOut().empty();
                }, 5000);

            } else {
                console.error('Retour : ', response.status)
                $('.mainTitleValidation').append('<p class="isNotOk">Une erreur est survenue durant la modification du titre, merci de renouveller l\'opération.</p>')
                setTimeout(function () {
                    $('.mainTitleValidation').fadeOut().empty();
                }, 5000);
            }
        } catch (e) {
            console.log(e)
        }
    }
    modifTitle({
        contentTitle: $('.mainTitle').val()
    })
})

// Modification du titre d'un paragraphe (valide aussi le paragraphe concerné)
$(document).on('click', '.paraTitleModifValid', function (event) {
    event.preventDefault();
    var result = $(this).parent().next()
    $('.paraTitleValidation').css('display', 'block')
    async function modifTitle(data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/text', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseDataArticle = await response.json()
                result.append('<p class="isOk">La modification du titre du paragraphe à bien été prise en compte.</p>')
                setTimeout(function () {
                    $('.paraTitleValidation').fadeOut().empty();
                }, 5000);
            } else {
                console.error('Retour : ', response.status)
                result.append('<p class="isNotOk">Une erreur est survenue durant la modification du titre du paragraphe, merci de renouveller l\'opération.</p>')
                setTimeout(function () {
                    $('.paraTitleValidation').fadeOut().empty();
                }, 5000);
            }
        } catch (e) {
            console.log(e)
        }
    }
    modifTitle({
        title: $(this).parent().prev().find('input').val(),
        id: $(this).attr('data-id'),
        text: $(this).parent().next().next().find('textarea').val()
    })
})

// Modification du texte d'un paragraphe (valide aussi son titre)
$(document).on('click', '.paraTextModifValid', function (event) {
    event.preventDefault();
    var result = $(this).parent().next()
    $('.paraTextValidation').css('display', 'block')
    async function modifTitle(data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/text', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseDataArticle = await response.json()
                result.append('<p class="isOk">La modification du titre du paragraphe à bien été prise en compte.</p>')
                setTimeout(function () {
                    $('.paraTextValidation').fadeOut().empty();
                }, 5000);
            } else {
                console.error('Retour : ', response.status)
                result.append('<p class="isNotOk">Une erreur est survenue durant la modification du titre du paragraphe, merci de renouveller l\'opération.</p>')
                setTimeout(function () {
                    $('.paraTextValidation').fadeOut().empty();
                }, 5000);
            }
        } catch (e) {
            console.log(e)
        }
    }
    modifTitle({
        title: $(this).parent().prev().prev().prev().prev().find('input').val(),
        id: $(this).attr('data-id'),
        text: $(this).parent().prev().find('textarea').val()
    })
})
// Modification d'un semi-paragraphe
$(document).on('click', '.paraSemiTextModifValid', function (event) {
    event.preventDefault();
    var result = $(this).parent().next()
    var title = null
    var text = $(this).parent().prev().find('textarea').val()
    $('.paraSemiTextValidation').css('display', 'block')
    async function modifTitle(data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/text', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseDataArticle = await response.json()
                result.append('<p class="isOk">La modification du titre du paragraphe à bien été prise en compte.</p>')
                setTimeout(function () {
                    $('.paraSemiTextValidation').fadeOut().empty();
                }, 5000);
            } else {
                console.error('Retour : ', response.status)
                result.append('<p class="isNotOk">Une erreur est survenue durant la modification du titre du paragraphe, merci de renouveller l\'opération.</p>')
                setTimeout(function () {
                    $('.paraSemiTextValidation').fadeOut().empty();
                }, 5000);
            }
        } catch (e) {
            console.log(e)
        }
    }
    modifTitle({
        title: null,
        id: $(this).attr('data-id'),
        text: $(this).parent().find('textarea').val()
    })
})

// rechargement à la fermeture de la modal de modification
$(document).on('click', '.closer', function (event) {
    event.preventDefault();
    window.location.reload();
})