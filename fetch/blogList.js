$(document).ready(function () {
    const getMyArticles = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/myArticle', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseData = await response.json()
                for (var resp in responseData) {
                    if (responseData[resp].contentIsOnline == 1) {
                        var contentIsOnline = 'En ligne'
                        var statusClass = 'onlineArticle'
                    } else if (responseData[resp].contentIsOnline == 0) {
                        var contentIsOnline = 'Hors ligne'
                        var statusClass = 'offlineArticle'
                    }
                    var date = new Date(responseData[resp].contentDate)
                    var options = { weekday: "short", year: "numeric", month: "long", day: "2-digit" };
                    var fullDate = date.toLocaleDateString("fr-FR", options)
                    if (responseData[resp].contentIsOnline == 0) {
                        var display = '<div class="row oneArticle"><div class="col-1"><a href="" title="Voir mon article" data-bs-toggle="modal" data-bs-target="#myArticleModal"><i class="fas fa-eye fa-2x oeil' +
                            (responseData[resp].id_contentType == 1 ? " imeBlog" : " blog") + '" data-id="' + responseData[resp].id +
                            '"></i></a></div>' +
                            '<div class="col-3 myTitle">' +
                            ((responseData[resp].contentTitle.length <= 30) ? responseData[resp].contentTitle : responseData[resp].contentTitle.substr(0, 30) + '...') + '</div><div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">' +
                            fullDate + '</div>' +
                            '<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 ' + statusClass + '">' + contentIsOnline + '</div>' +
                            '<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"><button class="btn btn-primary btn-sm modif" data-bs-toggle="modal" data-bs-target="#modalModif" data-id="' + responseData[resp].id + '" type="button">Modifier</button></div>' +
                            '<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"><button class="btn btn-danger btn-sm deleteArticle" data-bs-toggle="modal" data-bs-target="#deleteArticleModal" data-id="' + responseData[resp].id + '" type="button">Supprimer</button></div></div>'
                    } else {
                        var display = '<div class="row oneArticle"><div class="col-1"><a href="" title="Voir mon article" data-bs-toggle="modal" data-bs-target="#myArticleModal"><i class="fas fa-eye fa-2x oeil' +
                            (responseData[resp].id_contentType == 1 ? " imeBlog" : " blog") + '" data-id="' + responseData[resp].id +
                            '"></i></a></div>' +
                            '<div class="col-3 myTitle">' +
                            ((responseData[resp].contentTitle.length <= 30) ? responseData[resp].contentTitle : responseData[resp].contentTitle.substr(0, 30) + '...') + '</div><div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">'
                            + fullDate + '</div>' +
                            '<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 ' + statusClass + '">' + contentIsOnline + '</div>' +
                            '<div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">Pas de modification possible.</div></div>'
                    }
                    $('.articles').append(display)

                }
                console.log(responseData)
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
                $i = 0;
                if (responseThisArticle.contentIsOnline == 1) {
                    $('.articleModalModif').append('<h3>Vous ne pouvez pas modifier un article qui est en ligne.</h3>')
                } else {
                    var myArticleModif = '<div class="col-12 text-center"><p class="mod">Titre de l\'article</p><input class="form-control mainTitle" type="text" value="' +
                        responseThisArticle.contentTitle + '" /></div><div class="text-center"><button class="btn btn-primary btn-sm modifValid mainTitleValid mt-2" data-id="' +
                        responseThisArticle.id + '" type="button">Valider la modification</button></div><div class="mainTitleValidation text-center"></div><div class="col-12 modalPhoto mb-3"><img class="img-fluid"' +
                        'src="https://www.api.apajh.jeseb.fr/public' + responseThisArticle.photo[0].photoLink + '" alt="' + responseThisArticle.photo[0].photoText +
                        '"><br /><p class="mod">Titre de la photo</p><input class="form-control" type="text" value="' + responseThisArticle.photo[0].photoText +
                        '" /></div><div class="text-center"><button class="btn btn-primary btn-sm modifValid" data-id="' + responseThisArticle.photo[0].id +
                        '" type="button">Valider la modification</button></div><div class="validationOk"></div>'
                    for (var para in responseThisArticle.paragraph) {
                        $i++;
                        var textareaModif = '<textarea id="myModif" class="form-control myModif myModif' + $i + '" data-class="myModif' + $i + '">' + responseThisArticle.paragraph[para].text + '</textarea>'
                        var allParaModif = '<div class="title"><p class="mod">Titre du paragraphe (facultatif)</p><input class="form-control paraTitle" type="text" value="' +
                            (responseThisArticle.paragraph[para].title == null ? '' : responseThisArticle.paragraph[para].title) + '" /></div>' +
                            '<div class="text-center"><button class="btn btn-primary btn-sm paraTitleModifValid mt-2" data-id="' + responseThisArticle.paragraph[para].id +
                            '" type="button">Valider la modification</button></div><div class="paraTitleValidation text-center"></div>' +
                            '<div class="col-12 onePara"><p class="mod">paragraphe :</p>' + textareaModif + '</div>' +
                            '<div class="text-center"><button class="btn btn-primary btn-sm paraTextModifValid mt-2" data-id="' + responseThisArticle.paragraph[para].id +
                            '" type="button">Valider la modification</button></div><div class="paraTextValidation text-center"></div>'
                        for (var paraphoto in responseThisArticle.paragraph_photos) {
                            var allParaModif = '<div class="title"><p class="mod">Titre du paragraphe (facultatif)</p><input class="form-control paraTitle" type="text" value="' +
                                (responseThisArticle.paragraph[para].title == null ? '' : responseThisArticle.paragraph[para].title) + '" /></div>' +
                                '<div class="text-center"><button class="btn btn-primary btn-sm paraTitleModifValid mt-2" data-id="' + responseThisArticle.paragraph[para].id +
                                '" type="button">Valider la modification</button></div><div class="paraTitleValidation text-center"></div>' +
                                '<div class="col-12 onePara"><p class="mod">paragraphe :</p>' + textareaModif + '</div>' +
                                '<div class="text-center"><button class="btn btn-primary btn-sm paraTextModifValid mt-2" data-id="' + responseThisArticle.paragraph[para].id +
                                '" type="button">Valider la modification</button></div><div class="paraTextValidation text-center"></div>'
                            if (responseThisArticle.paragraph_photos != null) {
                                if (responseThisArticle.paragraph_photos[paraphoto].id_paragraph == responseThisArticle.paragraph[para].id) {
                                    var allParaModif = '<div class="row"><div class="col-6 semiPara"><img class="img-fluid photoP" src="https://www.api.apajh.jeseb.fr/public' +
                                        responseThisArticle.paragraph_photos[paraphoto].photoLink + '" alt="' +
                                        responseThisArticle.paragraph_photos[paraphoto].photoText + '"><button class="btn btn-primary btn-sm photoModif mt-1">Modifier la photo</button><br /><span class="photoModification mt-4">Ajouter le titre de votre nouvelle photo</span><br /><input class="form-control photoModificationText" type="text" /><input class="form-control photoModification semiParaPhotoModif mt-1" data-paragraph="' + responseThisArticle.paragraph_photos[paraphoto].id_paragraph + '" data-photoName="' + responseThisArticle.paragraph_photos[paraphoto].fileName + '" data-id="' + responseThisArticle.paragraph_photos[paraphoto].id + '" type="file" /></div><div class="col-6 semiPara semi"><p class="mod">demi-paragraphe :</p>' + textareaModif +
                                        '<button class="btn btn-primary btn-sm paraSemiTextModifValid mt-1" data-id="' + responseThisArticle.paragraph[para].id +
                                        '" type="button">Valider la modification</button></div><div class="paraSemiTextValidation text-center"></div></div>'
                                } else {
                                    var allParaModif = '<div class="title"><p class="mod">Titre du paragraphe (facultatif)</p><input class="form-control paraTitle" type="text" value="' +
                                        (responseThisArticle.paragraph[para].title == null ? '' : responseThisArticle.paragraph[para].title) + '" /></div>' +
                                        '<div class="text-center"><button class="btn btn-primary btn-sm paraTitleModifValid mt-2" data-id="' + responseThisArticle.paragraph[para].id +
                                        '" type="button">Valider la modification</button></div><div class="paraTitleValidation text-center"></div>' +
                                        '<div class="col-12 onePara"><p class="mod">paragraphe :</p>' + textareaModif + '</div>' +
                                        '<div class="text-center"><button class="btn btn-primary btn-sm paraTextModifValid mt-2" data-id="' + responseThisArticle.paragraph[para].id +
                                        '" type="button">Valider la modification</button></div><div class="paraTextValidation text-center"></div>'
                                }
                            }
                        }
                        $('.allParaModif').append(allParaModif)
                    }
                    $('.articleModalModif').append(myArticleModif)
                    if (responseThisArticle.carousel == '1') {
                        var photoCarousel = responseThisArticle.photo.shift()
                        for (var car in responseThisArticle.photo) {
                            var otherImgModif = '<div class="photosModif"><img src="https://www.api.apajh.jeseb.fr/public' + responseThisArticle.photo[car].photoLink + '" class="d-block w-100" alt="' + responseThisArticle.photo[car].photoText + '" title="' + responseThisArticle.photo[car].photoTitle + '"><button class="btn btn-danger btn-sm deleteCarouselPhoto" type="button" data-id="' + responseThisArticle.photo[car].id + '">Supprimer</button><hr /></div>'
                            $('.photos').append(otherImgModif)
                        }
                        $('.hiddenArticleId').attr('value', responseThisArticle.id)
                    }
                }
                // intégration de ckeditor
                $('textarea').each(function () {
                    let editor;
                    ClassicEditor
                        .create(document.querySelector('.' + $(this).attr('data-class')), {
                            language: {
                                ui: 'fr',
                                content: 'fr'
                            },
                            toolbar: ['heading', '|', 'bold', '|', 'italic', '|', 'link', '|', 'bulletedList', '|', 'numberedList', '|', 'blockQuote'],
                            heading: {
                                options: [
                                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' }
                                ]
                            }
                        })
                        .then(newEditor => {
                            editor = newEditor;
                        })
                        .catch(e => {
                            console.log(e);
                        });
                });
            } else {
                console.error('Retour : ', response.status)
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
        text: $(this).parent().prev().find('.ck-editor__editable').children().prevObject[0].innerHTML
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
        text: $(this).prev().find('.ck-editor__editable').children().prevObject[0].innerHTML
    })
})
// rechargement à la fermeture de la modal de modification
$(document).on('click', '.closer', function (event) {
    event.preventDefault();
    window.location.reload();
})

