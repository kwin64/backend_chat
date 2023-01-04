import express from 'express'
// import http from 'http'
// import cors from 'cors'
// import fs from 'fs'
// import dotenv from 'dotenv'
// import mongoose from 'mongoose'

const PORT = 5080

const app = express()

app.listen(PORT, () => console.log(`server started on ${PORT}`))
