import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // ✅ This fixes the path error
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


let posts = [];
let postId = 1;

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', (req, res) => {
    const { title, content } = req.body;
    posts.push({ id: postId++, title, content });
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    res.render('edit', { post });
});

app.post('/edit/:id', (req, res) => {
    const { title, content } = req.body;
    const post = posts.find(p => p.id === parseInt(req.params.id));
    post.title = title;
    post.content = content;
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id !== parseInt(req.params.id));
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
