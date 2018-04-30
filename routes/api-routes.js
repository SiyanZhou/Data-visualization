/// need to finish the changes to the tables 
var path = require("path");
var gdp = require("../models/models.js");

module.exports = function (app) {


  app.get("/submit/:year/:category", function (req, res) {

    var yearChosen = req.params.year;
    console.log(yearChosen);
    var categoryChosen = req.params.category;
    console.log(categoryChosen);
    // if (categoryChosen = "gdp") {
    //   var table = gdp;
    // }

    gdp.findAll({
      attributes: ['code', 'gdpIdx'],
      where: { year: yearChosen }
    }
    ).then(function (mapData) {
      var Data = {
        "took": 492,
        "timed_out": false,
        "_shards": {
          "total": 5,
          "successful": 3,
          "failed": 0
        },
        "hits": {
          "total": 30111166,
          "max_score": 0,
          "hits": []
        },
        "aggregations": {
          "world_map": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": []
          }
        }
      };

      mapData.forEach(function (gdp) {

        var countryInfo = {
          "key": gdp.dataValues.code,
          "doc_count": gdp.dataValues.gdpIdx
        }
        Data.aggregations.world_map.buckets.push(countryInfo);
      });
      res.send(JSON.stringify(Data));

      console.log(Data);
    });
  });

  app.post("/api/articles/saved", function (req, res) {

    var link = req.body.web_url;
    var title = req.body.headline;
    var date = req.body.pub_date;
    var byline = req.body.byline;
    var section = req.body.section_name;

    gdp.savedArticles.create({
      title: title,
      link: link,
      date: date,
      byline: byline,
      section: section
    }).then(function (saveart) {
      res.json(saveart);
    })

  });

}

  // app.get("/api/map", function (req, res) {
  //   var query = req.body;
  //   res.sendFile(path.join(__dirname, "../public/js/map.json"));

  // });
