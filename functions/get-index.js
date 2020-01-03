'use strict';

const fs = require("fs")
var html;

function loadHtml(){
  if (!html){
    html = fs.readFileSync('static/index.html', 'utf-8');
  }  
  return html;
}

module.exports.handler = async (event, context) => {
  let html = loadHtml();

  const response = {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  };
  return response;
};