const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const brazilian_banks = require("bancos-brasileiros")
const cepCoords = require("coordenadas-do-cep");

async function index(req, res) {
  try {
    return res.status(200).json('ok');
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function coordinates_zip (req, res) {
  try {
    const { 
      zip_code
    } = req.query;
    
    const coordenadas = await cepCoords.getByCep(zip_code.replace(/[^0-9]/g, ""))

    return res.send(coordenadas)
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function coordinates_address (req, res) {
  try {
    const { 
      zip_code,
      number
    } = req.query;
    
    const coordinates_zip = await cepCoords.getByCep(zip_code.replace(/[^0-9]/g, ""))
    
    const coordinates_address = await cepCoords.getByEndereco(`
      ${coordinates_zip.uf}, ${coordinates_zip.localidade} ${coordinates_zip.bairro} ${coordinates_zip.logradouro} ${number}
    `)

    const { lat, lon, ...restCoord } = coordinates_zip
    return res.send({ ...restCoord, number, ...coordinates_address })
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

async function banks (req, res) {
  try {
    const { 
      code
    } = req.query;

    if (code) {
      const bk = brazilian_banks.find(b => b.Code == code)

      return res.status(200).json(bk);
    }

    return res.status(200).json(brazilian_banks);
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}



module.exports = {
  index,
  coordinates_zip,
  coordinates_address,
  banks
};
