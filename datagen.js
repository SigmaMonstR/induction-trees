//Create dataset for induction tree

//Unique values
function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }


//create record level array
//build 1 function to create master file and another file for unique

// elementgen()
// k possible unique values, r number of values, c number of documents
    function elementgen(k,r){
            var array = [];
            for(var i = 0; i < r; i++){
                 var temp = Math.round(Math.random()*k).toString();
                 array.push(temp);
            }
           return array;
        };
    
    //Example
    test = elementgen(200,100);


//Create corpus and uniques
c = 4;
col = 200;
row = 100;
master = [];
uniquearray = [];

for(i = 0; i < c; i++){
    test = elementgen(col,row);
    master.push( "[" + test +"]" );
    uniquearray.push(test);
    
}

// usage example:
    var uniques = uniquearray.filter(onlyUnique);

//Push to HTML <div>
document.getElementById('unique').innerHTML+= uniquearray;
document.getElementById('elementgen').innerHTML+= master;
