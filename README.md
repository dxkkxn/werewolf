# RestAPI ref
Tout les données doivent etre passé en data comme dans les TPs
| Path                   | GET                                                                 | POST                                                                                                                                                                                                                                        | PUT | DELETE |
|------------------------|---------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----|--------|
| /sigin                 | 405                                                                 | `{username, password}` 201 or 304                                                                                                                                                                                                           | 405 | 405    |
| /login                 | 405                                                                 | `{username, password}` 200 or 401 returns `token` that needs to be in all headers                                                                                                                                                           | 405 | 405    |
| /game                  | Returns all available games `{idGame, ..., creatorUserName}` 200    | Creates a game `{minPlayers, maxPlayers, dayDuration, nightDuration, werewolfProbability, infectionProbability, sleeplessnessProbability, clairvoyanceProbability, spiritismProbability}` 201 or 304 if username has already a current game | 405 | 405    |
| /game/:id_game         | Returns all the informations of the current game                    | Joins the game `{}` (201 or 403 if user is already in a game)                                                                                                                                                                               | 405 | 405    |
| /game/:id_game/start   | 405                                                                 | starts the game 201, 403 if username is not the creator or if requisites are not fullfilled                                                                                                                                                 | 405 | 405    |
| /game/:id_game/message | returns 200 and all messages of villagers, 403 if username is alive | 403 if username is not playing id_game, if he's dead or if the day time is not the right, 201                                                                                                                                               | 405 | 405    |
| /game/:id_game/vote    | 405                                                                 | 403 if username already voted, if he's dead, if the day time is not the right, 201                                                                                                                                                          | 405 | 405    |
|                        |                                                                     |                                                                                                                                                                                                                                             |     |        |


If token is not valid returns 401 in all requests 

| code | status      |
|------|-------------|
| 200  | OK          |
| 200  | OK          |
| 201  | CREATED     |
| 401  | UNAUTORIZED |
| 403  | FORBIDDEN   |
| 404  | NOT FOUND   |
| 405  | NOT ALLOWED |

