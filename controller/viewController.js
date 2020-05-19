exports.getIntroduction = (req, res, next) => {
  res.status(200).render('intro', {
    title: 'quizApp'
  });
};

exports.signIn = (req, res, next) => {
  res.status(200).render('signIn');
};
exports.signUp = (req, res, next) => {
  res.status(200).render('signUp');
};

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
  res.status(200).render('admin_bot_manager', { bot });
};

exports.newbot = (req, res, next) => {
  res.status(200).render('admin_newBot');
};
