$(document).ready(function () {
    const getDevoirList = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/devoirs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseGetVideos = await response.json()
                console.log(responseGetVideos)
                for (var resp in responseGetVideos) {
                    var date = new Date(responseGetVideos[resp].contentDate)
                    var options = { weekday: "short", year: "numeric", month: "long", day: "2-digit" };
                    var fullDate = date.toLocaleDateString("fr-FR", options)
                    var forDate = new Date(responseGetVideos[resp].devoirs.length == 0 ? '1900-01-01' : responseGetVideos[resp].devoirs[0].dateFor)
                    var fullDateFor = forDate.toLocaleDateString("fr-FR", options)
                    var display = '<div class="row oneArticle"><div class="col-3 text-center"><span>' + responseGetVideos[resp].contentTitle + '</span></div>' +
                        '<div class="col-3 text-center"><span>' + fullDate + '</span></div><div class="col-3 text-center">' + fullDateFor +
                        '</div><div class="col-3 text-center"><i class="fas fa-eye fa-2x voir" data-id_content="' + responseGetVideos[resp].id + '" data-id="' + responseGetVideos[resp].devoirs[0].id + '" data-bs-toggle="modal" data-bs-target="#videoModal"></i></div></div>'
                    $('.listWord').append(display)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getDevoirList()
});
// Voir le devoir dans la modale
$(document).on('click', '.voir', function (event) {
    event.preventDefault();
    $('.devoirTitle').empty()
    $('.devoirBody').empty()
    $('.devoirDateFor').empty()
    $('.devoirBy').empty()
    var devoirId = $(this).attr('data-id')
    var devoirId_content = $(this).attr('data-id_content')
    $('.deleteThisDevoir').attr('data-id', devoirId)
    $('.deleteThisDevoir').attr('data-id_content', devoirId_content)
    const getThisDevoir = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/thisdevoirs/' + devoirId_content, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseGetThisDevoir = await response.json()
                console.log(responseGetThisDevoir)
                var date = new Date(responseGetThisDevoir[0].devoirs == null ? '1900-01-01' : responseGetThisDevoir[0].devoirs[0].dateFor)
                var options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };
                var fullDate = date.toLocaleDateString("fr-FR", options)
                var thisDevoirTitle = '<h3>' + responseGetThisDevoir[0].contentTitle + '</h3>'
                $('.devoirTitle').append(thisDevoirTitle)
                var thisDevoirBody = responseGetThisDevoir[0].devoirs[0].content
                $('.devoirBody').append(thisDevoirBody)
                var thisDevoirDateFor = fullDate
                $('.devoirDateFor').append('<p>A faire pour le ' + thisDevoirDateFor + '</p>')
                var thisDevoirBy = responseGetThisDevoir[0].user_description.firstname + ' ' + responseGetThisDevoir[0].user_description.lastname
                $('.devoirBy').append('<p>Demandé par ' + thisDevoirBy + '</p>')
            } else {
                console.error('Retour : ', response.status)
                console.log(localStorage.getItem('token'))
            }
        } catch (e) {
            console.log(e)
        }
    }
    getThisDevoir()
})
// supprimer un devoir
$(document).on('click', '.deleteThisDevoir', function (event) {
    event.preventDefault();
    var devoirId_content = $(this).attr('data-id_content')
    const deleteThisDevoir = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/devoirs', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let deleteVideo = await response.json()
                const deleteThisArticleDevoir = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/article', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(data)
                        })
                        if (response.ok) {
                            let deleteVideo = await response.json()
                            window.location.reload();

                        } else {
                            console.error('Retour : ', response.status)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                deleteThisArticleDevoir({
                    id: devoirId_content
                })

            } else {
                console.error('Retour : ', response.status)
                console.log(localStorage.getItem('token'))
            }
        } catch (e) {
            console.log(e)
        }
    }
    deleteThisDevoir({
        id: $(this).attr('data-id')
    })
})

