import mysql from "mysql2";

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
    database: "veterina_vz",
})

con.connect(function(err) {
    if(err) {
        console.log("connection error",err.message)
    } else {
        console.log("Connected")
    }
})

export default con;