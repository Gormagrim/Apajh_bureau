// Pour ajouter un article
$('.addBlogContent').on('click', function (event) {
    event.preventDefault();
    $('.mainPhoto').css('display', 'block')
    const addBlogContent = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                $('#articleId').val(responseData.Contenu.id)
                $('.firstStepArticle').css('display', 'none')
                const getBlogContent = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/articles/' + responseData.Contenu.id, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(data)
                        })
                        if (response.ok) {
                            let responseArticle = await response.json()
                            console.log(responseArticle)
                            $('.validTitle').append('<p class="articleTitleOk">Le titre de votre article à bien été créé.</p>')
                            $('.mainTitle').html('<p>Vous êtes en train d\'écrire l\'article "' + responseArticle.contentTitle + '"</p>')
                            setTimeout(function () {
                                $('.validTitle').fadeOut().empty()
                            }, 5000);
                            $('.mainPhoto').attr('display', 'block')
                        } else {
                            console.error('Retour : ', response.status)
                            $('.validTitle').append('<p class="articleTitleError">Un erreur est survenue durant la création de votre article, merci de rééssayer.</p>')
                            setTimeout(function () {
                                $('.validTitle').fadeOut().empty()
                            }, 5000);
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                getBlogContent()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addBlogContent({
        contentTitle: $('.newBlogContent').val(),
        contentType: $('.newBlogContentType').val()
    })
})

//ajout de la photo principale
$('.addMainPhoto').on('change', function (event) {
    event.preventDefault();
    addMainPhoto(event)
});
const addMainPhoto = async function (event) {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.set('file', file);
    formData.set('photoTitle', $('.photoTitle').val());
    formData.set('photoText', $('.photoTitle').val());
    formData.set('id_content', $('#articleId').val())
    $('.mainPhoto').css('display', 'none')
    $('.validTitle').css('display', 'block')
    try {
        let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/photo', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        })
        if (response.ok) {
            let responseData = await response.json()
            const getBlogContent = async function (data) {
                try {
                    let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/articles/' + $('#articleId').val(), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify(data)
                    })
                    if (response.ok) {
                        let responseArticle = await response.json()
                        $('.firstArticle').css('display', 'block')
                        $('.firstPhoto').attr('src', 'https://www.api.apajh-num-et-rik.fr/public/' + responseArticle.photo[0].photoLink)
                        $('.firstPhoto').attr('alt', responseArticle.photo[0].photoTitle)
                        $('.firstPhotoTitle').append(responseArticle.photo[0].photoTitle)
                        $('.photoNumber').empty()
                        var nbPara = (responseArticle.photo).length
                        if ((responseArticle.paragraph_photos).length != null) {
                            var nbParaPhoto = (responseArticle.paragraph_photos).length
                        } else {
                            var nbParaPhoto = 0
                        }
                        var nbrePhoto = nbPara + nbParaPhoto
                         if (nbrePhoto < 3) {
                             $('.photoNumber').css('display', 'block')
                             $('.photoNumber').append('Votre article comporte ' + nbrePhoto + (nbrePhoto > 1 ? ' photos' : ' photo') + ', ajoutez en ' + (3 - nbrePhoto) + ' de plus pour pouvoir ajouter une galerie de photos.')
                         }
                         $('.articleTitle').append(responseArticle.contentTitle)
                         if (nbrePhoto >= 3) {
                             $('.galeryValidation').css('display', 'block')
                             $('.galeryBtn').append('<button type="button" data-id="' + responseArticle.id + '" class="btn btn-outline-danger btn-sm carouselOn">Non</button>')
                         }
                        $('.validTitle').append('<p class="articleTitleOk">La photo principale de votre article à bien été ajoutée.</p>')
                        setTimeout(function () {
                            $('.validTitle').fadeOut().empty()
                        }, 5000);
                    } else {
                        console.error('Retour : ', response.status)
                        $('.validTitle').append('<p class="articleTitleError">Un erreur est survenue durant l\'ajout de votre photo, merci de rééssayer.</p>')
                        setTimeout(function () {
                            $('.validTitle').fadeOut().empty()
                        }, 5000);
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            getBlogContent()
        } else {
            console.error('Retour : ', response.status)
        }
    } catch (e) {
        console.log(e)
    }
}

// Ajout du premier paragraphe
$('.addFirstArticle').on('click', function (event) {
    event.preventDefault();
    $('.firstArticle').css('display', 'none')
    $('.addAny').css('display', 'block')
    $('.validTitle').css('display', 'block')
    const addBlogContent = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                const getBlogContent = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/articles/' + $('#articleId').val(), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(data)
                        })
                        if (response.ok) {
                            let responseArticle = await response.json()
                            $('.paragrafId').append('<p>id= ' + responseArticle.paragraph[0].id + '</p>')
                            $('.getFirstParagraf').append(responseArticle.paragraph[0].text)
                            $('.mainTitle').html('<p>Vous êtes en train d\'écrire l\'article "' + responseArticle.contentTitle + '"</p> <i class="fas fa-eye fa-2x oeil oeilConstru" data-bs-toggle="modal" data-bs-target="#staticBackdrop" title="Voir ou modifier mon article" data-id="' + responseArticle.id + '"></i>')
                            $('.validTitle').append('<p class="articleTitleOk">Le premier paragraphe de votre article à bien été ajouté.</p>')
                            setTimeout(function () {
                                $('.validTitle').fadeOut().empty()
                            }, 5000);
                        } else {
                            console.error('Retour : ', response.status)
                            $('.validTitle').append('<p class="articleTitleError">Un erreur est survenue durant l\'ajout de votre premier paragraphe, merci de rééssayer.</p>')
                            setTimeout(function () {
                                $('.validTitle').fadeOut().empty()
                            }, 5000);
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                getBlogContent()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addBlogContent({
        title: null,
        text: $(this).parent().find('.ck-editor__editable')[0].innerHTML,
        id_content: $('#articleId').val()
    })
})

