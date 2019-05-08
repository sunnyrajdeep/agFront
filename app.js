// set up ======================================================================
var express = require('express');
var app = express(); 
var mysql = require('mysql');					// create our app w/ express	
var request = require('request');
var iconv  = require('iconv-lite');
//var fs = require('fs');
//var unirest = require('unirest');
var cheerio = require('cheerio');
var tableScraper = require('table-scraper');
//var path = require('path');
let process = require('process');
var port = process.env.PORT || 3100; 				// set the port

//var morgan = require('morgan');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');
const scrapper = require('./scrapper.js');
const scrapperFrench = require('./french.js');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: "mail.iengageit.com",
  port: 465,
  secure: true,
  auth: {
         user: 'MRITBOT@iEngageIT.com',
         pass: 'ivF9CD;VQsh#'
     }
 });



//Initiallising connection string
// const requestConnection = mysql.createConnection({
    // host: 'localhost',
    // user:  'ritubhatt',
    // password:'ap29rJcw1',
    // database:'mrit',
// });
// const requestConnection = mysql.createConnection({
//   host: 'localhost',
//   user:  'MRITApp',
//   password: 'M91t$cr@ppe9',
//   database:'MRIT ',
// });
  

//var mydata = require('./router/mydata');

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
//app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
//app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// listen (start app with node server.js) ======================================
app.listen(port);

if (process.pid) {
  console.log('This process pid ' + process.pid);
}
console.log("App listening on port " + port+ "\r\n");
const requestConnection = mysql.createConnection({
  host: 'localhost',
  user:  'root',
  password: '',
  database:'onmusic',
});

