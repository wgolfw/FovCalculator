function setMenuFov() {
    var $fovMenu = $('div.fov-menu');
    $fovMenu.empty();
    //$fovMenu.html('<li class="dropdown-header">Name</li>');
    $.database({
        sql: {
            data: ['SELECT title FROM  favorite group by title ', [], function(tx, results) {

                    var len = results.rows.length;
                    var rows = results.rows;

                    var $a = null;

                    for (var i = 0; i < len; i++) {
                        obj = (rows.item(i));
                        $a = $('<a/>', {
                            'class': 'list-group-item',
                            'href': 'javascript:loadAction(\'' + obj.title + '\')',
                            //'href': 'javascript:loadFavSet(\'' + obj.title + '\');',
                            //'html': '<a href="javascript:loadFavSet(\'' + obj.title + '\');">' + obj.title + '</a>',
                            'html':   (i+1) + '. ' +  obj.title  ,
                            //'style': 'position:relative',
                        }) ;
                        
                        
                        $btn = $('<button/>', {
                            'class': 'btn btn-danger btn-sm pull-right',
                            'html': '<span class="glyphicon glyphicon-remove"></span>',
                            'style': 'position:relative;right:6px;top:-35px;z-index:9;',
                            'onclick': 'javascript:deleteFovSet("' + obj.title + '");',
                        }) ;
                        
                        $div = $('<div/>', {
                            
                        });
                        
                        $div.append($a);
                        
                        $btn = createBtnDeleteRow();
                        
                        $btn.css({
                           // 'display': 'none',
                            'position': 'relative',
                            'float': 'right',
                            'top': -40,
                            'z-index': 9,
                       
                        }).attr('onclick', 'javascript:deleteFovSet("' + obj.title + '");' ).addClass('btn-remove-fav');
                        
                        
                        if (isEditFav) {
                            $btn.removeClass('hide').addClass('show');
                        } else {
                           $btn.addClass('hide');
                        }
                        $div.append($btn );
                        
                        $fovMenu.append($div);
                        
                    }

                }],
        }
    });

}


function loadFavSet(title) { 
    
    var selectMM  = $('select.mm').length;;
 
    $.database({
        sql: {
            data: ['SELECT * FROM  favorite where title = "' + title + '"', [], function(tx, results) {

                    var len = results.rows.length;
                    var rows = results.rows;
                    
                    
                    if (len < selectMM) {
                        for (i=selectMM; i > len; i--) {
                            index = i- 1;
                            $('select.mm[data-index="' + (index) + '"]').parent().remove();
                            $('input.result[data-index="' + index + '"]').parent().remove();
                        }
                    } else if (len > selectMM) {
                        
                         
                        for (i=selectMM; i < len; i++) {
                            insertRow();
                        }
                    }
                    
                    
                    for (var i = 0; i < len; i++) {

                        fovs = jsEncode(rows.item(i).data); 
                        index = fovs.id;

                        if (i === 0) {
                            $('#fov-source').val(fovs.formatName1);
                            $('#fov-destination').val(fovs.formatName2);
                            $('#fovset-name').val(fovs.title);
                        }

                        $('select.mm[data-index="' + index + '"]').val(fovs.formatValue1);
                        $('input.result[data-index="' + index + '"]').val(fovs.formatValue2 + ' mm');

                    }

                }],
        }
    });
}


function saveFovSet() {

    var $inputFovName = $('#fovset-name');


    if ($.trim($inputFovName.val()) === "") {
        $inputFovName.focus();
        return false;
    }

    deleteFovSet($inputFovName.val());

    var $fovSource = $('#fov-source');
    var $fovDestination = $('#fov-destination');
    var rows = $('.mm').length;

    // $.database().open('fov_db');
    //  $.database().drop(['favorite', 'fovset']);
    // $.database().create(['favorite']);

    var objFov = new Object();

    for (i = 0; i < rows; i++) {

        objFov.id = i;
        objFov.title = $inputFovName.val();
        objFov.formatName1 = $fovSource.val();
        objFov.formatValue1 = $('select.mm[data-index="' + i + '"]').val();
        objFov.formatName2 = $fovDestination.val();
        objFov.formatValue2 = $.trim(($('input.result[data-index="' + i + '"]').val()).replace('mm', ''));




        $.database({
            sql: {
                data: [
                    'INSERT INTO favorite ( title, data) VALUES ("' + objFov.title + '",   "' + jsDecode(objFov) + '")'
                ],
            },
        });
    }
    // setMenuFov();
    $('.btn-cancel').trigger('click');
}

function deleteFovSet(title) {

    $.database({
        sql: {
            data: [
                'DELETE FROM favorite  where title = "' + title + '"'
            ],
        },
        callSuccess: function(){
            setMenuFov();
        },
    });
    
      
}

function convertFov(mm, s, d) {
    return Math.round(Math.round(mm / s) * d);
}

function resetFov() {
    $('select').find('option:nth-child(1)').attr('selected', true);
    $('#fov-source').trigger('change');
    $('input.result').val('');
}


function setIndexElement() {
    var counter = 0;
    $('select.mm').each(function(){
        $(this).attr('data-index', counter++);
    });
    
    counter = 0;
    $('input.result').each(function(){
        $(this).attr('data-index', counter++);
    });
}
