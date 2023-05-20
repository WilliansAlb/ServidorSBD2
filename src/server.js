const express = require('express');
//const mysql = require('mysql');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.use(bodyParser.json());
const port = 3000; // Puerto en el que se ejecutará el servidor


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("index");
});
app.get('/obtener-categorias', (req, res) => {
    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
            connection.query('SELECT * FROM categoria', (error, results, fields) => {
                if (error) {
                    console.error('Error al realizar el select: ' + error.message);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                }
                connection.end();
                res.send(results);
            });
        }
    });
});

app.get('/obtener-autores', (req, res) => {
    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
            connection.query('SELECT * FROM autor', (error, results, fields) => {
                if (error) {
                    console.error('Error al realizar el select: ' + error.message);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                }
                connection.end();
                res.send(results);
            });
        }
    });
});

app.get('/autores', (req, res) => {
    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
            connection.query('SELECT * FROM autor', (error, results, fields) => {
                if (error) {
                    console.error('Error al realizar el select: ' + error.message);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                }
                connection.end();
                res.render('authors', { results: results });
            });
        }
    });
});

app.get('/categorias', (req, res) => {
    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
            connection.query('SELECT * FROM categoria', (error, results, fields) => {
                if (error) {
                    console.error('Error al realizar el select: ' + error.message);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                }
                connection.end();
                res.render('categories', { results: results });
            });
        }
    });

});

app.get('/libros', (req, res) => {
    var queryBuscar = "";
    if (req.query.filtro == 'todas' || !req.query.filtro) {
        queryBuscar = "SELECT SUBSTRING(l.titulo, 1,25) AS titulo, l.fecha_publicacion AS fecha, c.nombre AS categoria, a.nombre AS autor FROM libro l inner join categoria c ON (l.categoria_id = c.id) inner join autor a ON (l.autor_id = a.id)";
        req.query.filtro = "todas";
    } else {
        queryBuscar = "SELECT SUBSTRING(l.titulo, 1,25)  AS titulo, l.fecha_publicacion AS fecha, c.nombre AS categoria, a.nombre AS autor FROM libro l inner join categoria c ON (l.categoria_id = c.id) inner join autor a ON (l.autor_id = a.id) WHERE c.id = " + req.query.filtro;
    }
    console.log(req.query.filtro);
    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            connection.query(queryBuscar, (error, results, fields) => {
                if (error) {
                    console.error('Error al realizar el select: ' + error.message);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                }
                connection.query('SELECT * FROM categoria', (error2, results2, fields2) => {
                    if (error) {
                        console.error('Error al realizar el select: ' + error2.message);
                        connection.end();
                        res.sendStatus(500); // Error del servidor
                    }
                    connection.end();
                    res.render('gallery', { results: results, categorias: results2, categoria: req.query.filtro });
                });
            });
        }
    });
});

app.get('/buscar-libro', (req, res) => {
    var buscada = req.query.keyword;
    var queryBuscar = "SELECT l.titulo AS titulo, l.fecha_publicacion AS fecha, c.nombre AS categoria, a.nombre AS autor FROM libro l inner join categoria c ON (l.categoria_id = c.id) inner join autor a ON (l.autor_id = a.id) "
        + `WHERE c.nombre LIKE '%${buscada}%' OR a.nombre LIKE '%${buscada}%' OR l.titulo LIKE '%${buscada}%' OR l.fecha_publicacion LIKE '%${buscada}%';`;
    console.log(queryBuscar);
    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
            connection.query(queryBuscar, (error, results, fields) => {
                if (error) {
                    console.error('Error al realizar el select: ' + error.message);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                }
                connection.query('SELECT * FROM categoria', (error2, results2, fields2) => {
                    if (error) {
                        console.error('Error al realizar el select: ' + error2.message);
                        connection.end();
                        res.sendStatus(500); // Error del servidor
                    }
                    connection.end();
                    res.render('gallery', { results: results, categorias: results2, categoria: 'busqueda' });
                });
            });
        }
    });
});

app.get('/buscar-autor', (req, res) => {
    var buscada = req.query.keyword;
    var queryBuscar = "SELECT * FROM autor "
        + `WHERE nombre LIKE '%${buscada}%';`;

    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
            connection.query(queryBuscar, (error, results, fields) => {
                if (error) {
                    console.error('Error al realizar el select: ' + error.message);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                }
                res.render('authors', { results: results });
            });
        }
    });
});

app.get('/buscar-categoria', (req, res) => {
    var buscada = req.query.keyword;
    var queryBuscar = "SELECT * FROM categoria "
        + `WHERE nombre LIKE '%${buscada}%';`;

    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
            connection.query(queryBuscar, (error, results, fields) => {
                if (error) {
                    console.error('Error al realizar el select: ' + error.message);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                }
                res.render('categories', { results: results });
            });
        }
    });
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.post('/insertar-libro', (req, res) => {
    const { titulo, fecha_publicacion, categoria_id, autor_id } = req.body;
    const libro = { titulo, fecha_publicacion, categoria_id, autor_id };

    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
            connection.query('INSERT INTO libro SET ?', libro, (error, results) => {
                if (error) {
                    console.error('Error al insertar libro:', error);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                } else {
                    console.log('Libro insertado con éxito');
                    connection.end();
                    res.sendStatus(200); // OK
                }
            });
        }
    });

});

app.post('/insertar-autor', (req, res) => {
    const { nombre } = req.body;
    const autor = { nombre };

    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
            connection.query('INSERT INTO autor SET ?', autor, (error, results) => {
                if (error) {
                    console.error('Error al insertar autor:', error);
                    connection.end();
                    res.sendStatus(500); // Error del servidor
                } else {
                    console.log('Autor insertado con éxito');
                    connection.end();
                    res.sendStatus(200); // OK
                }
            });
        }
    });

});

app.post('/insertar-categoria', (req, res) => {
    const { nombre } = req.body;
    const categoria = { nombre };

    const connection = mysql.createConnection({
        host: '192.168.205.131',
        port: '3306',
        user: 'clusadmin',
        password: 'admin',
        database: 'libreriaSBD2'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
        } else {
            console.log('Conexión exitosa a MySQL');
        }
    });

    connection.query('INSERT INTO categoria SET ?', categoria, (error, results) => {
        if (error) {
            console.error('Error al insertar categoria:', error);
            connection.end();
            res.sendStatus(500); // Error del servidor
            return;
        }
        if (results) {
            console.log('Categoria insertada con éxito');
            console.log(results)
            connection.end();
            res.sendStatus(200); // OK
        }
    });
});


app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});

