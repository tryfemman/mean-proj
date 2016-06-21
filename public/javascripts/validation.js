$('#addReviewFM').submit(function(e) {
    var alertBox = $('.alert.alert-danger');
    alertBox.hide();
    if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
        if (alertBox && alertBox.length) {
            alertBox.show();
        } else {
            $(this).prepend('<div class="alert alert-danger" role="alert">All fields are required, please try again</div>');
        }
        return false;
    }
});