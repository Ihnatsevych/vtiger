<?php


namespace FlexSuite;


class Security
{
    public function requireClientCertificates()
    {
        $client_verify = $this->haveValidCertificate();

        if ($client_verify == false) {
            \Vtiger_Session::init();
            $whitelist = \Vtiger_Session::get('certauthwhiltelist');

            if($whitelist === 1) return true;

            $redirUrl = \FlexSuite\Config::get('invalidredirecturl', 'https://www.google.com');

            header("HTTP/1.1 301 Moved Permanently");
            header("Location: " . $redirUrl);
            exit();
        }
        $dn = $_SERVER['HTTP_X_SSL_CLIENT_S_DN'];

        $parts = explode(',', $dn);

        // Take third part and skip first chars
        $OU = substr($parts[3], 3);

        $certKey = \FlexSuite\Config::get('certkey', '');
        if(empty($certKey)) {
            \FlexSuite\Config::set('certkey', sha1(microtime(true).mt_rand(100000,999999)), true);
        }
        //$url = parse_url(\VtigerConfig::get('site_URL'));

        // Check if Certificate is for this System
        if ($OU != $certKey) {
            \Vtiger_Session::init();
            $whitelist = \Vtiger_Session::get('certauthwhiltelist');

            if($whitelist === 1) return true;

            $redirUrl = \FlexSuite\Config::get('invalidredirecturl', 'https://www.google.com');

            header("HTTP/1.1 301 Moved Permanently");
            header("Location: " . $redirUrl);
            exit();
        }
        unset($certKey);
    }

    public function haveValidCertificate()
    {
        return !empty($_SERVER['HTTP_X_SSL_CLIENT_VERIFY']) && $_SERVER['HTTP_X_SSL_CLIENT_VERIFY'] == 'SUCCESS';
    }
}
