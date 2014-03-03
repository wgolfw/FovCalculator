function jsDecode(obj) {
    return  (JSON.stringify(obj)).replace(/\"/g, "|");
}
function jsEncode(str) {
    return  JSON.parse(str.replace(/\|/g, "\""));
}
var db = null;
var db_name = null;
$.database = function(options) {


    var opts = $.extend({
        name: null,
        version: "1.0",
        displayName: "webSqlDatabaseFovApp",
        size: "1000000",
        sql: null,
        callError: function(err) {
            //console.log(err);
        },
        callSuccess: function() {
            //console.log('Success!');
        },
    }, options);



    var sql = null;

    create = function() {
        db = window.openDatabase(opts.name, opts.version, opts.displayName, opts.size);
    };

    sqlCommand = function(tx) {
        $.each(opts.sql, function(key, item) {
            switch (item.length) {
                case 1:
                    tx.executeSql(item[0]);
                    break;
                case 2:
                    item[1];
                    tx.executeSql(item[0], item[1]);
                    break;
                case 3:
                    tx.executeSql(item[0], item[1], item[2]);
                    break;
            }

        });
    }

    transaction = function() {
        db.transaction(sqlCommand, opts.callError, opts.callSuccess);
    };

    if (opts.name !== null) {
        create();
    }


    if (opts.sql !== null) {
        transaction();
    }

    return {
        open: function(databaseName) {
            db_name = databaseName;
            db = window.openDatabase(db_name, opts.version, opts.displayName, opts.size);
            return db;
        },
        create: function(tableName, callSuccess, callError) {
            function populateDB(tx) {
                $.each(tableName, function(key, item) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + item + '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title, data)');
                     //tx.executeSql('INSERT INTO ' + item + ' (id, data) VALUES (1, "Fss33irssst row")');
                });
            }
            db.transaction(populateDB, callError, callSuccess);
        },
        drop: function(tableName, callSuccess, callError) {
            function populateDB(tx) {
                $.each(tableName, function(key, item) {
                    tx.executeSql('DROP TABLE IF EXISTS ' + item);
                });
            }
            db.transaction(populateDB, callError, callSuccess);
        },
    }
}

