$(() => {onReady();});

function onReady() {
        $(document).on('click', '#task-btn', submitTask);
        $(document).on('keypress', 'input', (key) => {
                if (key.which == 13) {
                        submitTask();
                }
        });
        getTasks();
}

function getTasks() {
        slay.get('/tasks')
        .then((response) => {
                console.log(response);
                let appendStr = ''
                for (let task of response) {
                        appendStr += getTaskAppendStr(task);
                }
                render('#task-div', appendStr);
        })
        .catch((err) => {
                console.log(err);
                $('body').prepend('Oops we made a fucky wucky...', err);
        });
}

function getTaskAppendStr(task) {
        let appendStr = ''
        let complete = task.complete;
        if (complete) {
                appendStr += `
                <span>
                <h3>
                  ${task.taskname}
                </h3>
                <p>
                  ${task.taskdesc}
                </p>
                <input class="incomplete-btn" type="button" value="🚫">
                <p>Completed: ${task.timecomplete}</p>
                <input class="delete-btn" type="button" value="❌">
                </span>`;
        } else {
                appendStr += `
                <span>
                <h3>
                  ${task.taskname}
                </h3>
                <p>
                  ${task.taskdesc}
                </p>
                <input class="complete-btn" type="button" value="✅">
                <input class="delete-btn" type="button" value="❌">
                </span>`;
        }
        return appendStr;
}

function submitTask() {
        let name = $('#task-name').val();
        let desc = $('#task-desc').val();
        $('#task-name').val('');
        $('#task-desc').val('');

        let payload = { name, desc };

        slay.post('/tasks', payload)
        .then((response) => {
                console.log(response);
                getTasks();
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

