
$(document).ready(function() {
    const userInfo = async function (data) {
        try {
            let response = await fetch('https://www.api.apajh.jeseb.fr/public/v1/user', {
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
                $('#name').text(responseData.user_description.firstname)
            } else {
                console.error('Retour : ', response.status)
            }
        } catch (e) {
            console.log(e)
        }
    }
    userInfo()
});