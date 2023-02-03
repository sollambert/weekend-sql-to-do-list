$(() => {
        onReady();
});

function onReady() {
        $(document).on('click', '#task-btn', submitTask);
        getTasks();
}

function getTasks() {
        slay.get('/tasks')
        .then((response) => {
                console.log(response);
                let appendStr = ''
                for (let task of response) {
                        appendStr +=`
                        <h3>
                          ${task.taskname}
                        </h3>
                        <p>
                          ${task.taskdesc}
                        </p>`;
                }
                render('#task-div', appendStr);
        })
        .catch((err) => {
                console.log(err);
                $('body').prepend('Oops we made a fucky wucky...', err);
        });
}

function submitTask() {
        let name = $('#task-name').val();
        let desc = $('#task-desc').val();

        let payload = {name, desc};

        slay.post('/tasks', payload)
        .then((response) => {
                console.log(response);
        })
        .catch((err) => {
                console.log(err);
                $('body').prepend("Oops we made a fucky wucky...", err);
        });
}

function render(id, string, className, remove) {
        $(id).empty();
        $(id).append(string);
        if (className) {
                if (remove) {
                        $(id).removeClass(className);
                } else {
                        $(id).addClass(className);
                }
        }
}

