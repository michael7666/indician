const Upload =  require("../model/Upload");
const { generateShortUrl } = require("../utill/url");

module.exports.createUrl =async (req, res) => {
    const {longUrl} = req.body
    try {
        
        const shortUrl = generateShortUrl();

        await Upload.create({ shortUrl, longUrl });
        res.json({ shortUrl });

    } catch (error) {
        res.status(500).json({ error: 'Failed to shorten URL' });
    }
}

module.exports.getUrl =async (req, res) => {
    const { shortUrl } = req.params;
    try {
        // Find the corresponding long URL in MongoDB
        const urlData = await Upload.findOne({ shortUrl });
    
        if (urlData) {
          // Redirect to the long URL
          res.redirect(urlData.longUrl);
        } else {
          res.status(404).send('URL not found');
        }
      } catch (error) {
        console.error('Failed to retrieve URL mapping:', error);
        res.status(500).send('Failed to retrieve URL mapping');
      }
}

module.exports.getUrlById =async (req, res) => {
    const { shortUrl } = req.params;
    try {
        // Find the corresponding long URL in MongoDB
        const urlData = await Upload.findOne({ shortUrl });
    
        if (urlData) {
          // Redirect to the long URL
          res.redirect(urlData.longUrl);
    
          // Update click count
          urlData.clickCount++;
          await urlData.save();
        } else {
          res.status(404).send('URL not found');
        }
      } catch (error) {
        console.error('Failed to retrieve URL mapping:', error);
        res.status(500).send('Failed to retrieve URL mapping');
      }
}

module.exports.getUrlStat =async (req, res) => {
    const { shortUrl } = req.params;

  try {
    // Find the corresponding URL in MongoDB
    const urlData = await Upload.findOne({ shortUrl });

    if (urlData) {
      const { longUrl, clickCount } = urlData;

      res.json({
        shortUrl,
        longUrl,
        clickCount
      });
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error('Failed to retrieve URL statistics:', error);
    res.status(500).send('Failed to retrieve URL statistics');
  }
}

