$(document).ready(function(){
    $('.delete-complaint').on('click',function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        console.log(id);
        $.ajax({
            type:'DELETE',
            url:'/complaints/'+id,
            success: function(response){
                alert('Deleting Complaint');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }

        });
    });
    $('.solved-complaint').on('click',function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        console.log(id);
        $.ajax({
            type:'POST',
            url:'/complaints/solve/'+id,
            success: function(response){
                alert('Setting complaint to solved');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }

        });
    });
});

