/* eslint-disable */

import axios from 'axios';
import { post } from 'jquery';

('use strict');

export const validate = (input) => {
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
    if ($(input).val().trim() == '') {
      return false;
    }
  }
};

export const showValidate = (input) => {
  var thisAlert = $(input).parent();

  $(thisAlert).addClass('alert-validate');
};

export const hideValidate = (input) => {
  var thisAlert = $(input).parent();

  $(thisAlert).removeClass('alert-validate');
};

// ======================================================
// [sginUp]

export const signUp = async (user) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/user/signup',
      data: user,
    });

    if (res.data.status === 'success') {
      alert('You successfully signed up');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
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
      url: 'http://localhost:3000/api/v1/user/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      alert('You successfully logged in');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
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
      url: 'http://localhost:3000/api/v1/user/logout',
    });
    if (res.data.status === 'success') {
      alert('you logged out successfuly');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    alert('error logging out! try again.');
  }
};

/*========================================================
  [send message] */
export const sendMessage = async (message) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/message',
      data: message,
    });
    if (res.data.status === 'success') {
      alert('پیام ارسال شد.');
      $('input[name="name"]').val('');
      $('input[name="email"]').val('');
      $('textarea[name="message"]').val('');
    }
  } catch (e) {
    console.log('error: ', e);
    alert('پیام ارسال نشد. دوباره امتحان کنید');
  }
};

/*========================================================
  [bot start] */

export const botStart = async (pageName) => {
  try {
    const res = await axios({
      method: 'get',
      url: `http://localhost:3000/api/v1/bot/start/${pageName}`,
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

export const botStop = async (pageName) => {
  try {
    const res = await axios({
      method: 'get',
      url: `http://localhost:3000/api/v1/bot/stop/${pageName}`,
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

export const newbot = async (bot) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/bot/create',
      data: bot,
    });
    console.log('status code: ', res.data);
    if (res.data.status === 'success') {
      alert(res.data.message);
      window.setTimeout(() => {
        location.assign('/mybots');
      }, 500);
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
    const res = await axios({
      method: 'patch',
      url: `http://localhost:3000/api/v1/bot/update-My-Bot/${id}`,
      data: bot,
    });
    if (res.data.status === 'success') {
      alert('ربات اپدیت شد.');
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    alert('خطا در اپدیت ربات.');
  }
  $('#updatebot').prop('disabled', false);
  $('#updatebot .rotator').hide();
};

//---------------------------------------------
//[discount check]

export const checkDiscount = async (code, price) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/discount/check',
      data: { code, price },
    });
    if (res.data.status === 'success') {
      $('#price').css('textDecoration', 'line-through');
      $('#price2').text(` ${res.data.newPrice} تومن`);
      data.price2 = res.data.newPrice;
    }
  } catch (e) {
    console.log('error:', e.response.data.message);
    alert('این کد قابل استفاده نمیباشد.');
  }
  $('#discountCheck').prop('disabled', false);
  $('#discountCheck .rotator').hide();
};

//---------------------------------------------
//[pay]

export const pay = async (serviceCode) => {
  try {
    const res = await axios({
      method: 'get',
      url: `http://localhost:3000/api/v1/bill/pay/?serviceCode=${serviceCode}`,
    });
    if (res.data.status === 'success') {
      console.log('success');
      console.log(res.data.session);
      window.location.replace(res.data.session.url);
    }
  } catch (e) {
    console.log('error:', e.response.data.message);
    alert('مشکلی در پرداخت وجود دارد.');
  }
  $('#pay').prop('disabled', false);
  $('#pay').text('پرداخت');
};

//---------------------------------------------
//[extension]
export const extension = async (serviceCode, botPagename) => {
  try {
    const res = await axios({
      method: 'get',
      url: `http://localhost:3000/api/v1/bill/pay/?serviceCode=${serviceCode}&botPagename=${botPagename}`,
    });
    if (res.data.status === 'success') {
      console.log('success');
      console.log(res.data.session);
      window.location.replace(res.data.session.url);
    }
  } catch (e) {
    console.log('error:', e.response.data.message);
    alert('مشکلی در تمدید اکانت وجود دارد.');
  }
};
