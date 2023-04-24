# RestAPI ref
Tout les données doivent etre passé en data comme dans les TPs
| Path                                 | GET                                                                 | POST                                                                                                                                                                                                                                                 | PUT | DELETE |   |
|--------------------------------------|---------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----|--------|---|
| /sigin                               | 405                                                                 | `{username, password}` 201 or 304                                                                                                                                                                                                                    | 405 | 405    |   |
| /login                               | 405                                                                 | `\{username, password\}` 200 or 401 returns `token` that needs to be in all headers                                                                                                                                                                  | 405 | 405    |   |
| /:username/game                      | Returns all available games `{id_game, ..., creator}` 200           | Creates a game `{min_players, max_players, duration_day, duration_night, werewolf_probability, infection_probability, sleeplessness_probability, clairvoyance_probability, spiritism_probability}` 201 or 304 if username has already a current game | 405 | 405    |   |
| /:username/:id_game                  | 405                                                                 | Joins the game `{}` (201 or 403 if user is already in a game)                                                                                                                                                                                        | 405 | 405    |   |
| /:username/:id_game/start            | 405                                                                 | starts the game 201, 403 if username is not the creator or if requisites are not fullfilled                                                                                                                                                          |     |        |   |
| /:username/:id_game/villager/message | returns 200 and all messages of villagers, 403 if username is alive | 403 if username is not playing id_game, if he's dead or if the current time is night, 201                                                                                                                                                            | 405 | 405    |   |
| /:username/:id_game/werewolf/message | returns 200 and all messages of werewolfs, 403 if username is alive | 403 if username is not playing id_game, if he's dead or if he's not a werewolf                                                                                                                                                                       | 405 | 405    |   |
|                                      |                                                                     |                                                                                                                                                                                                                                                      |     |        |   |


If token is not valid returns 401 in all requests 
200 -> OK
201 -> CREATED
401 -> UNAUTORIZED
403 -> FORBIDDEN
404 -> NOT FOUND
405 -> NOT ALLOWED

