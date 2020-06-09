const jsStringify = require('js-stringify');

exports.getIntroduction = (req, res, next) => {
  res.status(200).render('intro', {
    title: 'quizApp'
  });
};

exports.signIn = (req, res, next) => {
  res.status(200).render('signIn');
};

exports.signUp = (req, res, next) => {
  res.status(200).render('signIn');
};

exports.pricing = (req, res, next) => {
  res.status(200).render('pricing')
}

exports.service = (req, res, next) => {
  const {type} = req.params
  const data = type === 'standard'?{name:'استاندارد',price: 100000, number: 1}:type === 'silver'?{name:'نقره‌ای',price: 200000, number: 3}:{name:'طلایی',price: 300000, number: 5}
  if(req.user.firstTime && req.user.introducer){
    data.priec2 = data.price * 80 / 100
  }
  res.status(200).render('service', {jsStringify,
    data
  })
}

exports.myProfile = (req, res, next) => {
  res.status(200).render('admin_profile');
};

exports.bot = (req, res, next) => {
  res.status(200).render('admin_bot');
};

exports.botManager = (req, res, next) => {
  const { id } = req.params;
  const bot = req.user.bots.find(b => {
    return b.pageName === id;
  });
  if(!bot) {
    return next(
      new AppError('you do not have a bot with this name.', 401)
    );
  }
  res.status(200).render('admin_bot_manager', { bot });
};

exports.newbot = (req, res, next) => {
  res.status(200).render('admin_newBot');
};
