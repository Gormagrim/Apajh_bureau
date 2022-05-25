// Pour ajouter un article
$('.addBlogContent').on('click', function (event) {
    event.preventDefault();
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
                $('.firstArticle').css('display', 'block')
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
                            $('.validTitle').append('<p class="articleTitleOk">Le titre de votre devoir à bien été créé.</p>')
                            $('.mainTitle').html('<p>Vous êtes en train d\'ajouter le devoir : "' + responseArticle.contentTitle + '"</p>')
                            $('.mainTitle').attr('data-id', responseArticle.id)
                            setTimeout(function () {
                                $('.validTitle').fadeOut().empty()
                            }, 5000);
                        } else {
                            console.error('Retour : ', response.status)
                            $('.validTitle').append('<p class="articleTitleError">Un erreur est survenue durant la création de votre devoir, merci de rééssayer.</p>')
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
        contentType: 6
    })
})

// Ajout du contenu du devoir
$('.addFirstArticle').on('click', function (event) {
    event.preventDefault();
        const addBlogContent = async function (data) {
            try {
                let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/devoirs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                })
                if (response.ok) {
                    let responseData = await response.json()
                    $('.mainTitle').html('<p>Votre devoir à bien été ajouté. Il est déjà en ligne!</p>')
                    $('.firstArticle ').css('display', 'none')
                    window.setTimeout(function () { location.reload() }, 3000)
                } else {
                    console.error('Retour : ', response.status)
                    console.log($('.devoirTitle').val())
                    if ($('.devoirTitle').val() == '') {
                        $('.missTitle').append('Vous devez saisir le titre secondaire de votre devoir.')
                        setTimeout(function () {
                            $('.missTitle').empty()
                        }, 5000);
                    }
                    if ($('.dateFor').val() == '') {
                        $('.missDate').append('Vous devez saisir une date votre devoir.')
                        setTimeout(function () {
                            $('.missDate').empty()
                        }, 5000);
                    }
                    if ($('.ck-editor__editable').val() == '') {
                        $('.missText').append('Vous devez saisir les détail de votre devoir.')
                        setTimeout(function () {
                            $('.missText').empty()
                        }, 5000);
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
        addBlogContent({
            title: $('.devoirTitle').val(),
            dateFor: $('.dateFor').val(),
            content: $(this).parent().find('.ck-editor__editable')[0].innerHTML,
            id_content: $('.mainTitle').attr('data-id')
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
