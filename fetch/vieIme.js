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
        title: null,
        text: $(this).parent().find('.ck-editor__editable')[0].innerHTML,
        title: $('.paragraphTitle').val(),
        id_content: $('#articleId').val()
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