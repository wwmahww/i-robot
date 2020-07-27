/* eslint-disable */

import axios from 'axios';
import { post } from 'jquery';
import { token } from 'morgan';
import { bot } from '../../controller/viewController';

('use strict');

// Get tables ready
export const getTable = (format) => {
  // Message table-----------
  if ($('#message_table').length) {
    console.log('message table');
    var table = $('#message_table').DataTable({
      data: messages,
      columns: [
        {
          className: 'details-control',
          orderable: false,
          data: null,
          defaultContent: '',
        },
        { data: 'name' },
        { data: 'email' },
        { data: 'phone' },
      ],
      order: [[1, 'asc']],
    });
    // Submessage table
    $('#message_table tbody').on('click', 'td.details-control', function () {
      var tr = $(this).closest('tr');
      var row = table.row(tr);

      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
      } else {
        // Open this row
        row.child(format(row.data())).show();
        tr.addClass('shown');
      }
    });
    // Bot table----------
  } else if ($('#bot_table').length) {
    console.log('bot table');
    $('#bot_table').DataTable({
      data: bots,
      columns: [{ data: 'pageName' }, { data: 'owner' }, { data: 'daysLeft' }],
      order: [[1, 'asc']],
    });
    // Bill table----------
  } else if ($('#bill_table').length) {
    console.log('bill table');
    let table = $('#bill_table').DataTable({
      data: bills,
      columns: [
        {
          className: 'details-control',
          orderable: false,
          data: null,
          defaultContent: '',
        },
        { data: 'service' },
        { data: 'refID' },
        { data: 'userEmail' },
        { data: 'amount' },
        { data: 'isPayed' },
      ],
      order: [[1, 'asc']],
    });
    // Submessage table
    $('#bill_table tbody').on('click', 'td.details-control', function () {
      var tr = $(this).closest('tr');
      var row = table.row(tr);

      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
      } else {
        // Open this row
        row.child(format(row.data())).show();
        tr.addClass('shown');
      }
    });
    // User table----------
  } else if ($('#user_table').length) {
    console.log('user table');
    $('#user_table').DataTable({
      data: users,
      columns: [
        { data: 'name' },
        { data: 'username' },
        { data: 'email' },
        { data: 'bots.length' },
      ],
      order: [[1, 'asc']],
    });
  }
};

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
      console.log('data:', res.data);
      $('#price').css('textDecoration', 'line-through');
      $('#price2').text(` ${res.data.newPrice} تومن`);
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

export const pay = async (serviceCode, offCode) => {
  try {
    const res = await axios({
      method: 'get',
      url: `http://localhost:3000/api/v1/bill/pay/?serviceCode=${serviceCode}&offCode=${offCode}`,
    });
    if (res.data.status === 'success') {
      console.log('success');
      console.log(res.data.session);
      window.location.replace(res.data.session.url);
    }
  } catch (e) {
    console.log('error: ', e);
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

//---------------------------------------------
//[username checker]
export const usernameChecher = async (username) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/user/usernameChecker',
      data: { username },
    });
    if (res.status === 200) {
      console.log('true');
      $('#message').text('نام کاربری مورد تاییداست');
    }
  } catch (e) {
    if (e.response.status === 422) {
      console.log('false');
      $('#message').text('نام کاربری قبلا استفاده شده است');
    }
  }
};

//---------------------------------------------
//[save edited name or email]

export const saveEdit = async (name, email) => {
  try {
    const res = await axios({
      method: 'patch',
      url: 'http://localhost:3000/api/v1/user/updateMe',
      data: { name, email },
    });
    if (res.data.status === 'success') {
      alert('اطلاعات به درستی ذخیره شد');
      $('input[name="name"').prop('disabled', true);
      $('input[name="email"').prop('disabled', true);
      $('#save').hide();
      $('#cancel1').hide();
    }
  } catch (e) {
    alert('مشکلی در ذخیره تغییرات دجود داشت');
    console.log('error: ', e.message);
  }
  $('.rotator').hide();
};

//---------------------------------------------
//[save changed password]

export const changePassword = async (
  currentPassword,
  newPassword,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'patch',
      url: 'http://localhost:3000/api/v1/user/updateMyPassword',
      data: { currentPassword, newPassword, passwordConfirm },
    });
    if (res.data.status === 'success') {
      alert('پسورد با موفقیت تغییر کرد');
      $('.changePassword').hide();
      $('#savePassword').hide();
      $('#cancel2').hide();
    }
  } catch (e) {
    console.log(e.response.data.message);
    alert(e.response.data.message);
  }
};

//---------------------------------------------
//[forgetPassword]
export const forgetPassword = async (email) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/user/forgetPassword',
      data: { email },
    });
    if (res.data.status === 'success') {
      $('#recovery').hide();
      $('#message').show();
    }
  } catch (e) {
    alert('این ایمیل در سیستم ثبت نشده است');
  }
};

export const resetPassword = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `http://localhost:3000/api/v1/user/resetPassword/${token}`,
      data: { password, passwordConfirm },
    });
    if (res.data.status === 'success') {
      alert('رمز با موفقیت تغییر کرد');
      setTimeout(() => {
        window.location.replace('http://localhost:3000/');
      }, 5);
    }
  } catch (e) {
    console.log('error: ', e.response.data.message);
    alert(e.response.data.message);
  }
};

//---------------------------------------------
//[adminLogin]
export const adminLogin = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/user/login',
      data: { email, password, role: 'admin' },
    });
    if (res.data.status === 'success') {
      alert('you are loged in successfully');
      window.location.replace('http://localhost:3000/godPanel');
    }
  } catch (e) {
    console.log(e.response.data.message);
    alert(e.response.data.message);
  }
};

//---------------------------------------------
//[saveUser]
export const saveUser = async (user, id) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `http://localhost:3000/api/v1/user/${id}`,
      data: user,
    });
    if (res.data.status === 'success') {
      alert('data saved');
    }
  } catch (e) {
    console.log('error:', e.response.data);
    alert(e.response.data.message);
  }
};
//---------------------------------------------
//[saveBot]
export const saveBot = async (bot, id) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `http://localhost:3000/api/v1/bot/${id}`,
      data: bot,
    });
    if (res.data.status === 'success') {
      alert('data saved');
    }
  } catch (e) {
    console.log('error:', e.response.data);
    alert(e.response.data.message);
  }
};
