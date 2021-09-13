const router = require("express").Router();
const { User } = require("../../models");

// GET /api/users
router.get("/", (req, res) => {
    // Access our User model and run .findAll() and method)
    User.findAll({
        attributes: {exclude: ["password"]}
    })
    // JS equivalent to SQL's query "SELECT * FROM user;"
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get("/:id", (req, res) => {
    User.findOne({
        attributes: {exclude: ["password"]},
        // JS equivalent to SQL's query "SELECT * FROM user WHERE id = 1;"
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: "No user found with this id"});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post("/", (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        // JS equivalent to SQL's query "INSERT INTO "
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// POST /api/login
router.post("/login", (req, res) => {
 // expects {email: 'lernantino@gmail.com', password: 'password1234'}
 User.findOne({
     where: {
         email: req.body.email
     }
 })
 .then(dbUserData => {
     if (!dbUserData) {
         res.status(400).json({message: "No user with that email address!"});
         return;
     }
     // add comment syntax in front of this line in the .then()
    //  res.json({user: dbUserData});
     
     // verify user
     const validPassword = dbUserData.checkPassword(req.body.password);
     if (!validPassword) {
         res.status(400).json({message: "Incorrect password!"});
         return;
     }
     res.json({user: dbUserData, message: "You are logged in!"});
 });
});

// PUT /api/users/1
router.put("/:id", (req, res) => {
    router.put("/:id", (req, res) => {
        // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

        // if req.body has exact key/value pairs to match, you can just use `req.body` instead
        // pass in req.body instead to only updated what's passed through
        User.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({message: "No user found with this id"});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    });
});

// DELETE /api/users/1
router.delete("/:id", (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: "No user found with this id"});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;