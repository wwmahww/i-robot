/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as funs from './funs';
import $ from 'jquery';

// DOM ELEMENTS
var input = $('.validate-input .input100');
// VALUES
var showPass = 0;

// functions
const getBotData = () => {
  const bot = {};
  bot.timeLeft = timeLimit;
  bot.pageName = $('input[name="pageName"]').val();
  bot.pagePassword = $('input[name="pagePassword"]').val();
  bot.botPace = $('#botpace').text();
  bot.followPrivate = $('#followPrivate').prop('checked');
  bot.likeLastPost = $('#likeLastPost').prop('checked');
  bot.targetPages = $('textarea[name="targetPages"]')
    .val()
    .split(' ')
    .filter((el) => {
      if (el !== ' ') return el;
    });
  bot.targetTags = $('textarea[name="targetTags"]')
    .val()
    .split(' ')
    .filter((el) => {
      if (el !== ' ') return el;
    });
  bot.comments = $('textarea[name="comments"]')
    .val()
    .split('*')
    .filter((el) => {
      if (el !== ' ') return el;
    });
  bot.directTexts = $('textarea[name="directTexts"]')
    .val()
    .split('*')
    .filter((el) => {
      if (el !== ' ') return el;
    });
  bot.whiteList = $('textarea[name="whitelist"]')
    .val()
    .split(' ')
    .filter((el) => {
      if (el !== ' ') return el;
    });

  return bot;
};

// DELEGATION
console.log('heelllo form parcel');
/*==================================================================
    [ Focus input ]*/
$('.input100').each(function () {
  $(this).on('blur', function () {
    if ($(this).val().trim() != '') {
      $(this).addClass('has-val');
    } else {
      $(this).removeClass('has-val');
    }
  });
});

$('.dropdown-menu').on('click', 'a', function () {
  console.log('clicked');
  $('#dropdownMenuButton').text($(this).text());
  $('#dropdownMenuButton').val($(this).text());
});

/*==================================================================
    [ Validate ]*/
$('.validate-form').on('submit', function () {
  var check = true;

  for (var i = 0; i < input.length; i++) {
    if (validate(input[i]) == false) {
      funs.showValidate(input[i]);
      check = false;
    }
  }

  return check;
});

$('.validate-form .input100').each(function () {
  $(this).focus(function () {
    funs.hideValidate(this);
  });
});

/*==================================================================
    [ Show pass ]*/
$('.btn-show-pass').on('click', function () {
  if (showPass == 0) {
    $(this).next('input').attr('type', 'text');
    $(this).addClass('active');
    showPass = 1;
  } else {
    $(this).next('input').attr('type', 'password');
    $(this).removeClass('active');
    showPass = 0;
  }
});

/*==================================================================
    [ sginup ]*/
$('#signup').click((e) => {
  e.preventDefault();
  $('#signup').prop('disabled', true);
  $('.rotator').show();
  const user = {};
  user.name = $('input[name="name"]').val();
  user.username = $('input[name="username"]').val();
  user.email = $('input[name="email"]').val();
  user.password = $('input[name="password"]').val();
  user.passwordConfirm = $('input[name="passwordConfirm"]').val();
  user.introducer = $('input[name="introducer"]').val();
  console.log('user: ', user);
  funs.signUp(user);
});

/*==================================================================
    [ Login ]*/
$('#signin').click((e) => {
  e.preventDefault();
  $('#signin').prop('disabled', true);
  $('.rotator').show();
  const email = $('input[name="email1"]').val();
  const password = $('input[name="password1"]').val();
  console.log(email, password);
  funs.login(email, password);
});

/*==================================================================
    [ Logout ]*/
$('.logout').click((e) => {
  console.log('its logout');
  e.preventDefault();
  funs.logout();
});

/*==================================================================
    [ send message ]*/
$('#sendMessage').click((e) => {
  e.preventDefault();
  const message = {};
  message.name = $('input[name="name"]').val();
  message.email = $('input[name="email"]').val();
  message.message = $('textarea[name="message"]').val();
  console.log('message: ', message);

  funs.sendMessage(message);
});

/*==================================================================
  [Bot functions]*/
$('#trigger').on('click', (e) => {
  e.preventDefault();
  $('#trigger').prop('disabled', true);
  $('#trigger  .rotator').show();
  const act = $('#trigger').attr('name');
  const pageName = $('h1').text();
  act === 'start' ? funs.botStart(pageName) : funs.botStop(pageName);
});

