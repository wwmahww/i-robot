/* eslint-disable */
import 'core-js/stable';
import "regenerator-runtime/runtime";
import * as funs from './funs';
import $ from 'jquery';

// DOM ELEMENTS
var input = $('.validate-input .input100');
// VALUES
var showPass = 0;

// functions
const getBotData = () => {
  const bot = {};
  bot.pageName = $('input[name="pageName"]').val();
  bot.pagePassword = $('input[name="pagePassword"]').val();
  bot.botPace = $('#botpace').text();
  bot.followPrivate = $('#followPrivate').prop('checked');
  bot.likeLastPost = $('#likeLastPost').prop('checked');
  bot.targetPages = $('textarea[name="targetPages"]')
    .val()
    .split(' ')
    .filter(el => {
      if (el !== ' ') return el;
    });
  bot.targetTags = $('textarea[name="targetTags"]')
    .val()
    .split(' ')
    .filter(el => {
      if (el !== ' ') return el;
    });
  bot.comments = $('textarea[name="comments"]')
    .val()
    .split('*')
    .filter(el => {
      if (el !== ' ') return el;
    });
  bot.directTexts = $('textarea[name="directTexts"]')
    .val()
    .split('*')
    .filter(el => {
      if (el !== ' ') return el;
    });
  bot.whiteList = $('textarea[name="whitelist"]')
    .val()
    .split(' ')
    .filter(el => {
      if (el !== ' ') return el;
    });

  return bot;
};

// DELEGATION
console.log('heelllo form parcel');
/*==================================================================
    [ Focus input ]*/
$('.input100').each(function() {
  $(this).on('blur', function() {
    if (
      $(this)
        .val()
        .trim() != ''
    ) {
      $(this).addClass('has-val');
    } else {
      $(this).removeClass('has-val');
    }
  });
});

$('.dropdown-menu').on('click', 'a', function() {
  console.log('clicked');
  $('#dropdownMenuButton').text($(this).text());
  $('#dropdownMenuButton').val($(this).text());
});

/*==================================================================
    [ Validate ]*/
$('.validate-form').on('submit', function() {
  var check = true;

  for (var i = 0; i < input.length; i++) {
    if (validate(input[i]) == false) {
      funs.showValidate(input[i]);
      check = false;
    }
  }

  return check;
});

$('.validate-form .input100').each(function() {
  $(this).focus(function() {
    funs.hideValidate(this);
  });
});

/*==================================================================
    [ Show pass ]*/
$('.btn-show-pass').on('click', function() {
  if (showPass == 0) {
    $(this)
      .next('input')
      .attr('type', 'text');
    $(this).addClass('active');
    showPass = 1;
  } else {
    $(this)
      .next('input')
      .attr('type', 'password');
    $(this).removeClass('active');
    showPass = 0;
  }
});

/*==================================================================
    [ sginup ]*/
$('#signup').click(e => {
  e.preventDefault();
  $('#signup').prop('disabled', true);
  $('.rotator').show();
  const username = $('input[name="username"]').val();
  const email = $('input[name="email"]').val();
  const password = $('input[name="password"]').val();
  const passwordConfirm = $('input[name="passwordConfirm"]').val();
  funs.signUp(username, email, password, passwordConfirm);
});

/*==================================================================
    [ Login ]*/
$('#signin').click(e => {
  e.preventDefault();
  $('#signin').prop('disabled', true);
  $('.rotator').show();
  const email = $('input[name="email"]').val();
  const password = $('input[name="password"]').val();
  funs.login(email, password);
});

/*==================================================================
    [ Logout ]*/
$('a.logout-btn').on('click', e => {
  e.preventDefault();
  funs.logout();
});

/*==================================================================
  [Bot functions]*/
$('#trigger').on('click', e => {
  e.preventDefault();
  $('#trigger').prop('disabled', true);
  $('#trigger  .rotator').show();
  const act = $('#trigger').attr('name');
  const pageName = $('h1').text();
  act === 'start' ? funs.botStart(pageName) : funs.botStop(pageName);
});

/*==================================================================
    [ new bot ]*/
$('#newbot').click(e => {
  e.preventDefault();
  $('#newbot').prop('disabled', true);
  $('#newbot .rotator').show();
  const bot = getBotData();
  funs.newbot(bot);
});
/*==================================================================
    [ update bot ]*/
$('#updatebot').click(e => {
  e.preventDefault();
  $('#updatebot').prop('disabled', true);
  $('#updatebot .rotator').show();
  console.log('clicked');
  const id = $('input[name="pageName"]').val();
  const bot = getBotData();
  funs.updatebot(id, bot);
});
