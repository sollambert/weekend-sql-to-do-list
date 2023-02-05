$(() => { onReady(); });

let sortOrder = 'id';
let sortDirection = 'ASC';

/**
 * onReady function that is called when jQuery is initialized and the DOM has fully loaded.
 */
function onReady() {
        $(document).on('click', '#task-btn', submitTask);
        $(document).on('click', '.delete-btn', deleteTask);
        $(document).on('click', '.complete-btn', completeTask);
        $(document).on('click', '.incomplete-btn', incompleteTask);
        $(document).on('click', '.sub-check', checkSubTask);
        $(document).on('click', '#sort-id', sortId);
        $(document).on('click', '#sort-name', sortName);
        $(document).on('click', '#sort-completed', sortCompleted);
        $(document).on('keypress', 'input,textarea', (key) => {
                if (key.which == 13) {
                        submitTask();
                }
        });
        getTasks();
}

/**
 * Changes sort state to be sorting by id. If the sort method is already using the id column, switches ascending or descending order.
 */
function sortId() {
        if (sortOrder == 'id') {
                if (sortDirection == 'ASC') {
                        sortDirection = 'DESC';
                } else {
                        sortDirection = 'ASC';
                }
        }
        sortOrder = 'id';
        getTasks();
}

/**
 * Changes sort state to be sorting by taskname. If the sort method is already using the taskname column, switches ascending or descending order.
 */
function sortName() {
        if (sortOrder == 'taskname') {
                if (sortDirection == 'ASC') {
                        sortDirection = 'DESC';
                } else {
                        sortDirection = 'ASC';
                }
        }
        sortOrder = 'taskname';
        getTasks();
}

/**
 * Changes sort state to be sorting by timecomplete. If the sort method is already using the timecomplete column, switches ascending or descending order.
 */
function sortCompleted() {
        if (sortOrder == 'timecomplete') {
                if (sortDirection == 'ASC') {
                        sortDirection = 'DESC';
                } else {
                        sortDirection = 'ASC';
                }
        }
        sortOrder = 'timecomplete';
        getTasks();
}

/**
 * Saves the state of a checkbox for an individual subtask to be referenced later.
 */
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
                        slay.put(`/tasks/subs/${data[0]}`, { subtasks: splitSubs.join('|') })
                                .then((response) => {
                                        getTasks();
                                })
                                .catch((err) => {
                                        console.log(err);
                                        $('body').prepend('Uh oh, we\'ve encountered an error...', err);
                                });
                })
                .catch((err) => {
                        console.log(err);
                        $('body').prepend('Uh oh, we\'ve encountered an error...', err);
                });
}

/**
 * Switches a completed task to a state where it is complete and stores a timestamp
 */
function completeTask() {
        let id = $(this).parents('div').data('id');
        slay.put(`/tasks/${id}`, { timecomplete: new Date().toLocaleString() })
                .then((response) => {
                        getTasks();
                })
                .catch((err) => {
                        console.log(err);
                        $('body').prepend('Uh oh, we\'ve encountered an error...', err);
                });
}

/**
 * Switches a previously completed task to a state where it is incomplete
 */
function incompleteTask() {
        let id = $(this).parents('div').data('id');
        slay.put(`/tasks/${id}`, { timecomplete: null })
                .then((response) => {
                        getTasks();
                })
                .catch((err) => {
                        console.log(err);
                        $('body').prepend('Uh oh, we\'ve encountered an error...', err);
                });
}

/**
 * Deletes a task based on data-id stored in the parent div of clicked element
 */
function deleteTask() {
        let id = $(this).parents('div').data('id');
        Swal.mixin().fire({
                icon: 'warning',
                title: "Delete?",
                text: "Are you sure you want to delete this task?",
                showConfirmButton: true,
                showCancelButton: true
        })
                .then((value) => {
                        if (value.isConfirmed) {
                                slay.del(`/tasks/${id}`)
                                        .then((response) => {
                                                getTasks();
                                        })
                                        .catch((err) => {
                                                console.log(err);
                                                $('body').prepend('Uh oh, we\'ve encountered an error...', err);
                                        });
                        }
                })
}

/**
 * Runs the getTasksByOrder function by passing the sortOrder and sortDirection global variables
 */
function getTasks() {
        getTasksByOrder(sortOrder, sortDirection);
}

/**
 * Get tasks from SQL server based on a specific order as specified by function parameters.
 * @param {*} order the column name to order by
 * @param {*} asc ascending or descending order, either 'ASC' or 'DESC'
 */
function getTasksByOrder(order, asc) {
        slay.get(`/tasks/?order=${order}&direction=${asc}`)
                .then((response) => {
                        console.log(response);
                        let appendStr = ''
                        for (let task of response) {
                                appendStr += getTaskAppendStr(task);
                        }
                        render('#sort-info', `${sortOrder}, ${sortDirection}`);
                        render('#task-div', appendStr);
                })
                .catch((err) => {
                        console.log(err);
                        $('body').prepend('Uh oh, we\'ve encountered an error...', err);
                });
}

/**
 * Function to create the string that is used by the render function to append elements to the DOM
 * @param {*} task 
 * @returns a string containing necessary HTML for appending.
 */
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

/**
 * Function for submitting a new task by taking data from the input fields on the DOM.
 * Validates input and presents a popup if required information is not given.
 */
function submitTask() {
        let name = $('#task-name').val();
        let desc = $('#task-desc').val();
        if (name == '' || desc == '') {
                Swal.mixin().fire({
                        icon: 'warning',
                        title: "Empty Input",
                        text: "Can't submit without a name or description!",
                        showConfirmButton: true
                })
        } else {
                let subtasks = $('#subtask-area').val();
                if (subtasks == '') {
                        subtasks = undefined;
                } else {
                        let split = subtasks.split('|');
                        for (let i = 0; i < split.length; i++) {
                                split[i] = split[i] + ':f';
                        }
                        subtasks = split.join('|');
                        console.log(subtasks)
                }
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
                                $('body').prepend("Uh oh, we\'ve encountered an error...", err);
                        });
        }
}

/**
 * Render function
 * @param {*} id id of the element to append to
 * @param {*} string render string containing html markdown text that needs to be appended
 * @param {*} className an optional classname to add to specified element that is being appended to
 * @param {*} remove a boolean that will instead *remove* provided class name from element that is being appended to
 */
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

