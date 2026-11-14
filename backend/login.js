const inputUser = document.getElementById('userReg')
const inputPasswd = document.getElementById('userPasswd')
const buttonLog = document.getElementById('logButton')
const errors = document.getElementById('result')


buttonLog.addEventListener('click', async () => {
    let response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: inputUser.value,
            password: inputPasswd.value

        })
    })
    let data = await response.json()
    console.log(data)

    if(!response.ok){
        errors.innerHTML = data.error
    }
    else {
        errors.innerHTML = 'user succsefully login ' + data.token
        localStorage.setItem('token', data.token)
        
    }
})