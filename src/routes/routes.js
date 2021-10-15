const express = require('express');
const router = express.Router();
const pool = require('../database.js')
const helpers = require('../encript.js');

router.get('/signup', (req ,res) =>{
    res.render('signup.hbs');
    
})

router.get('/home/:id' , async (req,res) =>{
    const idP = req.params.id; // es el identificador de la tabla principal
    const datos = await pool.query(`SELECT * FROM usuario${idP}`)
    if(datos[0] == undefined){
        res.render("home.hbs" ,{datos,idP}) 
    }else{
        for(let i = 0 ; i <datos.length;i++){
            datos[i].idP = idP;
        }
        
        res.render("home.hbs" ,{datos,idP})
    }
    
})

router.get('/agregar/:id', (req,res) =>{
    const {id} = req.params;
    res.render('agregar.hbs' ,{id})
})
router.get('/editar/:idP/:id' ,async (req,res)=>{
    const {idP} = req.params;
    const {id} = req.params;
    const links = await pool.query(`SELECT * FROM usuario${idP}  WHERE id= ?`,[id])
    links[0].idP = idP;
    res.render('editar.hbs',{links: links[0]});
})

router.get('/eliminar/:idP/:id',async (req,res)=>{
    const {idP} = req.params;
    const {id} = req.params;
    await pool.query(`DELETE from usuario${idP} where id= ?`,[id])
    res.redirect(`/home/${idP}`)
})

router.post('/editar/:idP/:id', async (req,res) =>{
    const {id} = req.params;
    const {idP} = req.params;
    const{nombre,numero,descripcion} = req.body;
    const linkEdit ={
        nombre,
        numero,
        descripcion
    }

   await pool.query(`UPDATE usuario${idP} set ? WHERE id = ?`,[linkEdit,id])
   res.redirect(`/home/${idP}`);
})

router.post('/agregar/:id', async (req,res)=>{
    const {nombre ,numero,descripcion} = req.body;
    const {id} = req.params;
    const datosUsuario = {
        numero,
        nombre,
        descripcion
    }
    await pool.query(`INSERT INTO usuario${id} set ?`,[datosUsuario])

    res.redirect(`/home/${id}`);
})

router.post('/signIn', async (req,res)=>{
    cuenta = req.body;
    console.log(cuenta)
    const datostabla  = await pool.query('SELECT * FROM usuarios WHERE usuario = ?' , [cuenta.usuario])
    if(datostabla.length == 0){
        console.log("usuario no encontrado")
    }else{
        if( await helpers.matchPassword(cuenta.contraseña, datostabla[0].contraseña)){
           res.redirect(`/home/${datostabla[0].ideTable}`)
        }
        else{
            console.log("contraseña o usuario incorrectos")
        }
    }
})

router.post('/signup', async (req ,res) =>{
    const {usuario ,contraseña,nombre} = req.body;

    const datosUsuario = {
        usuario,
        contraseña,
        nombre
    }
    datosUsuario.contraseña = await helpers.encryptPassword(datosUsuario.contraseña)
    await pool.query('INSERT INTO usuarios set ?',[datosUsuario])
    const tabla  = await pool.query('SELECT * FROM usuarios WHERE usuario = ?' , [usuario])
    let idTabla = tabla[0].id;
    await pool.query(`UPDATE usuarios SET ideTable= ? WHERE id=?`,[idTabla,idTabla])
    await pool.query(`CREATE TABLE usuario${idTabla}(
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero VARCHAR(15),
        nombre VARCHAR(50),
        descripcion VARCHAR(100)
    )`);
    
    res.redirect(`/home/${idTabla}`);
    
})


module.exports = router;