import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'


const app = express()
app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

app.use(cors())

// sukurtos duonbazes pavadinimas
mongoose.connect('mongodb://localhost/facebook', (err) => {
    if (!err)
        console.log('prisijungimas prie DB pavyko')
});

// Schemos duomenu bazeje sukurimas, inicijuojamas po viena karta kiekvienai kolekcijai (lentelei) 
const postsSchema = new mongoose.Schema({
    content: String,
    data: Date,

})

// Schemos priskyrimas i modeli, inicijuojamas kartu su auksciau aprasytu kodu
const posts = mongoose.model('post', postsSchema)


// naujo iraso sukurimas ir issaugojimas duomenu bazeje
// const newPost = new posts()
// newPost.content = "test"
// newPost.data = '2022-03-31'
// newPost.save()

app.get('/show-data', (req, res) => {
    posts.find((err, data) => {
        if (err)
            return console.log(err)
        res.json(data)
    })
})


app.delete('/delete-data/:id', (req, res) => {
    let id = req.params.id
    posts.findByIdAndDelete(id).exec()
    posts.find((err, data) => {
        if (err)
            return console.log(err)
        res.json(data)
    })
})


app.post('/save-data', (req, res) => {
    const newPost = new posts()
    newPost.content = req.body.content
    newPost.data = req.body.data
    newPost.save()

    if (
        req.body.content === '' &&
        req.body.data === ''
    ) {
        res.send('Uzpildykite duomenis')
    } else {
        res.send('Duomenys sekmingai uzpildyti')
    }
})


// let post = posts.findByIdAndUpdate(id, {
//     content: 'REDAGAVOT IRASA'
// })
//     .then(data => {
//         {
//             console.log('irasas atnaujintas')
//         }
//     })

// post.content = 'Programiskai paredaguotas irasas'
// post.save()
// console.log(post)


app.put('/edit-data/:id', (req, res) => {
    let id = req.params.id
    // console.log(req.params.id)
    let post = posts.findByIdAndUpdate(id, {
        content: req.body.content
    })
        .then(data => {
            {
                console.log('Irasas paredaguotas')
            }
        })

})



app.listen(5002, () => {
    console.log('Serveris veikia')
})



