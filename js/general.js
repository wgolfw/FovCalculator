var dataJson = new Array();
var isEditFav = false;

var countClickEdit = 0;
function editAction() {

    icon = $('.btn-edit-action').find('span');
    if ((countClickEdit++ % 2) === 0) {
        display = 'block';
        $('.btn-edit-action').html('<span class="glyphicon glyphicon-ok"></span> Done');

        $('.btn-add-action').attr('disabled', true);
        $('.btn-save-action').attr('disabled', true);
        $('select, input').attr('disabled', true);
    } else {
        display = 'none';
        $('.btn-edit-action').html('<span class="glyphicon glyphicon-minus"></span> Delete');

        $('.btn-add-action').attr('disabled', false);
        $('.btn-save-action').attr('disabled', false);
        $('select, input').attr('disabled', false);
    }
    $('.btn-delete').css({
        'display': display,
    });

}

function loadAction(title) {

    $('.btn-load').attr('onclick', 'javascript:loadFavSet(\'' + title + '\');');
}
function deleteRow($btn) {

    var index = ($btn.next()).attr('data-index');

    $('select.mm[data-index="' + index + '"]').parent().remove();
    $('input.result[data-index="' + index + '"]').parent().remove();

    setIndexElement();
}
function createBtnDeleteRow() {
    var $btn = $('<div/>', {
        //'onclick': 'javascript:deleteRow(this)',
        'class': 'btn-delete',
    }).css({
        'width': 16 * 2.5,
        'height': 16 * 2.5,
        'position': 'absolute',
        'cursor': 'pointer',
        'right': 0,
        'top': -2,
        'background-image': 'url(images/icon-del.png)',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'display': 'none',
        //  'border': '1px solid #000',
        // 'background-color': '#000',
    });

    return $btn;
}

function insertRow() {
    var itemsLength = $('select.mm').length - 1;
    var nextIndex = itemsLength + 1;

    var opts = $('select.mm[data-index="' + itemsLength + '"]').html();
    var $col1 = $('form .col-1');
    var $col2 = $('form .col-2');

    var select = $('<select/>', {
        'class': 'form-control mm',
        'data-index': nextIndex,
        'html': opts,
    }).bind('change', function() {
        var $fovSource = $('#fov-source');
        var $fovDestination = $('#fov-destination');
        var index = $(this).attr('data-index');

        var inputText = $('input[data-index="' + index + '"]');
        var result = convertFov($(this).val(), $fovSource.val(), $fovDestination.val());
        inputText.val(result + ' mm');
    });

    var inputText = $('<input/>', {
        'type': 'text',
        'class': 'form-control result',
        'data-index': nextIndex,
        'readonly': true,
        'val': '0 mm',
    });

    var $formGroup = $('<div/>', {
        'class': 'form-group',
    });

    var $formGroupClone = $formGroup.clone();

    $formGroupClone.css({
        'position': 'relative',
    });
    $formGroup.append(select);

    $formGroupClone.append(createBtnDeleteRow());
    $formGroupClone.append(inputText);

    $formGroupClone.css({
        'position': 'relative',
    });

    $col1.append($formGroup);
    $col2.append($formGroupClone);

}

function addRowLens(rows) {




    var $col1 = $('form .col-1');
    var $col2 = $('form .col-2');
    var $col3 = $('form .col-3');

    for (i = 0; i < rows; i++) {

        var select = $('<select/>', {
            'class': 'form-control mm',
            'data-index': i,
        });

        var inputText = $('<input/>', {
            'type': 'text',
            'class': 'form-control result',
            'data-index': i,
            'readonly': true,
            'val': '0 mm',
        });

        var $formGroup = $('<div/>', {
            'class': 'form-group',
        });

        var $formGroupClone = $formGroup.clone();


        $formGroup.append(select);

        if (i != 0) {
            $formGroupClone.append(createBtnDeleteRow());
        }
        $formGroupClone.append(inputText);


        $formGroupClone.css({
            'position': 'relative',
        });

        $col1.append($formGroup);
        $col2.append($formGroupClone);
    }
}





$(document).on('click', '.btn-delete', function(e) {
    deleteRow($(this));
});

$(document).on('click', '.list-group-item', function() {
    $('.list-group-item').removeClass('active');
    $(this).addClass('active');
});

$(window).load(function() {
    //loadFovSet();


});


$(function() {


    $.database().open('fov_db');
    //$.database().drop(['favorite']);
    $.database().create(['favorite']);



    setMenuFov();


    addRowLens(5);




    $.getJSON('data/fovCropfactors.json', null, function(data) {
        var items = new Array();
        $.each(data, function(key, value) {
            items.push('<option value="' + (value) + '">' + key + '</option>');
        });

        $fovSource.empty().append(items.join(''));
        $fovDestination.empty().append(items.join(''));
    });

    var $fovSource = $('#fov-source');
    var $fovDestination = $('#fov-destination');
    var $mm = $('.mm');
    var items = new Array();
    items.push('<option value="">Select</option>');
    $.getJSON('data/mm.json', null, function(data) {

        $.each(data, function(key, value) {
            items.push('<option value="' + (value) + '">' + value + ' mm</option>');
        });
        $mm.empty().append(items.join(''));
    });

    // EVENT 
    var historyFovSource = 1;
    $fovSource.bind('change', function() {

        /*
         var convertToFov = $(this).val();
         $mm.find('option').each(function() {
         opt = $(this);
         result = convertFov(opt.val(), historyFovSource, convertToFov);
         opt.val(result);
         opt.html(result + ' mm');
         });
         historyFovSource = convertToFov; 
         */

        var $mm = $('.mm');
        $mm.find(':selected').each(function() {
            var itemSelected = $(this);
            var index = (itemSelected.parent('select')).attr('data-index');
            var inputText = $('input[data-index="' + index + '"]');

            var result = convertFov(itemSelected.val(), $fovSource.val(), $fovDestination.val());
            inputText.val(result + ' mm');

        });

    });

    $fovDestination.change(function() {
        $fovSource.trigger('change');
    });

    $('select.mm').bind('change', function() {
        console.log('a');
        var index = $(this).attr('data-index');
        var inputText = $('input[data-index="' + index + '"]');
        var result = convertFov($(this).val(), $fovSource.val(), $fovDestination.val());
        inputText.val(result + ' mm');
    });
    
    
    
    
    $('.btn-edit-fav').click(function(){
        
           if ($('.btn-remove-fav').hasClass('hide')) {
               $('.btn-load, .btn-cancel').attr('disabled', true);
               $('div.btn-remove-fav').removeClass('hide').addClass('show'); 
               $(this).html('Done');
               isEditFav = true;
           } else {
                $('.btn-load, .btn-cancel').attr('disabled', false);
               $('div.btn-remove-fav').removeClass('show').addClass('hide'); 
                $(this).html('Delete');
                isEditFav = false;
           }
           
               
    });
    
    
    $('.show-fav').click(function(e){
        console.log($(this));
        
        $('.btn-lens-set').trigger('click');
      
        return;
    }).mouseup(function(){
          $(this).removeClass('collapsed');
    });

});