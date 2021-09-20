
const { Pool } = require('pg')

const pool = new Pool({    
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'repertorio',
    port: 5432,
})

const insertar = async (datos) => {
    const consulta = {
        text: "INSERT INTO repertorio (cancion, artista, tono) values ($1, $2, $3)",
        values: datos,
        rowMode: 'array'
    }
    try{
        const result = await pool.query(consulta)
        return result
    }catch(error){
        return error;
    }
}

const consultar = async () => {
    try{
        const result = await pool.query("SELECT id, cancion, artista, tono FROM repertorio ORDER BY id;")
        return result
    }catch(error){
        return error;
    }
}

const editar = async (id, datos) => {
    try{
        const result = await pool.query(`UPDATE repertorio SET 
        cancion='${datos[0]}', 
        artista='${datos[1]}', 
        tono='${datos[2]}' WHERE id='${id}' RETURNING *;`)
        return result
    }catch(error){
        console.log(error)
        return error;
    }
}

const eliminar = async (id) => {
    try{
        const result = await pool.query(`DELETE FROM repertorio WHERE id='${id}' RETURNING *;`)
         console.log(result.rowCount)
        return result.rowCount

    }catch(error){

        console.log(error.code)
        return error;
    }
}

module.exports = { insertar, consultar, editar, eliminar}