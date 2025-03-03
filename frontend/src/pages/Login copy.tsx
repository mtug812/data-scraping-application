// // import Navbar from "../components/Navbar";
// // import React from "react";
// import { BASE_URL } from "../api/globalvariables";


// const Login = () => {

// //state variables for managing authentication
// const [authing,setAuthing]=useState(false);
// const [username, setUsername] = useState('');
// const [password, setPassword] = useState('');
// const [error, setError] = useState('');
// // export const loginAPI = async (username: string, password: string) => {

// //     try {
// //         const data = await axios.post<UserProfileToken>(`${BASE_URL}/login`, {
// //             username: username,
// //             password: password,
// //         })
// //         return data;
// //     } catch (error) {
// //         handleError()
// //     }

//     return(

//     <div className='w-full h-screen flex'>
//             {/* left half of the screen*/}
//             <div className="w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center">
//             </div>

//             {/**Right half ot the screen - login form */}
//             <div className='w-1/2 h-full bg-[#1a1a1a] flex flex-col p-20 justify-center'>
//                 <div className='w-full flex flex-col max-w-[450px] mx-auto'>
//                 </div>
//             </div>

//             {/**Header section with title and welcome message */}
//             <div className='w-full flex flex-col mb-10 text-white'>
//                     <h3 className='text-4x1 font-bold mb-2'>Login</h3>
//                     <p className='text-lg mb-4'>Welcome Back! Please enter your details.</p>
//             </div>



//             {/**input field for username & password */}
//             <div className='w-full flex flex-col mb-6'>
//             <input 
//             type='username'
//             placeholder='Username'
//             className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline'
//             value={username}
//             onChange={(e) => setUsername(e.target.value)} />
//             {/**input field for username & password */}
//             <input 
//             type='password'
//             placeholder='Password'
//             className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline'
//             value={password}
//             onChange={(e) => setPassword(e.target.value)} />
//              </div>

//             {/**button to login with username and password */}
//             {/* Button to log in with email and password */}
//             <div className='w-full flex flex-col mb-4'>
//                         <button
//                             className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
//                             onClick={signInWithEmail}
//                             disabled={authing}>
//                             Log In With Email and Password
//                         </button>
//              </div>

//              {/* Link to sign up page */}
//              <div className='w-full flex items-center justify-center mt-10'>
//                 <p className='text-sm font-normal text-gray-400'>Don't have an account? <span className='font-semibold text-white cursor-pointer underline'><a href='/signup'>Sign Up</a></span></p>
//              </div>

//      </div>
//     );

// }




// export default Login;

