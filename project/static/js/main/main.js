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
    
    console.log(task)
}