
$(document).ready(function () {
    const userInfo = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                if (responseData.user_description == null) {
                    $('#myInformationModal').modal('show')

                } else {
                    $('#name').text(responseData.user_description.firstname)
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    userInfo()
});
// si les infos sont rentrés, apparition du boutton valider
$(document).change(function () {
    if ($('#firstname').val() == '' || $('#lastname').val() == '' || $('#job').val() == "" || $('.id_city').val() == '') {
        $('.validInfo').html('Merci de saisir tous les champs pour pouvoir valider')
    } else {
        $('.validInfo').empty()
        $('.validButton').css('display', 'block')
    }
});

// selection de la ville par le code postale
$('#postalCode').on('keyup', function (event) {
    event.preventDefault();
    $('#cities').css('visibility', 'visible')
    const addCity = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/city', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                $('.cities').empty();
                if (responseData.length > 0) {
                    $.each(responseData, function (key, type) {
                        var display = '<option class="cityOption" data-value="' + key + '" id="' + type.id + '" value="' + type.id + '">' + type.cities + '</option>'
                        $('.cities').append(display)

                    });
                }
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    addCity({
        postalCode: $(this).val()
    })
})
$('#cities').on('change', function (event) {
    event.preventDefault();
    var idCity = $(this).val()
    $('.id_city').val(idCity)
});

$('.addUserInformations').on('click', function (event) {
    event.preventDefault();
    const addInformations = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseAddInfos = await response.json()
                $('.validButton').append('<div class="text-center modalInfo">Vos informations ont bien été ajoutées !</div>')
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
    addInformations({
        firstname: $('#firstname').val(),
        lastname: $('#lastname').val(),
        job: $('#job').val(),
        id_location: $('.id_city').val()
    })
});
