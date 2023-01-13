import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/user-model.js'
import { v2 as cloudinary } from 'cloudinary'

export const register = async (req, res) => {
	try {
		const hashPassword = await bcrypt.hash(req.body.password, 3)

		console.log(process.env.CLOUD_NAME)
		console.log(process.env.CLOUD_KEY)
		console.log(process.env.CLOUD_KEY_SECRET)

		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_KEY,
			api_secret: process.env.CLOUD_KEY_SECRET
		})

		const cloudAvatar = await cloudinary.uploader.upload(req.body.avatarUrl, {
			folder: 'chat_avatars'
		})
		const doc = new userModel({
			email: req.body.email,
			password: hashPassword,
			avatarUrl: {
				public_id: cloudAvatar.public_id,
				url: cloudAvatar.secure_url
			},
			nickname: req.body.nickname
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id
			},
			process.env.JWT_ACCESS_SECRET,
			{ expiresIn: '30d' }
		)

		const { password, ...userData } = user._doc
		res.json({
			...userData,
			token
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Failed to register', error: error })
	}
}
