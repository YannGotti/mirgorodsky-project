
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function loadFilesList(id_task){
    let filesListTask = document.getElementById('filesListTask_' + id_task);
    filesListTask.innerHTML = ``;
    $.ajax({
        url: 'api/v.1/selectFiles?id_task=' + id_task,
        method: 'get',
        success: function(data){


            if (data.length > 0){
                let filesDiv = document.getElementById('filesListDiv_' + id_task);
                filesDiv.style.display = 'block';
            }

            for (const file of data) {
                createFileTaskDiv(file);
            }
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}

function addFile(id_task){
    const inputFile = document.getElementById("formFileSm_" + id_task);

    let csrftoken = getCookie('csrftoken');

    let formData = new FormData();
    formData.append('id_task', id_task);
    formData.append('file', inputFile.files[0]);

    $.ajax({
        url: 'api/v.1/addFileTask/',
        method: 'post',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data){
            inputFile.value = null;
            let filesDiv = document.getElementById('filesListDiv_' + data.id_task);
            filesDiv.style.display = 'block';

            createFileTaskDiv(data);
            CallToastPanel('Файл "' + data.filename + '" добавлен!');
        },
        error: function (jqXHR, exception) {
            return;
        }
    });

}

function editDate(id_task, date){

    $.ajax({
        url: 'api/v.1/editDateTask?id=' + id_task + '&date=' + date,
        method: 'get',
        success: function(data){
            let date_finish = dateParse(new Date(data));
            let inputDate = document.getElementById('datepick_' + id_task);
            let label_finishDate = document.getElementById('finishDate_' + id_task);
            inputDate.value = '';
            inputDate.placeholder = 'Завершение ' + date_finish;
            label_finishDate.textContent = 'Завершение ' + date_finish;

            CallToastPanel('Дата завершения изменена!')
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
            CallToastPanel('Описание изменено!')
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
            CallToastPanel('Название изменено!')
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}

function CallToastPanel(message){
    const toastLiveExample = document.getElementById('liveToast');
            let toast_content = document.getElementById('toast_content');
            toast_content.innerText = message;
            const toast = new bootstrap.Toast(toastLiveExample);
            toast.show();
}