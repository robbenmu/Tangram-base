<?php
for ($i=0; $i < 100; $i++) { 
    sleep(1);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://vyingli.com/?fr=fuck");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-FORWARDED-FOR:8.8.8.8', 'CLIENT-IP:8.8.8.8'));  //构造IP
    curl_setopt($ch, CURLOPT_REFERER, "http://www.gosoa.com.cn/ ");   //构造来路
    curl_setopt($ch, CURLOPT_HEADER, 1);
    $out = curl_exec($ch);
    curl_close($ch);
}

?>