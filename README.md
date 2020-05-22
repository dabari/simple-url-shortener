# Simple URL-Shorter

## Benutzung

Die Dateien in den Serververzeichnis kopieren und die URL-Zuordnung in der Datei `mapping.php` vornehmen.
Z.B.:

``` php
$urlMapping = array(
  "url1" => "https://www.youtube.com/watch?v=9ryBJSbCqWw&list=PLRkXN1HP7lKtZCH29DQof93Me9fT-FGQ6",
  "url2" => "https://www.youtube.com/watch?v=QVz46N4I-zk"
);
```

Dankach können die kurze URLs wie folgt aufgerufen werden (die Groß-Kleinschreibung ist dabei egal):

* `https://menserver.de/url1`
* `https://menserver.de/URL2`
  