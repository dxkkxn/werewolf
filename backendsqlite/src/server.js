/* Pour info, ce point de départ est une adaptation de celui qui vous obtiendriez
en faisant npm create backend
issu du dépôt
<https://github.com/ChoqueCastroLD/create-backend/tree/master/src/template/js>
*/

// Load Enviroment Variables to process.env (if not present take variables defined in .env file)
require('mandatoryenv').load(['PORT'])
const { PORT } = process.env

// Instantiate an Express Application
const app = require('./app')
const cors = require('cors')
app.use(cors()); //allowing requests from frontend
// Open Server on selected Port
app.listen(
  PORT,
  () => console.log('Server listening on port ', PORT)
)
