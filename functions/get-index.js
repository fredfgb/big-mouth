'use strict';

const fs = require("fs")
const Mustache = require('mustache');
const superagent = require('superagent');
const aws4 = require('aws4');
const URL = require('url');

const restaurantsApiRoot = process.env.restaurants_api;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var html;

function loadHtml(){
  if (!html){
    html = fs.readFileSync('static/index.html', 'utf-8');
  }  
  return html;
}

async function getRestaurants() {
  let url = URL.parse(restaurantsApiRoot);
  let opts = {
    host: url.hostname,
    path: url.pathname
  };
  aws4.sign(opts);

  let res = await superagent
                    .get(restaurantsApiRoot)
                    .set('Host', opts.headers['Host'])
                    .set('X-Amz-Date', opts.headers['X-Amz-Date'])
                    .set('Authorization', opts.headers['Authorization'])
                    .set('X-Amz-Security-Token', opts.headers['X-Amz-Security-Token']);
  return res.body;
}

module.exports.handler = async (event, context) => {
  let template = loadHtml();  
  let restaurants = await getRestaurants();
  let dayOfWeek = days[new Date().getDay()];
  let html = Mustache.render(template, { dayOfWeek, restaurants });
  
  const response = {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  };
  return response;
};