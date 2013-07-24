/**
 * HomeController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  
  /**
   * /home/index
   */ 
  index: function (req,res) {
    res.view();
  }

};
