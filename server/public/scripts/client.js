$(() => { onReady(); });

function onReady() {
        $(document).on('click', '#task-btn', submitTask);
        $(document).on('click', '.delete-btn', deleteTask);
        $(document).on('click', '.complete-btn', completeTask);
        $(document).on('click', '.incomplete-btn', incompleteTask);
        $(document).on('click', '.sub-check', checkSubTask);
        $(document).on('keypress', 'input textarea', (key) => {
                if (key.which == 13) {
                        submitTask();
                }
        });
        getTasks();
}

function checkSubTask() {
        let data = $(this).data('id').split('-');
        slay.get(`/tasks/${data[0]}`)
        .then((response) => {
                //console.log(response);
                splitSubs = response[0].subtasks.split('|');
                splitSub = splitSubs[Number(data[1])].split(':');
                if (splitSub[1] == 'f') {
                        splitSub[1] = 't';
                } else {
                        splitSub[1] = 'f';
                }
                splitSubs[Number(data[1])] = splitSub.join(':');
                slay.put(`/tasks/subs/${data[0]}`, {subtasks: splitSubs.join('|')})
                .then((response) => {
                        getTasks();
                })
                .catch((err) => {
                        console.log(err);
                        $('body').prepend('Oops we made a fucky wucky...', err);
                });
        })
        .catch((err) => {
                console.log(err);
                $('body').prepend('Oops we made a fucky wucky...', err);
        });
}

function completeTask() {
        let id = $(this).parents('div').data('id');
        slay.put(`/tasks/${id}`, { timecomplete: new Date().toLocaleString() })
                .then((response) => {
                        getTasks();
                })
                .catch((err) => {
                        console.log(err);
                        $('body').prepend('Oops we made a fucky wucky...', err);
                });
}

function incompleteTask() {
        let id = $(this).parents('div').data('id');
        slay.put(`/tasks/${id}`, { timecomplete: null })
                .then((response) => {
                        getTasks();
                })
                .catch((err) => {
                        console.log(err);
                        $('body').prepend('Oops we made a fucky wucky...', err);
                });
}

function deleteTask() {
        let id = $(this).parents('div').data('id');
        slay.del(`/tasks/${id}`)
                .then((response) => {
                        getTasks();
                })
                .catch((err) => {
                        console.log(err);
                        $('body').prepend('Oops we made a fucky wucky...', err);
                });
}

function getTasks() {
        slay.get('/tasks')
                .then((response) => {
                        //console.log(response);
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
        let appendStr = '';
        let subtasks = undefined;
        if (task.subtasks != null) {
                subtasks = task.subtasks.split('|');
        }
        //console.log(task.subtasks);
        //console.log(subtasks);
        if (task.timecomplete) {
                let time = new Date(task.timecomplete).toLocaleString();
                appendStr += `
                <div class='task complete' data-id=${task.id}>
                <h3>
                  ${task.taskname}
                </h3>
                <p>
                  ${task.taskdesc}
                </p>`
                if (subtasks) {
                        for (let i = 0; i < subtasks.length; i++) {
                                let subtask = subtasks[i].split(':');
                                let checked = '';
                                if (subtask[1] == 't') {
                                        checked = 'checked';
                                }
                                appendStr += `
                                <p>
                                  <input class='sub-check' data-id=${task.id}-${i}-${subtask[1]} type="checkbox" ${checked}>${subtask[0]}
                                </p>`;
                        }
                }
                appendStr += `
                  <input class="incomplete-btn" type="button" value="🚫">
                  <input class="delete-btn" type="button" value="❌">`
                if (task.timecomplete) {
                        appendStr += `<p>Completed: ${time}</p>`
                }
                appendStr += `</div>`;
        } else {
                appendStr += `
                <div class='task' data-id=${task.id}>
                  <h3>
                    ${task.taskname}
                  </h3>
                  <p>
                    ${task.taskdesc}
                  </p>`
                if (subtasks) {
                        for (let i = 0; i < subtasks.length; i++) {
                                let subtask = subtasks[i].split(':');
                                let checked = '';
                                if (subtask[1] == 't') {
                                        checked = 'checked';
                                }
                                appendStr += `
                                <p>
                                  <input class='sub-check' data-id=${task.id}-${i}-${subtask[1]} type="checkbox" ${checked}>${subtask[0]}
                                </p>`;
                        }
                }
                appendStr += `
                  <input class="complete-btn" type="button" value="✅">
                  <input class="delete-btn" type="button" value="❌">`
                if (task.timecomplete) {
                        appendStr += `<p>Completed: ${task.timecomplete}</p>`
                }
                appendStr += `</div>`;
        }
        return appendStr;
}

function submitTask() {
        let name = $('#task-name').val();
        let desc = $('#task-desc').val();
        let subtasks = $('#subtask-area').val();
        let split = subtasks.split('|');
        for (let i = 0; i < split.length; i ++) {
                split[i] = split[i] + ':f';
        }
        subtasks = split.join('|');
        $('#task-name').val('');
        $('#task-desc').val('');
        $('#subtask-area').val('');
        let payload = { name, desc, subtasks };

        slay.post('/tasks', payload)
                .then((response) => {
                        //console.log(response);
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

