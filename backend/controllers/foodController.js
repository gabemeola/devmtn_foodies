module.exports = {
  getFoodies: (req, res, next) => {
    let db = req.app.get('db')
    let {id} = req.user
    db.get_foodies({id}).then( food => {
      res.status(200).send(food)
    })
    .catch(err => {
      res.status(500).send(err)
    })
  },
  postFood: (req, res, next) => {
    let db = req.app.get('db')
    let { foodLocation } = req.body;
    let {id} = req.user;
    db.add_food_location({id, foodLocation}).then( foodLocation => {
      console.log('food', foodLocation);
      res.status(200).send(foodLocation)
    })
    .catch(err => {
      res.status(500).send(err)
    })
  }
}