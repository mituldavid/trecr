import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import UserBoardingImg from '../assets/UserBoardingImg.png';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../layout/Footer';

const Login = ({ login, isAuthenticated }) => {
  const recaptchaRef = React.createRef();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      recaptchaRef.current.reset();
      const token = await recaptchaRef.current.executeAsync();

      const body = JSON.stringify({ captcha: token });
      await axios.post('/api/auth/verifycaptcha', body, config);

      login(email, password);
    } catch (err) {
      toast.error('reCaptcha failed. Please try again');
    }
  };

  //Redirect if Logged In
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div className='signup-container'>
      <div className='ub-topbar'>
        <p className='ub-logo'>
          <Link to='/'>trecr</Link>
        </p>
        <p className='ub-logo-tag'>/ the • rec • room /</p>
      </div>
      <form onSubmit={onSubmit} className='login-form'>
        <h1 className='form-heading'>Log In</h1>
        <div className='form-grp'>
          <label className='form-label'>Email</label>
          <br />
          <input
            className='form-input'
            type='email'
            required={true}
            name='email'
            placeholder='Enter your email id'
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-grp'>
          <label className='form-label'>Password</label>
          <br />
          <input
            className='form-input frgt-pswrd-exp'
            type='password'
            required={true}
            name='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => onChange(e)}
          />
          <div className='frgt-pswrd'>
            <Link to='/user/forgotpassword'>Forgot your password?</Link>
          </div>
        </div>
        <input type='submit' className='submit-btn' value='Log In' />
        <p className='switch-form'>
          Don't have an account?{' '}
          <Link to='/signup'>
            <b>Sign Up</b>
          </Link>
        </p>
        <ReCAPTCHA
          ref={recaptchaRef}
          size='invisible'
          sitekey='6LcXD68ZAAAAAG3ynckKmUXFUEXamuQCSmUhHF5k'
        />
      </form>
      <div className='ub-image'>
        <img src={UserBoardingImg} alt='Sign up or login to trecr' />
      </div>
      <Footer />
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
