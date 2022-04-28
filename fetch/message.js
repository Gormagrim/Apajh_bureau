$(document).ready(function () {
    const viewConversation = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/messageUser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseData = await response.json()
                var tata = responseData.filter(function (id, pos) {
                    return responseData.indexOf(id) == pos;
                })
                console.log(tata)

                var classResponseData = responseData.sort(function (a, b) {
                    return a.toUser - b.toUser;
                });
                var finalResponseData = classResponseData.sort(function (a, b) {
                    return a.fromUser - b.toUser
                })

                let duplicates = []
                console.log(finalResponseData)
                for (let i = 0; i < finalResponseData.length - 1; i++) {
                    if (finalResponseData[i + 1].toUser === finalResponseData[i].toUser) {
                        duplicates.push(finalResponseData[i])
                    }
                }
                // j.bleuart@apajh.asso.fr
                let smallDifference = finalResponseData.filter(x => !duplicates.includes(x));
                let secondDuplicates = []
                console.log(smallDifference)
                for (let i = 0; i < smallDifference.length - 1; i++) {
                    if (smallDifference[i].toUser === smallDifference[i + 1].fromUser && smallDifference[i].fromUser === smallDifference[i + 1].toUser) {
                        secondDuplicates.push(smallDifference[i])
                    }
                }
                let difference = smallDifference.filter(x => !secondDuplicates.includes(x));
                console.log(difference)
                const viewConversation = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/countnomess', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        if (response.ok) {
                            let responseData = await response.json()
                            console.log(responseData)
                            if (difference.fromUser != localStorage.getItem('id') && responseData > 0) {
                                var toto = '<i class="fas fa-comment-dots"></i>'
                                $('span.totoMess').append(toto)
                            }
                        } else {
                            console.error('Retour : ', response.status)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                viewConversation()
                for (var resp in difference) {
                    if (difference[resp].toUser == localStorage.getItem('id')) {
                        var lastMessage = difference[resp].isRead
                        console.log(lastMessage)
                    }

                    var displayUser = '<div class="messageFrom" data-userid="' + (difference[resp].fromUser == localStorage.getItem('id') ? (difference[resp].desti_user[0].id) : (difference[resp].user[0].id)) + '"><span class="totoMess"></span> ' + (difference[resp].fromUser == localStorage.getItem('id') ? (difference[resp].desti_user_description == null ? difference[resp].desti_user[0].mail : difference[resp].desti_user_description.firstname + ' ' + difference[resp].desti_user_description.lastname) : (difference[resp].user_description == null ? difference[resp].user[0].mail : difference[resp].user_description.firstname + ' ' + difference[resp].user_description.lastname)) + '</div><br />'
                    $('.userList').append(displayUser)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    viewConversation()
})

$(document).on('click', '.messageFrom', function (event) {
    event.preventDefault();
    $('#zoneMessage').animate({
        scrollTop: $(".succesMessage").offset().top + 2000
    }, 2000);
    $('.comWith').empty()
    $('.messageFrom').removeClass('focus')
    $('.userFocus').remove()
    $(this).append('<span class="userFocus"> <i class="fas fa-angle-right"></i></span>')
    $(this).addClass('focus')
    $('.sendMessage').css('display', 'block')
    var userId = $(this).attr('data-userid')
    $('.sendButton').attr('data-sendTo', $(this).attr('data-userid'))

    const viewMessage = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/message/' + userId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.ok) {
                let responseData = await response.json()
                console.log(responseData)
                for (var resp in responseData) {
                    var date = new Date(responseData[resp].time)
                    var readDate = new Date(responseData[resp].isReadTime)
                    var options = { weekday: "short", year: "numeric", month: "long", day: "2-digit" };
                    var fullDate = date.toLocaleDateString("fr-FR", options)
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    var readHour = readDate.getHours();
                    var readMinute = readDate.getMinutes();
                    var messHour = hour + ':' + (minute < 10 ? ('0' + minute) : minute)
                    var fullReadDate = readDate.toLocaleDateString("fr-FR", options)
                    var messReadHour = readHour + ':' + (readMinute < 10 ? ('0' + readMinute) : readMinute)
                    if (responseData[resp].fromUser == localStorage.getItem('id') && responseData[resp].toUser == userId || responseData[resp].fromUser == userId && responseData[resp].toUser == localStorage.getItem('id')) {
                        var lastMessage = responseData[resp].isRead
                        if (lastMessage == 1) {
                            var isRead = 'Ce message a été lu le ' + fullReadDate + ' à ' + messReadHour
                        } else {
                            var isRead = 'Ce message n\'a pas encore été lu.'
                        }
                        if (responseData[resp].mediaLink == null) {
                            var message = '<div><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + '">' + responseData[resp].content + '<br /><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "datetimeToUser" : "datetimeFromUser") + ' mt-2">' + (responseData[resp].toUser == localStorage.getItem('id') ? "Reçu" : "Envoyé") + ' le ' + fullDate + ' à ' + messHour + ' <i title="' + isRead + '" class="far fa-eye ' + (lastMessage == 0 ? 'noRead' : '') + '"></i></span></span><br /></div>'
                        } else {
                            var extension = responseData[resp].mediaLink.split('.').pop();
                            if (extension == 'png' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif' || extension == 'svg') {
                                var message = '<div><div class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + ' mediaMessage"><img src="https://www.api.apajh.jeseb.fr/public/' + responseData[resp].mediaLink + '" alt=""><br />' +
                                    '<span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + '">' + responseData[resp].content + '<br /><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "datetimeToUser" : "datetimeFromUser") + ' mt-2">' + (responseData[resp].toUser == localStorage.getItem('id') ? "Reçu" : "Envoyé") + ' le ' + fullDate + ' à ' + messHour + ' <i title="' + isRead + '" class="far fa-eye ' + (lastMessage == 0 ? 'noRead' : '') + '"></i></span></span></div></div>'
                            } else if (extension == 'mp4' || extension == 'avi' || extension == 'mov') {
                                var message = '<div><div class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + ' mediaMessage">' +
                                    '<video class="messageVideo" contextmenu="return false;" oncontextmenu="return false;" controls><source src="https://www.api.apajh.jeseb.fr/public' + responseData[resp].mediaLink + '" type="video/mp4"></video><br />' +
                                    '<span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + '">' + responseData[resp].content + '<br /><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "datetimeToUser" : "datetimeFromUser") + ' mt-2">' + (responseData[resp].toUser == localStorage.getItem('id') ? "Reçu" : "Envoyé") + ' le ' + fullDate + ' à ' + messHour + ' <i title="' + isRead + '" class="far fa-eye ' + (lastMessage == 0 ? 'noRead' : '') + '"></i></span></div></div>'
                            }
                        }
                        $('.comWith').append(message)
                    }

                }
                const messageIsRead = async function (data) {
                    try {
                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/isRead/' + userId, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(data)
                        })
                        if (response.ok) {
                            let responseData = await response.json()


                        } else {
                            console.error('Retour : ', response.status)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
                messageIsRead()
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    viewMessage()
})

$(function () {

    $('#mediaFile').on('change', function (event) {
        event.preventDefault();
        const file = event.target.files[0];
        console.log($('#mediaFile').get(0).files[0])
    });

    $(document).on('click', '.sendButton', function (event) {
        event.preventDefault();
        var userId = $(this).attr('data-sendTo')
        if ($('#mediaFile').val() == '') {
            const sendMessage = async function (data) {
                try {
                    let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/message', {
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
                        $('.succesMessage').append('Votre message à bien été envoyé !')
                        // setTimeout(function () {
                        $('#zoneMessage').animate({
                            scrollTop: $(".sendButton").offset().top + 2000
                        }, 2000);
                        $('.comWith').empty()
                        $('.succesMessage').empty()

                        console.log(userId)
                        const viewMessage = async function (data) {
                            try {
                                let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/message/' + userId, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                    }
                                })
                                if (response.ok) {
                                    let responseData = await response.json()
                                    console.log(responseData)
                                    for (var resp in responseData) {
                                        var date = new Date(responseData[resp].time)
                                        var readDate = new Date(responseData[resp].isReadTime)
                                        var options = { weekday: "short", year: "numeric", month: "long", day: "2-digit" };
                                        var fullDate = date.toLocaleDateString("fr-FR", options)
                                        var hour = date.getHours();
                                        var minute = date.getMinutes();
                                        var readHour = readDate.getHours();
                                        var readMinute = readDate.getMinutes();
                                        var messHour = hour + ':' + (minute < 10 ? ('0' + minute) : minute)
                                        var fullReadDate = readDate.toLocaleDateString("fr-FR", options)
                                        var messReadHour = readHour + ':' + (readMinute < 10 ? ('0' + readMinute) : readMinute)
                                        if (responseData[resp].fromUser == localStorage.getItem('id') && responseData[resp].toUser == userId || responseData[resp].fromUser == userId && responseData[resp].toUser == localStorage.getItem('id')) {
                                            var lastMessage = responseData[resp].isRead
                                            if (lastMessage == 1) {
                                                var isRead = 'Ce message a été lu le ' + fullReadDate + ' à ' + messReadHour
                                            } else {
                                                var isRead = 'Ce message n\'a pas encore été lu.'
                                            }
                                            if (responseData[resp].mediaLink == null) {
                                                var message = '<div><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + '">' + responseData[resp].content + '<br /><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "datetimeToUser" : "datetimeFromUser") + ' mt-2">' + (responseData[resp].toUser == localStorage.getItem('id') ? "Reçu" : "Envoyé") + ' le ' + fullDate + ' à ' + messHour + ' <i title="' + isRead + '" class="far fa-eye ' + (lastMessage == 0 ? 'noRead' : '') + '"></i></span></span><br /></div>'
                                            } else {
                                                var extension = responseData[resp].mediaLink.split('.').pop();
                                                if (extension == 'png' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif' || extension == 'svg') {
                                                    var message = '<div><div class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + ' mediaMessage"><img src="https://www.api.apajh.jeseb.fr/public/' + responseData[resp].mediaLink + '" alt=""><br />' +
                                                        '<span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + '">' + responseData[resp].content + '<br /><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "datetimeToUser" : "datetimeFromUser") + ' mt-2">' + (responseData[resp].toUser == localStorage.getItem('id') ? "Reçu" : "Envoyé") + ' le ' + fullDate + ' à ' + messHour + ' <i title="' + isRead + '" class="far fa-eye ' + (lastMessage == 0 ? 'noRead' : '') + '"></i></span></span></div></div>'
                                                } else if (extension == 'mp4' || extension == 'avi' || extension == 'mov') {
                                                    var message = '<div><div class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + ' mediaMessage">' +
                                                        '<video class="messageVideo" contextmenu="return false;" oncontextmenu="return false;" controls><source src="https://www.api.apajh.jeseb.fr/public' + responseData[resp].mediaLink + '" type="video/mp4"></video><br />' +
                                                        '<span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + '">' + responseData[resp].content + '<br /><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "datetimeToUser" : "datetimeFromUser") + ' mt-2">' + (responseData[resp].toUser == localStorage.getItem('id') ? "Reçu" : "Envoyé") + ' le ' + fullDate + ' à ' + messHour + ' <i title="' + isRead + '" class="far fa-eye ' + (lastMessage == 0 ? 'noRead' : '') + '"></i></span></div></div>'
                                                }
                                            }
                                            $('.comWith').append(message)
                                        }

                                    }
                                    $('.messageArea').val('')
                                } else {
                                    console.error('Retour : ', response.status)
                                }
                            } catch (e) {
                                console.log(e)
                            }
                        }
                        viewMessage()
                        //   }, 1000);

                    } else {
                        console.error('Retour : ', response.status)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            sendMessage({
                toUser: $(this).attr('data-sendTo'),
                content: $('textarea.messageArea').val()
            })
        } else {

            const sendMessageWithMedia = async function (event) {
                const formData = new FormData();
                formData.set('file', $('#mediaFile').get(0).files[0]);
                formData.set('toUser', $('.sendButton').attr('data-sendTo'));
                formData.set('content', $('textarea.messageArea').val());
                try {
                    let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/messageMedia', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: formData
                    })
                    if (response.ok) {
                        let responseData = await response.json()
                        $('.succesMessage').append('Votre message à bien été envoyé !')
                        $('#zoneMessage').animate({
                            scrollTop: $(".sendButton").offset().top + 2000
                        }, 2000);
                        $('.comWith').empty()
                        $('.succesMessage').empty()

                        console.log(userId)
                        const viewMessage = async function (data) {
                            try {
                                let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/message/' + userId, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                    }
                                })
                                if (response.ok) {
                                    let responseData = await response.json()
                                    console.log(responseData)
                                    for (var resp in responseData) {
                                        var date = new Date(responseData[resp].time)
                                        var readDate = new Date(responseData[resp].isReadTime)
                                        var options = { weekday: "short", year: "numeric", month: "long", day: "2-digit" };
                                        var fullDate = date.toLocaleDateString("fr-FR", options)
                                        var hour = date.getHours();
                                        var minute = date.getMinutes();
                                        var readHour = readDate.getHours();
                                        var readMinute = readDate.getMinutes();
                                        var messHour = hour + ':' + (minute < 10 ? ('0' + minute) : minute)
                                        var fullReadDate = readDate.toLocaleDateString("fr-FR", options)
                                        var messReadHour = readHour + ':' + (readMinute < 10 ? ('0' + readMinute) : readMinute)
                                        if (responseData[resp].fromUser == localStorage.getItem('id') && responseData[resp].toUser == userId || responseData[resp].fromUser == userId && responseData[resp].toUser == localStorage.getItem('id')) {
                                            var lastMessage = responseData[resp].isRead
                                            if (lastMessage == 1) {
                                                var isRead = 'Ce message a été lu le ' + fullReadDate + ' à ' + messReadHour
                                            } else {
                                                var isRead = 'Ce message n\'a pas encore été lu.'
                                            }
                                            if (responseData[resp].mediaLink == null) {
                                                var message = '<div><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + '">' + responseData[resp].content + '<br /><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "datetimeToUser" : "datetimeFromUser") + ' mt-2">Reçu le ' + fullDate + ' à ' + messHour + ' <i title="' + isRead + '" class="far fa-eye ' + (lastMessage == 0 ? 'noRead' : '') + '"></i></span></span><br /></div>'
                                            } else {
                                                var extension = responseData[resp].mediaLink.split('.').pop();
                                                if (extension == 'png' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif' || extension == 'svg') {
                                                    var message = '<div><div class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + ' mediaMessage"><img src="https://www.api.apajh.jeseb.fr/public/' + responseData[resp].mediaLink + '" alt=""><br />' +
                                                        '<span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + '">' + responseData[resp].content + '<br /><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "datetimeToUser" : "datetimeFromUser") + ' mt-2">Reçu le ' + fullDate + ' à ' + messHour + ' <i title="' + isRead + '" class="far fa-eye ' + (lastMessage == 0 ? 'noRead' : '') + '"></i></span></span></div></div>'
                                                } else if (extension == 'mp4' || extension == 'avi' || extension == 'mov') {
                                                    var message = '<div><div class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + ' mediaMessage">' +
                                                        '<video class="messageVideo" contextmenu="return false;" oncontextmenu="return false;" controls><source src="https://www.api.apajh.jeseb.fr/public' + responseData[resp].mediaLink + '" type="video/mp4"></video><br />' +
                                                        '<span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "messageToUser" : "messageFromUser") + '">' + responseData[resp].content + '<br /><span class="' + (responseData[resp].fromUser == localStorage.getItem('id') ? "datetimeToUser" : "datetimeFromUser") + ' mt-2">Reçu le ' + fullDate + ' à ' + messHour + ' <i title="' + isRead + '" class="far fa-eye ' + (lastMessage == 0 ? 'noRead' : '') + '"></i></span></div></div>'
                                                }
                                            }
                                            $('.comWith').append(message)
                                        }

                                    }
                                    $('.messageArea').val('')
                                } else {
                                    console.error('Retour : ', response.status)
                                }
                            } catch (e) {
                                console.log(e)
                            }
                        }
                        viewMessage()
                    } else {
                        console.error('Retour : ', response.status)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            sendMessageWithMedia(event)
        }

    })

});

$(document).on('click', '.newContact', function (event) {
    event.preventDefault();
    const selectUserForMessage = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/userForMessage', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                console.log(responseData)
                for (var resp in responseData) {
                    var user = '<option value="' + responseData[resp].id + '">' + (responseData[resp].user_description != null ? responseData[resp].user_description.firstname + ' ' + responseData[resp].user_description.lastname : responseData[resp].mail) + '</option>'
                    $('.userForMessage').append(user)
                }


            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    selectUserForMessage()
})
$(document).on('change', '.userForMessage', function (event) {
    event.preventDefault();
    $('.newSendButton').attr('data-sendTo', $('.userForMessage').val())
})

$(document).on('click', '.newSendButton', function (event) {
    event.preventDefault();
    const sendMessage = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/message', {
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
                $('.newSuccesMessage').append('Votre message à bien été envoyé !')
                setTimeout(function () {
                    window.location.reload(1);
                }, 1000);

            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    sendMessage({
        toUser: $(this).attr('data-sendTo'),
        content: $('textarea.newMessageArea').val()
    })
})
