$('#complaintForm').submit(function(e){
  e.preventDefault();

  let formData = {
    title: $('#title').val(),
    body: $('#complaint-body').val(),
    categories: $('#categories').val()
  }
  console.log(formData);

  $.ajax({
    url: '/add',
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