/*==================================================================
    [ new bot ]*/
$('#newbot').click((e) => {
  e.preventDefault();
  $('#newbot').prop('disabled', true);
  $('#newbot .rotator').show();
  const bot = getBotData();
  funs.newbot(bot);
});
/*==================================================================
    [ update bot ]*/
$('#updatebot').click((e) => {
  e.preventDefault();
  $('#updatebot').prop('disabled', true);
  $('#updatebot .rotator').show();
  console.log('clicked');
  const id = $('input[name="pageName"]').val();
  const bot = getBotData();
  funs.updatebot(id, bot);
});

/*==================================================================
    [discount check ]*/
$('#discountCheck').click((e) => {
  e.preventDefault();
  $('#discountCheck').prop('disabled', true);
  $('#discountCheck .rotator').show();
  const code = $('input[name="discountCode"]').val();
  console.log(code);
  console.log(service);
  funs.checkDiscount(code, service.price);
});

/*==================================================================
  [pay ]*/
$('#pay').click((e) => {
  e.preventDefault();
  $('#pay').prop('disabled', true);
  e.target.textContent = '. . . درحال انتقال';
  console.log('code: ', service);
  console.log('code type: ', typeof service.code);
  funs.pay(service.code);
});

/*==================================================================
    [ Extension ]*/

$('.extension').click((e) => {
  e.preventDefault();
  const serviceCode = e.target.name;
  const botPagename = bot.pageName;
  funs.extension(serviceCode, botPagename);
});

/*==================================================================
    [ username checker ]*/
$('input[name="username"]').keyup((e) => {
  const username = e.target.value;
  console.log('username: ', username);
  funs.usernameChecher(username);
});

/*==================================================================
    [ edit name and email ]*/
$('#edit').click((e) => {
  e.preventDefault();
  $('input[name="name"').prop('disabled', false);
  $('input[name="email"').prop('disabled', false);
  $('#save').show();
  $('#cancel1').show();
});

$('#save').click((e) => {
  e.preventDefault();
  $('.rotator').show();
  const name = $('input[name="name"]').val();
  const email = $('input[name="email"]').val();
  funs.saveEdit(name, email);
});

/*==================================================================
    [ change password ]*/
$('#editPassword').click((e) => {
  e.preventDefault();
  $('.changePassword').show();
  $('#savePassword').show();
  $('#cancel2').show();
});

$('#savePassword').click((e) => {
  e.preventDefault();
  const currentPassword = $('input[name="currentPassword"]').val();
  const newPassword = $('input[name="newPassword"]').val();
  const passwordConfirm = $('input[name="passwordConfirm"]').val();
  if (newPassword & (newPassword === passwordConfirm)) {
    funs.changePassword(currentPassword, newPassword, passwordConfirm);
  } else {
    alert('پسورد و تکرار پسورد یکسان نیستند');
  }
});

/*==================================================================
    [ password recovery ]*/
$('#passwordRecovery').click((e) => {
  e.preventDefault();
  const email = $('input[name="email"]').val();
  funs.forgetPassword(email);
});

$('#resetPassword').click((e) => {
  e.preventDefault();
  console.log('clicked on reset password button');
  const password = $('input[name="password"]').val();
  const passwordConfirm = $('input[name="passwordConfirm"]').val();
  if (!password || !passwordConfirm) {
    alert('پسورد و تکرار پسورد نمیتواند خالی باشد');
    return;
  }
  funs.resetPassword(token, password, passwordConfirm);
});

/*==================================================================
    [ cancel edit name and email and password]*/
$('#cancel1').click((e) => {
  e.preventDefault();
  $('input[name="name"').prop('disabled', true);
  $('input[name="email"').prop('disabled', true);
  $('#save').hide();
  $('#cancel1').hide();
});

$('#cancel2').click((e) => {
  $('.changePassword').hide();
  $('#savePassword').hide();
  $('#cancel2').hide();
});

/*==================================================================
    [ admin login]*/

$('#adminLogin').click((e) => {
  e.preventDefault();
  const email = $('input[name="email"]').val();
  const password = $('input[name="password"]').val();
  funs.adminLogin(email, password);
});
