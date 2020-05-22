<?php
    // #######################################################
    // Darijo, 22.05.20 
    // Ein einfacher URL-Kurzungsdienst für die EGP-URLs
    // #######################################################
    require_once "mapping.php";

    $short = $_REQUEST['short'];
    $url = "";


    // Wir schauen so nach dem key...
    foreach($urlMapping as $key=>$value)
    {
        // ...damit es auch einen Treffer gibt wenn die klein-groß-schreibung nicht beachtet wurde
        if (strtolower($key) == strtolower($short)) {
            $url = $value;
        }
    } 

    // Wenn ein treffer vorhanden, machen wir die Umleitung...
    if (!empty($url)) {
        Header("HTTP/1.1 301 Moved Permanently");
        header("Location: ".$url."");
    } else {
        // ...sonst geben wir eine Seite mit der Fehlermeldung zurück.
        $html = "Fehler: kann die Seite nicht finden...";
    }
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>EGP Links</title>
    <link type="text/css" rel="stylesheet" href="style.css" />
    </head>
    <body>
     <div id="pagewrap">
     <h1>link<span class="r">egp</span></h1>
 
     <div class="body">
       <?= $html ?>
       <br /><br />
       <span class="back"><a href="https://www.eg-p.de">X</a></span>
     </div>
 
     </div>
    </body>
</html>