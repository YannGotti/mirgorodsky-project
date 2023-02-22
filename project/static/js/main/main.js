
function addTask(){
    let form = document.forms.task_form;

    let datePicker = document.getElementById('datePicker');

    if (form.title.value == ''){
        return;
    }

    $.ajax({
        url: '/ajax/create_task?title=' + form.title.value + '&date_finish=' + datePicker.value,
        method: 'get',
        success: function(data){
            let task = data;

            let tasks_list = document.getElementById('tasks-list');

            tasks_list.innerHTML += 
            `
                <div class="p-3 m-3 task-background animate__animated animate__fadeInDown point-task col-11 col-lg-11 col-md-7" id="task_` + task.id + `"  onclick="openPanelTask(` + task.id + `)">

                    <div class="row d-flex justify-content-between">
                        <div class="col-8 col-lg-11">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"  onclick="readyTask(` + task.id + `)">
                                <label class="form-check-label text-task mx-4" for="flexCheckDefault">
                                    <a  type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling_` + task.id + `" aria-controls="offcanvasScrolling_` + task.id + `">` + task.title + `</a>
                                </label>
                              </div>
                        </div>

                        <div class="col-1 col-lg-1" id='setFavorite_` + task.id + `'>

                        </div>

                    </div>          

                </div>


                <div class="offcanvas offcanvas-end  p-4" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling_` + task.id + `" aria-labelledby="offcanvasScrollingLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasScrollingLabel">` + task.title + ` : ` + task.id + `</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onclick="closePanelTask(` + task.id + `)"></button>
                    </div>
                    <div class="offcanvas-body">
                        <p>` + task.title + `</p>
                    </div>
                </div>
            `

            let favotite = document.getElementById('setFavorite_' + task.id);

            if (task.favorite){
                favotite.innerHTML += `<img width="25px" id="task_favorite_` + task.id + `" onclick="setFavorite(` + task.id + `)" src="/static/image/main/active_star.png" alt="">`
            }
            else{
                favotite.innerHTML += `<img width="25px" id="task_favorite_` + task.id + `" onclick="setFavorite(` + task.id + `)" src="/static/image/main/disabled_star.png/" alt="">`
            }

            form.elements.title.value = '';

            checkCountTasks(task.count);

        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}


function readyTask(task){
    $.ajax({
        url: '/ajax/ready_task?id=' + task,
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
        url: '/ajax/setfavorite?favorite=' + favotite+ '&task=' + task,
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