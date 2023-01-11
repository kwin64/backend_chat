import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
app.use(cors({ origin: '*' }))
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
