var knex = require("../database/connection");
var bcrypt = require("bcrypt");

class User {

    async findAll() {
        try {
            var result = await knex.select("id", "name", "email", "role").table("users");
            return result;
        } catch(err) {
            console.log(err);
            return [];
        }
    }

    async findById(id) {
        try {
            var result = await knex.select("id", "name", "email", "role").where({id: id}).table("users");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async new(name, email, password) {
        try {
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({email, password: hash, name, role: 0}).table("users")
        } catch(err) {
            console.log(err);
        }
    }

    async findEmail(email) {
        try {
            var result = await knex.select(["*"]).from("users").where({email: email});
            if(result.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    async update(id, email, name, role) {

        var user = await this.findById(id);
        

        if (user != undefined) {

            var editUser = {};

            if (email != undefined) {
                if (email != user.email) {
                    var result = await this.findEmail(email);
                    if(result == false) {
                        editUser.email = email;
                    } else {
                        return {status: false, err: "O e-mail já está cadastrado!"};
                    }
                } else {
                    editUser.email = email;
                }
            }

            if (name != undefined) {
                editUser.name = name;
            }

            if (role != undefined) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({id: id}).table("users");
                return {status: true};
            } catch(err) {
                return {status: false, err: err};
            }

        } else {
            return {status: false, err: "O usuário não existe!"};
        }

    }

}

module.exports = new User();