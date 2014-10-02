files = [
  "#{Rails.root}/app/assets/build/app.js",
]

watcher = Rails.application.config.file_watcher.new(files) do
  p "reload app.js"
end

Rails.application.reloaders << watcher

ActionDispatch::Reloader.to_prepare do
  watcher.execute_if_updated
end
