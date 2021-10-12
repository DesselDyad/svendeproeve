//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////// ARTICLE FUNCTIONALITY /////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function edit_article(id) {
    fetch('/article/getSingle/' + id)
    .then(result => {
        return result.json()
    })
    .then(article => {
        let div = document.querySelector('#edit_div');
        div.innerHTML = '';
        div.classList.remove('hidden');
        div.innerHTML = `
            <form class="update_article_form" method="post" action="/admin/article/updateArticle/${id}" novalidate>
                <h2 class="big_h2"><strong>Rediger Artikel: </strong></h2>
                <h2>Overskrift: - ${article[0].title}</h2>
                <input name="written" value="${article[0].written}" hidden>
                <div class="form-group">
                    <label for="title">Rediger overskrift</label>
                    <input class="form-control" type="text" id="title" name="title" value="${article[0].title}" required>
                </div>
                <div class="form-group">
                    <label for="title">Redaktør</label>
                    <select class="form-control" id="editor_select" name="editor"></select>
                </div>
                <div class="form-group">
                    <label for="title">Kategori</label>
                    <select class="form-control" id="category_select" name="category"></select>
                </div>
                <h2>Afsnit i denne artikels indledning: </h2>
                <button type="button" class="admin_submit_btn" id="edit_article_opening_btn">Tilføj Afsnit til Indledning</button>
            </form>
        `;
        return article;
    })
    .then(article => {
        if(article[0].content.opening != undefined) {
            if(article[0].content.opening.length > 0) {
                article[0].content.opening.forEach((entry,i) => {
                    document.querySelector('.update_article_form').innerHTML += `
                        <div class="form-group">
                            <label for="entry">${'Paragraf #' + (i + 1)}</label>
                            <textarea class="form-control" type="text" id="entry" name="entry" required>${entry}</textarea>
                        </div>
                    `;
                })
            }
        }
        return article;
    })
    .then(article => {
        let paragraph_count = 0;
        if(article[0].content.paragraphs != null) {
            if(article[0].content.paragraphs.length > 0) {
                article[0].content.paragraphs.forEach((paragraph,i) => {
                    document.querySelector('.update_article_form').innerHTML += `
                        <div class="form-group">
                            <h2>Under-Overskrift: - ${paragraph.subtitle}</h2>
                            <label for="subtitle">Rediger under-overskrift: </label>
                            <input class="form-control" type="text" id="title" name="paragraph_${i}" value="${paragraph.subtitle}" required>
                        </div>
                        <div class="form-group paragraph_${i}">
                            <label for="subtitle">Afsnit</label>
                        </div>
                    `;
                    paragraph.sections.forEach(section => {
                        document.querySelector('.paragraph_' + i).innerHTML += `
                            <textarea class="form-control" type="text" id="entry" name="paragraph_${i}" required>${section}</textarea>
                        `;
                    })
                    paragraph_count++;
                })
            }
        }
        return {
            article: article,
            paragraph_count: paragraph_count
        };
    })
    .then(article => {
        document.querySelector('.update_article_form').innerHTML += `
            <button type="button" class="admin_submit_btn" id="edit_article_paragraph_btn">Tilføj Under-Afsnit</button>
        `;
        //now that i'm sure everything has been properly parsed, i'll add some buttons and some eventlisteners to append some more empty fields and stuff
        //right here
        return article;
    })
    .then(article => {

        fetch('/user/getAllEditors')
        .then(result => {
            return result.json();
        })
        .then(editors => {
            console.log('editors', editors);
            editors.forEach(editor => {
                document.querySelector('#editor_select').innerHTML += `
                    <option value="${editor._id}">
                        ${editor.name}
                    </option>
                `;
                Array.from(document.querySelector('#editor_select').getElementsByTagName('option')).forEach(option => {
                    if(article.article[0].author != null) {
                        if(option.value == article.article[0].author._id) {
                            // option.selected = true;
                            option.setAttribute('selected', true);
                        }
                    }
                })
            })
        })
        .catch(e => {
            console.log(e);
        })
        return article;
    })
    .then(article => {
        fetch('/category/getAllForEditArticle')
        .then(result => {
            return result.json();
        })
        .then(categories => {
            console.log('categories', categories);
            categories.forEach(category => {
                document.querySelector('#category_select').innerHTML += `
                    <option value="${category._id}">
                        ${category.editor_name}
                    </option>
                `;
            })
        })
        .catch(e => {
            console.log(e);
        })
        return article;
    })
    .then(article => {
        console.log('article.paragraph_count',article.paragraph_count);
        document.querySelector('.update_article_form').innerHTML += `
            <button type="submit" class="admin_submit_btn">
                Opdater
            </button>
        `;
        document.querySelector('#edit_article_opening_btn').addEventListener('click', e => {
            console.log('getting clicked')
            e.preventDefault();
            document.querySelector('#edit_article_opening_btn').insertAdjacentHTML('beforebegin', `
            <div class="form-group">
                <textarea class="form-control" type="text" id="entry" name="entry" required></textarea>
            </div>
            `);
        })
        document.querySelector('#edit_article_paragraph_btn').addEventListener('click', e => {
            e.preventDefault();
            let myCount = article.paragraph_count;
            document.querySelector('#edit_article_paragraph_btn').insertAdjacentHTML('beforebegin', `
                <div class="form-group"><div class="form-group">
                    <label for="subtitle">Under-overskrift: </label>
                    <input class="form-control" type="text" id="title" name="paragraph_${myCount}" required>
                </div>
                <div class="form-group" id="my_paragraph_div_${myCount}">
                    <label for="paragraph ${myCount}">Afsnit</label>
                    <textarea class="form-control" type="text" id="paragraph ${myCount}" name="paragraph_${myCount}" required></textarea>
                </div>
                <button type="button" class="admin_submit_btn" id="add_paragraph_btn_${myCount}">Tilføj Afsnit</button>
            `);
            console.log(myCount)
            document.querySelector('#add_paragraph_btn_'+myCount).addEventListener('click', e => {
                e.preventDefault();
                console.log(myCount)
                document.querySelector(`#my_paragraph_div_${myCount}`).innerHTML += `
                    <textarea class="form-control" type="text" id="paragraph ${myCount}" name="paragraph_${myCount}" required></textarea>
                `;
            })
            article.paragraph_count++;
        })
        window.location.href = window.location.href + '#edit_div';
    })
    .catch(e => {
        console.log(e);
    })
}

