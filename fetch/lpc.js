$('.seeVoirCat').on('click', function () {
    $('.voirCat').css('display', 'block')
    $('.seeCreatCat').css('visibility', 'visible')
    $('.seeCreatContent').css('visibility', 'visible')
    $('.seeCreatVideoContent').css('visibility', 'visible')
    $('.creatCat').css('display', 'none')
    $('.creatContent').css('display', 'none')
    $('.creatVideoContent').css('display', 'none')
    $('.seeVoirCat').css('visibility', 'hidden')
})
$('.seeCreatCat').on('click', function () {
    $('.creatCat').css('display', 'block')
    $('.seeVoirCat').css('visibility', 'visible')
    $('.seeCreatContent').css('visibility', 'visible')
    $('.seeCreatVideoContent').css('visibility', 'visible')
    $('.seeCreatCat').css('visibility', 'hidden')
    $('.creatContent').css('display', 'none')
    $('.creatVideoContent').css('display', 'none')
    $('.voirCat').css('display', 'none')
})
$('.seeCreatContent').on('click', function () {
    $('.creatContent').css('display', 'block')
    $('.seeCreatContent').css('visibility', 'hidden')
    $('.seeCreatCat').css('visibility', 'visible')
    $('.seeVoirCat').css('visibility', 'visible')
    $('.seeCreatVideoContent').css('visibility', 'visible')
    $('.voirCat').css('display', 'none')
    $('.creatCat').css('display', 'none')
    $('.creatVideoContent').css('display', 'none')
})
$('.addVideoContent').on('click', function () {
    $('.creatVideoContent').css('display', 'block')
    $('.seeCreatVideoContent').css('visibility', 'hidden')
    $('.creatContent').css('display', 'none')
    $('.seeCreatContent').css('visibility', 'visible')
})

// Pour ajouter un contenu vidéo
$('.addVideoContent').on('click', function (event) {
    event.preventDefault();
    const addVideoContent = async function (data) {
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
                console.log(responseData)
                $('.id_content').val(responseData.Contenu.id)
                $('.videoTitle').val(responseData.Contenu.contentTitle)
            } else {
                if (!$('.newVideoContent').val().match(/^[^<>]+$/)) {
                    alert('Merci de saisir correctement le titre de votre vidéo, les caractères "<" et ">" ne sont pas acceptés.');
                    $('.creatVideoContent').css('display', 'none')
                }
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addVideoContent({
        contentTitle: $('.newVideoContent').val(),
        contentType: $('.newVideoContentType').val()
    })
})
// Pour ajouter une vidéo au contenu vidéo
$(document).ready(function () {
    $('.addVideoToVideoContent').on('click', function (event) {
        event.preventDefault();
        addVideoToVideoContent(event)
    })
    const addVideoToVideoContent = async function (event) {
        const formData = new FormData();
        formData.set('videoTitle', $('.videoTitle').val())
        const input = document.querySelector("input[type='file']");
        const file = input.files[0]
        formData.set('file', file)
        formData.set('id_content', $('.id_content').val())
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/lpcvideo', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData
            })
            if (response.ok) {
                let responseData = await response.json()
                console.log(responseData)
                $('.itIsOk').html('<p>Votre contenu vidéo à bien été ajouté. Il sera mis en ligne très bientôt par administrateur.</p>')
                window.setTimeout(function () { location.reload() }, 3000)
            } else {
                console.error('Retour : ', response.status)
                if (!$('.videoTitle').val().match(/^[^<>]+$/)) {
                    alert('Merci de saisir correctement le titre de votre vidéo, les caractères "<" et ">" ne sont pas acceptés.');
                } else if (!$('.videoText').val().match(/^[^<>]+$/)) {
                    alert('Merci de saisir correctement la description de votre vidéo, les caractères "<" et ">" ne sont pas acceptés.');
                } else if ($('.file').val().length == 0) {
                    alert('Merci de sélectionner une vidéo.')
                } else if ($('.getCategory').val() == 0) {
                    alert('Merci de sélectionner une catégorie.');
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
})