$('#complaintForm').submit(function(e){
  e.preventDefault();

  let formData = {
    title: $('#title').val(),
    desc: $('#complaint-body').val(),
    categories: $('#categories').val(),
    files: $('#files').val()
  }
  console.log(formData);
  console.log( new FormData($(this)[0]))
  $.ajax({
    url: '/complaints/add',
    type: 'POST',
    data: formData,
    success: function (data) {
        alert(data);
    },
    cache: false,
    contentType: false,
    processData: false
  });
});