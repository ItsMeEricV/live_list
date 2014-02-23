%if mode == 'definition':
Balanced\Customer->holds()

% else:
<?php

require(__DIR__ . '/vendor/autoload.php');

Httpful\Bootstrap::init();
RESTful\Bootstrap::init();
Balanced\Bootstrap::init();

Balanced\Settings::$api_key = "ak-test-1p1Tsac7gHeMQowL2seB7ieliuAJAufyq";

$customer = Balanced\Customer::get("/v1/customers/CUcKunVjtvF7v8JlC5ZBdeM");
$holds = $customer->holds->query()->all();

?>
%endif