
function editDate(id_task, date){

    $.ajax({
        url: 'api/v.1/editDateTask?id=' + id_task + '&date=' + date,
        method: 'get',
        success: function(data){
            const toastLiveExample = document.getElementById('liveToast');
            let toast_content = document.getElementById('toast_content');
            toast_content.innerText = 'Дата завершения изменена';
            const toast = new bootstrap.Toast(toastLiveExample);
            toast.show();

            let date_finish = dateParse(new Date(data));
            let inputDate = document.getElementById('datepick_' + id_task);
            let label_finishDate = document.getElementById('finishDate_' + id_task);
            inputDate.value = '';
            inputDate.placeholder = 'Завершение ' + date_finish;
            label_finishDate.textContent = 'Завершение ' + date_finish;
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
      
}

function addDescription(e){
    let id_task = e.target.id.split('_')[1];
    let description = e.target.value;

    if (description == ''){
        return;
    }

    $.ajax({
        url: 'api/v.1/addDescriptionTask?id=' + id_task + '&description=' + description,
        method: 'get',
        success: function(data){
            const toastLiveExample = document.getElementById('liveToast');
            let toast_content = document.getElementById('toast_content');
            toast_content.innerText = 'Описание изменено';
            const toast = new bootstrap.Toast(toastLiveExample);
            toast.show();
        },
        error: function (jqXHR, exception) {
            return;
        }
    });

}

function renamePanel(task){
    let input = document.getElementById('renameInput_' + task);
    let title_task = document.getElementById('task_title_' + task);
    title_task.innerText = input.value;
}

function AjaxRenameTask(e){
    let title = e.target.value;

    let id_task = e.target.id.split('_')[1];

    if (title == ''){
        return;
    }

    $.ajax({
        url: 'api/v.1/renameTask?id=' + id_task + '&title=' + title,
        method: 'get',
        success: function(data){
            const toastLiveExample = document.getElementById('liveToast');
            let toast_content = document.getElementById('toast_content');
            toast_content.innerText = 'Название изменено';
            const toast = new bootstrap.Toast(toastLiveExample);
            toast.show();

        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}