// import jwt from 'jsonwebtoken';

// export default (req, res, next) => {
//   const token = req.headers.authorization || ' ';
//   // .split(' ')[1];

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//       req.userId = decoded._id;
//       next();
//     } catch (error) {
//       return res.status(403).json({
//         message: "Don't have access",
//       });
//     }
//   } else {
//     return res.status(403).json({
//       message: "Don't have access",
//     });
//   }
// };