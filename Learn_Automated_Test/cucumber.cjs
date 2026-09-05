module.exports = {
  default: {
    paths: ['cucumber/features/**/*.feature'],
    require: [
      'cucumber/support/world.js',
      'cucumber/support/**/*.js',
      'cucumber/step_definitions/**/*.js'
    ]
  }
};