const inputUser = document.getElementById('userReg')
const inputPasswd = document.getElementById('userPasswd')
const buttonReg = document.getElementById('regButton')
const errors = document.getElementById('result')

buttonReg.addEventListener('click', async () => {
    let response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: inputUser.value,
            password: inputPasswd.value

        })
    })
    let data = await response.json()

    if(!response.ok){
        errors.innerHTML = data.error
    }
    else {
        errors.innerHTML = 'user succsefully register'

    }
})