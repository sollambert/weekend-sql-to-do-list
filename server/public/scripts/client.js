$(() => {
        onReady();
});

function onReady() {
        $(document).on('click', '#task-btn', submitTask);
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

