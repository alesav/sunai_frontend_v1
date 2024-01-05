import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(['token']);
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://cf1.smspm.workers.dev/login', { username, password }, ); // {withCredentials: true}
      console.log(JSON.stringify(res));
      setCookie('token', res.data.token, { path: '/' });
      navigateTo('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">                                                               
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">                                                                                                                    
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800   
dark:border-gray-700">                                                                                                
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">                                                       
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white" >  Login to your account  </h1>                                                                                                   
            <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>                                                    
              <div>                                                                                                 
                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Your email</label>                                                                                                         
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="email" id="email" className="bg-gray-50 border border-gray-300            
text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-7 
dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"   
placeholder="name@company.com" required="" />                                                                         
              </div>                                                                                                
              <div>                                                                                                 
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900                   
dark:text-white">Password</label>                                                                                     
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" id="password" placeholder="••••••••" className="bg-gray-50   
border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-fu 
p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500        
dark:focus:border-blue-500" required="" />                                                                            
              </div>                                                                                                
              <div className="flex items-center justify-between">                                                   
                <div className="flex items-start">                                                                  
                  <div className="flex items-center h-5">                                                           
                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border      
border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600          
dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />                                                 
                  </div>                                                                                            
                  <div className="ml-3 text-sm">                                                                    
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>      
                  </div>                                                                                            
                </div>                                                                                              
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline                         
dark:text-primary-500">Forgot password?</a>                                                                           
              </div>                                                                                                
              <Button type="submit" >Sign in</Button>                                               
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">                                   
                Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline      
dark:text-primary-500">Sign up</a>                                                                                    
              </p>                                                                                                  
            </form>                                                                                                 
          </div>                                                                                                    
        </div>                                                                                                      
      </div>                                                                                                        
    </section>                                                                                                      

    </div>
  );
};

export default Login;