// Faire apparaitre la modification de photo semi-paragraphe

$(document).on('click', '.photoModif', function (event) {
    event.preventDefault();
    $('input.photoModification').css('display', 'block')
    $('input.photoModificationText').css('display', 'block')
    $('span.photoModification').css('display', 'block')
    $('.photoModif').addClass('photoModifNot')
})
$(document).on('click', '.photoModifNot', function (event) {
    event.preventDefault();
    $('input.photoModification').css('display', 'none')
    $('input.photoModificationText').css('display', 'none')
    $('span.photoModification').css('display', 'none')
    $('.photoModifNot').removeClass('photoModifNot')
})

// Modification de photo semi-paragraphe
$(document).on('change', '.photoModification', function (event) {
    event.preventDefault();
    const deleteParaPhotoPhoto = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/text-photo', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                const formData = new FormData();
                const file = event.target.files[0];
                formData.set('file', file);
                formData.set('photoTitle', $('.photoModificationText').val());
                formData.set('photoText', $('.photoModificationText').val());
                formData.set('id_paragraph', $('.photoModification.semiParaPhotoModif').attr('data-paragraph'))
                try {
                    let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/text-photo', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: formData
                    })
                    if (response.ok) {
                        let responseData = await response.json()
                        window.location.reload();
                    } else {
                        console.error('Retour : ', response.status)
                    }
                } catch (e) {
                    console.log(e)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    deleteParaPhotoPhoto({
        fileName: $(this).attr('data-photoName')
    })
})
//Supprimer une photo du carousel
$(document).on('click', '.deleteCarouselPhoto', function (event) {
    event.preventDefault();
    const deleteCarouselPhoto = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/photo', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    deleteCarouselPhoto({
        id: $(this).attr('data-id')
    })
})
// Ajouter une nouvelle photo dans la modification
$(document).on('click', '.addNewPhoto', function (event) {
    event.preventDefault();
    $('.addPhotoFileCarousel').css('display', 'block')
    $('.addPhotoTitleCarousel').css('display', 'block')
    $('.addNewPhotoSpan').css('display', 'block')
    $('.addNewPhoto').addClass('addNewPhotoNot')
})
$(document).on('click', '.addNewPhotoNot', function (event) {
    event.preventDefault();
    $('.addPhotoFileCarousel').css('display', 'none')
    $('.addPhotoTitleCarousel').css('display', 'none')
    $('.addNewPhotoSpan').css('display', 'none')
    $('.addNewPhoto').removeClass('addNewPhotoNot')
})

$('.addOnePhotoToCarousel').on('change', function (event) {
    event.preventDefault();
    addOnePhoto(event)
});
const addOnePhoto = async function (event) {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.set('file', file);
    formData.set('photoTitle', $('.addPhotoTitleCarousel').val());
    formData.set('photoText', $('.addPhotoTitleCarousel').val());
    formData.set('id_content', $('.hiddenArticleId').val())
    try {
        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/photo', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        })
        if (response.ok) {
            let responseData = await response.json()
            window.location.reload();
        } else {
            console.error('Retour : ', response.status)
        }
    } catch (e) {
        console.log(e)
    }
}
// Supprimer un article
$(document).on('click', '.deleteArticle', function (event) {
    event.preventDefault();
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
               $('.articleTitle').append('"' + responseThisArticle.contentTitle + '"')
               $('.deleteArticleValidation').attr('data-id', responseThisArticle.id)
               
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getThisArticles()
})
//validation de suppression d'article
$(document).on('click', '.deleteArticleValidation', function (event) {
    event.preventDefault();
    const deleteThisArticles = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/article', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseThisArticle = await response.json()
                window.location.reload();
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    deleteThisArticles({
        id: $(this).attr('data-id')
    })
})
