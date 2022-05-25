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

// Obtenir la liste des catégories
$(document).ready(function () {
    const getCategory = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/videos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                let responseGetCat = await response.json()
                for (var resp in responseGetCat) {
                    var display = '<option value="' + responseGetCat[resp].id + '">' + responseGetCat[resp].category + '</option>'
                    $('.getCat').append(display)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getCategory()
});

//Liste des catégories sur le select de création
$(document).ready(function () {
    const getCategory = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/videos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                let responseGetCat = await response.json()
                for (var resp in responseGetCat) {
                    var display = '<option value="' + responseGetCat[resp].id + '">' + responseGetCat[resp].category + '</option>'
                    $('.getCategory').append(display)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getCategory()
});
// Pour ajouter un catégorie
$('.addCat').on('click', function (event) {
    event.preventDefault();
    const addCategory = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/addCategory', {
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
                $('.itIsOk').html('<p>Votre catégorie à bien été ajouté.</p>')
                window.setTimeout(function () { location.reload() }, 3000)
            } else {
                console.error('Retour : ', response.status)
                if ($('.newCat').val().match(/[<>;,]+/)) {
                    alert('"' + $('.newCat').val() + '"' + ' n\'est pas une catégorie valide, merci de n\'entrer que des caractères valides (lettres).');
                } else if (!$('.newCat').val().match(/(^[a-zA-ZÀ-ÖØ-öø-ÿ]+)([- ]{1}[a-zA-ZÀ-ÖØ-öø-ÿ]+){0,3}$/)) {
                    alert('"' + $('.newCat').val() + '"' + ' n\'est pas une catégorie valide, le mot ne doit être composé que de lettres.');
                    $('.newCat').empty()
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    addCategory({
        category: $('.newCat').val()
    })
})
// Pour ajouter un contenu vidéo
$('.addVideoContent').on('click', function (event) {
    event.preventDefault();
    const addVideoContent = async function (data) {
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
    $('.getCategory').change(function () {
        $('.catId').attr('value', $(this).val())
    })
    $('.addVideoToVideoContent').on('click', function (event) {
        event.preventDefault();
        addVideoToVideoContent(event)
    })
    const addVideoToVideoContent = async function (event) {
        const formData = new FormData();
        formData.set('videoTitle', $('.videoTitle').val())
        formData.set('videoText', 'Mot ' + $('.videoTitle').val() + ' en langue des signes française')
        const input = document.querySelector("input[type='file']");
        const file = input.files[0]
        formData.set('file', file)
        formData.set('id_content', $('.id_content').val())
        formData.set('id_category', $('.catId').val())
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/video', {
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