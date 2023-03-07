
function getAllCustomFlags(){
    $.ajax({
        url: 'api/v.1/selectAllTasks/customFlags/',
        method: 'get',
        success: function(data){
            for (const filter of data) {
                createFilterChoise(filter);
                CUSTOM_FLAGS.push(filter.flagName);
            }
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}

function getTaskCustomFlags(id_task){
    $.ajax({
        url: 'api/v.1/selectAllTasks/taskCustomFlags?id_task=' + id_task,
        method: 'get',
        success: function(data){
            for (const filter of data) {
                delCustomFlagsDivIfDelTask(filter);
            }
        },
        error: function (jqXHR, exception) {
            return [];
        }
    });
}

getAllCustomFlags();

function delCustomFlagsDivIfDelTask(data){
    if (data.count == 0) {
        deleteCustomFlagsDiv(data.flagName);
    }
}

function getCountCustomFlagsDiv(name){
    let custom_filters = document.getElementById('filter-list').children;
    for (const filter of custom_filters) {
        if (filter.children[0].textContent == name){
            return true;
        }
    }
}

function deleteCustomFlagsDiv(name){
    let custom_filters = document.getElementById('filter-list').children;
    for (const filter of custom_filters) {
        if (filter.children[0].textContent == name){
            filter.remove();
            return;
        }
    }
}


function filterAjax(method, filtername){

    let new_url = 'api/v.1/selectAllTasks/' + method+'/';

    if (CUSTOM_FLAGS.includes(method)){
        new_url = 'api/v.1/selectAllTasks/customFlagTasks/?flagName=' + method;
    }

    $.ajax({

        url: new_url,
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

    if (stateFilterCookie == 'favorite'){
        validation(count_task, id_task);
        return;
    }

    if (DEFAULT_FLAGS.includes(stateFilterCookie) && stateFilterCookie != action){
        validation(count_task, id_task);
        return;
    }
    if (CUSTOM_FLAGS.includes(stateFilterCookie) && stateFilterCookie == action){
        validation(count_task, id_task);
        return;
    }

    
}

function validation(count_task, id_task){
    if (count_task > 1){
        let select_task = document.getElementById('task_' + id_task);

        select_task.classList.replace('animate__fadeInDown', 'animate__fadeOut');

        setTimeout(function(){ select_task.remove() }, 500);

        document.getElementById('offcanvasScrolling_' + id_task).remove();
        return;
    }

    filterAjax('all', 'Все');
}

const DEFAULT_FLAGS = [
    'easy',
    'normal',
    'hard'
]

let CUSTOM_FLAGS = []
