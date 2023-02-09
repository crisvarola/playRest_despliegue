//es un middleware que se ejecuta para verificar la autentificacion del usuario
let autenticacion = (req, res, next) => {
    if (req.session && req.session.usuario)
    return next();
    else
    res.render('auth_login');
   };

   module.exports = autenticacion;
 