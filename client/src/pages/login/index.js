import styles from './styles.module.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ username, setUsername, password, setPassword, socket }) => {
    const navi = useNavigate();

    const loginUser = () =>{
        if ( username !== '' && password !== ''){
            socket.emit('login_check_user', { username, password });
            socket.once("change_directory_to_room_lobby", (userName) => {
                    setUsername(userName)
                    console.log(userName)
                    navi('/home', { replace: true })
                    
            })
        }
    }


  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`<>Login</>`}</h1>
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
            onClick={loginUser}
        >
            Login</button>

        <Link to='/register'>No account yet? Click here to register</Link>
      </div>
    </div>
  );
};

export default Login;