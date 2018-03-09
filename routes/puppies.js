const router = require('express').Router();

const Puppy = require('../models/Puppy');
const Food = require('../models/Food');

module.exports = router;

// // We will use this to test the class + instance method, therefore, see the get puppy by id route below
// router.param('id', (req, res, next, id) => {
//   Puppy.findById(id)
//     .then(puppy => {
//       // if no puppy found, send 404
//       if (!puppy) res.sendStatus(404);
//       else {
//         req.puppy = puppy;
//         // we have to call next here so that the actual route we want to hit will match after the router.param
//         next();
//       }
//     })
//     .catch(next);
// });


// get all puppies route
router.get('/', (req, res, next) => {
  // here we can also use a req.query to match against puppies if we need to!
  // this allows use to use routes like /puppies?favFood=pizza to get all puppies who love pizza.
  // if no query is present, we there is no where condition to match against, so everthing is returned. neat!
  Puppy.findAll({
    where: req.query,
    include: [{all: true}]
  })
  // quick one-line res.send. This will res.send whatever the previous promise resolves to.
  .then(res.send.bind(res))
  .catch(next);
});

// post a new puppy
// req.body is the puppy object
router.post('/', (req, res, next) => {
  Puppy.create(req.body)
    .then(puppy => {
      res.send(puppy);
    })
    .catch(next);
});

// get puppy by id
router.get('/:id', (req, res, next) => {
  // router.param has now taken care of this!!
  //res.send(req.puppy);
  
 var inputFood = req.query.food;
 console.log('Testing the input parameters and the class+instance methods: ' + JSON.stringify(req.query.food) + '\n');
  Puppy.findOne({
    where: {  //sequelize
      id: req.params.id
    }
  })
  .then(function (puppy) {
    if (!puppy) res.send('that pup does not exist, try other id')
    else {
      //tests for the class+instance methods
      console.log(puppy.greet());
      puppy.constructor.count();
      puppy.constructor.findByFavFood(inputFood); //localhost:3000/puppies/2?food=pizza returns how many pups have favFood pizza
      res.send(puppy)
    }
  })
  .catch(next);
  
  
});

// update a particular puppy
router.put('/:id', (req, res, next) => {
  // we already got a puppy from the db with router.param
  req.puppy.update(req.body)
  .then(updatedPuppy => {
    res.send(updatedPuppy);
  })
  .catch(next);
});

// we will get a foodId in the req.body
router.put('/:id/food', (req, res, next) => {
  req.puppy.addFavFoods(req.body.foodId)
    .then(res.send.bind(res))
    .catch(next)
});

// create a new Food instance based on req.body, save it to the db
// and associate it with the puppy, all in one fell swoop
// see http://docs.sequelizejs.com/en/v3/api/associations/belongs-to-many/#createassociationvalues-options-promise

router.post('/:id/food', (req, res, next) =>{
  req.puppy.createFavFood(req.body)
    .then(res.send.bind(res))
    .catch(next)
});
