require "bundler/capistrano"
require 'capistrano/ext/multistage'

# Read from local system your gemset
set :rvm_ruby_string, ENV['GEM_HOME'].gsub(/.*\//,"")
set :rvm_install_ruby, :install
g
set :domain, "my_domain"
set :application, "One"
set :scm, :git
set :repository, "add_repository_here"
set :stages, ['staging', 'production']
set :default_stage, 'staging'

set :user, "user"
set :group, "user"
set :use_sudo, false

set :deploy_via, :copy
set :copy_strategy, :export

namespace :deploy do

  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end

  desc "share config files on each release "
  task :symlink_shared do
    run "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
  end

  desc "Install the bundle"
  task :bundle do
    run "bundle install --gemfile #{release_path}/Gemfile --without development test"
  end

  desc "drop and create database"
  task :drop_create_db, :roles => :app do
    run "cd #{current_path} && bundle exec rake db:migrate:reset RAILS_ENV='production'"
  end

  namespace :assets do
    desc "Precompile assets on local machine and upload them to the server."
    task :precompile, :roles => :web, :except => {:no_release => true} do
      run_locally "bundle exec rake assets:precompile"
      find_servers_for_task(current_task).each do |server|
        run_locally "rsync -vr --exclude='.DS_Store' public/assets #{user}@#{server.host}:#{shared_path}/"
      end
    end
  end

end

desc "Download the production log file"
task :get_log do
  get "#{current_path}/log/production.log", \
  "#{Time.now.strftime("%Y%m%d%H%M")}.production.log"
end

desc "Upload the host-specific config files to the server"
task :upload_config_files do
  run "mkdir -p #{shared_path}/config"
  upload "config/database.yml", "#{shared_path}/config/database.yml"
end

namespace :logs do
  desc "Tail the Rails log for the current stage"
  task :tail, :roles => :app do
    stream "tail -f #{current_path}/log/production.log"
  end
end

#RVM recipes provided by rvm-capistrano gem
before 'deploy:setup', 'rvm:install_rvm'
before 'deploy:setup', 'rvm:install_ruby' # install Ruby and create gemset.
require "rvm/capistrano"

after "deploy:update_code", "deploy:bundle"
after "deploy:update_code", "deploy:symlink_shared"
after "deploy:update_code", "deploy:cleanup" # keep only the last 5 releases
after "deploy:update", "deploy:migrate"
after "deploy:update", "deploy:restart"
