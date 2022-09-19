import { useRef, useState, useEffect } from "react";
import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

//regex used for verifying username validity. 
//it must start with a lower or uppercase letter, followed by
//either letters, numbers or - _ from 3 to 23 digits 
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

//password must have at least 1 lowercase, 1 uppercase
//1 number and 1 special character. it must be between
//8 to 24 digits long
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () =>{
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSucess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []) //no dependency in the second argument, will only load in the first render

    useEffect(() =>{ //user validation
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user]) //user is a dependency, so everytime user changes
    //this useEffect block will run

    useEffect(()=>{
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]) //will clear error message
    //everytime the user changes either password user or match field
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        //the only thing preventing the form from being
        //submitted is the button, which can be enabled
        //via js. so extra checks can be placed here to
        //guarantee that the info submitted will be correct
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if(!v1 || !v2){
            setErrMsg("Invalid Entry");
            return;
        }
    }

    return(
        <section>
            <p ref={errRef} className = {errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            {//if the error message exists show it, if not hide it offscreen,
            //note how display none is not used
            }
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                    <span className={validName ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck}/>
                        {//if the username is valid display fontawesome check
                        }
                    </span>
                    <span className={validName || !user ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes}/>
                        {//if the name is valid or if the field is empty hide the x
                        }
                    </span>
                </label>

                <input
                    type="text"
                    id="username"
                    ref={userRef} //this element is focused because
                    //we useeffected it to be focused on first render,
                    //so we are making this input be focused on render via userRef
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)} //ties the input to the user state
                    required
                    aria-invalid={validName ? "false" : "true"}
                    //tells whether some input is valid or not
                    aria-describedby="uidnote"
                    //ties the current element with the id
                    //of another element containing extra info
                    //for users that might need it,
                    //in this case we are using it for instructions
                    //on how the username should be formatted.
                    //note that aria components are user-accesbility
                    //oriented
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                />
                <p id="uidnote" className={userFocus && user && !validName
                ? "instructions" : "offscreen"}>
                {//if user field is focused on, if there is any typing in the field
                // and if the name is invalid, show instructions
                }
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    4 to 24 characters.<br/>
                    Must begin with a letter.<br/>
                    Letters, numbers, underscores, hyphens allowed.
                </p>

                <label htmlFor="password">
                    Password:
                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </label>

                <input
                    type="password"
                    id="password"
                    onChange={ (e) => setPwd(e.target.value)}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.<br/>
                    Must include upper and lowercase letters, a number and <br/>
                    a special character.
                </p>

                <label htmlFor="confirm_pwd">
                    Confirm Password:
                    <span className={validMatch && matchPwd ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>
                    <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>

                <input
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Passwords must match.
                </p>

                <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
            </form>
            <p>
                Already registered?<br/>
                <span className="line">
                    {/* router link here */}
                    <a href="#">Sign in</a>
                </span>
            </p>

        </section>
    )
}

export default Register
