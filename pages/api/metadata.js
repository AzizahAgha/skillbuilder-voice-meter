import urlMetadata from 'url-metadata';
import { LogoScrape } from 'logo-scrape';

export default function handler(req, res) {

  urlMetadata(req.query.url)
    .then(async (metadata) => { // success handler
      
      const logo = await LogoScrape.getLogo(metadata.url);

      res.status(200).json({ metadata, logo });
    })
    .catch(error => {
      // console.error(error);
      res.status(404).end();
    })
}
