var User = require("../models/User");

class UserController {

    async findUser(req, res) {
        var id = req.params.id;
        var user = await User.findById(id);
        if (user == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.json(user);
            res.status(200);
        }
    }

    async index(req, res) {
        var users = await User.findAll();
        res.json(users);
    }

    async create(req, res) {
        var {email, name, password} = req.body;

        if (email === undefined) {
            res.status(400);
            res.json({err: "O e-mail é inválido!"});
            return;
        }

        var emailExists = await User.findEmail(email);

        if (emailExists) {
            res.status(406);
            res.json({err: "O e-mail já está cadastrado!"});
            return;
        }

        await User.new(name, email, password);

        res.status(200);
        res.send("Pegando o corpo da requisição!");
    }
}

module.exports = new UserController();