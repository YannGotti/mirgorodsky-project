

function InitPanelData(task_id){
    loadFlagsList(task_id);
    loadFilesList(task_id);
    openPanelTask(task_id);
}

function deleteCustomFlag(flagName, id_flag, id_task){

    let csrftoken = getCookie('csrftoken');

    $.ajax({
        url: 'api/v.1/customFlag/?id_task=' + id_task + '&flagName=' + flagName + '&id_flag=' + id_flag,
        method: 'delete',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data){
            let flagDiv = document.getElementById('customFlag_' + id_flag);
            flagDiv.remove();

            if (data == 0) {
                deleteCustomFlagsDiv(flagName);
            }

            getStateFilter(flagName, id_task);

            CallToastPanel('Категория "'+ flagName +'" успешно удалена!');
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}

function setValueInputCustomFlags(flag, input_id){
    let input = document.getElementById('inputCustomFlag_' + input_id);
    input.value = flag;
    addCustomFlag(input_id);
    return;
}

function listCustomFlags(id_task){
    let list = document.getElementById('listCustomFlags_' + id_task);
    let flags = UpdateAllCustomFlags();
    setTimeout(function(){
        if (flags.length == 0){
            list.style.display = 'none';
            return;
        }
        createListCustomFlags(flags , list, id_task);
    }, 100);
    
    
}

function addCustomFlag(id_task){

    let csrftoken = getCookie('csrftoken');

    let inputCustomFlag = document.getElementById('inputCustomFlag_' + id_task);
    let flagName = inputCustomFlag.value;


    if (flagName == ''){
        CallToastPanel('Поле название категории не может быть пустым!');
        return;
    }

    if (flagName.length > 15){
        CallToastPanel('Название категории не может быть более 15 символов!');
        return;
    }

    $.ajax({
        url: 'api/v.1/customFlag/?id=' + id_task + '&flagName=' + flagName,
        method: 'post',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data){

            if (data.error){
                CallToastPanel('Вы превысили допустимое количество категорий!');
                return;
            }
            inputCustomFlag.value = null;
            createCustomFlagsDiv(data);
            CUSTOM_FLAGS.push(flagName);

            if (!getCountCustomFlagsDiv(flagName)){
                let data = {
                    'flagName' : flagName
                }
                createFilterChoise(data);
            }

            CallToastPanel('Вы успешно создали категорию '+ data.flagName + '!');
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}

function setFlag(flag, id_task){

    let csrftoken = getCookie('csrftoken');

    $.ajax({
        url: 'api/v.1/flagTask/?id=' + id_task + '&flag=' + flag,
        method: 'put',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data){

            let action = (flag == 1) ? 'easy' : (flag == 2) ? 'normal' : (flag == 3) ? 'hard' : null;

            getStateFilter(action, id_task);

            CallToastPanel('Сложность "'+ setFlagDiv(data, id_task) +'" установлена!');
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}

function deleteFile(filename, id_task){

    let csrftoken = getCookie('csrftoken');

    $.ajax({
        url: 'api/v.1/FileTask/?id=' + id_task + '&filename=' + filename,
        method: 'delete',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data){

            if (data < 1){
                let filesDiv = document.getElementById('filesListDiv_' + id_task);
                filesDiv.style.display = 'none';
            }

            let fileDiv = document.getElementById(filename + '_' + id_task);
            fileDiv.remove();

            CallToastPanel('Файл "'+ filename +'" успешно удален!');
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
        url: 'api/v.1/FileTask/',
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

            if (data.error){
                CallToastPanel('Файл с таким именем уже существует!');
                return;
            }

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
    let csrftoken = getCookie('csrftoken');

    $.ajax({
        url: 'api/v.1/editDateTask/?id=' + id_task + '&date=' + date,
        method: 'put',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
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

    let csrftoken = getCookie('csrftoken');


    let id_task = e.target.id.split('_')[1];
    let description = e.target.value;

    $.ajax({
        url: 'api/v.1/updateDescriptionTask/?id=' + id_task + '&description=' + description,
        method: 'put',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
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
    let csrftoken = getCookie('csrftoken');

    let title = e.target.value;

    let id_task = e.target.id.split('_')[1];

    if (title == ''){
        return;
    }

    $.ajax({
        url: 'api/v.1/renameTask/?id=' + id_task + '&title=' + title,
        method: 'put',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data){
            CallToastPanel('Название изменено!')
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}

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

function setFlagDiv(flag, task){
    let flagList = document.getElementById('FlagList_' + task)

    let flag_text = (flag == 1) ? 'Легко' : (flag == 2) ? 'Средне' : (flag == 3) ? 'Сложно' : null;
    flagList.innerText = flag_text;
    return flag_text;
}

function CallToastPanel(message){
    const toastLiveExample = document.getElementById('liveToast');
            let toast_content = document.getElementById('toast_content');
            toast_content.innerText = message;
            const toast = new bootstrap.Toast(toastLiveExample);
            toast.show();
}

function loadFlagsList(id_task){

    let csrftoken = getCookie('csrftoken');

    let customFlagsList = document.getElementById('customFlagsList_' + id_task);
    if (customFlagsList.childElementCount != 0){
        return;
    }
    
    $.ajax({
        url: 'api/v.1/customFlag/?id=' + id_task,
        method: 'post',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data){

            if (data == null){
                return;
            }

            for (const flag of data) {
                createCustomFlagsDiv(flag);
            }
        },
        error: function (jqXHR, exception) {
            return;
        }
    });
}

function loadFilesList(id_task){
    let filesListTask = document.getElementById('filesListTask_' + id_task);
    if (filesListTask.childElementCount != 0){
        return;
    }
    $.ajax({
        url: 'api/v.1/FileTask/?id_task=' + id_task,
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