// Voir la page
$(document).on('click', '.voir', function (event) {
    event.preventDefault();
    $('.allPara').empty()
    $('.articleModal').empty()
    $('.carousel-inner').empty()
    var articleId = $(this).attr('data-id')
    const getAllArticles = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/articles/860', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseData = await response.json()
                console.log(responseData)
                $('.actualInfo').empty()
                var textareaModif = '<textarea id="myModif" class="form-control myModif">' + responseData.paragraph[0].text + '</textarea>' +
                '<div class="text-center"><button class="btn btn-primary btn-sm paraTextModifValid mt-2" data-id="' + responseData.paragraph[0].id +
                '" type="button">Valider la modification</button></div><div class="result text-center"></div>'
                $('.actualInfo').append(textareaModif)
                // intégration de ckeditor
                let editor;
                ClassicEditor
                    .create(document.querySelector('#myModif'), {
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
                $('.result').append('<p class="isOk">La modification de l\'annonce à bien été prise en compte.</p>')
                setTimeout(function () {
                    $('.paraTextValidation').fadeOut().empty();
                }, 5000);
            } else {
                console.error('Retour : ', response.status)
                $('.result').append('<p class="isNotOk">Une erreur est survenue durant la modification du titre de l\'annonce, merci de renouveller l\'opération.</p>')
                setTimeout(function () {
                    $('.paraTextValidation').fadeOut().empty();
                }, 5000);
            }
        } catch (e) {
            console.log(e)
        }
    }
    modifTitle({
        title: null,
        id: $(this).attr('data-id'),
        text: $(this).parent().prev().find('.ck-editor__editable').children().prevObject[0].innerHTML
    })
})