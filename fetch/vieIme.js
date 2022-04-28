// retour au menu de choix d'ajout
$(document).on('click', '.return', function (event) {
    event.preventDefault();
    $('.addAnyy').css('display', 'block')
    $('.paragraf').css('display', 'none')
    $('.paragrafPhotoPara').css('display', 'none')
    $('.photo').css('display', 'none')
})

// Faire apparaitre l'ajout d'un paragraphe
$(document).on('click', '.addOnePara', function (event) {
    event.preventDefault();
    $('.addAnyy').css('display', 'none')
    $('.paragrafPhotoPara').css('display', 'none')
    $('.photo').css('display', 'none')
    $('.paragraf').css('display', 'block')
})

// Faire apparaitre l'ajout d'un demi-paragraphe
$(document).on('click', '.addOneSemiPara', function (event) {
    event.preventDefault();
    $('.addAnyy').css('display', 'none')
    $('.paragrafPhotoPara').css('display', 'block')
    $('.photo').css('display', 'none')
    $('.paragraf').css('display', 'none')
})

// Faire apparaitre l'ajout d'une photo pour un demi-paragraphe
$(document).on('click', '.addParagrafPhotoPara', function (event) {
    event.preventDefault();
    $('.addAnyy').css('display', 'none')
    $('.paragrafPhotoPara').css('display', 'none')
    $('.paragrafPhotoPhoto').css('display', 'block')
    $('.photo').css('display', 'none')
    $('.paragraf').css('display', 'none')
})

// Faire apparaitre l'ajout d'une photo
$(document).on('click', '.addOnePhoto', function (event) {
    event.preventDefault();
    $('.addAnyy').css('display', 'none')
    $('.paragrafPhoto').css('display', 'none')
    $('.photo').css('display', 'block')
    $('.paragraf').css('display', 'none')
})

// Ajout d'un paragraphe'
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
                $('.addAnyy').css('display', 'block')

            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addBlogParagraph({
        text: $(this).parent().find('.ck-editor__editable')[0].innerHTML,
        title: $('.paragraphTitle').val(),
        id_content: 856
    })
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
//ajout une photo
$('.addGaleryPhoto').on('change', function (event) {
    event.preventDefault();
    addPhoto(event)
});
const addPhoto = async function (event) {
    const formData = new FormData();
    const file = event.target.files[0];
    console.log(file.size)
    if (file.size > 2048000) {
        $('.validTitle').css('display', 'block')
        $('.validTitle').append('<p class="articleTitleError">la taille de la photo ne doit pas dépasser 2048Ko.</p>')
        setTimeout(function () {
            $('.validTitle').fadeOut().empty()
        }, 5000);
    } else {
        formData.set('file', file);
        formData.set('photoTitle', $('.photoTitle').val());
        formData.set('photoText', $('.photoTitle').val());
        formData.set('id_content', 856)
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
                $('.addAnyy').css('display', 'block')
                $('.photoTitle').empty()
                $('.addGaleryPhoto').val('')

            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
}
// Voir la page
$(document).on('click', '.voir', function (event) {
    event.preventDefault();
    $('.allPara').empty()
    $('.articleModal').empty()
    $('.carousel-inner').empty()
    var articleId = $(this).attr('data-id')
    const getAllArticles = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/856', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseData = await response.json()
                console.log(responseData)
                $i = 0;
                var myArticle = '<div class="col-12 text-center"><p>' + responseData.contentTitle + '</p></div><div class="col-12 modalPhoto mb-3">' +
                    '</div>'
                for (var para in responseData.paragraph) {
                    $i++;
                    if (responseData.paragraph[para].title != null) {
                        var title = '<div><input class="form-control paraTitle" type="text" value="' +
                        (responseData.paragraph[para].title == null ? '' : responseData.paragraph[para].title) + '" /></div>' +
                        '<div class="text-center"><button class="btn btn-primary btn-sm paraTitleModifValid none mt-2" data-id="' + responseData.paragraph[para].id +
                            '" type="button">Valider la modification</button></div>'
                    } else {
                        var title = null
                    }
                    var allPara = '<textarea id="myModif" class="form-control myModif myModif' + $i + '" data-class="myModif' + $i + '">' + responseData.paragraph[para].text + '</textarea>' +
                    '<div class="text-center"><button class="btn btn-primary btn-sm paraTextModifValid mt-2" data-id="' + responseData.paragraph[para].id +
                    '" type="button">Valider la modification</button></div><div class="result text-center"></div>'
                    $('.allPara').append(title)


                    var allPara = '<textarea id="myModif" class="form-control myModif myModif' + $i + '" data-class="myModif' + $i + '">' + responseData.paragraph[para].text + '</textarea>' +
                    '<div class="text-center"><button class="btn btn-primary btn-sm paraTextModifValid mt-2" data-id="' + responseData.paragraph[para].id +
                    '" type="button">Valider la modification</button></div><div class="result text-center"></div>'

                    $('.allPara').append(allPara)
                }
                $('.articleModal').append(myArticle)
                    $('.carousel').css('display', 'block')
                    var firstImg = '<div class="carousel-item active"><img src="https://www.api.apajh.jeseb.fr/public' + responseData.photo[0].photoLink + '" class="d-block w-100" alt="' + responseData.photo[0].photoText + '" title="' + responseData.photo[0].photoTitle + '"></div>'
                    for (var car in responseData.photo) {
                        var otherImg = '<div class="carousel-item"><img src="https://www.api.apajh.jeseb.fr/public' + responseData.photo[car].photoLink + '" class="d-block w-100" alt="' + responseData.photo[car].photoText + '" title="' + responseData.photo[car].photoTitle + '"></div>'
                        $('.carousel-inner').append(otherImg)
                    }
                    $('.carousel-inner').append(firstImg)
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
    getAllArticles({
        id: $(this).attr('data-id')
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
                console.log($(this).parent().prev().prev().prev().prev().find('input').val())
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