let countOfRowsAddedinDb = 0;
let scrappedTitles=[];
let notScrappedTitles=[];
//step 1. this function will request google for searching wiki title and returns search page body
function handleDisconnect(requestConnection) {  
  //Initiallising connection string
  function formaturl(url){
    return new Promise((resolve,reject)=>{
      var uri ='';
      var n = url.search("%26");
      if(url.includes('�')){
        uri = url.replace(/�/g,'%C3%A9');
        resolve(uri);
      }
      else if(n!==-1){
        uri = url.replace(/%26/g,'&');
      }
      else{
        uri = url;
      }
       var urlEndPart = encodeURIComponent(uri.slice(uri.lastIndexOf("/")+1));
       var urlPart = url.slice(0,url.lastIndexOf("/")+1)
       var mainUrl = urlPart+urlEndPart;
      console.log("mainurl: "+mainUrl);
      resolve(mainUrl);
    })    
  }
// this doRequest returns google search page body
  function doRequest(url) {
    return new Promise(function (resolve, reject) {
      console.log("doRequest Called");
      request({encoding: null, method: "GET", uri: url}, 
        function (error, res, body) {
          body = iconv.decode(new Buffer(body), "ISO-8859-1");
          console.log("requested url: "+ url);
          if (!error && res.statusCode == 200) {
            console.log("do request status code of google:");
            console.log(res.statusCode);
            resolve(body);
          }
          else if(res.statusCode==400){
            console.log("in do request if status code from google is 400 responding with 1");
            reject(1);
          } 
          else {
            console.log("in doRequest error: "+ error);
            reject(503);
          }
        });
    });
  }
  
  // Step 2. This function extract exact wikipedia link for provided title title from body - provided by step 1. 
  //          This step returns the wikipedia page url.
  
  function googlescrapper(body, title){
    console.log("googlescrapper called");
    return new Promise(function(resolve, reject){
      if(body!==undefined){
      let $= cheerio.load(body);
      var decodedTitle = decodeURIComponent(title);
      console.log(decodedTitle);
      var title1 = decodedTitle.charAt(0).toUpperCase();
      console.log('substring 4 char :'+ title1);
      console.log("cite:contains('wikipedia.org/wiki/"+title1+"')");
      //let $url= $('.g .r a').first().attr('href');
      let wikilink = $("cite:contains('wikipedia.org/wiki/"+title1+"')").first().text();
      // let wikilink = $("cite:contains('wikipedia.org/wiki/"+title22+"')").first().parent().parent().text();//.first().attr('href');
      // //let wikilink = $("#rso div:nth-child(1) div.r  a:nth-child(1)").attr('href');
      console.log(wikilink);
      let linkObject = {
        wikilink : wikilink,
        title : title
      }
      console.log(linkObject.wikilink.length);
      resolve(linkObject);
      }
      else{
        reject("Empty res/body");
      }
    });
  }
  
  // Step 3. This function requests wiki-url and returns the body of wiki page for provided title initially.
  
  function wikirequest(url) {
    return new Promise(function (resolve, reject) {
      request({method: "GET", uri: url}, 
        function (error, res, body) {
         // body = iconv.decode(new Buffer(body), "ISO-8859-1");
        if (!error && res.statusCode==200) {
          console.log("response code of wikipedia: "+ res.statusCode);
          resolve(body);
        } else {
          console.log("error in wikirequest() else: response code of wikipedia: "+ res +error);
          reject(error);
        }
      });
    });
  }
  
  
  function wikiDataInjector(programmeData,title){
    return new Promise(function (resolve, reject) {
      console.log(programmeData.episode.length);
      if(programmeData.episode.length!==0){
        var arraylength= programmeData.episode.length;
        for(var i=0;i<arraylength;i++){
          var titleMain = decodeURIComponent(title);
          var executiveProducers= programmeData.executiveProducers;
          var Producers = programmeData.Producers;
          var locations = programmeData.locations;
          var Cinematography = programmeData.Cinematography;
          var runningTime = programmeData.runningTime;
          var ProductionCompany = programmeData.ProductionCompany;
          var Distributor = programmeData.Distributor;
          var MainActors = programmeData.MainActors;
          var Production = programmeData.Production;
          var Broadcast = programmeData.Release.Broadcast;
          var HomeMedia = programmeData.Release.HomeMedia;
          var Genre = programmeData.Genre;
          var BasedOn = programmeData.BasedOn;
          var Written_by= programmeData.episode[i].episodeWrittenBy;
          var Created_by= programmeData.Created_by;
          var Narrated_by= programmeData.Narrated_by;
          var Composers= programmeData.Composers;
          var openingTheme= programmeData.openingTheme;
          var endingTheme= programmeData.endingTheme;
          var countryOfOrigin= programmeData.countryOfOrigin;
          var OriginalLanguages= programmeData.OriginalLanguages;
          var NoOfSeasonsSeries= programmeData.NoOfSeasonsSeries;
          var NoOfEpisodes= programmeData.NoOfEpisodes;
          var editors= programmeData.editors;
          var originalNetwork= programmeData.originalNetwork;
          var pictureFormat= programmeData.pictureFormat;
          var originalRelease= programmeData.originalRelease;
          var audioFormat= programmeData.audioFormat;
          var episodeTitle = programmeData.episode[i].episodeTitle;
          var episodeDirector = programmeData.episode[i].episodeDirector;
          var episodeDate = programmeData.episode[i].episodDate;
          var episodeSeasonSeries= programmeData.episode[i].episodeSeasonSeries;
          var TimeofStorage = new Date();
          var Status = 'Loaded';
          var episodeNumber = i+1;
    
          var queryWiki = 'INSERT INTO scrapper_data (title, executiveProducers, producers, locations, Cinematography, runningTime, Distributor, ProductionCompany, MainActors, EpisodesTitle, EpisodeDirector, EpisodeDate, Production, Broadcast, HomeMedia, Genre, BasedOn, Written_by, Created_by, Narrated_by, Composers, openingTheme, endingTheme, countryOfOrigin, OriginalLanguages, NoOfSeasonsSeries, NoOfEpisodes, editors, originalNetwork, pictureFormat, originalRelease, audioFormat, episodeSeasonSeries, TimeofStorage, Status, episodeNumber ) VALUES ("'+titleMain+'","'+executiveProducers+'","'+Producers+'","'+locations+'","'+Cinematography+'","'+runningTime+'","'+Distributor+'","'+ProductionCompany+'","'+MainActors+'"," '+episodeTitle+'","'+episodeDirector+'","'+episodeDate+' ","'+Production+'","'+Broadcast+'","'+HomeMedia+'","'+Genre+'","'+BasedOn+'","'+Written_by+'","'+Created_by+'","'+Narrated_by+'","'+Composers+'","'+openingTheme+'","'+endingTheme+'","'+countryOfOrigin+'","'+OriginalLanguages+'","'+NoOfSeasonsSeries+'","'+NoOfEpisodes+'","'+editors+'","'+originalNetwork+'","'+pictureFormat+'","'+originalRelease+'","'+audioFormat+'","'+episodeSeasonSeries+'","'+TimeofStorage+'","'+Status+'","'+episodeNumber+'")'; 
          // query to the database
          //console.log(queryWiki);
          //console.log('&&&& '+i);
            requestConnection.query(queryWiki, function (err, results, fields) {
              if (err) {
                  console.log(err);
              }
              else {
                 // console.log('success');
                  }
              });
        };
        resolve(arraylength);
        }
      else{
        var titleMain = decodeURIComponent(title);
        var executiveProducers= programmeData.executiveProducers;
        var Producers = programmeData.Producers;
        var locations = programmeData.locations;
        var Cinematography = programmeData.Cinematography;
        var runningTime = programmeData.runningTime;
        var ProductionCompany = programmeData.ProductionCompany;
        var Distributor = programmeData.Distributor;
        var MainActors = programmeData.MainActors;
        var Production = programmeData.Production;
        var Broadcast = programmeData.Release.Broadcast;
        var HomeMedia = programmeData.Release.HomeMedia;
        var Genre = programmeData.Genre;
        var BasedOn = programmeData.BasedOn;
        var Written_by= programmeData.Written_by;
        var Created_by= programmeData.Created_by;
        var Narrated_by= programmeData.Narrated_by;
        var Composers= programmeData.Composers;
        var openingTheme= programmeData.openingTheme;
        var endingTheme= programmeData.endingTheme;
        var countryOfOrigin= programmeData.countryOfOrigin;
        var OriginalLanguages= programmeData.OriginalLanguages;
        var NoOfSeasonsSeries= programmeData.NoOfSeasonsSeries;
        var NoOfEpisodes= programmeData.NoOfEpisodes;
        var editors= programmeData.editors;
        var originalNetwork= programmeData.originalNetwork;
        var pictureFormat= programmeData.pictureFormat;
        var originalRelease= programmeData.originalRelease;
        var audioFormat= programmeData.audioFormat;
        var episodeTitle = "";
        var episodeDirector = programmeData.DirectedBy;
        var episodeDate = "";
        var episodeSeasonSeries= "";
        var TimeofStorage = new Date();
        var Status = 'Loaded';
        var episodeNumber = '';
  
        var queryWiki = 'INSERT INTO scrapper_data (title, executiveProducers, producers, locations, Cinematography, runningTime, Distributor, ProductionCompany, MainActors, EpisodesTitle, EpisodeDirector, EpisodeDate, Production, Broadcast, HomeMedia, Genre, BasedOn, Written_by, Created_by, Narrated_by, Composers, openingTheme, endingTheme, countryOfOrigin, OriginalLanguages, NoOfSeasonsSeries, NoOfEpisodes, editors, originalNetwork, pictureFormat, originalRelease, audioFormat, episodeSeasonSeries, TimeofStorage, Status, episodeNumber ) VALUES ("'+titleMain+'","'+executiveProducers+'","'+Producers+'","'+locations+'","'+Cinematography+'","'+runningTime+'","'+Distributor+'","'+ProductionCompany+'","'+MainActors+'"," '+episodeTitle+'","'+episodeDirector+'","'+episodeDate+' ","'+Production+'","'+Broadcast+'","'+HomeMedia+'","'+Genre+'","'+BasedOn+'","'+Written_by+'","'+Created_by+'","'+Narrated_by+'","'+Composers+'","'+openingTheme+'","'+endingTheme+'","'+countryOfOrigin+'","'+OriginalLanguages+'","'+NoOfSeasonsSeries+'","'+NoOfEpisodes+'","'+editors+'","'+originalNetwork+'","'+pictureFormat+'","'+originalRelease+'","'+audioFormat+'","'+episodeSeasonSeries+'","'+TimeofStorage+'","'+Status+'","'+episodeNumber+'")'; 
        
          requestConnection.query(queryWiki, function (err, results, fields) {
            if (err) {
                console.log("Error while querying database in wikidata injector else :- " + err);
            }
            else {
                //console.log('success');
                }
            });
            resolve("Single Row added");
        };//end else 
      
    });
  }
  
  function countInitRows(){
    return new Promise(function(resolve, reject){
      var querycount = 'select COUNT(*) totalcount FROM scrapper_data';
      requestConnection.query(querycount, function (err, results, fields) {
          if (err) {
              console.log("Error while querying database in countInitRows() :- " + err+ "\r\n");
              dat = err;
              console.log(err+ "\r\n");
          }
          else {
              initRows = results[0].totalcount;
              //console.log('initial no. of Rows: '+ initRows);
              resolve(initRows);
              }              
          });
    })
  }
  // Usage:
  function countEndRows(){
    return new Promise(function(resolve, reject){
      var queryOne = 'select COUNT(*) totalcount FROM scrapper_data';
      requestConnection.query(queryOne, function (err, results, fields) {
          if (err) {
              console.log("Error while querying database countEndRows():- " + err);
              dat = err;
              console.log(err);
          }
          else {
              lastRows = results[0].totalcount;
              //console.log('initial no. of Rows: '+ initRows);
              resolve(lastRows);
              }              
          });
    })
  }

  const main = async  (title,prog_id, altTitle, directedBy,productionCompany,actor)=> {
    url = 'https://www.google.com/search?q="'+title+'"+'+directedBy+'+'+productionCompany+'+'+actor+'+wikipedia&oq="'+title+'"+'+directedBy+'+'+productionCompany+'+'+actor+'+wikipedia';
    url2 = 'https://www.google.com/search?q="'+altTitle+'"+'+directedBy+'+'+productionCompany+'+'+actor+'+wikipedia&oq="'+altTitle+'"+'+directedBy+'+'+productionCompany+'+'+actor+'+wikipedia';
    console.log("URL in main "+url)
    let initialNoOfRows= await countInitRows(); // Got initial rows count
    //console.log('Google link : '+ url);
    let res;
    let gscrapping;
    let wikibody ;
    let wikiscrapper;
    try{
      res = await doRequest(url);// Request google url it gives back google search page body
    }
    catch(e){
      notScrappedTitles.push(decodeURIComponent(title));
      if(e==1){
        return 1;
      }
      else{
        console.log("do request status code of google: in catch block: ");
      console.log(e);
      let gerr={title:title,mrid:prog_id,errorCode:e};
      return gerr;
      }     
      
    }
     
    console.log('Got request response body from');
    
    //console.log("gscrapping length: "+gscrapping.length);
    try{
      gscrapping = await googlescrapper(res, title); // this gives back wiki link
    }
    catch(e){
      console.log(e);
      //return 1;
    }
    //let formatWikiUrl = await formaturl(gscrapping);
    
    
    if(gscrapping.wikilink.length !=0 && gscrapping.title == title){
        console.log(gscrapping.wikilink.length);
        console.log('Google page responded with wikilink: '+gscrapping.wikilink);
        
        try{
          wikibody = await wikirequest(gscrapping.wikilink); // this gives back wiki page body
        }
        catch(e){
          notScrappedTitles.push(decodeURIComponent(title));
          console.log(e);
          console.log("1 returned from catch block wikibody");
          return 1;
          
        }
        console.log('Got response body from wikisrapper');
      } 
      // Requesting alt title 
      else if (gscrapping.wikilink.length ==0 && gscrapping.title != altTitle && altTitle !==''){
        try{
          res = await doRequest(url2);// Request google url it gives back google search page body
        }
        catch(e){
          notScrappedTitles.push(decodeURIComponent(altTitle));
          if(e==1){
            return 1;
          }
          else{
            console.log("do request status code of google: in catch block: ");
          console.log(e);
          let gerr={title:altTitle,mrid:prog_id,errorCode:e};
          return gerr;
          }     
          
        }
         
        console.log('Got request response body from');
        
        //console.log("gscrapping length: "+gscrapping.length);
        try{
          gscrapping = await googlescrapper(res, altTitle); // this gives back wiki link
        }
        catch(e){
          console.log(e);
          notScrappedTitles.push(decodeURIComponent(altTitle));
          return 1;
        }
      }
      if(gscrapping.wikilink.length!=0){
        try{
          wikibody = await wikirequest(gscrapping.wikilink); // this gives back wiki page body
        }
        catch(e){
          notScrappedTitles.push(decodeURIComponent(altTitle));
          console.log(e);
          console.log("1 returned from catch block wikibody");
          return 1;
          
        }
        if(gscrapping.wikilink.includes("fr.w")){
          wikiscrapper = await scrapperFrench.wikilinkScrapperFrench(wikibody,gscrapping.wikilink); // For French This give actual data with array of episodes
        }
        else {
          wikiscrapper = await scrapper.wikilinkScrapper(wikibody,gscrapping.wikilink); // For General ssThis give actual data with array of episodes
        }
        
        //Check Genre 
        let checkGenre = (genre)=>{
          if(genre.match(/news and current affairs|news|current affairs|discussion|religion|advertising|sports|political|magazine programme|magazine/gi)!=null && genre.length!=0){
            console.log("Contains Specified Genre.");
            return false;
          }
          else{
            return true;
          }
        }
        let SpecifiedGenre = await checkGenre(wikiscrapper.Genre);

        if(SpecifiedGenre==true) {
          await wikiDataInjector(wikiscrapper,title);
          scrappedTitles.push(decodeURIComponent(wikiscrapper.title)+' | Passed title: '+decodeURIComponent(title));
        } // function for dumping data to the db
        
      
        let rowCountLast = await countEndRows();
        let log = {
          title: wikiscrapper.title,
          googleurl: url,
          googleStatusCode: '',
          wikilinkByGoogle: gscrapping,
          wikiPageStatusCode: '',
          rowsadded: rowCountLast-initialNoOfRows,
          titledata: wikiscrapper,
          timelog: new Date(),
          mrid:prog_id
        }
        countOfRowsAddedinDb +=log.rowsadded;
        console.log(countOfRowsAddedinDb);
        
        return log;
      }
    else{
      notScrappedTitles.push(decodeURIComponent(title));
      return 1;
    }    
  }// End main

  requestConnection.connect(function(err){
    if (err){
      console.log( err+ "\r\n");
      setTimeout(handleDisconnect(requestConnection), 2000);
    }
     else{
    console.log("Connected to DB, Time: "+ new Date()+"\r\n");
    console.log('connected as id ' + requestConnection.threadId);
        var queryOne = 'select COUNT(*) totalcount FROM scrapper_data';
        requestConnection.query(queryOne, function (err, results, fields) {
            if (err) {
                console.log("Error while querying database while queryOne :- " + err+ "\r\n");
                dat = err;
               // res.send(err);
            }
            else {
                initRows = results[0].totalcount;
                console.log('initial no. of Rows: '+ initRows+ "\r\n");
                }              
            });
  ////////// +++++++++++ Main Function scrapper ++++++++++++++ ///////////////
      app.get('/keytitle',function(req,res){
        var queryCheck = 'select COUNT(*) totalcount FROM scrapper_data';
        requestConnection.query(queryCheck, function (err, results, fields) {
            if (err) {
                console.log("Error while querying database in get keytitle :- " + err+ "\r\n");
                dat = err;
               res.send("MySql Server offline"+"\n");
            }
            else {
                console.log('MySql'+ "\r\n");
                }              
            });
        if(req.query.link==''){
            console.log("Empty Query and Programme-ID, Can not process request"+ "\r\n");
            res.send("query and Programme-ID should not be empty");
        }
        else{
          keytitle = req.query.link;
          var directedBy = '';
          var productionCompany = '';
          var actor = '';
          var prog_id = '';
          prog_id= req.query.mrid;
          //console.log("length: "+req.query.hint.length);
          if(req.query.directedBy){
            if(req.query.directedBy.length!==0){
              director = req.query.directedBy;
              console.log("Directed By: "+ director+ "\r\n");
              directedBy = encodeURIComponent(director)//.replace(/ /,'+').replace(/&/g,'%26'); // <== Directed By
            }
          }
          if(req.query.prodCompany){
            if(req.query.prodCompany.length!==0){
              company = req.query.prodCompany;
              console.log("Production Company: "+ company+ "\r\n");
              productionCompany = encodeURIComponent(company)//.replace(/ /,'+').replace(/&/g,'%26'); // <== productionCompany
            }
          } 
          console.log("file status: "+req.query.fileStatus);  
          if(req.query.actor){
            if(req.query.actor.length!==0){
              actor = req.query.actor;
              console.log("Actor: "+ actor+ "\r\n");
              actor = encodeURIComponent(actor);//.replace(/ /,'+').replace(/&/g,'%26'); // <== Actor
            }
          }           
          var title = encodeURIComponent(keytitle);//.replace(/%60/g,"'");
          if(req.query.fileStatus == 1){
            console.log("This is file start");
            countOfRowsAddedinDb = 0;
            scrappedTitles=[];
            notScrappedTitles=[];
          }
          console.log("Search Title = "+title+ "\r\n");
          var altTitle = '';
          console.log(req.query.altTitle);
          altTitle = ((req.query.altTitle=="undefined") ? '' : encodeURIComponent(req.query.altTitle));
          console.log(altTitle);
          
          //console.log(keytitle); &oq="+title+"+Series+tv+Programme+wikipedia
          //Googlelink = 'https://www.google.com/search?q="'+title+'"+'+hint+'+wikipedia&ei=IDc7W4DkCYjTvgSym5TQBA&oq="'+title+'"+wikipedia';
          Googlelink = 'https://www.google.com/search?q="'+title+'"+'+directedBy+'+'+productionCompany+'+'+actor+'+wikipedia&oq="'+title+'"+'+directedBy+'+'+productionCompany+'+'+actor+'+wikipedia';
          //console.log("googlelink before calling main(): "+ Googlelink);
          main(title,prog_id, altTitle, directedBy,productionCompany,actor).then((t)=>{
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
            //res.send(JSON.stringify(t));
            //t.lastcountrows = countEndRows();
            //console.log("then func console"+t+ "\r\n");
            let tableView = (data) =>{
              let view = "<table border='1'><tbody><tr>";
               for(var i=0; i<data.length; i++){
                 var newElement = "<td>"+data[i]+"</td>";
                 view+= newElement;    
                 if(i%5===0 && i!==0) {view += "</tr><tr>";}
               }
               return view+"</tr></tbody></table>";
             }
            const mailOptions = {
              from: 'Scrapper <MRITBOT@iEngageIT.com>', // sender address
              to: 'sunny@iengageit.com',// jyothirmai@iengageit.com, ritu.bhatt@iengageit.com', //'ritu.bhatt@iengageit.com, abbie.triggs@on-music.tv', // list of receivers
              //cc: 'sunny@iengageit.com', // CC
              subject: 'AI Bot | MRIT |  Session: ' + new Date(), // Subject line
              html: ` <b>Rows Added:</b> ${countOfRowsAddedinDb} <br>
                      <b>Number of Scrapped Programme titles : </b> ${scrappedTitles.length}<br>
                      <b>Number of Not Scrapped Programme titles : </b>${notScrappedTitles.length}<br>
                      <b>Scrapped Programme titles </b> = <br>${tableView(scrappedTitles)}<br>
                      <b>Not Scrapped Programme titles</b> = <br>${tableView(notScrappedTitles)}<br>
                      <b>Time: </b> ${new Date()} <br>
                          `// plain text body
            };
            if(req.query.fileStatus==0){
              if(countOfRowsAddedinDb!==0){
                transporter.sendMail(mailOptions, function (err, info) {
                  if(err){
                    console.log("mail info ////////////// \r\n ");
                    console.log(err);
                    console.log("mail info ////////////// \r\n ");
                  }
                  else{
                    console.log("mail info ////////////// \r\n ");
                    console.log(info);
                    console.log("mail info ////////////// \r\n ");
                  } 
                });
              }
              // Count reset to 0
              countOfRowsAddedinDb = 0;
              scrappedTitles=[];
              notScrappedTitles=[];
            }
            if(t.errorCode==503){
              res.send(t);
              console.log("if 503 sent res as:" +t);
              
              console.log("count reset first "+countOfRowsAddedinDb);
                if(countOfRowsAddedinDb!==0){
                  transporter.sendMail(mailOptions, function (err, info) {
                    if(err){
                      console.log("mail info ////////////// \r\n ");
                      console.log(err);
                      console.log("mail info ////////////// \r\n ");
                    }
                    else{
                      console.log("mail info ////////////// \r\n ");
                      console.log(info);
                      console.log("mail info ////////////// \r\n ");
                    } 
                  });
                }
                // Count reset to 0
                countOfRowsAddedinDb = 0;
                scrappedTitles=[];
                notScrappedTitles=[];
                console.log("count reset "+countOfRowsAddedinDb);
            }
            else if(t!==1){
              //let timeofLog = Date.now();
              let gLink = t.googleurl.replace(/"/g,'');
              let reqTitle = t.title.replace(/\+/g,' ');
              console.log(gLink+ "\r\n");
              let queryLog = 'INSERT INTO `scrapper_log`(`timeofLog`, `Googlelink`, `wikilink`, `keytitle`, `NoOfrowsAdded`)'+
                            ' VALUES ("'+t.timelog+'","'+gLink+'","'+t.wikilinkByGoogle+'","'+reqTitle+'","'+t.rowsadded+'")'
              requestConnection.query(queryLog, function (err, results, fields) {
                if (err) {
                    console.log("Error while querying database in query log line 484 :- " + err+ "\r\n");
                    }
                else {
                    console.log('Log for this instance saved successfully \r\n');
                    }
                });
                res.send({title:t.title, mrid: t.mrid,errorCode:""});
              // send mail total rows added.
            }
            else{                
              if(res.headersSent){
                console.log("wikipedia link not found"+ "\r\n");
              }
              else{
                console.log("wikipedia link not found"+ "\r\n");
                res.send({title:  decodeURIComponent(title), mrid: t.mrid,errorCode:""});
              }                
            }
              
          }).catch(console.error);
        }
      });

      app.get("/api/data", function(req , res){
        console.log(req.query.titleinput);
        var titlequery = req.query.titleinput;
        if(titlequery!==undefined){
          if(titlequery!==''){
            var query = "SELECT * FROM scrapper_data WHERE title like"+"'"+titlequery+"%'";
            console.log(query);
            // query to the database
            requestConnection.query(query, function (err, results, fields) {
              if (err) {
                console.log("Error while querying database line no. 386 :- " + err+ "\r\n");
                res.send(err);
              }
              else {
                //console.log(results);
                res.send(results);
                console.log("Data accessed through api with title query"+ "\r\n");
                }
                //request.end();
              });
          }
          else{
            var query = "SELECT * from scrapper_data";
            // query to the database
            requestConnection.query(query, function (err, results, fields) {
              if (err) {
                console.log("Error while querying database line no. 386 :- " + err+ "\r\n");
                res.send(err);
              }
              else {
                //console.log(results);
                res.send(results);
                console.log("Data accessed through api"+ "\r\n");
                }
                //request.end();
              });
          }

        }
        
        });
      }
    });

    requestConnection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect(requestConnection);                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });


    app.get("/api/log", function(req , res){
      var query = "SELECT * from scrapper_log";
      // query to the database
      requestConnection.query(query, function (err, results, fields) {
        if (err) {
          console.log("Error while querying database  line no. 415:- " + err+ "\r\n");
          res.send(err);
        }
        else {
          //console.log(results);
          res.send(results);
          console.log("log Data accessed through api"+ "\r\n");
          }
          //request.end();
        });
      });
    }

    handleDisconnect(requestConnection);
    process.on('exit', (code) => {
      console.log(`About to exit with code: ${code}`);
    });
