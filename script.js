window.addEventListener("load", () => {
    document.getElementsByTagName("form")[0].addEventListener('submit', e => {
        e.preventDefault();
        fetch(e.target.action, {
            method: 'POST',
            body: new FormData(e.target),
        }).then(res => {
            if (res.ok)
                return res.json();
            return Promise.reject(response);
        }).then(data => {
            console.log(data);
        }).catch(error => {
            console.warn(error);
        });
    });
});