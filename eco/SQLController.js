const mysql = require('mysql2/promise');


module.exports = {
    db: "buyers_db",

    GetConnection: async function(db = this.db, pass = "password", host="localhost") {
        try {
            return await mysql.createPool({
                host: host,
                // Your port; if not 3306
                port: 3306,
                user: "root",
                password: pass,
                database: db,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        } catch (err) {
            console.log('error unable to connect to sqlDB');
            throw err;
        }

    },

    // inserts new users into the database
    insertNewUser: async function(con, tableOneCol, InsertObject) {
        let queryString =
            `INSERT INTO ${tableOneCol} SET ?;`;
        try {
            console.log(InsertObject)
            let response = await con.query(
                queryString, {
                    fullName: InsertObject.fullName,
                    genderPref: "Unknown",
                    dob: InsertObject.dob,
                    email: InsertObject.email,
                    phone: InsertObject.phone,
                    allowMarketing:InsertObject.allowMarketing,
                    streetAddress: InsertObject.streetAddress,
                    city: InsertObject.city,
                    state: InsertObject.state,
                    zip: InsertObject.zip,
                    dl: InsertObject.dl,
                    medRecNum:InsertObject.medRecNum,
                    medRecExp:InsertObject.medRecExp,
                    location:InsertObject.location
                });
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL server Response Error code:500 in method InsertNewUser()" });
                }
            });
        } catch (err) {
            console.log("error inserting data to table");
            throw err;
        }
    },

    // inserts new users into the database
    insertNewInvoice: async function(con, tableOneCol, InsertObject) {
        let queryString =
            `INSERT INTO ${tableOneCol} SET ?;`;
        try {
            console.log(InsertObject)
            let response = await con.query(
                queryString, {
                    invoiceID: InsertObject.invoiceID,
                    receiptID: InsertObject.receiptID,
                    total: InsertObject.total,
                    paymentType: InsertObject.paymentType,
                    customerName: InsertObject.customerName,
                    customerRef: InsertObject.customerRef,
                    createdOn: InsertObject.createdOn,
                    location: InsertObject.location
                });
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL server Response Error code:500 in method InsertNewUser()" });
                }
            });
        } catch (err) {
            console.log("error inserting data to table");
            throw err;
        }
    },

    insertCustomeData: async function(con, InsertObject){
        let queryString =
            `INSERT INTO userData SET ? ;`;
        try {
            // console.log(InsertObject)
            let response = await con.query(
                queryString, {
                    userID: InsertObject.userID,
                    totalVisitsPerMonth: InsertObject.totalFreq,
                    totalLifeTimeVisits: InsertObject.totalVisits,
                    timeBetweenFirstAndLast: InsertObject.totalTimeUnix,
                    timeBetweenVisits: InsertObject.timeBetweenVisits,
                    totalSpentPerVisit: InsertObject.totalPerVisit,
                    visitsInMonth: InsertObject.visitsInMonth,
                    totalSpent: InsertObject.totalSpent,
                    location:InsertObject.location
                });
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL server Response Error code:500 in method InsertNewUser()" });
                }
            });
        } catch (err) {
            console.log("error inserting data to table");
            throw err;
        }
    },

    selectAllFromTable: async function (con, table) {
        let queryString = "SELECT * FROM ?"
        try {
            let response = await con.query(queryString, table);
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "MYSQL SERVER ERROR Code:500 in SelectAllFromTable()" })
                }
            })
        } catch (err) {
            throw err;
        }
    },

    selectWhere: async function (con, tableInput, colToSearch, valOfCol) {
        let queryString = "SELECT * FROM ?? WHERE ?? = ?";
        try {
            let response = await con.query(queryString, [tableInput, colToSearch, valOfCol]);
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL Sever error code:500 in method selectWhere()" })
                }
            });
        } catch (err) {
            throw err;
        }
    },


    selectSomethingWhere: async function (con, selector, tableInput, colToSearch, valOfCol) {
        let queryString = "SELECT ? FROM ?? WHERE ?? = ?";
        try {
            let response = await con.query(queryString, [selector, tableInput, colToSearch, valOfCol]);
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL Sever error code:500 in method selectWhere()" })
                }
            });
        } catch (err) {
            throw err;
        }
    },

    SelectAllAndOrderByTmestamp: async function (con, ID, table) {
        let queryString = `SELECT * FROM ?? WHERE foreignId =${ID} ORDER BY unixTimestamp DESC`;
        console.log(queryString);
        try {
            let response = await con.query(queryString, [table]);
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL server response error code:500 in method SelectAndOrder()" })
                }
            });
        } catch (err) {
            throw err;
        }
    },

    findWhoHasMost: async function (con, tableOneCol, tableTwoForeignKey, tableOne, tableTwo) {
        let queryString =
            "SELECT ??, COUNT(??) AS count FROM ?? LEFT JOIN ?? ON ??.??= ??.id GROUP BY ?? ORDER BY count DESC LIMIT 1";
        try {
            let response = await con.query(
                queryString, [tableOneCol, tableOneCol, tableOne, tableTwo, tableTwo, tableTwoForeignKey, tableOne, tableOneCol]);
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL server Response Error code:500 in method findWhoHasMost()" });
                }
            });

        } catch (err) {
            throw err;
        }
    },

    selectSomethingFromTable: async function(con, something, tableName){
        let queryString = `SELECT ${something} FROM ${tableName}`;
        try {
            let response = await con.query(queryString);
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL server response error code:500 in method SelectAndOrder()" })
                }
            });
        } catch (err) {
            throw err;
        }
    },

    findInvoiceByID: async function(con, ID,){
        let queryString = `SELECT * FROM invoices WHERE customerRef = ${ID} `;
        try {
            let response = await con.query(queryString);
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL server response error code:500 in method SelectAndOrder()" })
                }
            });
        } catch (err) {
            throw err;
        }
    },

    insertOne: async function (con, tableOneCol, InsertObject) {
        let queryString =
            `INSERT INTO currencies SET ?;`;
        try {
            console.log(InsertObject)
            let response = await con.query(
                queryString, {
                    currency: InsertObject.ValueA,
                    currencyLong: InsertObject.ValueB,
                    txfee: InsertObject.ValueC
                });
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL server Response Error code:500 in method findWhoHasMost()" });
                }
            });

        } catch (err) {
            console.log("error inserting data to table");
            throw err;
        }
    },


    insertEleven: async function (con, tableOneCol, InsertObject) {
        let queryString =
            `INSERT INTO ${tableOneCol} SET ?;`;
        try {
            console.log(InsertObject)
            let response = await con.query(
                queryString, [{
                    foreignId: InsertObject.ValueA,
                    high: InsertObject.ValueB,
                    low: InsertObject.ValueC,
                    Volume: InsertObject.ValueD,
                    last: InsertObject.ValueE,
                    unixTimestamp: InsertObject.ValueF,
                    bid: InsertObject.ValueG,
                    ask: InsertObject.ValueH,
                    openBuys: InsertObject.ValueI,
                    openSells: InsertObject.ValueJ,
                    prevDay: InsertObject.ValueK

                }]);
            return new Promise((resolve, reject) => {
                if (response) {
                    resolve(response[0]);
                } else {
                    reject({ err: "SQL server Response Error code:500 in method findWhoHasMost()" });
                }
            });

        } catch (err) {
            console.log("error inserting data to table");
            throw err;
        }
    }
    //end of methods
}
// 'foreignId', 'high', 'low', 'Volume', 'last', 'unixTimestamp', 'bid', 'ask', 'openBuys', 'openSells', 'prevDay'
// 11 values
