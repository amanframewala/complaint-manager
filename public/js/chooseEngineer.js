
$('#complaintTable tr').click(function(){
  $('#complaintTable tr').removeClass('table-primary');
  $(this).addClass('table-primary');

  //console.log($(this).children('.c_id').eq(0).val());

  $('#assignForm').attr('action', `/complaints/assign/${$(this).children('.c_id').eq(0).val()}`);

});