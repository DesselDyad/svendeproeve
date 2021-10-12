
if (document.querySelector('.admin_sorting_category_select')) {
    document.querySelector('.admin_sorting_category_select').addEventListener('change', (event => {
        event.preventDefault();
        fetch('http://localhost:3000/article/getSingleCategory/' + document.querySelector('.admin_sorting_category_select').value)
            .then(result => { return result.json() })
            .then(articles => {
                document.querySelector('.admin_articles_tbl').getElementsByTagName('tbody')[0].innerHTML = '';
                articles.forEach(article => {
                    document.querySelector('.admin_articles_tbl').getElementsByTagName('tbody')[0].innerHTML += `
                    <tr>
                        <td>
                            <button type="button" class="admin_edit_btn" id=${article._id} onclick="edit_article(this.id)">
                                <span class="glyphicon glyphicon-wrench">
                                </span>
                            </button>
                            <button type="button" class="admin_delete_btn" id=${article._id} onclick="delete_article(this.id)">
                                <span class="glyphicon glyphicon-remove">
                                </span>
                            </button>
                        </td>
                        <td>
                            <a href="/${article.category.query_name}/getSingle/${article._id}" title="/${article.category.query_name}/getSingle/${article._id}">
                                ${article.title}
                            </a>
                        </td>
                        <td>
                            ${article.author.name}
                        </td>
                        <td>
                            ${article.category.editor_name}
                        </td>
                        <td>
                            ${article.written}
                        </td>
                        <td>
                            ${article.comments.length}
                        </td>
                        <td>
                            ${article.viewCount}
                        </td>
                    </tr>
                `;
                })
            })
            .catch(e => {
                console.log(e);
            })
    }))
}
if (document.querySelector('.admin_sorting_editor_select')) {
    document.querySelector('.admin_sorting_editor_select').addEventListener('change', (event => {
        event.preventDefault();
        fetch('http://localhost:3000/article/getSingleAuthor/' + document.querySelector('.admin_sorting_editor_select').value)
            .then(result => { return result.json() })
            .then(articles => {
                document.querySelector('.admin_articles_tbl').getElementsByTagName('tbody')[0].innerHTML = '';
                articles.forEach(article => {
                    document.querySelector('.admin_articles_tbl').getElementsByTagName('tbody')[0].innerHTML += `
                    <tr>
                        <td>
                            <button type="button" class="admin_edit_btn" id=${article._id} onclick="edit_article(this.id)">
                                <span class="glyphicon glyphicon-wrench">
                                </span>
                            </button>
                            <button type="button" class="admin_delete_btn" id=${article._id} onclick="delete_article(this.id)">
                                <span class="glyphicon glyphicon-remove">
                                </span>
                            </button>
                        </td>
                        <td>
                            <a href="/${article.category.query_name}/getSingle/${article._id}" title="/${article.category.query_name}/getSingle/${article._id}">
                                ${article.title}
                            </a>
                        </td>
                        <td>
                            ${article.author.name}
                        </td>
                        <td>
                            ${article.category.editor_name}
                        </td>
                        <td>
                            ${article.written}
                        </td>
                        <td>
                            ${article.comments.length}
                        </td>
                        <td>
                            ${article.viewCount}
                        </td>
                    </tr>
                `;
                })
            })
            .catch(e => {
                console.log(e);
            })
    }))
}

if (document.querySelector('.admin_comment_sort_select')) {
    console.log('do you get called')
    document.querySelector('.admin_comment_sort_select').addEventListener('change', (event => {
        event.preventDefault();
        fetch('http://localhost:3000/article/getSingle/' + document.querySelector('.admin_comment_sort_select').value)
            .then(result => { return result.json() })
            .then(article => {
                document.querySelector('.admin_comments_tbl').getElementsByTagName('tbody')[0].innerHTML = '';
                article[0].comments.forEach(comment => {
                    document.querySelector('.admin_comments_tbl').getElementsByTagName('tbody')[0].innerHTML += `
                    <tr>
                        <td>
                            <button type="button" class="admin_edit_btn" id=${comment._id} onclick="edit_comment(this.id)">
                                <span class="glyphicon glyphicon-wrench">
                                </span>
                            </button>
                            <button type="button" class="admin_delete_btn" id=${comment._id} onclick="delete_comment(this.id)">
                                <span class="glyphicon glyphicon-remove">
                                </span>
                            </button>
                        </td>
                        <td>
                            ${comment.comment}
                        </td>
                        <td>
                            ${comment.author.author}
                        </td>
                        <td>
                            ${comment.email}
                        </td>
                        <td>
                            ${comment.written}
                        </td>
                        <td>
                            ${article[0].author.name + ' ' + article[0].title}
                        </td>
                    </tr>
                `;
                })
            })
            .catch(e => {
                console.log(e);
            })
    }))
}