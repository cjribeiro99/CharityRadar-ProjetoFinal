const localstrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//models e dados
const PostUser = require("../main/database/migrations/PostUser");
//--------

//logica do login no js
/**
 *
 * @param {import("passport")} passport
 */
module.exports = function (passport) {
  passport.use(
    new localstrategy(
      { usernameField: "email", passwordField: "senha" },
      (email, senha, done) => {
        PostUser.findOne({
          where: { email: email },
        }).then((ref) => {
          if (!ref) {
            return done(null, false, { message: " Credenciais inválidas" });
          }
          const usuario = ref.toJSON();

          if (!usuario) {
            return done(null, false, { message: " Credenciais inválidas" });
          }

          bcrypt.compare(senha, usuario.senha, (erro, bate) => {
            if (bate) {
              done(null, { id: usuario.id, nome: usuario.name });
            } else {
              return done(null, false, {
                message: " Credenciais inválidas senha",
              });
            }
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};

//---------------------
