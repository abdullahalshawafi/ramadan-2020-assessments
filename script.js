let sortOption = "sort_by_new";
const sort_by_top = document.getElementById('sort_by_top');
const sort_by_new = document.getElementById('sort_by_new');
const search_box = document.getElementById('search_box');

const isFormValid = formData => {
    const name = formData.get('author_name');
    const email = formData.get('author_email');
    const title = formData.get('topic_title');
    const details = formData.get('topic_details');
    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

    if (!name)
        document.getElementsByName('author_name')[0].classList.add('is-invalid');

    if (!email || !emailRegex.test(email))
        document.getElementsByName('author_email')[0].classList.add('is-invalid');

    if (!title || title.length > 100)
        document.getElementsByName('topic_title')[0].classList.add('is-invalid');

    if (!details)
        document.getElementsByName('topic_details')[0].classList.add('is-invalid');

    const invalidElements = document.querySelectorAll('#videoReqForm .is-invalid');
    if (invalidElements.length) {
        invalidElements.forEach(elm =>
            elm.addEventListener('input', () => elm.classList.remove('is-invalid'))
        );
        return false;
    }

    return true;
}

const videoRequestBody = data =>
    `
        <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
                <h3>${data.topic_title}</h3>
                <p class="text-muted mb-2">${data.topic_details}</p>
                ${data.expected_result && `<p class="mb-0 text-muted"><strong>Expected results:</strong> ${data.expected_result}</p>`}
            </div>
            <div class="d-flex flex-column text-center">
                <a class="btn btn-link" onclick="vote('ups', '${data._id}')">🔺</a>
                <h3>${data.votes.ups - data.votes.downs}</h3>
                <a class="btn btn-link" onclick="vote('downs', '${data._id}')">🔻</a>
            </div>
            </div>
            <div class="card-footer d-flex flex-row justify-content-between">
            <div>
                <span class="text-info">${data.status.toUpperCase()}</span>
                &bullet; added by <strong>${data.author_name}</strong> on
                <strong>${new Date(data.submit_date).toString().split(' ').slice(0, 4).join(' ')}</strong>
            </div>
            <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
                <div class="badge badge-success">
                ${data.target_level[0].toUpperCase()}${data.target_level.slice(1).toLowerCase()}
                </div>
            </div>
        </div>
    `;

const createVideosRequests = data => {
    const container = document.createElement("div");
    container.classList.add("card");
    container.classList.add("mb-3");
    container.innerHTML = videoRequestBody(data);
    return container;
}

const fetchVideoRequest = (sort = "sort_by_new", search = "") => {
    fetch(`http://localhost:7777/video-request/?sortBy=${sort}&search=${search}`)
        .then(res => {
            if (res.ok)
                return res.json();
            return Promise.reject(response);
        }).then(data => {
            document.getElementById('listOfRequests').innerHTML = "";
            data.forEach(request =>
                document.getElementById('listOfRequests').appendChild(createVideosRequests(request)));
        }).catch(error => {
            console.warn(error);
        });
}

const fetchPostVideoRequest = () => {
    document.getElementById("videoReqForm").addEventListener('submit', e => {
        e.preventDefault();
        const inputData = new FormData(e.target);
        if (!isFormValid(inputData)) return;
        fetch("http://localhost:7777/video-request", {
            method: 'POST',
            body: inputData,
        }).then(res => {
            if (res.ok)
                return res.json();
            return Promise.reject(response);
        }).then(data => {
            if (sortOption === "sort_by_top" || search_box.value)
                fetchVideoRequest(sortOption, search_box.value);
            else
                document.getElementById('listOfRequests').prepend(createVideosRequests(data));
            document.getElementById("videoReqForm").reset();
        }).catch(error => {
            console.warn(error);
        });
    });
}

const vote = (vote_type, id) => {
    fetch("http://localhost:7777/video-request/vote", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, vote_type }),
    }).then(res => {
        if (res.ok)
            return res.json();
        return Promise.reject(response);
    }).then(() => {
        fetchVideoRequest(sortOption, search_box.value);
    }).catch(error => {
        console.warn(error);
    });
}

const debounce = (fn, time) => {
    let timeout;
    return (...arguments) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, arguments), time);
    }
}

window.addEventListener("load", () => {
    sort_by_top.addEventListener('click', () => {
        sort_by_top.classList.add('active');
        sort_by_new.classList.remove('active');
        sortOption = "sort_by_top";
        fetchVideoRequest(sortOption, search_box.value);
    });
    sort_by_new.addEventListener('click', () => {
        sort_by_new.classList.add('active');
        sort_by_top.classList.remove('active');
        sortOption = "sort_by_new";
        fetchVideoRequest(sortOption, search_box.value);
    });
    search_box.addEventListener('input', debounce(e => {
        console.log(search_box.value);
        console.log(e.key);
        fetchVideoRequest(sortOption, search_box.value);
    }, 300));

    fetchVideoRequest();
    fetchPostVideoRequest();

});