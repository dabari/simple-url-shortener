# Simple URL-Shortener

Dies ist ein einfacher [URL-Shortener](https://de.wikipedia.org/wiki/Kurz-URL-Dienst). Im gegensatz zu anderen verfügbaren Diensten wie z.B. bit.ly, owl.ly oder lnkd.in kann der "Simple URL-Shortener" auf einem eigenen Server betrieben werden und somit z.B. DSGVO-konform innerhalb einer Organisation eingesetzt werden.

Da "Simple URL-Shortener" für die Verwaltung überschaubarer Anzahl der "Link-Mappings" gedach ist, speichert er alle notwendigen Daten in einer Datei. Somit ist der Einsatz von einer Datenbank auf dem Server nicht notwendig.

## Benutzung

Nach dem die entsprechende Zuordnung (das "Link-Mapping") zwischen dem **"Kurzen Link"** und der **"Langer Link"** auf dem Server eingepflegt wurde z.B.:

``` php
  "KurzerLink1"  => "https://www.youtube.com/watch?v=9ryBJSbCqWw&list=PLRkXN1HP7lKtZCH29DQof93Me9fT-FGQ6",
  "KurzerLink2"  => "https://www.youtube.com/watch?v=QVz46N4I-zk"
```

können die kurze URLs wie folgt aufgerufen werden (die Groß-Kleinschreibung ist dabei egal):

* `https://mein-server.de/KurzerLink1`
* `https://mein-srver.de/KurzerLink2`

## Bestandteile

Der "Simple URL-Shortener" besteht aus einem `Backend-` und aus einem `Frontend-Teil`.

### Backend

Das Backend ist mit PHP umgesetzt und besteht logisch aus zwei Teilen:

* **Teil 1** - ist ein "Controller" der die Verarbetung der **"Kurzen Link"** realisiert und die entsprechende Umleitung zu den **"Langen Links"** durchführt.
* **Teil 2** - ist eine "REST API" die eine Bearbeitung\Pflege der Link-Zuordnung ermöglicht.

### Frontend

Das Frontend ist eine in **"Angular"** umgesetzte [SPA](https://de.wikipedia.org/wiki/Single-Page-Webanwendung) und stellt die Oberfläche für die Bearbeitung\Pflege von Links zur Verfügung. Alle Aktionen in der Oberfläche kommunizieren über die Endpunkte der "REST API" nach dem [CRUD](https://de.wikipedia.org/wiki/CRUD)-Prinzip mit dem Backend.

Das Frontend ist unter der URL `https://mein-server.de/app/admin` erreichbar und kann nach einer erfolgreichen Authentifizierung für die Bearbeitung\Pflege von Links, benutzt werden.

### Authentifizierung

Damit die Manipulation (Bearbeitung\Pflege) von Links nur durch die berechtigte Personen durchgeführt werden kann, wurde eine einfache Authentifizierung implementiert. Die Authentifizierung wurde auf Basis von [**"basic access authentication"**](https://en.wikipedia.org/wiki/Basic_access_authentication) umgesetzt. Dabei muss der Client bei jeder Anfrage über das **"Authorization"**-Feld im Header die entsprechende Zugangsdaten (Benutzername + Passwort) schicken. Diese Zugangsdaten werden gegen die auf dem Server in der Datei [`.htpasswd`](https://www.redim.de/blog/passwortschutz-mit-htaccess-einrichten) gespeicherte Zugangsdaten validiert.

> ACHTUNG: Da bei der **"basic access authentication"** die Zugangsdaten zum Server geschickt werden, ist eine verschlüsselte Verbindung (SSL-Verbindung) für die Kommunikation zwischen Client und Server notwendig!!!

## REST API

Der "Simple URL-Shortener" verfügt über eine REST-API die folgende Endpunkte unter `https://mein-server.de/api` zur Verfügung stellt:

| Endpoint                | Action                                      | Request / Response Examples                           | Authentication required |
|:------------------------|:--------------------------------------------|-------------------------------------------------------|-------------------------|
| `POST /authenticate`    | Prüft ob die Zugangsdaten korrekt sind      | [Check Authentication](#check-authentication-request) | no                      |
| `GET /mapping`          | Liefert alle "Link-Mappings"                | [List Mappings](#list-mappings-request)               | yes                     |
| `POST /mapping`         | Erstellt ein "Link-Mapping"                 | [Create link](#create-link-request)                   | yes                     |
| `POST /mapping-all`     | Erstellt alle "Link-Mappings"               | [Create all link](#create-all-link-request)           | yes                     |
| `PUT /mapping/{id}`     | Aktualisiert das "Link-Mapping"             | [Update link](#update-link-request)                   | yes                     |
| `DELETE /mapping/{id}`  | Löscht das "Link-Mapping"                   | [Delete link](#delete-link-request)                   | yes                     |

Für alle Endpunkte die eine Authentifizierung erfordern muss in dem Request ein **"Authorization"**-Feld im Header mit den gültigen Zugangsdaten angegeben werden.

### Check Authentication Request

Mit dem Befehl `POST /authenticate` kann ein Client die Korrektheit der Zugangsdaten prüfen.

* Request, Beispiel-Payload:

```json
{
    "username": "beispielUsername",
    "password": "beispielPassword"
}
```

* Response:
  * **Statuscode 200 (OK)** -> "beispielUsername" und "beispielPassword" sind die korrekten Zugangsdaten und können für die weitere REST-Aufrufe als **"Authorization"**-Feld im Header verwendet werden (z.B. `"Authorization: Basic YmVpc3BpZWxVc2VybmFtZTpiZWlzcGllbFBhc3N3b3Jk"`)
  * **Statuscode 401 (Unauthorized)** -> "beispielUsername" und "beispielPassword" sind nicht die korrekten Zugangsdaten.

### List Mappings Request

Mit dem Befehl `GET /mapping` werden alle verfügbare "Link-Mappings" zurückgegeben.

* Beispiel einer erfolgreichen Antwort wenn 4 "Link-Mappings" vorhanden sind:

```json
[
    {
        "id": 1,
        "shortLink": "Link1",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=6cjCOZ1s18Y"
    },
    {
        "id": 2,
        "shortLink": "Link2",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=FdFV93DmNfU"
    },
    {
        "id": 3,
        "shortLink": "Link3",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=lfDwqY1l4UU&t=3s"
    },
    {
        "id": 4,
        "shortLink": "Link4",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=qhWYonEkNGw"
    }
]
```

### Create Link Request

Mit dem Befehl `POST /mapping` kann ein neues "Link-Mapping" erstellt werden.

* Request, Beispiel-Payload:

```json
{
    "shortLink": "TestLink",
    "targetUrl": "https://www.youtube.com/watch?v=9ryBJSbCqWw&list=PLRkXN1HP7lKtZCH29DQof93Me9fT-FGQ6"
}
```

* Beispiel einer erfolgreichen Antwort:

```json
    {
        "id": 5,
        "shortLink": "TestLink",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=9ryBJSbCqWw&list=PLRkXN1HP7lKtZCH29DQof93Me9fT-FGQ6"
    }
```

### Create All Link Request

Mit dem Befehl `POST /mapping-all` können alle "Link-Mappings" (auf ein mal) erstellt werden.

* Request, Beispiel-Payload:

```json
[
    {
        "shortLink": "Link1",
        "targetUrl": "https://www.youtube.com/watch?v=6cjCOZ1s18Y"
    },
    {
        "shortLink": "Link2",
        "targetUrl": "https://www.youtube.com/watch?v=FdFV93DmNfU"
    },
    {
        "shortLink": "Link3",
        "targetUrl": "https://www.youtube.com/watch?v=lfDwqY1l4UU&t=3s"
    },
    {
        "shortLink": "Link4",
        "targetUrl": "https://www.youtube.com/watch?v=qhWYonEkNGw"
    }
]
```

* Beispiel einer erfolgreichen Antwort:

```json
[
    {
        "id": 1,
        "shortLink": "Link1",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=6cjCOZ1s18Y"
    },
    {
        "id": 2,
        "shortLink": "Link2",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=FdFV93DmNfU"
    },
    {
        "id": 3,
        "shortLink": "Link3",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=lfDwqY1l4UU&t=3s"
    },
    {
        "id": 4,
        "shortLink": "Link4",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=qhWYonEkNGw"
    }
]
```

### Update Link Request

Mit dem Befehl `PUT /mapping/{id}` kann das vorhandene "Link-Mapping" (z.B. mit der id=5) aktualisiert werden.

* Request, Beispiel-Payload:

```json
{
    "shortLink": "TestLink-New",
    "targetUrl": "https://www.youtube.com/watch?v=9ryBJSbCqWw&list=PLRkXN1HP7lKtZCH29DQof93Me9fT-FGQ6"
}
```

* Beispiel einer erfolgreichen Antwort für die Aktualisierung des "Link-Mappings" mit der id=5:

```json
    {
        "id": 5,
        "shortLink": "TestLink-New",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=9ryBJSbCqWw&list=PLRkXN1HP7lKtZCH29DQof93Me9fT-FGQ6"
    }
```

### Delete Link Request

Mit dem Befehl `DELETE /mapping/{id}` kann das vorhandene "Link-Mapping" (z.B. mit der id=5) gelöscht werden. Be der erfolgreichen Löschung (Statuscode 200) werden alle noch übrigen "Link-Mappings" zurückgegeben.

* Beispiel der vorhandenen "Link-Mappings" auf dem Server vor der Löschung
  
```json
[
    {
        "id": 1,
        "shortLink": "Link1",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=6cjCOZ1s18Y"
    },
    {
        "id": 2,
        "shortLink": "Link2",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=FdFV93DmNfU"
    },
    {
        "id": 3,
        "shortLink": "Link3",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=lfDwqY1l4UU&t=3s"
    },
    {
        "id": 4,
        "shortLink": "Link4",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=qhWYonEkNGw"
    }
]
```

* Die Antwort wenn das "Link-Mapping" mit der id=3 erfolgreich gelöscht wird:

```json
[
    {
        "id": 1,
        "shortLink": "Link1",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=6cjCOZ1s18Y"
    },
    {
        "id": 2,
        "shortLink": "Link2",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=FdFV93DmNfU"
    },
    {
        "id": 4,
        "shortLink": "Link4",
        "targetUrl": "https:\/\/www.youtube.com\/watch?v=qhWYonEkNGw"
    }
]
```
