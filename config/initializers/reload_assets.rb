paths = [
  "#{Rails.root}/app/frontend/components/home/react_home.coffee",
]

watcher = Rails.application.config.file_watcher.new(paths) { p 'RELOAD JS BITCH' }

Rails.application.reloaders << watcher

ActionDispatch::Reloader.to_prepare do
  watcher.execute_if_updated
end
