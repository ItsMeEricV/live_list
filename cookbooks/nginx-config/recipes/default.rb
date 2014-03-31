#
# Cookbook Name:: nginx-config
# Recipe:: default
#
# Copyright (C) 2014 Eric Vierhaus
# 
# All rights reserved - Do Not Redistribute
#

include_recipe 'apt'
include_recipe 'nginx'
include_recipe 'git'
include_recipe 'vim'
include_recipe 'nodejs'
include_recipe 'rvm::vagrant'
include_recipe 'rvm::system'
include_recipe 'redisio::install'
include_recipe 'redisio::enable'
 
 
begin
  t = resources("template[#{node['nginx']['dir']}/sites-available/default]")
  t.source "default-site.erb"
  t.cookbook "nginx-config"
rescue Chef::Exceptions::ResourceNotFound
  Chef::Log.warn "could not find template your template override!"
end


node.default['mysql']['server_root_password'] = "the_password"
node.default['mysql']['server_repl_password'] = "the_password"
node.default['mysql']['server_debian_password'] = "the_password"
node.default['mysql']['bind_address'] = "0.0.0.0"