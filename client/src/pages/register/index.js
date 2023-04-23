import styles from './styles.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

//const harperRegisterUser = require('../../../../server/services/harper-register-user');


const Register = ({ username, setUsername, password, setPassword, socket }) => {
    const navi = useNavigate();
    
    

    const registerUser = () => {
        
        
        if ( username !== '' && password !== ''){
           socket.emit('check_for_user', { username, password });
           socket.on('change_directory_to_login', (response) => {
                  navi('/', { replace: true });
           })
           /*
           socket.on('registered_username', (response) => {
                //return () => socket.off('registered_username');
                
                //alert('Hello:', registeredUsername);
                const parsedData = JSON.parse(response)
                const userName = parsedData.username;
                console.log(userName);
                if (parsedData.length > 0){
                  //navi('/', { replace: true });
                    return
                  } else {
                    socket.emit('register_user', { username, password});
                  }
                //navi('/', { replace: true });
          
           }) */
           
           //console.log('hi');
  
        }
        
        
        //navi('/', { replace: true });
        
    }
  

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`<>Register</>`}</h1>
        
            <input 
                className={styles.input} 
                placeholder='Username...' 
                onChange={(e) => setUsername(e.target.value)}
            />
            <input 
                type="password"
                className={styles.input} 
                placeholder='Password...' 
                onChange={(e) => setPassword(e.target.value)}
            />
            

            
            <button 
                className='btn btn-secondary'
                onClick={registerUser}
            >Register</button>
        

        <Link to='/'>Already have an account? Login instead</Link>
      </div>
    </div>
  );
};

export default Register;