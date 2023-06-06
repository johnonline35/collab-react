// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDLJS = require("peopledatalabs");
const peopledatalabs_api_key = process.env.REACT_APP_PEOPLEDATALABS;

// Create a client, specifying your API key
const PDLClient = new PDLJS({ apiKey: peopledatalabs_api_key });

module.exports = async (req, res) => {
  const params = {
    email: "viviana@felicis.com",
    min_likelihood: 4,
  };

  try {
    const data = await PDLClient.person.enrichment(params);
    const record = data.data;

    console.log(record);

    console.log("successfully enriched profile with pdl data");

    res.json(record);
  } catch (error) {
    console.error("Enrichment unsuccessful. See error and try again.");
    console.error(error);

    res
      .status(500)
      .send("Enrichment unsuccessful. See server logs for more details.");
  }
};
