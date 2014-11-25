name "webserver_db_development"
description "Development webserver and database role"
run_list  "recipe[apt]",
          "recipe[nginx]",
          "recipe[git]",
          "recipe[vim]",
          "recipe[build-essential::default]",
          "recipe[rbenv::default]",
          "recipe[rbenv::ruby_build]",
          "recipe[user]",
          "recipe[mongodb::default]",
          "recipe[nginx-config]"