import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import multer from 'multer'
import authRoute from './routes/auth.js'
dotenv.config()

mongoose.set('strictQuery', false)
mongoose
	.connect(process.env.DB_URL)
	.then(() => console.log('db connected'))
	.catch(err => console.log('db error', err))

const app = express()
app.use(express.json())
app.use(cors({ origin: '*' }))

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads')
		}
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})
const upload = multer({ storage })
app.use('/uploads', express.static('uploads'))

//routes
app.use('/auth', authRoute)
app.post('/uploads', upload.single('image'), (req, res) => {
	res.json({
		url: `uploads/${req.file.originalname}`
	})
})

const server = createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', socket => {
	socket.on('join', ({ name, room }) => {
		socket.join(room)

		const response = { user: { userName: name }, message: `connected ${name}` }
		socket.emit('message', response)
	})

	socket.on('disconnect', () => {
		console.log('Disconnected')
	})
})

server.listen(process.env.PORT || 8000, () => {
	console.log('Server running on : ', process.env.PORT || 8000)
})
