const router = require("express").Router();
const { User, Post, Comment, Vote } = require("../../models");
const withAut = require("../../utils/auth");

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
        attributes: { exclude: ["password"]},
        where: { 
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ["id", "title", "post_url", "created_at"]
            },
            // include the Comment model here:
            {
                model: Comment,
                attributes: ["id", "comment_text", "created_at"],
                include: {
                    model: Post,
                    attributes: ["title"]
                }
            },
            {
                model: Post,
                attributes: ["title"],
                through: Vote,
                as: "voted_posts"
            }
        ]
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
router.post("/", withAut, (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        // JS equivalent to SQL's query "INSERT INTO "
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    });
});

// POST /api/login
router.post("/login", withAut, (req, res) => {
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

     req.session.save(() => {
         // declare session variables
         req.session.user_id = dbUserData.id;
         req.session.username = dbUserData.username;
         req.session.loggedIn = true;

         res.json({user: dbUserData, message: "You are logged in!"});
     });
 });
});

router.post("/logout", withAut, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

// PUT /api/users/1
router.put("/:id", withAut, (req, res) => {
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

// DELETE /api/users/1
router.delete("/:id", withAut, (req, res) => {
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




/*
router.get("/:id", (req, res) => {
    User.findOne({
        attributes: {exclude: ["password"]},
        // JS equivalent to SQL's query "SELECT * FROM user WHERE id = 1;"
        where: {
            id: req.params.id
        },
        include: [
            {
                model:  Post,
                attributes: ["id", "title", "post_url", "created_at"]
            },
            // include the Comment model here:
            {
                model: Comment,
                attributes: ["id", "comment_text", "created_at"],
                include: {
                    model: Post,
                    attributes: ["title"]
                }
            },
            {
                model: Post,
                attributes: ["title"],
                through: Vote,
                at: "voted_posts"
            }
        ]
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
*/