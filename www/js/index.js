document.addEventListener('deviceready', onDeviceReady, false);
var db = null;
function onDeviceReady(){
    db = window.openDatabase("main7.db", "1.0", "eHealth DB", 3000000);
    db.transaction(populateDB, errorCB, successCB);
    //createGraph('min_bp','7');
    console.log('device ready!!');
}
// Populate the database //
    function populateDB(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS User (name varchar(256), birthdate date , height float, weight float)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Record (_id integer primary key , created_time DATETIME DEFAULT CURRENT_TIMESTAMP, value float , type varchar(256))');
        
    }
    function errorCB(err) {
        console.log("Error processing SQL: "+err);
    }
    function successCB() {
        console.log("success!");
    }


function main_insert(value,type){
     db.transaction(function(tx){
       var record_insert = 'INSERT INTO Record (value,type) VALUES (' + value + ',' + '\'' + type + '\'' + ')';
        tx.executeSql(record_insert); 
    },errorCB)
}
function query_result(){
    var type = document.getElementById('type_option').value;
    db.transaction(function(tx){
        var query_cmd = 'SELECT * FROM Record ' + 'WHERE type = ' + '\'' + type + '\'' ;
        tx.executeSql(query_cmd,[],query_success);
    },errorCB)
}
function query_success(tx,results){
    var len = results.rows.length;
    var tblText = '';
    for (var i = 0; i < len; i++) {
        tblText += '<tr>' + '<td><center>' + results.rows.item(i).created_time + '</center></td>' +
                            '<td><center>' + results.rows.item(i).value + '</center></td>' +
                    '</tr>';
    }
    document.getElementById("history_data").innerHTML =tblText;
}
function toastmsg(msg){
    var x = document.getElementById("snackbar")
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", "something1"); }, 2500);
    var html = '<div>'+ msg +'</div>'
    document.getElementById("snackbar").innerHTML = html;
}
function entry_data_check(data){
    if(data == null || data == ""){
        toastmsg("Please input data.");
        return false;
    }
    if(isNaN(data)){
        toastmsg("Please input only a number.");
        return false;
    }
    return true;
}

function insert_blood_pressure(){
    var min_bp = document.getElementById('blood_pressure_min').value ;
    var max_bp = document.getElementById('blood_pressure_max').value ;
    
    if(entry_data_check(min_bp) && entry_data_check(max_bp)){
        main_insert(min_bp,'min_bp');
        main_insert(max_bp,'max_bp');
        toastmsg('You have added data, value min : ' + min_bp + ',value max : ' + max_bp );
        document.getElementById('blood_pressure_min').value  = "" ;
        document.getElementById('blood_pressure_max').value  = "" ;
    }
}

function insert_heart_rate(){
    var heart_rate = document.getElementById('heart_rate').value ;
    if(entry_data_check(heart_rate)){
        main_insert(heart_rate,'heart_rate');
        toastmsg('You have added, value : ' + heart_rate);
        heart_rate = document.getElementById('heart_rate').value = "" ;
    }
}

function insert_weight(){
    var weight = document.getElementById('weight_value').value ;
    if(entry_data_check(weight)){
        main_insert(weight,'weight');
        main_insert((weight/(1.76*1.76)),'bmi');
        toastmsg('You have added, value : ' + weight);
        weight = document.getElementById('weight_value').value = "" ;
    }
}




