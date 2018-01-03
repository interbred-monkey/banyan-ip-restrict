/*global __base*/

const _       = require('lodash/core'),
      fs      = require('fs'),
      yaml    = require('js-yaml'),
      library = require('ip-range-check');

function GenerateWhitelist() {

  let whitelist;

  if (_.isString(process.env.IP_WHITELIST)) {

    whitelist = LoadWhitelistFile(process.env.IP_WHITELIST);

  }

  whitelist = ExtractWhitelistFromObject(whitelist);
  SaveWhitelistToEnvironment(whitelist);

  return;

}

function LoadWhitelistFile(whitelist) {

  if (!whitelist.match(/\.yaml|\.yml/gi)) {

    try {

      return JSON.parse(whitelist);

    }

    catch(e) {

      throw new Error('Supplied whitelist does not match any of the required formats. A .yaml, JSON, or YAML should be provided');

    }

  }

  if (!fs.existsSync(`${__base}/${whitelist}`)) {

    throw new Error(`Path \n${__base}/${whitelist}\nDoes not exist, cannot load IP whitelist`);

  }

  whitelist = yaml.safeLoad(fs.readFileSync(whitelist, 'utf8'));
  return whitelist;

}

function ExtractWhitelistFromObject(whitelist) {

  if (!_.isObject(whitelist)) {

    throw new Error('Supplied whitelist does not match any of the required formats. A .yaml, JSON, or YAML should be provided');

  }

  return _.flatten(Object.values(whitelist));

}

function SaveWhitelistToEnvironment(whitelist) {

  process.env.IP_RESTRICT = whitelist;
  return;

}

function IsWhitelistedIp(req, res, next) {

  if (!_.isString(process.env.IP_WHITELIST) && !_.isObject(process.env.IP_WHITELIST) &&
      !_.isString(process.env.IP_RESTRICT)) {

    return next();

  }

  if (!_.isString(process.env.IP_RESTRICT)) {

    GenerateWhitelist();

  }

  let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (library(clientIp, process.env.IP_RESTRICT.split(','))) {

    return next();

  }

  return res.status(403).send();

}

module.exports = IsWhitelistedIp;