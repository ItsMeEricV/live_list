name             'nginx-config'
maintainer       'Eric Vierhaus'
maintainer_email 'ejvaudio@gmail.com'
license          'All rights reserved'
description      'Installs/Configures nginx-config'
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          '0.1.0'

depends 'nginx'
#depends 'nginx', '~> 2.2.0'
depends 'git'
depends 'vim'
depends 'nodejs'
# depends 'php'
# depends 'php-fpm'

