document.querySelector('#header_list').querySelectorAll('a').forEach(a => {
    if(a.innerHTML.trim().includes(document.querySelectorAll('title')[0].innerHTML.trim())) {
        a.classList.add('menu_item_clicked');
    }
    else {
        a.classList.remove('menu_item_clicked');
    }
})

if(document.querySelector('#crumbs')) {
    document.querySelector('#crumbs').querySelectorAll('a').forEach(a => {
        if(a.innerHTML.trim().includes(document.querySelectorAll('title')[0].innerHTML.trim())) {
            a.classList.add('active_crumb');
        }
        else {
            a.classList.remove('active_crumb');
        }
    })
}

//this beautiful piece of code takes care of toggleing visibility for the different containers on the admin pages overview
//as well as toggleing css classes on the buttons, indicating which entity is being looked at
Array.from(document.getElementsByClassName('admin_btn')).forEach(btn => {
    //add eventlisteners to all buttons
    btn.addEventListener('click', e => {
        e.preventDefault();
        //populate a second array with the same buttons, for dynamic comparison
        Array.from(document.getElementsByClassName('admin_btn')).forEach(button => {
            //remove site location indication
            button.classList.remove('btn_clicked');
            //essentially, if the button is not the one being clicked, hide the corresponding container
            if(btn.dataset.container != button.dataset.container) {
                if(document.querySelector('.' + button.dataset.container)) {
                    document.querySelector('.' + button.dataset.container).classList.add('hidden');
                }
            } else {
                //if the button is the one being clicked, show the container
                button.classList.add('btn_clicked');
                if(document.querySelector('.' + button.dataset.container)) {
                    document.querySelector('.' + button.dataset.container).classList.remove('hidden');
                }
            }
        })
    })
})

if(document.querySelector('.add_ad_btn')) {
    document.querySelector('.add_ad_btn').addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.add_ad_div').classList.toggle('hidden');
    })
}

if(document.querySelector('.add_price_per_view_btn')) {
    document.querySelector('.add_price_per_view_btn').addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.add_price_per_view_div').classList.toggle('hidden');
    })
}

if(document.querySelector('.article_add_btn')) {
    document.querySelector('.article_add_btn').addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.add_article_div').classList.toggle('hidden');
    })
}

let paragraph_count = 0;
if(document.querySelector('.add_paragraph')) {
    document.querySelector('.add_paragraph').addEventListener('click', e => {
        paragraph_count++;
        e.preventDefault();
        document.querySelector('.add_paragraph').insertAdjacentHTML('beforebegin',`
            <div class="form-group paragraph_div_${paragraph_count}">
                <label for="subtitle">Under-Overskrift: </label>
                <input class="form-control" type="text" id="subtitle_${paragraph_count}" name="paragraph_${paragraph_count}" required>
            </div>
            <div class="form-group section_div_${paragraph_count}">
                <label for="subtitle">Afsnit: </label>
                <textarea class="form-control" id="section_${paragraph_count}" name="paragraph_${paragraph_count}" required></textarea>
            </div>
            <div class="form-group">
                <button type="button" class="admin_submit_btn add_section_btn_${paragraph_count}">Tilføj nyt afsnit</button>
            </div>
        `);
        document.querySelector('.add_section_btn_' + paragraph_count).addEventListener('click', e => {
            e.preventDefault()
            console.log('test')
            document.querySelector(`.section_div_${paragraph_count}`).innerHTML += `
                <textarea class="form-control" id="section_${paragraph_count}" name="paragraph_${paragraph_count}" required></textarea>
            `;
        })
    })
}

if(document.querySelector('.add_opening_paragraph')) {
    document.querySelector('.add_opening_paragraph').addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.add_opening_paragraph').insertAdjacentHTML("beforebegin",`
            <textarea class="form-control opening" name="opening" required></textarea>
        `);
    })
}

function toggle_new_user() {
    document.querySelector('.add_user_div').classList.toggle('hidden');
}