const mysql = require('mysql')

class mysqlDao {
    constructor(host, rootpassword, db){
        this.connectionPool = mysql.createPool({
            host,
            user: 'root',
            password: rootpassword,
            database: db,
            connectionLimit: 10
        })
        this.connectionPool.on('connection', () => {
            console.log('We are connected to mysql pool')
        })
        this.connectionPool.on('error', err => {
            console.log('mysql error>>>', err)
        })

        const tableQuery = 'CREATE TABLE IF NOT EXISTS contacts(id int auto_increment Primary key, fname varchar(20), lname varchar(20), phone varchar(11))'

        setTimeout(async() => {
            try{
                const result = await executeQuery(this.connectionPool, tableQuery, [])
                console.log('Database and Table Ready!')
            } catch(err) {
                console.log('Set timeout error>>>', err)
            }
        }, 2000);
    }

    async addContact(fname, lname, phone) {
        const query = 'INSERT INTO contacts(fname, lname, phone) VALUES(?,?,?)'
        try {
            const result = await executeQuery(this.connectionPool, query, [fname, lname, phone])
            const { insertId } = result
            return insertId
        } catch (error) {
            console.log('Error adding contact', error)
            return false
        }
    }

    async delContact(contactId) {
        const query = 'DELETE FROM contacts where id = ?'
        try {
            const result = await executeQuery(this.connectionPool, query, [contactId])
            return true
        } catch (error) {
            console.log('Error deleting contact>>>', error)
            return false
        }
    }

    async getContact(contactId) {
        const query = 'SELECT * FROM contacts where id = ?'
        try {
            const result = await executeQuery(this.connectionPool, query, [contactId])
            return result
        } catch (error) {
            console.log('Error getting single contact>>>', error)
            return false
        }
    }

    async getContacts() {
        const query = 'SELECT * FROM contacts'
        try {
            const result = await executeQuery(this.connectionPool, query, [])
            console.log('Contacts', JSON.stringify(result))
            return result
        } catch (error) {
            console.log('Error getting contacts>>>', error)
            return false
        }
    }

    async updateContacts(contactId, fname, lname, phone) {
        const query = 'UPDATE contacts SET fname=?, lname=?, phone=? WHERE id= ?'
        try {
            const result = await executeQuery(this.connectionPool, query, [contactId, fname, lname, phone])
            return true
        } catch (error) {
            console.log('Error updating contacts>>>', error)
            return false
        }
    }
}

function executeQuery(connectionPool, queryString, paramsArray) {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((err, con) => {
            if(err) {
                console.log('Error getting connection from pool', err)
                reject(err)
            }
            else {
                con.query(queryString, paramsArray, (err, result, fields) => {
                    if(err) {
                        console.log('Query error', err)
                    }
                    else {
                        resolve(result)
                        con.release()
                    }
                })
            }
        })
    })
}

module.exports = mysqlDao

// const newDao = new mysqlDao('localhost', 'secret', 'contactDb')

// newDao.getContacts()

// (async()=>{
//     const me = await newDao.getContact(2)
//     console.log(me)
// })()

//add
// const me = newDao.addContact('ussy', 'icey', '08078790976')
//update
// const me = newDao.updateContacts(2, 'uzlash', 'ace', '08055555555')
//get contact
// const me = newDao.getContact(2)
//get contacts
// const me = newDao.getContacts()
//delete
// const me = newDao.delContact(2)

//result
// me.then(response => console.log(response))