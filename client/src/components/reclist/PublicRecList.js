import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PublicRecEntry from './PublicRecEntry';
import PublicRecShow from './PublicRecShow';
import Spinner from '../layout/Spinner';
import VerifyErrorIcon from '../assets/Icons/VerifyErrorIcon.svg';

import { getReclistByUsername } from '../../actions/reclist';
import { pinList } from '../../actions/pinnedlist';
import NavMenu from '../layout/NavMenu';
import PinIcon from '../assets/Icons/PinIcon.svg';
import { toast } from 'react-toastify';
import Footer from '../layout/Footer';

const PublicRecList = ({
  match,
  getReclistByUsername,
  pinList,
  reclist: { loading, error, viewlist },
  isAuthenticated,
}) => {
  useEffect(() => {
    getReclistByUsername(match.params.username);
  }, [getReclistByUsername, match.params.username]);
  const onClick = (id) => {
    isAuthenticated ? pinList(id) : toast.error('Log in to pin lists');
  };

  if (loading && viewlist === null) {
    return (
      <div className='spinner-container'>
        <Spinner />
      </div>
    );
  } else if (
    // error.msg === 'This user does not have any recommendations' ||
    // error.msg === 'This user does not exist' ||
    // error.msg === 'Internal Server Error' ||
    viewlist === null ||
    viewlist.r_list.length <= 0 ||
    viewlist.r_list === null
  ) {
    return (
      <Fragment>
        <div className='verify-container'>
          <div className='verify-topbar'>
            <p className='ub-logo verify-logo'>trecr</p>
            <p className='ub-logo-tag verify-logo'>/ the • rec • room /</p>
          </div>
          <div className='verify-msg'>
            <img
              src={VerifyErrorIcon}
              className='verify-icon'
              alt='InvalidLink'
            />
            <div className='verify-heading'>There's nothing here</div>
            <div className='verify-subhead'>
              This user either does not exist or doesn't have any
              recommendations yet.
            </div>
            <Link to='/' className='submit-btn verify-btn'>
              Head Back
            </Link>
          </div>
        </div>
      </Fragment>
    );
  } else if (viewlist !== null) {
    return (
      <Fragment>
        <NavMenu />
        <div className='user-rec-list'>
          <nav className='r-nav'>
            <div className='nav-logo'>
              <Link to='/' className='nav-logo-title'>
                trecr
              </Link>
              <div className='nav-logo-username'>
                @{viewlist && viewlist.user_id.username}
              </div>
            </div>
          </nav>
          <div className='rec-case'>
            <div className='rec-showcase'>
              <PublicRecShow />
            </div>
            <div className='rec-list'>
              <div className='rl-header'>
                <div className='rl-heading'>the.rec.list</div>{' '}
                <span
                  className='pin-list'
                  onClick={() => onClick(viewlist.user_id._id)}
                >
                  <img src={PinIcon} alt='Pin List' />
                </span>
                <div className='rl-subheading'>
                  {viewlist && viewlist.user_id.username}'s recommendations
                </div>
              </div>
              <div className='rl-grid'>
                <PublicRecEntry />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  } else {
    //@todo: Add Page Design
    return (
      <Fragment>
        <div className='verify-container'>
          <div className='verify-topbar'>
            <p className='ub-logo verify-logo'>trecr</p>
            <p className='ub-logo-tag verify-logo'>/ the • rec • room /</p>
          </div>
          <div className='verify-msg'>
            <img
              src={VerifyErrorIcon}
              className='verify-icon'
              alt='InvalidLink'
            />
            <div className='verify-heading'>All out of recommendations</div>
            <div className='verify-subhead'>
              This user either does not exist or doesn't have any
              recommendations yet.
            </div>
            <Link to='/' className='submit-btn verify-btn'>
              Head Back
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
};

PublicRecList.propTypes = {
  getReclistByUsername: PropTypes.func.isRequired,
  reclist: PropTypes.object.isRequired,
  pinList: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  reclist: state.reclist,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getReclistByUsername, pinList })(
  PublicRecList
);
