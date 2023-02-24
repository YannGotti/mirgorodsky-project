function createTaskDiv(task){
    let fields = task.fields;
    let tasks_list = document.getElementById('tasks-list');

    let date_finish = new Date(fields.date_finish);
    let date_create = new Date(fields.date_create);


    tasks_list.innerHTML += 
            `
                <div class="p-3 m-3 task-background animate__animated animate__fadeInDown point-task col-11 col-lg-11 col-md-7" id="task_` + task.pk + `"  onclick="openPanelTask(` + task.pk + `)">

                    <div class="row d-flex justify-content-between">
                        <div class="col-8 col-lg-11">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"  onclick="readyTask(` + task.pk + `)">
                                <label class="form-check-label text-task mx-4" for="flexCheckDefault">
                                    <a  type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling_` + task.pk + `" aria-controls="offcanvasScrolling_` + task.pk + `">` + fields.title + `</a>
                                </label>
                              </div>
                        </div>

                        <div class="col-1 col-lg-1" id='setFavorite_` + task.pk + `'>

                        </div>

                    </div>          

                </div>


                <div class="offcanvas offcanvas-end  p-4" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling_` + task.pk + `" aria-labelledby="offcanvasScrollingLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasScrollingLabel">` + fields.title + `</h5>
                    </div>
                    <div class="offcanvas-body">


                            <div class="content-panel">
                                <p>` + fields.title + `</p>
                            </div>

                            <div class="row d-flex justify-content-center">
                                <div class="col-12">
                                    <h4 class="text-dop mt-3 text-center">Завершение ` + dateParse(date_finish) + `</h4>
                                </div>
                            </div>

                            <div class="row d-flex justify-content-between footer-panel">
                                <hr></hr>
                                <div class="col-2 mt-1">
                                    <button type="button" class="btn btn-outline-light text-dark text-navbar-elements" aria-label="Скрыть подробное представление">
                                        <img data-bs-dismiss="offcanvas" aria-label="Close"  src="static/image/main/closePanel.png"
                                        width="20px" height="20px"  onclick="closePanelTask(` + task.pk + `)" style="cursor: pointer;">
                                    </button>
                                </div>

                                <div class="col-8">
                                    <h4 class="text-dop mt-3 text-center">Создано ` + dateParse(date_create) + `</h4>
                                </div>

                                <div class="col-2 mt-1">
                                    <button type="button" class="btn btn-outline-light text-dark text-navbar-elements">
                                        <img src="static/image/main/delTask.png" width="20px" height="20px" style="cursor: pointer;">
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                </div>
            `

        let favotite = document.getElementById('setFavorite_' + task.pk);

        if (task.fields.favorite){
            favotite.innerHTML += `<img width="25px" id="task_favorite_` + task.pk + `" onclick="setFavorite(` + task.pk + `)" src="/static/image/main/active_star.png" alt="">`
        }
        else{
            favotite.innerHTML += `<img width="25px" id="task_favorite_` + task.pk + `" onclick="setFavorite(` + task.pk + `)" src="/static/image/main/disabled_star.png/" alt="">`
        }

}


function InitMainPage(){
    $.ajax({
        url: 'api/v.1/selectAllTasks/',
        method: 'get',
        success: function(data){
            
            data.sort((a, b) => a.fields.favorite < b.fields.favorite ? 1 : -1);
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
    let form = document.forms.task_form;

    let datePicker = document.getElementById('datePicker');

    if (form.title.value == ''){
        return;
    }

    $.ajax({
        url: 'api/v.1/create_task?title=' + form.title.value + '&date_finish=' + datePicker.value,
        method: 'get',
        success: function(request){
            let task = request[0];
            createTaskDiv(task);

            form.elements.title.value = '';


            checkCountTasks();

        },
        error: function (jqXHR, exception) {
            console.log(exception)
            return;
        }
    });
}


function readyTask(task){
    $.ajax({
        url: '/api/v.1/ready_task?id=' + task,
        method: 'get',
        success: function(data){
            let select_task = document.getElementById('task_' + task);

            select_task.classList.remove('animate__fadeInDown');
            select_task.classList.add('animate__fadeOut');

            setTimeout(function(){ select_task.remove() }, 500);
            setTimeout(function(){ checkCountTasks(data.count) }, 1000);
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
    

}

function setFavorite(task, favotite){
    $.ajax({
        url: '/api/v.1/setfavorite?favorite=' + favotite+ '&task=' + task,
        method: 'get',
        success: function(data){
            let task_favorite = document.getElementById('task_favorite_' + task);


            if (Boolean(parseInt(data))){
                task_favorite.setAttribute('src', '/static/image/main/active_star.png');
            }

            else{
                task_favorite.setAttribute('src', '/static/image/main/disabled_star.png');
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

    dropdown.classList.remove('mx-0')
    dropdown.classList.add('mx-5')

    for (let point_task of point_tasks) {
        if (task_panel.className == 'offcanvas offcanvas-end p-4 showing'){
            point_task.classList.remove('col-11', 'col-lg-11', 'col-md-7');
            point_task.classList.add('col-lg-10', 'col-11', 'col-md-7');
        }
        

        else{
            closePanelTask(task);
        }
    }
}

function closePanelTask(task){
    let point_tasks = document.getElementsByClassName('point-task');
    let dropdown = document.getElementById('button-dropdown');

    dropdown.classList.remove('mx-5')
    dropdown.classList.add('mx-0')


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
    return date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear() + ' года'
}