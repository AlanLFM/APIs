import './App.css';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import BusinessIcon from '@material-ui/icons/Business';
import SubjectIcon from '@material-ui/icons/Subject';
import ReactQuill from 'react-quill';
import {Auth0Provider, useAuth0} from '@auth0/auth0-react';
import 'react-quill/dist/quill.snow.css'; // ES6
import React, { useState, useRef } from 'react';

import {LoginButton} from './login'
import {LogoutButton} from "./loginOut"
import { Profile } from './Profile';

import ReactDOM from 'react-dom/client';
import axios from 'axios'
import sending from './img/sending.gif'
import ReCAPTCHA from "react-google-recaptcha";

const root = ReactDOM.createRoot(document.getElementById('root'));

export default function App() {
//captcha
const {isAuthenticated  }=useAuth0();
  const [captchaValido, cambiarCaptchaValido]=useState(null);
  const [usuarioValido, cambiarUsuarioValido]=useState(false);
  
  

  const captcha=useRef(null);
  const submit=(e)=>{
    
    e.preventDefault();
    if(captcha.current.getValue()){
      console.log("Usuario no es un robot");
      cambiarUsuarioValido(true);
      cambiarCaptchaValido(true);
    }else{
      console.log('Acepta el captcha');
      cambiarUsuarioValido(false);
      cambiarCaptchaValido(false)
    }
  }
  
  const onChange=()=>{
    if(captcha.current.getValue()){
      console.log("Usuario no es un robot");
      cambiarCaptchaValido(true);
    }
  }
  //

  const Form = () => {
   const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [company, setCompany] = useState('')
  const[loading, setLoading] = useState(false)

  const handleQuillChange = (value) => {
    setMessage(value)
  }

  const handleRequest = async (e) => {
    if(email && company && name && subject !== ""){
      if(message !== ""){
      e.preventDefault()
    setLoading(true)
    console.log({email, message, name, subject, company})

    const body = {
      email,
      message, 
      subject, 
      name,
      company
    }

   await axios.post('/mail', body, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then((res) => {
      alert('Email Sent Successfully')
      setLoading(false)
      console.log(res)
      window.location.reload()
    }).catch((err) => {
      console.log(err)
      setLoading(false)
    })
      } else {
        alert('Compose Email')
      }
      
    } else {
      alert('Please fill all required filled')
    }
   
    
  }
    return (
        
<>


    {!isAuthenticated &&

    <div>
    <LoginButton/>
    
    </div>
    }
    {isAuthenticated &&

      <form onSubmit = {handleRequest} method = "post">
        
      <div className = "form">
        <div className = "form__wrapper">
          <div className = "form__title">
          <h4>{loading ? 'Sending...' : "Send Email"}</h4>
          {
          loading && <img 
            src = {sending}
            alt = "loading..."
            style = {{
              filter: "invert(1)",
              position: "absolute",
              width : 200,
              height : 200,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          />
        }
        </div>
        <Profile/>
        <div className = "form__container">
          <div className = "form__containerItems">
            <div className = "form__containerItem">
              <div className = "form__containerItemName">
              <label>Name</label>
              <PersonIcon />
            </div>
            <div className = "form__containerItemField">
              <input
                id = "name"
                value = {name}
                onChange = {(e) => setName(e.target.value)}
                required = {true} 
                type = "text"
                placeholder = "Enter Your Name"
              />
            </div>
            </div>
            <div className = "form__containerItem">
              <div className = "form__containerItemName">
              <label>Email</label>
              <EmailIcon />
            </div>
            <div className = "form__containerItemField">
              <input 
                id = "email"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
                required = {true}
                type = "text"
                placeholder = "Enter Your valid Email"
              />
            </div>
            </div>
            <div className = "form__containerItem">
              <div className = "form__containerItemName">
              <label>Company</label>
              <BusinessIcon />
            </div>
            <div className = "form__containerItemField">
              <input 
                id = "company"
                value = {company}
                onChange = {(e) => setCompany(e.target.value)}
                type = "text"
                placeholder = "Enter Your Company Name"
              />
            </div>
            </div>
            <div className = "form__containerItem">
              <div className = "form__containerItemName">
              <label>Subject</label>
              <SubjectIcon />
            </div>
            <div className = "form__containerItemField">
              <input
                id = "subject"
                value = {subject}
                onChange = {(e) => setSubject(e.target.value)} 
                required
                type = "text"
                placeholder = "Add Subject"
              />
            </div>
          </div>
          <div className = "form__containerItem">
            <div className = "form__containerItemName">
              <label>Compose Mail</label>
              <button
              disabled = {loading}
              onClick = {handleRequest}  type = "submit" className = "btn btn-success">Send</button>
            </div></div>
            <div className = "container__composeMail">
            <ReactQuill
              id = "message"
              value = {message}
              onChange = {handleQuillChange}
              className = "quill" 
              placeholder = "Enter Content from here..."
            />
          </div>
        </div> 
      
    </div>
    
   </div>
   
   <LogoutButton/>
 </div>
</form>
  }
</>
)}

  return (
    <div className="App">
      <>
      <Form />
      </>
      
    </div>
  );
}
