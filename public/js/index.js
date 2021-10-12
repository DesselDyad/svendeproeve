document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('success_msg')) {
        let myDiv = document.createElement('DIV');
        let rowDiv = document.createElement('DIV');
        myDiv.classList.add('alert');
        myDiv.classList.add('alert-success');
        let myNode = document.createTextNode(localStorage.getItem('success_msg'));
        let myP = document.createElement('P');
        myP.appendChild(myNode);
        myDiv.appendChild(myP);
        myDiv.classList.add('col-xs-12');
        rowDiv.classList.add('row');
        rowDiv.appendChild(myDiv);
        document.querySelector('.top_div').insertAdjacentElement('afterbegin', rowDiv);
        localStorage.removeItem('success_msg');
    }
    [
        {
            name: 'newsletter.js'
        },
        {
            name: 'image_input.js'
        },
        {
            name: 'admin_function.js'
        },
        {
            name: 'admin_toggle.js'
        },
        {
            name: 'admin_sort.js'
        }
    ].forEach(script => {
        let _script = document.createElement('SCRIPT');
        _script.setAttribute('src', '/js/' + script.name);
        document.querySelectorAll('head')[0].appendChild(_script);
    })
})