// Ajout des paragraphes suivants
$('.addParagraph').on('click', function (event) {
    event.preventDefault();
    const addBlogParagraph = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                $('.paragraf').css('display', 'none')
                $('.addAny').css('display', 'block')
                const getBlogParagraf = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/text/' + $('#articleId').val(), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(data)
                        })
                        if (response.ok) {
                            let responsePara = await response.json()
                            $('.addPhotoToPara').attr('data-id', responsePara.id)
                            $('.paragrafId').empty()
                            $('.getFirstParagraf').empty()
                            $('.getParagraf').empty()
                            $('.paragraphTitle').val('')
                            $('.paragraphText').val('')
                            $('.ck-editor__editable').children().empty()
                        } else {
                            console.error('Retour : ', response.status)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                getBlogParagraf()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addBlogParagraph({
        title: null,
        text: $(this).parent().find('.ck-editor__editable')[0].innerHTML,
        title: $('.paragraphTitle').val(),
        id_content: $('#articleId').val()
    })
})

// Ajout d'un demi paragraphes
$('.addParagrafPhotoPara').on('click', function (event) {
    event.preventDefault();
    const addBlogParagraph = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                $('.paragraf').css('display', 'none')
                $('.addAny').css('display', 'none')
                $('.hiddenParaId').attr('data-id', responseData.id)
                console.log(responseData.id)
                const getBlogParagraf = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/text/' + $('#articleId').val(), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(data)
                        })
                        if (response.ok) {
                            let responsePara = await response.json()
                            $('.paragrafId').empty()
                            $('.getFirstParagraf').empty()
                            $('.getParagraf').empty()
                            for (var resp in responsePara) {
                                var display = '<div class="row"><div class="col-2 mt-2 idOrPhoto' + responsePara[resp].id + '"><p>id= ' + responsePara[resp].id + '</p></div><div class="col-8 mt-2"><div>' + (responsePara[resp].title != null ? responsePara[resp].title : '') + '</div><div>' + responsePara[resp].text + '</div></div></div>';
                                $('.getParagraf').append(display)
                            }
                        } else {
                            console.error('Retour : ', response.status)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                getBlogParagraf()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addBlogParagraph({
        title: null,
        text: $(this).parent().find('.ck-editor__editable')[0].innerHTML,
        title: $('.semiParagraphTitle').val(),
        id_content: $('#articleId').val()
    })
})

//Gérer l'affichage du demi paragraphe quand il y en a dèjà un

