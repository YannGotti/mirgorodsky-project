function createTaskDiv(task){
    let fields = task.fields;
    let tasks_list = document.getElementById('tasks-list');

    let date_finish = new Date(fields.date_finish);
    let date_create = new Date(fields.date_create);

    tasks_list.innerHTML += 
            `
                <div class="p-3 m-3 task-background  point-task  animate__animated animate__fadeInDown col-11 col-lg-11 col-md-7" id="task_` + task.pk + `">

                    <div class="row d-flex justify-content-between">
                        <div class="col-8 col-lg-11">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"  onclick="readyTask(` + task.pk + `)">
                                <label class="form-check-label text-task mx-4" for="flexCheckDefault">
                                    <a  type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling_` + task.pk + `" id="task_title_` + task.pk + `" aria-controls="offcanvasScrolling_` + task.pk + `"  onclick="loadFilesList(` + task.pk + `); openPanelTask(` + task.pk + `)">` + fields.title + `</a>
                                </label>
                                <label class="form-check-label mx-1 text-finish-task" id="finishDate_` + task.pk + `">Завершение ` + dateParse(date_finish) + `</label>
                              </div>
                        </div>

                        <div class="col-2 col-lg-1" id='setFavorite_` + task.pk + `'>

                        </div>

                    </div>          

                </div>


                <div class="offcanvas offcanvas-end  all_offcanvas p-4" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling_` + task.pk + `" aria-labelledby="offcanvasScrollingLabel">
                    <div class="offcanvas-body">


                            <div class="row d-flex justify-content-center">
                                <div class="col-12">
                                    <input class="form-control text-rename-panel text-center" id="renameInput_` + task.pk + `" onclick="addEventListener('focusout', AjaxRenameTask)" onkeyup="renamePanel(` + task.pk + `)" value="` + fields.title + `">
                                </div>
                            </div>

                            <div class="row d-flex justify-content-center mt-3">
                                <div class="col-12">
                                    <div class="mb-3">
                                        <label for="descriptionTask_` + task.pk + `" class="form-label text-panel">Добавить описание</label>
                                        <textarea class="form-control text-panel-description" id="descriptionTask_` + task.pk + `" rows="2" onclick="addEventListener('focusout', addDescription)">` + fields.description + `</textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="row d-flex justify-content-center">
                                <div class="col-12 mb-3">
                                    <form id="taskfileform_` + task.pk + `">
                                        <label for="formFileSm_` + task.pk + `" class="form-label text-panel">Добавить файл</label>
                                        <input class="form-control text-panel-input fileinputpanel"  name="image"  id="formFileSm_` + task.pk + `" type="file" onchange="addFile(` + task.pk + `)">
                                    </form>
                                </div>

                                <div class="row d-flex justify-content-center">
                                    <div class="col-12 btn-group mb-3" id="filesListDiv_` + task.pk + `"  style="display: none;">
                                        <button class="btn btn-outline-white btn-sm dropdown-toggle text-panel" style="width: 100%;" type="button" data-bs-toggle="dropdown" aria-expanded="false">Прикрепленные файлы</button>
                                        <ul class="dropdown-menu text-panel" id="filesListTask_` + task.pk + `" style="width: 95%;">
                                            
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="row d-flex justify-content-center">
                                <div class="col-12 mb-3">
                                    <label class="form-label text-panel">Выбрать сложность</label>
                                    <button class="btn btn-outline-white btn-sm dropdown-toggle flag-panel" id="FlagList_` + task.pk + `" style="width: 100%;" type="button" data-bs-toggle="dropdown" aria-expanded="false">` + fields.flag + `</button>
                                        <ul class="dropdown-menu" style="width: 80%;">
                                            <li><button type="button" class="btn btn-outline-light text-dark  text-panel" onclick="setFlag(1, ` + task.pk + `)"  style="width: 100%;">Легко</button></li>
                                            <li><button type="button" class="btn btn-outline-light text-dark  text-panel" onclick="setFlag(2, ` + task.pk + `)"  style="width: 100%;">Средне</button></li>
                                            <li><button type="button" class="btn btn-outline-light text-dark  text-panel" onclick="setFlag(3, ` + task.pk + `)"  style="width: 100%;">Сложно</button></li>
                                        </ul>
                                </div>
                            </div>

                            <div class="row d-flex justify-content-center">
                                <div class="col-12 mb-3">
                                    <label class="form-label text-panel">Изменить дату завершения</label>
                                    <input class="form-control form-control-sm text-dark text-button-form  text-center datepick datepicks" id="datepick_` + task.pk + `" type="text" placeholder="Завершение ` + dateParse(date_finish) + `">
                                </div>
                            </div>



                            <div class="row d-flex justify-content-between footer-panel mt-2">
                                <hr></hr>
                                <div class="col-2 mt-1">
                                    <button type="button" class="btn btn-outline-light text-dark text-navbar-elements" aria-label="Скрыть подробное представление">
                                        <img data-bs-dismiss="offcanvas" aria-label="Close"  src="static/image/main/closePanel.png"
                                        width="20px" height="20px"  onclick="closePanelTask(` + task.pk + `)" style="cursor: pointer;">
                                    </button>
                                </div>

                                <div class="col-8">
                                    <h4 class="text-panel mt-3 text-center">Создано ` + dateParse(date_create) + `</h4>
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


        function setFavorite(){
            let favotite = document.getElementById('setFavorite_' + task.pk);

            if (task.fields.favorite){
                favotite.innerHTML += `<img width="25px" id="task_favorite_` + task.pk + `" onclick="setFavorite(` + task.pk + `)" src="/static/image/main/active_star.png" alt="">`
            }
            else{
                favotite.innerHTML += `<img width="25px" id="task_favorite_` + task.pk + `" onclick="setFavorite(` + task.pk + `)" src="/static/image/main/disabled_star.png/" alt="">`
            }
        }

        function setFlag(){
            let flagList = document.getElementById('FlagList_' + task.pk)

            let flag = (fields.flag == 1) ? 'Легко' : (fields.flag == 2) ? 'Средне' : (fields.flag == 3) ? 'Сложно' : null;
            flagList.innerText = flag;
        }
        
        setFavorite();
        setFlag();
        

}

function createFileTaskDiv(data){
    let filesListTask = document.getElementById('filesListTask_' + data.id_task);

    filesListTask.innerHTML += 
    `
    <li id="`+ data.filename +`_`+ data.id_task +`">
        <div class="row d-flex justify-content-center">
            <div class="col-8">
                <a target="_blank" href="`+ data.path +`" class="btn btn-outline-light text-panel text-dark text-start" download>`+ data.filename +`</a>
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-outline-light text-panel">
                    <img src="static/image/main/deleteFile.png" width="20px" height="20px" style="cursor: pointer;" onclick="deleteFile('`+ data.filename +`', `+ data.id_task +`)">
                </button>
            </div>
        </div>
    </li>
    `
}