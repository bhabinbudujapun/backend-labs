import express from "express";

const app = express();
app.use(express.json());
const PORT = 3000;

let teaList = [];
let _id = 1;

// add or post the tea
app.post("/tea", (req, res) => {
  const teas = req.body;
  teas._id = _id++;
  teaList.push(teas);

  res.status(200).json({
    message: "Succesfully receive data !!",
    data: teaList,
  });
});

// get the colletction tea
app.get("/tea", (req, res) => {
  res.status(200).json(teaList);
});

//get the tea by id
app.get("/tea/:id", (req, res) => {
  const _id = parseInt(req.params.id);
  const tea = teaList.find((tea) => tea._id === _id);

  if (tea) {
    res.status(200).json({
      message: "Successfully received tea by using id",
      data: tea,
    });
  } else {
    res.status(404).json({
      message: "Tea not found",
    });
  }
});

// update tea properties
app.put("/tea/:id", (req, res) => {
  const _id = parseInt(req.params.id);
  const { name, price } = req.body;
  const teaIndex = teaList.findIndex((tea) => tea._id == _id);
  if (teaIndex === -1) {
    return res.status(404).json({
      message: "Tea not found",
    });
  }

  (teaList[teaIndex].name = name), (teaList[teaIndex].price = price);
  res.status(200).json({
    message: "Updated successfully !!",
  });
});

app.listen(PORT, () => {
  console.log(`Express Server listen on PORT ${PORT}`);
});
