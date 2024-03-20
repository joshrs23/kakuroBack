const Level = require('../models/levels');

exports.getLevels  = async(req, res)=>{
    try {

        const level = await Level.find();

        if (level.length === 0) {

          res.json({
                success: false,
                levels: null,
            });

        } else {

          res.json({
                success: true,
                levels: level,
            }); 

        }

    } catch (err) {

        res.json({
            success: false,
            error: err.message ,
        });

    }
}

exports.getLevel = async (req, res) => {
  try {
    const { _id } = req.body;
    const level = await Level.findOne({ _id: _id })

    if (!level) {

      res.json({

        success: false,
        level: null,

      });

    } else {

      res.json({

        success: true,
        level: level,

      });

    }

  } catch (err) {

    res.json({

      success: false,
      error: err.message,
      
    });

  }
};
  