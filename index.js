//________packet-install
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const { Connection, Client } = require("pg");

//_____-packet-install_location
const db = require("./connection/db");
const upload = require("./middlewares/fileUpload");
const { array } = require("./middlewares/fileUpload");

//port
const port = 8000;

//_____function-date
const { getFormatTime } = require("./date/date");
const { getDistanceTime } = require("./date/date");

//______tag-variabel
const { query, request, response } = require("express");
const app = express();
app.use(flash());
app.use(
  session({
    secret: "TIme Access",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1 * 60 * 60 * 1000, //1 hours
    },
  })
);

// set view engine
app.set("view engine", "hbs");

//directory(save data static)
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.urlencoded({ extended: false }));

//connect DataBase
db.connect((err, client, done) => {
  if (err) throw err; //error ceonection

  app.get("/register", (request, response) => {
    response.render("register", {
      user: request.session.user,
      isLogin: request.session.isLogin,
    });
  });

  app.post("/register", (request, response) => {
    const { inputName, inputEmail, inputPassword } = request.body;

    const hashedPassword = bcrypt.hashSync(inputPassword, 10);

    const query = `INSERT INTO public.tb_user(name, email, password)
      VALUES ('${inputName}','${inputEmail}','${hashedPassword}');`;

    client.query(query, (err, x) => {
      if (err) throw err;

      response.redirect("/login");
    });
  });

  app.get("/login", (request, response) => {
    response.render("login", {
      user: request.session.user,
      isLogin: request.session.isLogin,
    });
  });

  app.post("/login", (request, response) => {
    const { inputName, inputEmail, inputPassword } = request.body;
    const query = `SELECT * FROM tb_user WHERE email='${inputEmail}'`;

    client.query(query, (err, x) => {
      if (err) throw err;
      const isMatch = bcrypt.compareSync(inputPassword, x.rows[0].password);
      // console.log(x.rows);
      if (x.rows.length == 0) {
        request.flash("danger", "your email not register");
        return response.redirect("/login");
      }

      if (isMatch) {
        // console.log('login successfully');
        request.session.isLogin = true;
        request.session.user = {
          id: x.rows[0].id,
          name: x.rows[0].name,
          email: x.rows[0].email,
        };
        request.flash("success", "login successfully");
        response.redirect("/");
      } else {
        // console.log('login failed');
        request.flash("danger", "your password wrong");
        response.redirect("/login");
      }
    });
  });

  app.get("/logout", function (req, res) {
    req.session.destroy();

    res.redirect("/");
  });

  //home_page
  app.get("/", upload.single("inputImage"), (request, response) => {
    console.log(request.session);
    let query = "SELECT * FROM tb_project";
    client.query(query, (err, X) => {
      if (err) throw err;

      let responseDB = X.rows;

      console.log(responseDB);
      // console.log('pass')
      response.render("index", {
        reload: responseDB,
        user: request.session.user,
        isLogin: request.session.isLogin,
      });
    });
  });
  //contact_page
  app.get("/contact", (request, response) => {
    response.render("contact");
  });

  //blog_page
  app.get("/blog/:id", upload.single("inputImage"), (request, response) => {
    //take params
    let id = request.params.id;
    //take data from DB
    client.query(`SELECT * FROM tb_project where id=${id}`, (err, x) => {
      if (err) throw err;
      let responseDB = x.rows[0];
      // console.log(responseDB);
      response.render("blog", responseDB);
    });
  });

  // _________fitur

  //________input
  app.get("/project", (request, response) => {
    if (!request.session.user) {
      request.flash("danger", "login first");
      return response.redirect("/login");
    }
    response.render("project");
  });

  app.post("/project", upload.single("inputImage"), (request, response) => {
    const data = request.body;
    const image = request.file.filename;

    function tecno() {
      tes = [];

      data.js ? tes.push(data.js) : "null",
        data.php ? tes.push(data.php) : "null",
        data.java ? tes.push(data.java) : "null",
        data.react ? tes.push(data.react) : "null";

      return tes;
    }

    const query = `INSERT INTO tb_project(title,description,start_date,end_date,image,technologies)
    
    VALUES ($1,$2,$3,$4,$5,$6)`;

    client.query(
      query,
      [
        data.inputTitle,
        data.inputDescription,
        data.inputStartDate,
        data.inputEndDate,
        image,
        tecno(),
      ],
      (err, x) => {
        if (err) throw err;
        response.redirect("/");
      }
    );
  });

  //____________edit
  app.get("/edit-blog/:id", (request, response) => {
    if (!request.session.user) {
      request.flash("danger", "login first");
      return response.redirect("/login");
    }
    let id = request.params.id;
    //take data from DB
    client.query(`SELECT * FROM tb_project where id=${id}`, (err, x) => {
      if (err) throw err;
      let responseDB = x.rows[0];
      response.render("edit-blog", responseDB);
    });
  });

  app.post(
    "/edit-blog/:id",
    upload.single("inputImage"),
    (request, response) => {
      let id = request.params.id;
      let data = request.body;
      const image = request.file.filename;

      function tecno() {
        tes = [];

        data.js ? tes.push(data.js) : "null",
          data.php ? tes.push(data.php) : "null",
          data.java ? tes.push(data.java) : "null",
          data.react ? tes.push(data.react) : "null";

        return tes;
      }

      const query = `UPDATE public.tb_project
    SET title=$1, description=$2, start_date=$3, end_date=$4, image=$5, technologies=$6
    WHERE id=${id}`;

      client.query(
        query,
        [
          data.inputTitle,
          data.inputDescription,
          data.inputStartDate,
          data.inputEndDate,
          image,
          tecno(),
        ],
        (err, x) => {
          let responseDB = x;
          // console.log('check nih')
          // console.log(responseDB);
          response.redirect("/");
        }
      );
    }
  );

  // delete data
  app.get("/delete-blog/:id", (request, response) => {
    if (!request.session.user) {
      request.flash("danger", "login first");
      return response.redirect("/login");
    }
    const id = request.params.id;

    client.query(`DELETE FROM tb_project WHERE id=${id};`, (err, result) => {
      if (err) throw err;
      response.redirect("/");
    });
  });
});

app.listen(port, () => {
  // console.log(`Server running on port ${port}`);
});
