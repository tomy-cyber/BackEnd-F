// // backend/middlewares/cors.js
// import Cors from 'cors';

// export const cors = Cors({
//   origin: "http://localhost:3000", // Change in production
//   methods: ["GET", "POST", "OPTIONS"],
//   allowedHeaders: ["Content-Type"],
//   credentials: true,
// });

// export default function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }
// import Cors from 'cors';

// export const cors = Cors({
//   origin: ["http://localhost:3000", "http://localhost:3002"],  // Allow these origins
//   methods: ["GET", "POST", "OPTIONS"],  // Allow these methods
//   allowedHeaders: ["Content-Type"],  // Allow these headers
//   credentials: true,  // Allow credentials (cookies, authorization headers)
// });

// export default function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }



// import Cors from "cors";

// // Allow requests from both the frontend and admin panel
// const cors = Cors({
//   origin: ["http://localhost:3000", "http://localhost:3002"],
//   methods: ["GET", "POST", "OPTIONS"],
//   allowedHeaders: ["Content-Type"],
//   credentials: true,
// });

// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }



// import Cors from "cors";

// // Allow requests from both the frontend and admin panel
// const cors = Cors({
//   origin: ["http://localhost:3000", "http://localhost:3002"],
//   methods: ["GET", "POST", "OPTIONS"],
//   allowedHeaders: ["Content-Type"],
//   credentials: true,
// });
// // app.use(cors())
// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }

// // Export both cors and runMiddleware
// export { cors, runMiddleware };
import Cors from "cors"

// Configure CORS options
export const cors = Cors({
  origin: ["https://front-end-f.vercel.app", "https://admin-panel-kappa-lyart.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours in seconds
})

// Helper function to run middleware
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}
