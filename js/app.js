// app.js

var Curiosity = angular.module('curiosity', ['elasticjs.service', 'elasticsearch', 'ngGrid','ui.select2','ui.bootstrap', 'ui.tinymce']);
Curiosity.service('elasticClient', function(esFactory) {
		return { 
			getClient: function(server) {	
          	  return esFactory({
            	    host: server 
            	});
        	}
   		}
   	}
);