import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserBoardingImg from '../assets/UserBoardingImg.png';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Footer from '../layout/Footer';

const ResendVerification = () => {
  const recaptchaRef = React.createRef();

  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resendLink = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email });
    try {
      await axios.post('/api/users/resendverification', body, config);
      toast.success('A verification email has been sent to your email id');
    } catch (err) {
      const errors = err.response.data.errors;
      if (err.response.status === 429)
        toast.error('You have made too many requests, please try again later.');
      else if (errors) {
        errors.forEach((error) => {
          toast.error(error.msg);
        });
      } else {
        toast.error('Request not valid');
      }
    }
  };

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

      resendLink();
    } catch (err) {
      toast.error('reCaptcha failed. Please try again');
    }
  };

  return (
    <div className='signup-container'>
      <div className='ub-topbar'>
        <p className='ub-logo'>
          <Link to='/'>trecr</Link>
        </p>
        <p className='ub-logo-tag'>/ the • rec • room /</p>
      </div>
      <form className='login-form' onSubmit={onSubmit}>
        <h1 className='form-heading verify-form'>Resend Verification Email</h1>
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
        <input type='submit' className='submit-btn' value='Resend' />
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

export default ResendVerification;