function delete_article(id) {
    if(confirm('Er du sikker på du vil slette denne artikel? ADVARSEL: DETTE VIL LIGELEDES SLETTE ALLE TILHØRENDE KOMMENTARER PERAMNENT!!!!!!')) {
        fetch('/admin/article/deleteArticle/' + id)
        // .then(response => {
        //     return response.json()
        // })
        .then(article => {
            localStorage.setItem('success_msg', 'Artikel blev slettet succesfuldt!');
            window.location.reload('http://localhost:3000/admin');
        })
        .catch(err => {
            console.log(err);
        })
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// ADVERTISEMENT & SPONSOR STUFF /////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function edit_ad (id) {
    fetch('/ad/getSingle/' + id)
    .then(result => {
        return result.json()
    })
    .then(ad => {
        //do something
        let div = document.querySelector('#edit_div');
        div.innerHTML = '';
        div.classList.remove('hidden');
        div.innerHTML += `
            <form class="update_ad_form" method="post" action="/admin/ad/updateSingle/${id}" enctype="multipart/form-data" novalidate>
                <h2>Rediger Reklame: </h2>
                <div class="form-group">
                    <label for="category">Vælg Kategori: </label>
                    <select class="form-control" id="category_select" name="category" value="${ad[0].category.query_name}"></select>
                </div>
                <div class="form-group">
                    <label for="text">Reklame Tekst: </label>
                    <input class="form-control" type="text" id="text" name="text" value="${ad[0].text}">
                </div>
                <div class="form-group">
                    <label>Gammelt Billede: </label>
                    <img src="/img/logo/${ad[0].img}" title"/img/logo/${ad[0].img}" alt="/img/logo/${ad[0].img}" class="img-responsive">
                    <input type="text" name="oldImage" id="oldImage" value="${ad[0].img}" class="hidden">

                    <label>Upload Nyt Billede</label>
                    
                    <input type="file" name="adImage" id="adImage" value="${ad[0].img}" width="150">
                    <img id="ad_preview" class="img-responsive hidden">
                </div>
                <button type="submit" class="admin_submit_btn">Opdater</button>
            </form>
        `;
        document.querySelector('#adImage').addEventListener('change', () => {
            var reader = new FileReader();
            document.querySelector('#ad_preview').classList.remove('hidden');
            let file = document.querySelector('#adImage').files[0];
            reader.addEventListener("load", function () {
                document.querySelector('#ad_preview').src = reader.result;
                localStorage.setItem("imgData", reader.result);
            })
            if (file) {
                reader.readAsDataURL(file);
            }
        })
        return ad;
    })
    .then(ad => {
        fetch('/category/getAll')
        .then(result => {
            return result.json();
        })
        .then(categories => {
            categories.forEach(category => {
                document.querySelector('#category_select').innerHTML += `
                    <option value="${category._id}">
                        ${category.editor_name}
                    </option>
                `;
            })
        })
        .catch(e => {
            console.log(e);
        })
    })
    .then(() => {
        window.location.href = window.location.href + '#edit_div';
    })
    .catch(e => {
        console.log(e);
    })
}

function delete_ad(id) {
    if(confirm('Er du sikker på du vil slette denne reklame? ADVARSEL: DETTE VIL LIGELEDES SLETTE DET TILHØRENDE BILLEDE PERAMNENT!!!!!!')) {
        fetch('/admin/ad/deleteSingle/' + id)
        .then(response => {
            localStorage.setItem('success_msg', 'Reklame slettet succesfuldt!');
            window.location.reload('http://localhost:3000/admin');
        })
        .catch(err => {
            console.log(err);
        })
    }
}

function edit_price(id) {
    fetch('/ad/getSinglePrice/' + id)
    .then(result => {
        return result.json()
    })
    .then(price => {
        //do something with article
        let div = document.querySelector('#edit_div');
        div.innerHTML = '';
        div.classList.remove('hidden');
        div.innerHTML += `
            <form class="update_ad_price_form" method="post" action="/admin/ad/updateSinglePrice/${id}" novalidate>
                <h2>Rediger Priser per Visning: </h2>
                <div class="form-group">
                    <label for="views">Visninger</label>
                    <input class="form-control" type="number" id="views" name="views" value="${price[0].views}" required>
                </div>
                <div class="form-group">
                    <label for="price">Pris per Visning</label>
                    <input class="form-control" type="number" id="price" name="price" value="${price[0].price_per_view}" required>
                </div>
                <button type="submit" class="admin_submit_btn">Opdater</button>
            </form>
        `;
    })
    .then(() => {
        window.location.href = window.location.href + '#edit_div';
    })
    .catch(e => {
        console.log(e);
    })
}

function delete_price (id) {
    if(confirm('Er du sikker på du vil slette det antal visninger/pris per visning par?')) {
        fetch('/admin/ad/deleteSinglePrice/' + id)
        .then(response => {
            localStorage.setItem('success_msg', 'Antal visninger/pris per visning par slettet succesfuldt!');
            window.location.reload('http://localhost:3000/admin');
        })
        .catch(err => {
            console.log(err);
        })
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// ADVERTISEMENT & SPONSOR STUFF /////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function edit_user(id) {
    fetch('/user/getSingle/' + id)
    .then(result => {
        return result.json()
    })
    .then(user => {
        console.log(user);
        let div = document.querySelector('#edit_div');
        div.innerHTML = '';
        div.classList.remove('hidden');
        div.innerHTML += `
            <form class="update_user_form" method="post" action="/admin/user/updateUser/${id}" enctype="multipart/form-data" novalidate>
                <h2>Rediger Bruger</h2>
                <div class="form-group">
                    <label for="name">Navn: </label>
                    <input class="form-control" type="text" id="name" name="name" value="${user[0].name}" required>
                </div>
                <div class="form-group">
                    <label for="name">Brugernavn: </label>
                    <input class="form-control" type="text" id="username" name="username" value="${user[0].username}" required>
                </div>
                <div class="form-group">
                    <label for="text">Profil tekst: </label>
                    <input class="form-control" type="text" id="text" name="text" value="${user[0].profile_text}" required>
                </div>
                <div class="form-group">
                    <label for="email">E-mail adresse: </label>
                    <input class="form-control" type="text" id="email" name="email" value="${user[0].email}" required>
                </div>
                <div class="form-group pick_cat_div">
                    <label for="category">Vælg kategori: </label>
                </div>
                <div class="form-group">
                    <label for="role">Vælg bruger rolle: </label>
                    <select class="form-control" id="role_select" name="role" value="${user[0].role._id}"></select>
                </div>
                <div class="form-group">
                    <label>Gammelt Billede: </label>
                    <img src="/img/editorial/${user[0].img}" title"/img/editorial/${user[0].img}" alt="/img/editorial/${user[0].img}" class="img-responsive">
                    <input type="text" name="oldImage" id="oldImage" value="${user[0].img}" class="hidden">

                    <label>Upload Nyt Billede</label>
                    
                    <input form-control type="file" name="userImage" id="userImage" value="${user[0].img}">
                    <img id="user_preview" class="img-responsive hidden" width="200">
                </div>
                <button type="submit" class="admin_submit_btn">Opdater</button>
            </form>
        `;
        document.querySelector('#userImage').addEventListener('change', () => {
            var reader = new FileReader();
            document.querySelector('#user_preview').classList.remove('hidden');
            let file = document.querySelector('#userImage').files[0];
            reader.addEventListener("load", function () {
                document.querySelector('#user_preview').src = reader.result;
                localStorage.setItem("imgData", reader.result);
            })
            if (file) {
                reader.readAsDataURL(file);
            }
        })
        return user;
    })
    .then(user => {
        fetch('/category/getAll')
        .then(result => {
            return result.json();
        })
        .then(categories => {
            categories.forEach(category => {
                document.querySelector('.pick_cat_div').innerHTML += `
                    <p>
                        <label>${category.editor_name}</label>
                        <input type="checkbox" value="${category._id}" name="category">
                    </p>
                `;
            })
        })
        .then(() => {
            if(user[0].category) {
                document.querySelector('.pick_cat_div').querySelectorAll('input[type=checkbox]').forEach(checkbox => {
                    user[0].category.forEach(category => {
                        if(category._id == checkbox.value) {
                            checkbox.checked = true;
                        }
                    })
                })
            }
        })
        .catch(e => {
            console.log(e);
        })
    })
    .then(() => {
        fetch('/roles/getAll')
        .then(result => {
            return result.json();
        })
        .then(roles => {
            roles.forEach(role => {
                document.querySelector('#role_select').innerHTML += `
                    <option value="${role._id}">
                        ${role.display_name}
                    </option>
                `;
            })
        })
        .catch(e => {
            console.log(e);
        })
    })
    .then(() => {
        window.location.href = window.location.href + '#edit_div';
    })
    .catch(e => {
        console.log(e);
    })
}

function delete_user(id) {
    if(confirm('Er du sikker på du vil slette denne bruger?? ADVARSEL: DETTE VIL PERMANENT SLETTE DET TILHØRENDE BILLEDE !!!!!!!!!')) {
        fetch('/admin/user/deleteUser/' + id)
        .then(response => {
            localStorage.setItem('success_msg', 'Bruger succesfuldt slettet!');
            window.location.reload('http://localhost:3000/admin');
        })
        .catch(err => {
            console.log(err);
        })
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////// COMMENT STUFF /////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function edit_comment(id) {
    fetch('/article/getSingleComment/' + id)
    .then(result =>  {
        return result.json()
    })
    .then(comment => {
        let div = document.querySelector('#edit_div');
        div.innerHTML = '';
        div.classList.remove('hidden');
        div.innerHTML += `
            <form class="edit_comment_form" method="post" action="/admin/article/updateComment/${id}" novalidate>
                <h2>Rediger Kommentar</h2>
                <div class="form-group">
                    <p>
                        <label>Afsender: - <strong>${comment[0].author}</strong></label>
                    <p>
                    </p>
                        <label>E-mail adresse: - <strong>${comment[0].email}</strong></label>
                    <p>
                    </p>
                        <label>Dato skrevet: - <strong>${comment[0].written}</strong></label>
                    </p>
                    </p>
                        <label for="comment">Kommentar: </label>
                        <input class="form-control" type="text" id="comment" name="comment" value="${comment[0].comment}" required>
                    </p>
                    <button type="submit" class="admin_submit_btn">Opdater</button>
                </div>
            </form>
        `;
    })
    .then(() => {
        window.location.href = window.location.href + '#edit_div';
    })
    .catch(e => {
        console.log(e)
    })
}

function delete_comment(id) {
    if(confirm('Er du sikker på du vil slette denne kommentar??')) {
        fetch('/admin/article/deleteComment/' + id)
        .then(response => {
            localStorage.setItem('success_msg', 'Kommentar succesfuldt slettet!');
            window.location.reload('http://localhost:3000/admin');
        })
        .catch(err => {
            console.log(err);
        })
    }
}