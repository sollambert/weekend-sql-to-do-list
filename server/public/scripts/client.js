$(() => { onReady(); });

function onReady() {
        $(document).on('click', '#task-btn', submitTask);
        $(document).on('keypress', 'input textarea', (key) => {
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
        let appendStr = '';
        let subtasks = undefined;
        if (task.subtasks != null) {
                subtasks = task.subtasks.split('|');
        }
        console.log(task.subtasks);
        console.log(subtasks);
        if (task.timecomplete) {
                let time =  new Date(task.timecomplete).toISOString().split('T');
                appendStr += `
                <div class='task complete'>
                <h3>
                  ${task.taskname}
                </h3>
                <p>
                  ${task.taskdesc}
                </p>`
                if (subtasks) {
                        for (let i = 0; i < subtasks.length; i++) {
                                appendStr += `
                        <p>
                          <input type="checkbox" value="${i}">${subtasks[i]}
                        </p>`;
                        }
                }
                appendStr += `
                  <input class="incomplete-btn" type="button" value="🚫">
                  <input class="delete-btn" type="button" value="❌">`
                if (task.timecomplete) {
                        appendStr += `<p>Completed: ${time[1].split('.')[0]} ${time[0]}</p>`
                }
                appendStr += `</div>`;
        } else {
                appendStr += `
                <div class='task'>
                  <h3>
                    ${task.taskname}
                  </h3>
                  <p>
                    ${task.taskdesc}
                  </p>`
                  if (subtasks) {
                          for (let i = 0; i < subtasks.length; i++) {
                                  appendStr += `
                          <p>
                            <input type="checkbox" value="${i}">${subtasks[i]}
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
        $('#task-name').val('');
        $('#task-desc').val('');
        $('#subtask-area').val('');
        let payload = { name, desc, subtasks };

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

