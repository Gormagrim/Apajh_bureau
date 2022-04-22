// Pour ajouter un quizz
$('.addQuizzContent').on('click', function (event) {
    event.preventDefault();
    const addQuizzContent = async function (data) {
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
                $('#quizzId').val(responseData.Contenu.id)
                $('.firstStepQuizz').css('display', 'none')
                $('.questions').css('display', 'block')
                $('.secondStep').css('display', 'block')

                const getQuizzContent = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/quizz/' + responseData.Contenu.id, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(data)
                        })
                        if (response.ok) {
                            let responseQuizz = await response.json()
                            console.log(responseQuizz)
                            $('.validTitle').append('<p class="articleTitleOk">Le titre de votre quizz à bien été créé.</p>')
                            $('.mainTitle').html('<p>Vous êtes en train d\'écrire le quizz "' + responseQuizz.contentTitle + '"</p><i class="fas fa-eye fa-2x oeil oeilConstru" data-bs-toggle="modal" data-bs-target="#staticBackdrop" title="Voir ou modifier mon article" data-id="' + responseQuizz.id + '"></i>')
                            setTimeout(function () {
                                $('.validTitle').fadeOut().empty()
                            }, 5000);
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
                getQuizzContent()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addQuizzContent({
        contentTitle: $('.newQuizzContent').val(),
        contentType: 4
    })
})

// Pour ajouter une question
$('.addQuizzQuestion').on('click', function (event) {
    event.preventDefault();
    const addQuizzContent = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/question', {
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
                $('.questions').css('display', 'none')
                $('.photosButton').css('display', 'block')
                $('.newQuizzQuestion').val('')
                $('.newQuizzComment').css('display', 'none')
                $('.allQuestions').empty()
                $('.allQuestions').html('<p class="quest" data-id="' + responseData.id + '">Votre question : "' + responseData.question + '"</p>')
                $('.reponses').css('display', 'block')
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addQuizzContent({
        question: $('.newQuizzQuestion').val(),
        id_content: $('#quizzId').val()
    })
})



$(document).on('click', '.photoQuizz', function (event) {
    event.preventDefault();
    $('.photoQuizzFile').css('display', 'block')
})

$(document).on('click', '.noPhotoQuizz', function (event) {
    event.preventDefault();
    $('.photoQuizzFile').css('display', 'none')
    $('.reponses').css('display', 'block')
    $('.photosButton').css('display', 'none')
})

// Pour ajouter une réponse
$('.addQuizzReponse').on('click', function (event) {
    event.preventDefault();
    const addQuizzContent = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/answer', {
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
                $('.questions').css('display', 'none')
                $('.newQuizzReponse').val('')
                $('.newQuizzComment').val('')
                $('.reponses').css('display', 'bock')
                var count = 0
                $('.allAnswers').append('<p class="answ ' + (responseData.user.isGood == 1 ? "isGood" : "") + '" data-id="' + responseData.user.id + '">Votre réponse : "' + responseData.user.answer + '"</p>')
                const getQuizzContent = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/quizz/' + $('#quizzId').val(), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(data)
                        })
                        if (response.ok) {
                            let responseQuizz = await response.json()
                            console.log(responseQuizz)
                        } else {
                            console.error('Retour : ', response.status)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                getQuizzContent()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addQuizzContent({
        answer: $('.newQuizzReponse').val(),
        id_questions: $('.quest').attr('data-id'),
        isGood: $('.addQuizzReponse').attr('data-value'),
        comment: $('.newQuizzComment').val()

    })
})
$('.form-check-input').on('change', function (event) {
    event.preventDefault();
    $('.form-check-input').addClass('toto')
    console.log(event.target.checked);
    if (event.target.checked == true) {
        $('.addQuizzReponse').attr('data-value', 1)
        $('.newQuizzComment').css('display', 'block')
    } else {
        $('.addQuizzReponse').attr('data-value', 0)
        $('.newQuizzComment').css('display', 'none')
    }
})

$('.addQuizzOtherQuestion').on('click', function (event) {
    $('.allQuestions').empty()
    $('.allAnswers').empty()
    $('.reponses').css('display', 'none')
    $('.questions').css('display', 'block')
})

$(document).on('click', '.oeil', function (event) {
    event.preventDefault();
    $('.quizzContent').empty()
    const getQuizzContent = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/quizz/' + $('#quizzId').val(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseQuizz = await response.json()
                console.log(responseQuizz)
                var count = 1
                var responses = 1
                for (var resp in responseQuizz.questions) {
                    $('.quizzContent').append('<div class="text-center"><p data-qId="' + responseQuizz.questions[resp].id + '"><span style="font-size:10px;">Question n°' + count++ + ' : </span><br />' + responseQuizz.questions[resp].question + '</p></div>')
                    for (var answ in responseQuizz.answers) {
                        if (responseQuizz.questions[resp].id == responseQuizz.answers[answ].id_questions) {
                            $('.quizzContent').append('<p class="' + (responseQuizz.answers[answ].isGood == 1 ? "isGood" : "") + '"><span style="font-size:10px;">Réponse n° ' + responses++ + ' : </span>' + responseQuizz.answers[answ].answer + '</p>')
                        }
                    }
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getQuizzContent()
})
