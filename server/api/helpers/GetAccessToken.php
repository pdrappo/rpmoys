<?php

function GetAccessToken($meli){
	$app = \Slim\Slim::getInstance();

	$protocol = 'http://';
	$url = $protocol.$_SERVER['HTTP_HOST'].$app->request->getRootUri().$app->request->getResourceUri();

	$AuthUrl = $meli->getAuthUrl($url);

	if(isset($_GET['code']) || isset($_SESSION['access_token'])) {

		// If code exist and session is empty
		if(isset($_GET['code']) && !isset($_SESSION['access_token'])) {
			// If the code was in get parameter we authorize
			$oAuth = $meli->authorize($_GET['code'], $url);

			// Now we create the sessions with the authenticated user
			$_SESSION['access_token'] = $oAuth['body']->access_token;
			$_SESSION['expires_in'] = time() + $oAuth['body']->expires_in;
			$_SESSION['refresh_token'] = $oAuth['body']->refresh_token;

		} else {
			// We can check if the access token in invalid checking the time
			if(isset($_SESSION['expires_in']) < time()) {
				try {
					// Make the refresh proccess
					$refresh = $meli->refreshAccessToken();

					// Now we create the sessions with the new parameters
					$_SESSION['access_token'] = $refresh['body']->access_token;
					$_SESSION['expires_in'] = time() + $refresh['body']->expires_in;
					$_SESSION['refresh_token'] = $refresh['body']->refresh_token;
				} catch (Exception $e) {
				  	echo "Exception: ",  $e->getMessage(), "\n";
				}
			}
		}

	} else {
		$app->redirect($AuthUrl);
	}
}

/* Get Access Token */
$GetAccessToken = function ($meli) {
    return function () use ($meli) {
        GetAccessToken($meli);
    };
};