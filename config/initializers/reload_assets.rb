# directories = {
#   "#{Rails.root}/app/frontend" => [:coffee],
# }
#
# watcher = Rails.application.config.file_watcher.new([], directories) do
#   p "RELOADED FRONTEND COFFEE FILES"
# end
#
# Rails.application.reloaders << watcher
#
# ActionDispatch::Reloader.to_prepare do
#   watcher.execute_if_updated
# end
