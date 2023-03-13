function checkCountTasks(task_count){

    let hide_tasks = document.getElementById('hide_tasks');
    let show_tasks = document.getElementById('show_tasks');

    if (task_count == 0){
        hide_tasks.style.setProperty("display", "block", "important");
        show_tasks.style.setProperty("display", "none", "important");
    }
    else{
        show_tasks.style.setProperty("display", "block", "important");
        hide_tasks.style.setProperty("display", "none", "important");
    }
}


function InitMainPage(){
    $.ajax({
        url: 'api/v.1/selectAllTasks/all/',
        method: 'get',
        success: function(data){
           
            document.cookie = "stateFilter=all; path=/;"
            checkCountTasks(data.length);
            
            for (const task of data) {
                createTaskDiv(task);
            }

        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}

InitMainPage();

function addTask(){
    let csrftoken = getCookie('csrftoken');

    let form = document.forms.task_form;

    let datePicker = document.getElementById('datePicker');

    if (form.title.value == ''){
        return;
    }

    $.ajax({
        url: 'api/v.1/task/?title=' + form.title.value + '&date_finish=' + datePicker.value,
        method: 'post',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(request){
            let task = request[0];
            createTaskDiv(task);
            createOnePickerPanel(task);
            form.elements.title.value = '';

            checkCountTasks();
            closePanelTask();

            filterAjax('all', 'Все');
        },
        error: function (jqXHR, exception) {
            console.log(exception)
            return;
        }
    });
}


function readyTask(task){
    let csrftoken = getCookie('csrftoken');

    $.ajax({
        url: '/api/v.1/task/?id=' + task,
        method: 'put',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data){
            let select_task = document.getElementById('task_' + task);

            

            select_task.classList.remove('animate__fadeInDown');
            select_task.classList.add('animate__fadeOut');

            setTimeout(function(){ select_task.remove() }, 500);
            setTimeout(function(){ checkCountTasks(data.count) }, 1000);
            setTimeout(function(){ closePanelTask(task) }, 500);


            getTaskCustomFlags(task);
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
    

}

function setFavorite(task){
    let csrftoken = getCookie('csrftoken');

    $.ajax({
        url: '/api/v.1/updateFavoriteTask/?task=' + task,
        method: 'put',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data){
            let task_favorite = document.getElementById('task_favorite_' + task);

            if (Boolean(parseInt(data))){
                task_favorite.setAttribute('src', '/static/image/main/active_star.png');
            }

            else{
                task_favorite.setAttribute('src', '/static/image/main/disabled_star.png');
                getStateFilter(null, task);
            }
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}



function openPanelTask(task){

    let task_panel = document.getElementById('offcanvasScrolling_' + task);
    let point_tasks = document.getElementsByClassName('point-task');

    let dropdown = document.getElementById('button-dropdown');

    dropdown.classList.remove('mx-0');
    dropdown.classList.add('mx-5');

    for (let point_task of point_tasks) {
        if (task_panel.classList.contains('showing')){
            point_task.classList.remove('col-11', 'col-lg-11', 'col-md-7');
            point_task.classList.add('col-lg-10', 'col-11', 'col-md-7');
        }
        

        else{
            closePanelTask();
        }
    }
}

function closePanelTask(id_task){

    if (id_task){
        let offcanvas = document.getElementById('offcanvasScrolling_' + id_task)
        offcanvas.classList.replace('show', 'hide');
    }
    else{
        let all_offcanvas = document.getElementsByClassName('all_offcanvas');

        for (let offcanvas of all_offcanvas) {
            offcanvas.classList.replace('show', 'hide');
        }
    }

    

    let point_tasks = document.getElementsByClassName('point-task');
    let dropdown = document.getElementById('button-dropdown');

    dropdown.classList.remove('mx-5');
    dropdown.classList.add('mx-0');


    for (let point_task of point_tasks) {
        point_task.classList.remove('col-lg-10', 'col-11', 'col-md-7');
        point_task.classList.add('col-11', 'col-lg-11', 'col-md-7');
    }
}

MONTHS = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря'
]

function dateParse(date) {
    return date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear() + ' года';
}