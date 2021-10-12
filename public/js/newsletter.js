if(document.querySelector('#unsubscribe_btn')) {
    document.querySelector('#unsubscribe_btn').addEventListener('click', e => {
        e.preventDefault();
        let email = document.querySelector('#newsletter_email').value;
        console.log(email)
        fetch('http://localhost:3000/newsletter/unsubscribe/' + email)
        .then(response => {
            localStorage.setItem('success_msg', 'Du har succesfuldt afmeldt denne email: ' + email + '!');
            window.location.reload(window.location.href);
        })
        .catch(err => {
            console.log(err);
        })
    })
}
