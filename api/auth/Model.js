const db = require('../../data/dbConfig')

const findById = (id) => {
    return db('users').where('id', id).first()
}
const find = (username) => {
    return db("users").where('username', username)
}
const register = async (newUser) => {
    // const [id] = db('users').insert(newUser)
    const [id] = await db('users').insert(newUser)
    return findById(id)
}




module.exports = {
    register,
    findById,
    find
}