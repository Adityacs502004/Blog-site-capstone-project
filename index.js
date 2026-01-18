import express from "express";
import bodyParser from "body-parser";
import { render } from "ejs";



const Port = 3000;

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));


var blog_body = [];
var blog_title = [];
var truncated_body = [];

app.post("/create" , (req , res)=>{
    var post_body = req.body.post_story;
    var post_title = req.body.post_title;
    blog_body.push(post_body);
    blog_title.push(post_title);
    console.log(post_title);

    if (post_body.length > 25 ){
        var truncated_post = post_body.substring(0, 25) + "....";
        truncated_body.push(truncated_post);
    }
    else{
        var truncated_post = post_body.substring(0, 5) + "....";
        truncated_body.push(truncated_post);
    }

    res.redirect("/")
});


app.get("/" , (req , res)=>{
    res.render("homepage.ejs"  , {
        truncated_body : truncated_body,
        blog_title : blog_title
    })
});


app.get("/create" , (req , res)=>{
    res.render("create.ejs" , {
        title : "",
        post_body : "", 
        action : "/create",
        button : "Post"
    });
})

app.get("/blog/:id", (req , res) =>{
    var blog_id = req.params.id;
    console.log(blog_id);
    res.render("blog.ejs" , {
        blog_id : blog_id, 
        blog_title : blog_title,
        blog_body : blog_body
    }) 
})

app.get("/edit/:id" , (req ,res) =>{
    var id = req.params.id;
    res.render("create.ejs" , {
        title : blog_title[id],
        post_body : blog_body[id], 
        action : `/edit/${id}`,
        button : "Update"
    })

})


app.post("/edit/:id" , (req , res)=>{
    var id = req.params.id;
    var edited_post_title = req.body.post_title;
    var edited_post_body = req.body.post_story;

    if (edited_post_title == blog_title[id] && edited_post_body == blog_body[id]){
        res.redirect("/");
    }
    else{
        blog_title[id] = (edited_post_title);

        blog_body[id] = (edited_post_body);


        if (edited_post_body.length > 25 ){
            var edited_truncated_post = edited_post_body.substring(0, 25) + "....";
            truncated_body[id] = (edited_truncated_post);
            

        }
        else{
            var edited_truncated_post = edited_post_body.substring(0, 5) + "....";
            truncated_body[id] = (edited_truncated_post);
        }


        res.redirect("/");
    }

    

})



app.get("/delete/:id" , (req , res) =>{
    var id = req.params.id;
    res.render("create.ejs" , {
        blog_id : id,
        title : blog_title[id],
        post_body : blog_body[id], 
        action : `/delete/${id}`,
        button : "Delete"
    })
})


app.get("/confm_delete/:id" , (req , res)=>{
    var id = req.params.id;
    blog_body.splice(id , 1);
    blog_title.splice(id , 1);
    truncated_body.splice(id , 1);

    res.redirect("/");

})











app.listen(Port , ()=>{
    console.log("Server is running on Port 3000");
})