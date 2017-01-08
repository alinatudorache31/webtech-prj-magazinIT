/*global $*/

// READ recods on page load
$(document).ready(function () {
    readRecords(); // calling function
});

// READ records
function readRecords() {
    $.get("/items/", {}, function (data, status) {
        data.forEach(function(value) {
            var row = '<tr id="row_id_'+ value.id +'">'
            			+ displayColumns(value)
        				+ '</tr>';
            $('#items').append(row);
        });
    });
}

function displayColumns(value) {
    return 	'<td>'+value.id+'</td>'
            + '<td class="name">'+ value.name +'</a></td>'
			+ '<td class="description">'+ value.description +'</td>'
			+ '<td class="price">'+ value.price +'</td>'
			+ '<td align="center">'
			+	'<button onclick="viewRecord('+ value.id +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteRecord('+ value.id +')" class="btn btn-danger">Exclude</button>'
			+ '</td>';
}

function addRecord() {
    $('#id').val('');
    $('#name').val('');
    $('#description').val('');
    $('#price').val('');
    
    $('#myModalLabel').html('Add New Product');
    $('#add_new_record_modal').modal('show');
}

function viewRecord(id) {
    var url = "/items/" + id;
    
    $.get(url, {}, function (data, status) {
        //bind the values to the form fields
        $('#name').val(data.name);
        $('#description').val(data.description);
        $('#price').val(data.price);
        
        $('#id').val(id);
        $('#myModalLabel').html('Edit Products');
        
        $('#add_new_record_modal').modal('show');
    });
}

function saveRecord() {
    var formData = $('#record_form').serializeObject();
    if(formData.id) {
        updateRecord(formData);
    } else {
        createRecord(formData);
    }
}

function createRecord(formData) {
    $.ajax({
        url: '/items/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_record_modal').modal('hide');
            
            var row = '<tr id="row_id_'+ data.id +'">'
            			+ displayColumns(data)
        				+ '</tr>';
            $('#items').append(row);
        } 
    });
}

function updateRecord(formData) {
    $.ajax({
        url: '/items/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#row_id_'+formData.id+'>td.name').html(formData.name);
            $('#row_id_'+formData.id+'>td.description').html(formData.description);
            $('#row_id_'+formData.id+'>td.price').html(formData.price);
            $('#add_new_record_modal').modal('hide');
        } 
    });
}

function deleteRecord(id) {
    $.ajax({
        url: '/items/'+id,
        type: 'DELETE',
        success: function(data) {
            $('#row_id_'+id).remove();
        }
    });
}


//extending jQuery with a serializeObject method so that form values can be retrieved as JSON objects
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};