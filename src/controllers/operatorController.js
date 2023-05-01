const {
  operatorSignUp,
  operatorUpdate,
  updatePicture,
  selectProduct,
} = require("../dao/operator.dao");

//@desc Create New Operator
//@route POST /api/operator/register
//@access private

const createOperator = async (req, res) => {
  try {
    console.log(req.file);
    let result = await operatorSignUp(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

//@desc Create New Operator
//@route PUT /api/operator/updateoperator
//@access private

const updateOperator = async (req, res) => {
  try {
    let result = await operatorUpdate(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

//@desc Update Operator Picture
//@route PUT /api/operator/updatepicture
//@access private

const pictureUpdate = async (req, res) => {
  try {
    console.log(req.file);
    let result = await updatePicture(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//@desc Select Product and Seed type
//@route PUT /api/operator/:product_id/:seedId
//@access private

const productSelect = async (req, res) => {
  try {
    let result = await selectProduct(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

module.exports = {
  createOperator,
  updateOperator,
  pictureUpdate,
  productSelect,
};
