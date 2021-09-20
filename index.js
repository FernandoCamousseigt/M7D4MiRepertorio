const http = require('http')
const { insertar, consultar, editar, eliminar } = require('./consultas')
const fs = require('fs')
const url = require('url')

http
.createServer(async (req, res) => {
    if(req.url =='/' && req.method === 'GET'){
        res.setHeader('Content-Type', 'text/html')
        const html = fs.readFileSync('index.html', 'utf8')
        res.end(html)
    }
    // PASO 1:
    if(req.url =='/cancion' && req.method === 'POST'){
        let body = ''
        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', async () => {
            // PASO 2:
            const datos = Object.values(JSON.parse(body))
            // PASO 3:
            const respuesta = await insertar(datos)
            res.statusCode = 201
            // PASO 4:
            res.end(JSON.stringify(respuesta))
        })
    }

    if(req.url =='/canciones' && req.method === 'GET'){
        const registros = await consultar()
        res.statusCode = 200
        res.end(JSON.stringify(registros))
    }

    if(req.url.startsWith('/cancion/') && req.method === 'PUT'){
        let body = ''
        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', async () => {
            const id = req.url.split("/")[2]
            const datos = Object.values(JSON.parse(body))
            const respuesta = await editar(id, datos)
            res.statusCode = 200
            res.end('Recurso editado con éxito')
        })
    }
    
    if(req.url.startsWith('/cancion?') && req.method == 'DELETE'){
        const { id } = url.parse(req.url, true).query
        const respuesta = await eliminar(id)
        res.statusCode = 200
        res.end("Registro Eliminado con Exito")
    }
})
.listen(3000)