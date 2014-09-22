# kerk = ActiveSupport::FileUpdateChecker.new([
#   "#{Rails.root}/app/assets/javascripts/components/hello_message.js",
# ], {}) do
#   p 'SHOULD BE EXECUTED IF CHANGED'
# end

# p Rails.application.configuration.file_watcher

paths = [
  "#{Rails.root}/app/assets/javascripts/components/hello_message.js",
]

watcher = Rails.application.config.file_watcher.new(paths) { p 'RELOAD JS BITCH' }

Rails.application.reloaders << watcher

ActionDispatch::Reloader.to_prepare do
  watcher.execute_if_updated
end
