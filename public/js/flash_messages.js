let topPos = 30;

function flashMessage(message, level = 'danger') {

  topPos += 70;

  if (topPos > 300)
    topPos = 30;
  
  $('body').append(`
  <div class="alert alert-dismissible fade show alert-${level}" role="alert" 
  
  style="
  position: fixed; 
  top: ${topPos}px; 
  right: 0;
  margin-right: 20px;
  display: block;
  min-width:200px;
  "
  >
   ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="topPos -= 70;">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  `);


 
}

// flashMessage('Testing1', 'danger');
// flashMessage('This is a  long alert messageThis is a  long alert message');