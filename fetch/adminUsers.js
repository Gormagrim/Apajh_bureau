$(document).ready(function () {
    const getUsers = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/users', {
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
                    var lastLoginDate = new Date(responseData[resp].last_Login)
                    var lastLoginDate = new Date(responseData[resp].last_Login)
                    var today = new Date()
                    var oneDay = 60 * 60 * 24 * 1000
                    var oneYear = 365
                    var memberLastLoginFullDate = Math.floor((today - lastLoginDate) / oneDay)
                    var memberTimeYear = (memberLastLoginFullDate / oneYear).toFixed(2)
                    var memberLastLoginFullDate = Math.floor((today - lastLoginDate) / oneDay)
                    var memberTimeYear = (memberLastLoginFullDate / oneYear).toFixed(2)
                    //   if (responseData[resp].contentIsOnline == 1) {
                    //      var contentIsOnline = '<button type="button" data-id="' + responseData[resp].id + '" data-online="' + responseData[resp].contentIsOnline + '" class="btn btn-outline-success btn-sm isOnline">Online</button>'
                    //      var statusClass = 'onlineArticle'
                    //   } else if (responseData[resp].contentIsOnline == 0) {
                    //       var contentIsOnline = '<button type="button" data-id="' + responseData[resp].id + '" data-online="' + responseData[resp].contentIsOnline + '" class="btn btn-outline-danger btn-sm isOffline">Offline</button>'
                    //      var statusClass = 'offlineArticle'
                    //    }
                    //   var status = '<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"><button class="btn btn-primary btn-sm modif" data-bs-toggle="modal" data-bs-target="#modalModif" data-id="' + responseData[resp].id + '" type="button">Modifier</button></div>' +
                    //       '<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"><button class="btn btn-danger btn-sm delete" data-deleteId="' + responseData[resp].id + '" type="button">Supprimer</button></div>'
                    var login = responseData[resp].last_Login == null ? null : responseData[resp].last_Login
                    var date = new Date(login)
                    var options = { weekday: "short", year: "numeric", month: "long", day: "2-digit" };
                    var fullDate = responseData[resp].last_Login == null ? 'Aucune' : date.toLocaleDateString("fr-FR", options)

                    var display = '<div class="row oneUser' + (responseData[resp].last_Login == null ? '' : (memberTimeYear >= 2 ? ' accountWillBeDeleted' : '')) + '"><div class="col-4">' +
                        (responseData[resp].user_description != null ? (responseData[resp].user_description.firstname + ' ' + responseData[resp].user_description.lastname) : responseData[resp].mail) +
                        '</div><div class="col-1 ' + (responseData[resp].user_group.type == 'Admin' ? 'admin' : (responseData[resp].user_group.type == 'Direction' ? 'direction' : (responseData[resp].user_group.type == 'IME' ? 'ime' : (responseData[resp].user_group.type == 'Auditif' ? 'service' : (responseData[resp].user_group.type == 'Visuel' ? 'service' : (responseData[resp].user_group.type == 'Famille' ? 'famille' : (responseData[resp].user_group.type == 'Inscrit' ? 'inscrit' : ''))))))) + '">' + (responseData[resp].user_group.type == 'Visuel' || responseData[resp].user_group.type == 'Auditif' ? 'Service' : responseData[resp].user_group.type) + '</div><div class="col-3">' + fullDate + '</div>' +
                        '<div class="col-2 ' + (responseData[resp].isActive == '1' ? 'active' : 'inactive') + '">' + (responseData[resp].isActive == '1' ? 'Activé' : 'Non Activé') +
                        '</div><div class="col-2"><span class="oeilSpan" title="Voir l\'utilisateur" data-bs-toggle="modal" data-bs-target="#userModal"><i class="fas fa-eye fa-2x userView" data-id="' +
                        responseData[resp].id + '"></i></span></div></div>'

                    $('.users').append(display)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getUsers()
})
// clic sur l'oeil pour voir le détail d'un utilisateur
$(document).on('click', '.userView', function (event) {
    event.preventDefault();
    $('.modal-title').empty()
    $('.userPhoto').empty()
    $('.userDescription').empty()
    $('.registerDate').empty()
    $('.isActif').empty()
    $('.lastLogin').empty()
    $('.userGroup').empty()
    $('.modifGroup').empty()
    $('.modifGroupButton').empty()
    $('.modifGroupButton').css('display', 'block')
    $('.modifGroup').css('display', 'none')
    var userId = $(this).attr('data-id')
    const userInfo = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/users/' + userId, {
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
                $('.trashUser').attr('data-id', responseData[0].id);
                $('.modal-title').text(responseData[0].user_description == null ? responseData[0].mail : responseData[0].user_description.firstname + ' ' + responseData[0].user_description.lastname)
                var userPhoto = responseData[0].user_photo == null ? '../img/avatar.png' : 'https://www.api.apajh.jeseb.fr/public' + responseData[0].user_photo.photoLink
                var userPhotoAlt = responseData[0].user_description == null ? 'Photo de profil de ' + responseData[0].mail : responseData[0].user_description.firstname + ' ' + responseData[0].user_description.lastname
                $('.userPhoto').append('<img class="myPhoto" src="' + userPhoto + '" alt="Photo de profil de ' +
                    userPhotoAlt + '">')
                $('.userGroup').append('<div class="col-12 text-center">Groupe d\'utilisateur : <span class="' + (responseData[0].user_group.type == 'Admin' ? 'admin' : (responseData[0].user_group.type == 'Direction' ? 'direction' : (responseData[0].user_group.type == 'IME' ? 'ime' : (responseData[0].user_group.type == 'Auditif' ? 'service' : (responseData[0].user_group.type == 'Visuel' ? 'service' : (responseData[0].user_group.type == 'Famille' ? 'famille' : (responseData[0].user_group.type == 'Inscrit' ? 'inscrit' : ''))))))) + '">' + (responseData[0].user_group.type == 'Auditif' || responseData[0].user_group.type == 'Visuel' ? 'Service' : responseData[0].user_group.type) + '</span></div>')
                $('.modifGroupButton').append('<div class="text-center mt-2"><button type="button" class="btn btn-outline-success btn-sm groupModif">Modifier le groupe</button></div>')
                if (localStorage.getItem('userGroup') == 1) {
                    $('.modifGroup').append('<select class="adminUserGroupSelect"><option value="">--Choix du groupe--</option>' +
                        '<option value="1">Admin</option>' +
                        '<option value="2">Direction</option>' +
                        '<option value="3">IME</option>' +
                        '<option value="4">Auditif</option>' +
                        '<option value="5">Visuel</option>' +
                        '<option value="6">Famille</option>' +
                        '<option value="7">Inscrit</option>' +
                        '</select><div class="text-center mt-2"><button type="button" data-actualUG="' + responseData[0].id_userGroup + '" data-id="' + responseData[0].id + '" class="btn btn-outline-success btn-sm groupValidation">Valider le groupe</button></div>')
                } else if (localStorage.getItem('userGroup') == 2) {
                    $('.modifGroup').append('<select class="adminUserGroupSelect"><option value="">--Choix du groupe--</option>' +
                        '<option value="3">IME</option>' +
                        '<option value="4">Auditif</option>' +
                        '<option value="5">Visuel</option>' +
                        '<option value="6">Famille</option>' +
                        '<option value="7">Inscrit</option>' +
                        '</select><div class="text-center mt-2"><button type="button" data-actualUG="' + responseData[0].id_userGroup + '" data-id="' + responseData[0].id + '" class="btn btn-outline-success btn-sm groupValidation">Valider le groupe</button></div>')
                }
                var city = responseData[0].location == null ? 'Ville non renseignée' : responseData[0].location.cities + ' (' + responseData[0].location.postalCode + ')'
                if (responseData[0].user_description == null) {
                    $('.userDescription').append('<div>Pas de description renseignée.</div>')
                } else {
                    $('.userDescription').append('<div>' + responseData[0].user_description.job + ' à ' + city + '</div>')
                }
                var date = new Date(responseData[0].created_at)
                var options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };
                var fullDate = date.toLocaleDateString("fr-FR", options)
                var oneDay = 60 * 60 * 24 * 1000
                var oneYear = 365
                var today = new Date()
                var memberTime = Math.floor((today - date) / oneDay)
                $('.registerDate').append('<div>Membre depuis le <span class="userRegisterDate">' + fullDate + '</span> soit <span class="userRegisterDate">' + memberTime + '</span> jours.</div>')
                if (responseData[0].isActive == '0') {
                    $('.isActif').append('<div class="notActive">Ce compte n\'a pas été activé par l\'utilisateur.</div><br /><div><button type="button" data-id="' + responseData[0].id +
                        '" class="btn btn-primary btn-sm sendMail" data-key="' + responseData[0].validationKey + '" data-mail="' + responseData[0].mail + '">Renvoyer le mail de validation d\'inscription</button></div><br /><div><button type="button" data-id="' + responseData[0].id +
                        '" class="btn btn-outline-success btn-sm activAccount" data-mail="' + responseData[0].mail + '" data-key="' + responseData[0].validationKey +
                        '">Activer le compte</button></div>')
                } else {
                    $('.isActif').append('<div>Ce compte est actif</div><div><button type="button" data-id="' + responseData[0].id +
                        '" class="btn btn-outline-danger btn-sm desactivAccount" data-mail="' + responseData[0].mail + '" data-key="' + responseData[0].validationKey + '">Desactiver le compte</button></div>')
                }
                var lastLoginDate = new Date(responseData[0].last_Login)
                var lastLoginFullDate = lastLoginDate.toLocaleDateString("fr-FR", options)
                var memberLastLoginFullDate = Math.floor((today - lastLoginDate) / oneDay)
                var memberTimeYear = (memberLastLoginFullDate / oneYear).toFixed(2)
                if (responseData[0].last_Login == null) {
                    $('.lastLogin').append('<div>Pas d\'information sur sa dernière connexion.</div>')
                } else {
                    $('.lastLogin').append('<span>Sa dernière connexion remonte au <span class="userRegisterDate">' + lastLoginFullDate + '.</span>' + (memberTimeYear == '0.00' ? '' : ' (' + memberTimeYear + ' ans)') + '</span>')
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    userInfo()
})
// Modification du groupe d'utilisateur
$(document).on('click', '.groupValidation', function (event) {
    event.preventDefault();
    console.log($('.adminUserGroupSelect').val())
    if ($(this).attr('data-actualUG') == 1 && localStorage.getItem('userGroup') == 2 || $(this).attr('data-actualUG') == 2 && localStorage.getItem('userGroup') == 2) {
        $('.modifGroup').empty()
        $('.modifGroup').append('<p class="errorMsg">Vous n\'êtes pas autorisé.</p>')
        setTimeout(function () {
            window.location.reload(1);
        }, 1000);
    } else {
        const usergroupModif = async function (data) {
            try {
                let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/usergroup', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(data)
                })
                if (response.ok) {
                    let responseData = await response.json()
                    console.log(localStorage.getItem('userGroup'))
                    $('.modifGroup').empty()
                    $('.modifGroup').append(responseData.message)
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
        usergroupModif({
            id: $(this).attr('data-id'),
            id_userGroup: $('.adminUserGroupSelect').val()
        })
    }
})
$(document).on('click', '.groupModif', function (event) {
    event.preventDefault();
    $('.modifGroupButton').css('display', 'none')
    $('.modifGroup').css('display', 'block')
})
//Desactiver un compte
$(document).on('click', '.desactivAccount', function (event) {
    event.preventDefault();
    const userAccountActivate = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/desactivate', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                $('.isActif').empty()
                $('.isActif').append('<div class="text-center activateAcc">Le compte de l\'utilisateur a bien été desactivé</div>')
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
    userAccountActivate({
        mail: $(this).attr('data-mail'),
        validationKey: $(this).attr('data-key')
    })
})
// activer un compte
$(document).on('click', '.activAccount', function (event) {
    event.preventDefault();
    const userAccountDesactivate = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/activate', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                $('.isActif').empty()
                $('.isActif').append('<div class="text-center activateAcc">Le compte de l\'utilisateur a bien été activé</div>')
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
    userAccountDesactivate({
        mail: $(this).attr('data-mail'),
        validationKey: $(this).attr('data-key')
    })
})

// renvoyer le mail de validation d'inscription
$(document).on('click', '.sendMail', function (event) {
    event.preventDefault();
    const sendMail = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/sendmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                $('.isActif').empty()
                $('.isActif').append('<div class="text-center activateAcc">Le mail de validation d\'inscription a bien été renvoyé à l\'utilisateur.</div>')
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
    sendMail({
        mail: $(this).attr('data-mail'),
        validationKey: $(this).attr('data-key')
    })
})

// Supprimer un utilisateur
$(document).on('click', '.trashUser', function (event) {
    event.preventDefault();
    const trashUser = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                $('.isActif').empty()
                $('.isActif').append('<div class="text-center activateAcc">L\'utilisateur a bien été supprimé.</div>')
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
    trashUser({
        id: $(this).attr('data-id')
    })
})

// Solidité mot de passe
$('#password').on('keyup', function (event) {
    var msg;
    var str = $('#password').val();
    if (str.match(/[0-9]/g) &&
        str.match(/[A-Z]/g) &&
        str.match(/[a-z]/g) &&
        str.match(/[^a-zA-Z\d]/g) &&
        str.length >= 8) {
        msg = "<p style='color:green'>Mot de passe fort.</p>";
    } else if (str.length == 0) {
        msg = "";
    } else {
        msg = "<p style='color:red'>Mot de passe faible.</p>";
    }
    $('#msg').html(msg);
});

// Afficher ou pas le mot de passe
$(document).ready(function () {
    $("#show_hide_password a").on('click', function (event) {
        event.preventDefault();
        if ($('#show_hide_password input').attr("type") == "text") {
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass("fa-eye-slash");
            $('#show_hide_password i').removeClass("fa-eye");
        } else if ($('#show_hide_password input').attr("type") == "password") {
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass("fa-eye-slash");
            $('#show_hide_password i').addClass("fa-eye");
        }
    });
    $("#show_hide_password_verif a").on('click', function (event) {
        event.preventDefault();
        if ($('#show_hide_password_verif input').attr("type") == "text") {
            $('#show_hide_password_verif input').attr('type', 'password');
            $('#show_hide_password_verif i').addClass("fa-eye-slash");
            $('#show_hide_password_verif i').removeClass("fa-eye");
        } else if ($('#show_hide_password_verif input').attr("type") == "password") {
            $('#show_hide_password_verif input').attr('type', 'text');
            $('#show_hide_password_verif i').removeClass("fa-eye-slash");
            $('#show_hide_password_verif i').addClass("fa-eye");
        }
    });
});

// Ajouter un utilisateur
$(document).on('click', '.createUserValidation', function (event) {
    event.preventDefault();
    $('.creationMessage').empty()
    $('.mailError').empty()
    $('.pwdError').empty()
    $('.pwdVError').empty()
    var mailTest = /^([a-zA-Z0-9À-ÖØ-öø-ÿ\.\-\_]+)@([a-zA-Z0-9À-ÖØ-öø-ÿ\-\_\.]+)\.([a-zA-Z\.]{2,250})$/
    var mail = $('#mail').val()
    var password = $('#password').val()
    var passwordVerif = $('#passwordVerif').val()
    if (password.length >= 8) {
        if (password == passwordVerif) {
            if (mail.match(mailTest)) {
                if (password.length >= 8 && password == passwordVerif && mail.match(mailTest)) {
                    const addUser = async function (data) {
                        try {
                            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/register', {
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
                                $('.creationMessage').append('<p>Un nouvel utilisateur a bien été créé.</p>')
                                 setTimeout(function () {
                                     window.location.reload(1);
                                 }, 1000);
                                var mail = responseData.user.mail
                                var key = responseData.user.validationKey
                                const sendUserMail = async function (data) {
                                    try {
                                        let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/sendmail', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                                            },
                                            body: JSON.stringify(data)
                                        })
                                        if (response.ok) {
                                            let responseMailData = await response.json()

                                        } else {
                                            console.error('Retour : ', response.status)
                                        }
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }
                                sendUserMail({
                                    mail: mail,
                                    validationKey: key
                                })
                            } else {
                                console.error('Retour : ', response.status)
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    addUser({
                        mail: $('#mail').val(),
                        password: $('#password').val()
                    })
                } else {
                    $('.creationMessage').append('<p>Une erreur est survenue.</p>')
                }
            } else {
                $('.mailError').append('<p>Vous devez saisir une adresse mail valide.</p>')
            }
        } else {
            $('.pwdError').append('<p>Le mot de passe doit être identique à la confirmation.</p>')
            $('.pwdVError').append('<p>Le mot de passe doit être identique à la confirmation.</p>')
        }
    } else {
        $('.pwdError').append('<p>Le mot de passe doit contenir au moins 8 caraclères.</p>')
    }
})