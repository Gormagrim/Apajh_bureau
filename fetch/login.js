$('#login').on('click', function (event) {
    event.preventDefault();
    var mail = $('#mail').val()
    var password = $('#password').val()
    console.log(mail)
    console.log(password)
    const login = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh-num-et-rik.fr/public/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                let responseData = await response.json()
                localStorage.setItem('token', responseData.token.original.access_token)
                localStorage.setItem('id', responseData.id)
                localStorage.setItem('userPhoto', responseData.userPhoto)
                localStorage.setItem('userGroup', responseData.userGroup)
                localStorage.setItem('isActive', responseData.isActive)
                localStorage.setItem('logoutTime', Date.now() + (3600*1000))
                document.location.replace('./views/menu.html');
            } else {
                if (!mail.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)) {
                    alert(mail +  ' n\'est pas une adresse valide');
                } else {
                    alert('Le mail et le mot de passe saisis ne correspondent pas.')
                }
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    login({
        mail: $('#mail').val(),
        password: $('#password').val()
    })
})