$(document).change(function (event) {
    event.preventDefault();
    var articleId = $('#articleId').val()
    console.log(articleId)
    const getThisArticless = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/articles/' + articleId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseDataa = await response.json()
                console.log(responseDataa)
                if (responseDataa.paragraph_photos.length != 0){
                    $('.addOneSemiPara').css('display', 'none')
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getThisArticless({
        id: $('#articleId').val()
    })
})

// Ajouter une photo a un paragraphe
$('.addParagrafPhoto').on('change', function (event) {
    event.preventDefault();
    addParagrafPhoto(event)
});
const addParagrafPhoto = async function (event) {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.set('file', file);
    formData.set('photoTitle', $('.paragrafPhotoTitle').val());
    formData.set('photoText', $('.paragrafPhotoTitle').val());
    formData.set('id_paragraph', $('.hiddenParaId').attr('data-id'))
    try {
        let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/text-photo', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        })
        if (response.ok) {
            let responseData = await response.json()

            $('.paragrafPhoto').css('display', 'none')
            $('.addAny').css('display', 'block')
            const getBlogContent = async function (data) {
                try {
                    let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/articles/' + $('#articleId').val(), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify(data)
                    })
                    if (response.ok) {
                        let responseArticle = await response.json()
                        $('.photoNumber').empty()
                        var nbPara = (responseArticle.photo).length
                        if ((responseArticle.paragraph_photos).length != null) {
                            var nbParaPhoto = (responseArticle.paragraph_photos).length
                        } else {
                            var nbParaPhoto = 0
                        }
                        var nbrePhoto = nbPara + nbParaPhoto
                        if (nbrePhoto < 3) {
                            $('.photoNumber').css('display', 'block')
                            $('.photoNumber').append('Votre article comporte ' + nbrePhoto + (nbrePhoto > 1 ? ' photos' : ' photo') + ', ajoutez en ' + (3 - nbrePhoto) + ' de plus pour pouvoir ajouter une galerie de photos.')
                        }
                        $('.articleTitle').append(responseArticle.contentTitle)
                        if (nbrePhoto >= 3) {
                            $('.photoNumber').css('display', 'none')
                            $('.galeryValidation').css('display', 'block')
                            $('.galeryBtn').append('<button type="button" data-id="' + responseArticle.id + '" class="btn btn-outline-danger btn-sm carouselOn">Non</button>')
                        }
                        var para = responseArticle.paragraph
                        for (var paraPhoto in responseArticle.paragraph_photos) {
                            if (paraPhoto != null && paraPhoto.id == para.id) {
                                var semiPhoto = '<img class="semiPhoto" src="https://www.api.apajh-num-et-rik.fr/public/' + responseArticle.paragraph_photos[0].photoLink + '" alt="' + responseArticle.paragraph_photos[0].photoTitle + '">'
                                var foto = '.idOrPhoto' + $('.paragrafPhotoId').val()
                                $(foto).append(semiPhoto)
                            }
                        }
                    } else {
                        console.error('Retour : ', response.status)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            getBlogContent()
        } else {
            console.error('Retour : ', response.status)
        }
    } catch (e) {
        console.log(e)
    }
}

//ajout une photo au carousel
$('.addGaleryPhoto').on('change', function (event) {
    event.preventDefault();
    addPhoto(event)
});
const addPhoto = async function (event) {
    const formData = new FormData();
    const file = event.target.files[0];
    console.log(file.size)
    if (file.size > 1024000) {
        $('.validTitle').css('display', 'block')
        $('.validTitle').append('<p class="articleTitleError">la taille de la photo ne doit pas dépasser 1024Ko.</p>')
        setTimeout(function () {
            $('.validTitle').fadeOut().empty()
        }, 5000);
    } else {
    formData.set('file', file);
    formData.set('photoTitle', $('.photoTitle').val());
    formData.set('photoText', $('.photoTitle').val());
    formData.set('id_content', $('#articleId').val())
    try {
        let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/photo', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        })
        if (response.ok) {
            let responseData = await response.json()
            $('.photo').css('display', 'none')
            $('.addAny').css('display', 'block')
            $('.photoTitle').empty()
            $('.addGaleryPhoto').val('')
            const getBlogContent = async function (data) {
                try {
                    let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/articles/' + $('#articleId').val(), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify(data)
                    })
                    if (response.ok) {
                        let responseArticle = await response.json()
                        $('.photoNumber').empty()
                        var nbPara = (responseArticle.photo).length
                        if ((responseArticle.paragraph_photos).length != null) {
                            var nbParaPhoto = (responseArticle.paragraph_photos).length
                        } else {
                            var nbParaPhoto = 0
                        }
                        var nbrePhoto = nbPara + nbParaPhoto
                        var potoTest = 0
                        if (nbrePhoto < 3 && potoTest == 0) {
                            $('.photoNumber').css('display', 'block')
                            $('.photoNumber').append('Votre article comporte ' + nbrePhoto + (nbrePhoto > 1 ? ' photos' : ' photo') + ', ajoutez en ' + (3 - nbrePhoto) + ' de plus pour pouvoir ajouter une galerie de photos.')
                        }
                        $('.articleTitle').append(responseArticle.contentTitle)
                        if (nbrePhoto == 3) {
                            $('.photoNumber').css('display', 'none')
                            $('.galeryValidation').css('display', 'block')
                            $('.galeryBtn').append('<button type="button" data-id="' + responseArticle.id + '" class="btn btn-outline-danger btn-sm carouselOn">Non</button>')
                        }
                    } else {
                        console.error('Retour : ', response.status)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            getBlogContent()
        } else {
            console.error('Retour : ', response.status)
        }
    } catch (e) {
        console.log(e)
    }
}
}

// Activer / desactiver le caroussel

$(document).on('click', '.carouselOff', function (event) {
    event.preventDefault();
    $(this).addClass('carouselOn')
    $(this).addClass('btn-outline-danger')
    $(this).removeClass('btn-outline-success')
    $(this).removeClass('carouselOff')
    $(this).html('Non')
    const addCarousel = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/carouselOff', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseContentOffline = await response.json()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addCarousel({
        id: $(this).attr('data-id')
    })
})

$(document).on('click', '.carouselOn', function (event) {
    event.preventDefault();
    $(this).addClass('carouselOff')
    $(this).addClass('btn-outline-success')
    $(this).removeClass('btn-outline-danger')
    $(this).removeClass('carouselOn')
    $(this).html('Oui')
    const removeCarousel = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/carouselOn', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseContentOnline = await response.json()
                $('.carousel').css('display', 'block')
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    removeCarousel({
        id: $(this).attr('data-id')
    })
});

// Voir l'article en construction
$(document).on('click', '.oeil', function (event) {
    event.preventDefault();
    $('.allPara').empty()
    $('.articleModal').empty()
    $('.carousel-inner').empty()
    var articleId = $(this).attr('data-id')
    const getAllArticles = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/articles/' + articleId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseData = await response.json()
                var myArticle = '<div class="col-12 text-center"><p>' + responseData.contentTitle + '</p></div><div class="col-12 modalPhoto mb-3"><img class="img-fluid"' +
                    'src="https://www.api.apajh-num-et-rik.fr/public' + responseData.photo[0].photoLink + '" alt="' + responseData.photo[0].photoText + '"><br /><span class="">' + responseData.photo[0].photoText + '</span></div>'
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
                                var allPara = '<div class="row"><div class="col-6 semiPara"><img class="img-fluid photoP" src="https://www.api.apajh-num-et-rik.fr/public' + responseData.paragraph_photos[paraphoto].photoLink + '" alt="' + responseData.paragraph_photos[paraphoto].photoText + '"></div><div class="col-6 semiPara semi">' + responseData.paragraph[para].text + '</div></div>'
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
                    var firstImg = '<div class="carousel-item active"><img src="https://www.api.apajh-num-et-rik.fr/public' + responseData.photo[0].photoLink + '" class="d-block w-100" alt="' + responseData.photo[0].photoText + '" title="' + responseData.photo[0].photoTitle + '"></div>'
                    for (var car in responseData.photo) {
                        var otherImg = '<div class="carousel-item"><img src="https://www.api.apajh-num-et-rik.fr/public' + responseData.photo[car].photoLink + '" class="d-block w-100" alt="' + responseData.photo[car].photoText + '" title="' + responseData.photo[car].photoTitle + '"></div>'
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
// retour au menu de choix d'ajout
$(document).on('click', '.return', function (event) {
    event.preventDefault();
    $('.addAny').css('display', 'block')
    $('.paragraf').css('display', 'none')
    $('.paragrafPhotoPara').css('display', 'none')
    $('.photo').css('display', 'none')
})

// Faire apparaitre l'ajout d'un paragraphe
$(document).on('click', '.addOnePara', function (event) {
    event.preventDefault();
    $('.addAny').css('display', 'none')
    $('.paragrafPhotoPara').css('display', 'none')
    $('.photo').css('display', 'none')
    $('.paragraf').css('display', 'block')
})

// Faire apparaitre l'ajout d'un demi-paragraphe
$(document).on('click', '.addOneSemiPara', function (event) {
    event.preventDefault();
    $('.addAny').css('display', 'none')
    $('.paragrafPhotoPara').css('display', 'block')
    $('.photo').css('display', 'none')
    $('.paragraf').css('display', 'none')
})

// Faire apparaitre l'ajout d'une photo pour un demi-paragraphe
$(document).on('click', '.addParagrafPhotoPara', function (event) {
    event.preventDefault();
    $('.addAny').css('display', 'none')
    $('.paragrafPhotoPara').css('display', 'none')
    $('.paragrafPhotoPhoto').css('display', 'block')
    $('.photo').css('display', 'none')
    $('.paragraf').css('display', 'none')
})

// Faire apparaitre l'ajout d'une photo
$(document).on('click', '.addOnePhoto', function (event) {
    event.preventDefault();
    $('.addAny').css('display', 'none')
    $('.paragrafPhoto').css('display', 'none')
    $('.photo').css('display', 'block')
    $('.paragraf').css('display', 'none')
})

// intégration de ckeditor
$(document).ready(function () {
    let editor;
    ClassicEditor
        .create(document.querySelector('textarea'), {
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
            })
})
$(document).ready(function () {
    let editor;
    ClassicEditor
        .create(document.querySelector('.paragraphText'), {
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
            })
})

$(document).ready(function () {
    let editor;
    ClassicEditor
        .create(document.querySelector('.semiParagraphText'), {
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
            })
})