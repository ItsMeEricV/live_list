Vagrant.configure("2") do |config|

  require 'berkshelf/vagrant'

  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
  end

  #install latest chef version using vagrant-omnibus
  config.omnibus.chef_version = :latest

  config.vm.define :cue do |cue|
    cue.vm.box = "precise64"
    #cue.vm.box_url = "http://files.vagrantup.com/precise64.box"
   
    cue.vm.network :private_network, ip: "192.168.60.20"
    #cue.vm.network :public_network
    
    cue.berkshelf.enabled = true

    cue.vm.synced_folder "~/code/cue_tracker/", "/srv/website"
 
    #cue.vm.provision :shell, :inline => "aptitude install ruby1.9.1-dev"
    #cue.vm.provision :shell, :inline => "gem install chef --version 11.8.2 --no-rdoc --no-ri --conservative"

    cue.vm.provision :chef_solo do |chef|
      #chef.add_recipe "apt"
      #chef.add_recipe "nginx-config"

      chef.json = {
        "mysql" => {
            "server_root_password" => "the_password",
            "server_debian_password" => "the_password",
            "server_repl_password" => "the_password"
        }
      }

      chef.run_list = [
        "recipe[nginx-config]"
      ]

    end

  end
end