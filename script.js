const videoRequestBody = data =>
    `
        <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
                <h3>${data.topic_title}</h3>
                <p class="text-muted mb-2">${data.topic_details}</p>
                <p class="mb-0 text-muted">
                <strong>Expected results:</strong> ${data.expected_result}
                </p>
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

const postVideoRequest = data => {
    let list = document.getElementById('listOfRequests');
    const container = document.createElement("div");
    container.classList.add("card");
    container.classList.add("mb-3");
    container.innerHTML = videoRequestBody(data);
    list.insertBefore(container, list.firstChild);
}

const getVideoRequests = data => {
    let list = document.getElementById('listOfRequests');
    list.innerHTML = "";
    data.forEach(request => {
        const container = document.createElement("div");
        container.classList.add("card");
        container.classList.add("mb-3");
        container.innerHTML = videoRequestBody(request);
        list.appendChild(container);
    });
}

const fetchVideoRequest = () => {
    fetch("http://localhost:7777/video-request")
        .then(res => {
            if (res.ok)
                return res.json();
            return Promise.reject(response);
        }).then(data => {
            getVideoRequests(data);
        }).catch(error => {
            console.warn(error);
        });
}

const vote = (vote_type, id) => {
    const votes = new FormData();
    votes.append('id', id);
    votes.append('vote_type', vote_type);
    fetch("http://localhost:7777/video-request/vote", {
        method: 'PUT',
        body: votes,
    }).then(res => {
        if (res.ok)
            return res.json();
        return Promise.reject(response);
    }).then(() => {
        fetchVideoRequest();
    }).catch(error => {
        console.warn(error);
    });
}

window.addEventListener("load", () => {
    fetchVideoRequest();

    document.getElementById("videoReqForm").addEventListener('submit', e => {
        e.preventDefault();
        fetch("http://localhost:7777/video-request", {
            method: 'POST',
            body: new FormData(e.target),
        }).then(res => {
            if (res.ok)
                return res.json();
            return Promise.reject(response);
        }).then(data => {
            postVideoRequest(data);
        }).catch(error => {
            console.warn(error);
        });
    });
});