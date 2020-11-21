window.addEventListener("load", () => {
    const addRequest = data => {
        let list = document.getElementById('listOfRequests');
        const container = document.createElement("div");
        container.classList.add("card");
        container.classList.add("mb-3");
        container.innerHTML = `
            <div class="card-body d-flex justify-content-between flex-row">
                <div class="d-flex flex-column">
                    <h3>${data.topic_title}</h3>
                    <p class="text-muted mb-2">${data.topic_details}</p>
                    <p class="mb-0 text-muted">
                    <strong>Expected results:</strong> ${data.expected_result}
                    </p>
                </div>
                <div class="d-flex flex-column text-center">
                    <a class="btn btn-link">🔺</a>
                    <h3>0</h3>
                    <a class="btn btn-link">🔻</a>
                </div>
                </div>
                <div class="card-footer d-flex flex-row justify-content-between">
                <div>
                    <span class="text-info">${data.status.toUpperCase()}</span>
                    &bullet; added by <strong>${data.author_name}</strong> on
                    <strong>${data.submit_date.toString()}</strong>
                </div>
                <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
                    <div class="badge badge-success">
                    ${data.target_level[0].toUpperCase()}${data.target_level.slice(1).toLowerCase()}
                    </div>
                </div>
            </div>
        `;
        list.appendChild(container);
    }

    const viewRequests = data => {
        let list = document.getElementById('listOfRequests');
        list.innerHTML = "";
        data.forEach(request => {
            const container = document.createElement("div");
            container.classList.add("card");
            container.classList.add("mb-3");
            container.innerHTML = `
                <div class="card-body d-flex justify-content-between flex-row">
                    <div class="d-flex flex-column">
                        <h3>${request.topic_title}</h3>
                        <p class="text-muted mb-2">${request.topic_details}</p>
                        <p class="mb-0 text-muted">
                        <strong>Expected results:</strong> ${request.expected_result}
                        </p>
                    </div>
                    <div class="d-flex flex-column text-center">
                        <a class="btn btn-link">🔺</a>
                        <h3>0</h3>
                        <a class="btn btn-link">🔻</a>
                    </div>
                    </div>
                    <div class="card-footer d-flex flex-row justify-content-between">
                    <div>
                        <span class="text-info">${request.status.toUpperCase()}</span>
                        &bullet; added by <strong>${request.author_name}</strong> on
                        <strong>${new Date(request.submit_date).toString().split(' ').slice(0, 4).join(' ')}</strong>
                    </div>
                    <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
                        <div class="badge badge-success">
                        ${request.target_level[0].toUpperCase()}${request.target_level.slice(1).toLowerCase()}
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(container);
        });
    }

    fetch("http://localhost:7777/video-request")
        .then(res => {
            if (res.ok)
                return res.json();
            return Promise.reject(response);
        }).then(data => {
            viewRequests(data);
        }).catch(error => {
            console.warn(error);
        });

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
            addRequest(data);
            fetch("http://localhost:7777/video-request")
                .then(res => {
                    if (res.ok)
                        return res.json();
                    return Promise.reject(response);
                }).then(data => {
                    viewRequests(data);
                }).catch(error => {
                    console.warn(error);
                });
        }).catch(error => {
            console.warn(error);
        });
    });
});