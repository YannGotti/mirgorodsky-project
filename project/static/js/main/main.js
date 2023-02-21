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

    for (let point_task of point_tasks) {
        classes = '';

        if (task_panel.className == 'offcanvas offcanvas-end showing'){
            for (let i = 0; i < point_task.classList.length - 3; i++) {
                classes +=  ' ' + point_task.classList[i];
            }
        
            classes += ' col-lg-10  col-11 col-md-7'
            point_task.className = classes
        }

        else{
            closePanelTask(task);
        }
    }
}

function closePanelTask(task){
    let point_tasks = document.getElementsByClassName('point-task');

    for (let point_task of point_tasks) {
        classes = '';

        for (let i = 0; i < point_task.classList.length - 3; i++) {
            classes +=  ' ' + point_task.classList[i];
        }
    
        classes += ' col-lg-11  col-11 col-md-7'
        
        point_task.className = classes
    }
}