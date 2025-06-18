import React,{UseState}from "react";

function Login() {
  const [username,setUsername]=UseState("");
  const [password,setPassword]=UseState("");
  const [email,setEmail]=UseState("");

  const valuser='chelshiya';
  const valpass='1234';
  const valemail='gautamchelsea639@gmail.com';
  if(username==valuser && password==valpass && email==valemail){
    // setmessage="Login sucessfully";
  }

  return (
    <>
    
    </>
  );
}

export default Login;