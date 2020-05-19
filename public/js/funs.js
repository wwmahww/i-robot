/* eslint-disable */

import axios from 'axios';

('use strict');

export const validate = input => {
  if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
    if (
      $(input)
        .val()
        .trim()
        .match(
          /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
        ) == null
    ) {
      return false;
    }
  } else {
    if (
      $(input)
        .val()
        .trim() == ''
    ) {
      return false;
    }
  }
};

export const showValidate = input => {
  var thisAlert = $(input).parent();

  $(thisAlert).addClass('alert-validate');
};

export const hideValidate = input => {
  var thisAlert = $(input).parent();

  $(thisAlert).removeClass('alert-validate');
};

// ======================================================
// [sginUp]

export const signUp = async (username, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/users/signup',
      data: {
        username,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      alert('You successfully signed up');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(`error: ${err.response.data.message}`);
    console.log(err);
  }
  $('#signup').prop('disabled', false);
  $('.rotator').hide();
};

/*========================================================
  [login] */

export const login = async (email, password) => {
  try {
    console.log(email, password);
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      alert('You successfully logged in');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(`error: ${err.response.data.message}`);
    console.log(err);
  }
  $('#signin').prop('disabled', false);
  $('.rotator').hide();
};

/*========================================================
  [logout] */

export const logout = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: 'http://localhost:3000/api/v1/users/logout'
    });
    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    alert('error logging out! try again.');
  }
};

/*========================================================
  [bot start] */

export const botStart = async pageName => {
  try {
    const res = await axios({
      method: 'get',
      url: `http://localhost:3000/api/v1/bots/start/${pageName}`
    });
    if (res.data.status === 'success') {
      alert('ربات روشن شد.');
      $('#trigger > span').text('توقف');
      $('#trigger')
        .removeClass('btn-success')
        .addClass('btn-danger')
        .attr({ name: 'stop' });
    } else {
      console.log(res.data);
    }
  } catch (err) {
    alert('خطا در روشن کردن ربات.');
  }
  $('#trigger').prop('disabled', false);
  $('#trigger  .rotator').hide();
};

//---------------------------------------------
//[stop bot]

export const botStop = async pageName => {
  try {
    const res = await axios({
      method: 'get',
      url: `http://localhost:3000/api/v1/bots/stop/${pageName}`
    });
    if (res.data.status === 'success') {
      alert('ربات متوقف شد.');
      $('#trigger > span').text('شروع');
      $('#trigger')
        .removeClass('btn-danger')
        .addClass('btn-success')
        .attr({ name: 'start' });
    }
  } catch (err) {
    alert('مشکل در متوقف کردن ربات.');
  }
  $('#trigger').prop('disabled', false);
  $('#trigger  .rotator').hide();
};
//---------------------------------------------
//[newBot]

export const newbot = async bot => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/bots/create',
      data: bot
    });
    console.log('status code: ', res.data);
    if (res.data.status === 'success') {
      alert(res.data.message);
      window.setTimeout(() => {
        location.assign('/bot');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response.data.message);
    alert(err.response.data.message);
  }
  $('#newbot').prop('disabled', false);
  $('#newbot .rotator').hide();
};
//---------------------------------------------
//[updateBot]

export const updatebot = async (id, bot) => {
  try {
    console.log('bot: ', bot);
    const res = await axios({
      method: 'patch',
      url: `http://localhost:3000/api/v1/bots/update-My-Bot/${id}`,
      data: bot
    });
    if (res.data.status === 'success') {
      alert('ربات اپدیت شد.');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    alert('خطا در اپدیت ربات.');
  }
  $('#updatebot').prop('disabled', false);
  $('#updatebot .rotator').hide();
};
