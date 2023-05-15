# RestAPI ref
Tout les données doivent etre passé en data comme dans les TPs
| Path                  | GET                                                                                | POST                                                                                                                                                                                                                                        | PUT | DELETE |
|-----------------------|------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----|--------|
| /sigin                | 405                                                                                | `{username, password}` 201 or 304                                                                                                                                                                                                           | 405 | 405    |
| /login                | 405                                                                                | `{username, password}` 200 or 401 returns `token` that needs to be in all headers                                                                                                                                                           | 405 | 405    |
| /game                 | Returns all available games `{idGame, ..., creatorUserName}` 200                   | Creates a game `{minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability, infectionProbability, sleeplessnessProbability, clairvoyanceProbability, spiritismProbability}` 201 or 304 if username has already a current game | 405 | 405    |
| /game/:idGame         | Returns all the informations of the idGame                                         | Joins the game `{}` (201 or 403 if user is already in a game)                                                                                                                                                                               | 405 | 405    |
| /game/:idGame/play    | Returns information of the game that is being played `{players:.., messages: ...}` | starts the game 201, 403 if username is not the creator or if requisites are not fullfilled                                                                                                                                                 | 405 | 405    |
| /game/:idGame/message | 405                                                                                | 403 if username is not playing idGame, if he's dead or if the day time is not the right, 201                                                                                                                                                | 405 | 405    |
| /game/:idGame/vote    | 405                                                                                | 403 if username already voted, if he's dead, if the day time is not the right, 201                                                                                                                                                          | 405 | 405    |
|                       |                                                                                    |                                                                                                                                                                                                                                             |     |        |


If token is not valid returns 401 in all requests 

| code | status      |
|------|-------------|
| 200  | OK          |
| 201  | CREATED     |
| 401  | UNAUTORIZED |
| 403  | FORBIDDEN   |
| 404  | NOT FOUND   |
| 405  | NOT ALLOWED |



À chaque étape, assurez-vous de vérifier que les tests passent et ajoutez un nouveau fichier de tests pour chaque partie testée.
