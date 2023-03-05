


function filterAjax(method, filtername){

    $.ajax({
        url: 'api/v.1/selectAllTasks?method=' + method,
        method: 'get',
        success: function(data){

            if (method != 'all' && data.length == 0){
                CallToastPanel('Задачи с данным фильтром отсутствуют');
                return;
            }

            let tasks_list = document.getElementById('tasks-list');
            tasks_list.innerHTML = ``;

            checkCountTasks(data.length);
            
            for (const task of data) {
                createTaskDiv(task);
            }

            let filter_choise = document.getElementById('filter_choise');
            filter_choise.textContent = filtername;
            document.cookie = "stateFilter="+ method +"; path=/;"
            closePanelTask();


        },
        error: function (jqXHR, exception) {
            return;
        }
    });
    
}

function getStateFilter(action = null, id_task = null){
    let stateFilterCookie = document.cookie.replace(/(?:(?:^|.*;\s*)stateFilter\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    let tasks_list = document.getElementById('tasks-list');
    let count_task = tasks_list.childElementCount / 2;
    console.log(stateFilterCookie);

    if (stateFilterCookie == 'favorite'){
        validation(count_task, id_task);
        return;
    }

    if (DEFAULT_FLAGS.includes(stateFilterCookie) && stateFilterCookie != action){
        validation(count_task, id_task);
        return;
    }

    
}

function validation(count_task, id_task){
    console.log(count_task);
    if (count_task > 1){
        let select_task = document.getElementById('task_' + id_task);

        select_task.classList.replace('animate__fadeInDown', 'animate__fadeOut');

        setTimeout(function(){ select_task.remove() }, 500);

        document.getElementById('offcanvasScrolling_' + id_task).remove();
        return;
    }

    filterAjax('all');
}

const DEFAULT_FLAGS = [
    'easy',
    'normal',
    'hard'
]