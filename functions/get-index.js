'use strict';

const fs = require("fs")
const Mustache = require('mustache');
const superagent = require('superagent');

const restaurantsApiRoot = process.env.restaurants_api;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var html;

function loadHtml(){
  if (!html){
    html = fs.readFileSync('static/index.html', 'utf-8');
  }  
  return html;
}

module.exports.handler = async (event, context) => {
  let template = loadHtml();
  let res = await superagent.get(restaurantsApiRoot);
  let restaurants = res.body;
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