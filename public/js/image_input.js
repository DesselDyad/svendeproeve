if(document.querySelector('#userImage')) {
    document.querySelector('#userImage').addEventListener('change', () => {
        document.querySelector('#preview').classList.toggle('hidden');
        var reader = new FileReader();
        let file = document.querySelector('#userImage').files[0];
        reader.addEventListener("load", function () {
            document.querySelector('#preview').src = reader.result;
            localStorage.setItem("imgData", reader.result);
        })
        if (file) {
            reader.readAsDataURL(file);
        }
    });
}

if(document.querySelector('#adImage')) {
    document.querySelector('#adImage').addEventListener('change', () => {
        document.querySelector('#ad_preview').classList.toggle('hidden');
        var reader = new FileReader();
        let file = document.querySelector('#adImage').files[0];
        reader.addEventListener("load", function () {
            document.querySelector('#ad_preview').src = reader.result;
            localStorage.setItem("imgData", reader.result);
        })
        if (file) {
            reader.readAsDataURL(file);
        }
    });
}