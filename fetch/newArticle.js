// Pour ajouter un article
$('.addBlogContent').on('click', function (event) {
    event.preventDefault();
    $('.mainPhoto').css('display', 'block')
    const addBlogContent = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                $('.videoTitle').val(responseData.Contenu.contentTitle)
                $('#articleId').val(responseData.Contenu.id)
                $('.postTitle').css('display', 'none')
                const getBlogContent = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/' + responseData.Contenu.id, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(data)
                        })
                        if (response.ok) {
                            let responseArticle = await response.json()
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
    formData.set('photoText', $('.photoText').val());
    formData.set('id_content', $('#articleId').val())
    $('.mainPhoto').css('display', 'none')
    $('.firstArticle').css('display', 'block')
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
            const getBlogContent = async function (data) {
                try {
                    let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/' + $('#articleId').val(), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify(data)
                    })
                    if (response.ok) {
                        let responseArticle = await response.json()
                        $('.firstPhoto').attr('src', 'https://www.api.apajh.jeseb.fr/public/' + responseArticle.photo[0].photoLink)
                        $('.firstPhoto').attr('alt', responseArticle.photo[0].photoTitle)
                        $('.firstPhotoTitle').append(responseArticle.photo[0].photoTitle)
                        $('.photoNumber').empty()
                        var nbPara = (responseArticle.photo).length
                        console.log(nbPara)
                        if ((responseArticle.paragraph_photos).length != null) {
                            var nbParaPhoto = (responseArticle.paragraph_photos).length
                        } else {
                            var nbParaPhoto = 0
                        }
                        console.log(nbParaPhoto)
                        var nbrePhoto = nbPara + nbParaPhoto
                        console.log(nbrePhoto)
                        if (nbrePhoto < 3) {
                            $('.photoNumber').css('display', 'block')
                            $('.photoNumber').append('Votre article comporte ' + nbrePhoto + (nbrePhoto > 1 ? ' photos' : ' photo') + ', ajoutez en ' + (3 - nbrePhoto) + ' de plus pour pouvoir ajouter une galerie de photos.')
                        }
                        $('.articleTitle').append(responseArticle.contentTitle)
                        if (nbrePhoto >= 3) {
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
// Ajout du premier paragraphe
$('.addFirstArticle').on('click', function (event) {
    event.preventDefault();
    $('.firstArticle').css('display', 'none')
    $('.addAny').css('display', 'block')
    const addBlogContent = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/text', {
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
                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/' + $('#articleId').val(), {
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
    addBlogContent({
        title: null,
        text: $('.firstArticleText').val(),
        id_content: $('#articleId').val()
    })
})
// Ajout des paragraphes suivants
$('.addParagraph').on('click', function (event) {
    event.preventDefault();
    const addBlogParagraph = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/text', {
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
                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/text/' + $('#articleId').val(), {
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
        text: $('.paragraphText').val(),
        title: $('.paragraphTitle').val(),
        id_content: $('#articleId').val()
    })
})

$('.addText').on('click', function (event) {
    event.preventDefault();
    $('.addAny').css('display', 'none')
    $('.paragraf').css('display', 'block')
    $('.paragrafPhoto').css('display', 'none')
    $('.photo').css('display', 'none')
})
$('.addTextAndPhoto').on('click', function (event) {
    event.preventDefault();
    $('.addAny').css('display', 'none')
    $('.paragrafPhoto').css('display', 'block')
    $('.paragraf').css('display', 'none')
    $('.photo').css('display', 'none')
})
$('.addPhoto').on('click', function (event) {
    event.preventDefault();
    $('.addAny').css('display', 'none')
    $('.photo').css('display', 'block')
    $('.paragrafPhoto').css('display', 'none')
    $('.paragraf').css('display', 'none')
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
    formData.set('photoText', $('.paragrafPhotoText').val());
    formData.set('id_paragraph', $('.paragrafPhotoId').val())
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
            $('.paragrafPhoto').css('display', 'none')
            $('.addAny').css('display', 'block')
            const getBlogContent = async function (data) {
                try {
                    let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/' + $('#articleId').val(), {
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
                        console.log(responseArticle.photo)
                        console.log((responseArticle.photo).length)
                        console.log(nbPara)
                        if ((responseArticle.paragraph_photos).length != null) {
                            var nbParaPhoto = (responseArticle.paragraph_photos).length
                        } else {
                            var nbParaPhoto = 0
                        }
                        console.log(responseArticle.paragraph_photos)
                        console.log((responseArticle.paragraph_photos).length)
                        console.log(nbParaPhoto)
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
                                var semiPhoto = '<img class="semiPhoto" src="https://www.api.apajh.jeseb.fr/public/' + responseArticle.paragraph_photos[0].photoLink + '" alt="' + responseArticle.paragraph_photos[0].photoTitle + '">'
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

// Ajouter un carousel à un article

$(document).on('click', '.carouselOff', function (event) {
    event.preventDefault();
    $(this).addClass('carouselOn')
    $(this).addClass('btn-outline-danger')
    $(this).removeClass('btn-outline-success')
    $(this).removeClass('carouselOff')
    $(this).html('Non')
    const addCarousel = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/carouselOff', {
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
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/carouselOn', {
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

$('.carouselOn').on('click', function () {
    console.log('toto')
})

//ajout une photo au carousel
$('.addGaleryPhoto').on('change', function (event) {
    event.preventDefault();
    addPhoto(event)
});
const addPhoto = async function (event) {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.set('file', file);
    formData.set('photoTitle', $('.photoTitle').val());
    formData.set('photoText', $('.photoText').val());
    formData.set('id_content', $('#articleId').val())
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
            $('.photo').css('display', 'none')
            $('.addAny').css('display', 'block')
            const getBlogContent = async function (data) {
                try {
                    let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/' + $('#articleId').val(), {
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
                        console.log(responseArticle.photo)
                        console.log((responseArticle.photo).length)
                        console.log(nbPara)
                        if ((responseArticle.paragraph_photos).length != null) {
                            var nbParaPhoto = (responseArticle.paragraph_photos).length
                        } else {
                            var nbParaPhoto = 0
                        }
                        console.log(responseArticle.paragraph_photos)
                        console.log((responseArticle.paragraph_photos).length)
                        console.log(nbParaPhoto)
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

$(document).on('click', '.carouselOn', function () {
    const getBlogContent = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/' + $('#articleId').val(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseArticle = await response.json()
                if (responseArticle.carousel == 1) {
                    $('.carousel').css('display', 'block')
                    for (var photo in responseArticle.photos) {
                        var allPhoto = '<img src="https://www.api.apajh.jeseb.fr/public/' + responseArticle.photo[photo].photoLink + '" class="d-block w-100" alt="' + responseArticle.photo[photo].title + '" title="' + responseArticle.photo[photo].title + '">'
                        console.log(allPhoto)
                        $('.carousel-item.active').append(allPhoto)
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
})