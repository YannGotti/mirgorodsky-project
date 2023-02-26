
const picker = new Litepicker({ 
    element: document.getElementById('datePicker'),
    lang : 'ru',
    minDate: new Date(),
    plugins: ['mobilefriendly']
  });



function createPickerPanel(){
  let datepicks = document.getElementsByClassName('datepicks');
  for (const datepick of datepicks) {
    new Litepicker({ 
      element: datepick,
      lang : 'ru',
      minDate: new Date(),
      plugins: ['mobilefriendly'],

      setup: (picker) => {

        picker.on('selected', (date1, date2) => {
          let id_task = datepick.id.split('_')[1];

          setTimeout(function(){
              let date = datepick.value;

              editDate(id_task, date);
          }, 500);

        });

     },

    });
  }
}

setTimeout(function(){ createPickerPanel() }, 1000);