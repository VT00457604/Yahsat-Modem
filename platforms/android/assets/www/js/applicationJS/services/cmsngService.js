'use strict'
app.factory('cmsngService',  function($q, $http)  {
    // UAT with Modem (Old)
    /*var cmsng_url = 'http://100.100.0.51:8003/InstallerPortal/rest/json/mma';*/
    /*----UAT on Modem (Commented on 21-Jun-2018 on Mano's suggestion)----*/
    //var cmsng_url = 'http://YNTRNIP1.yahsat.com.br:8003/InstallerPortal/rest/json/mma';
   // var cmsng_url2 = 'http://ipv6.YNTRNIP1.yahsat.com.br:8003/InstallerPortal/rest/json/mma';
	/*----UAT on VPN----*/
    //var cmsng_url = 'http://100.100.0.51:8004/InstallerPortal/rest/json/mma';

    /*---DEV----*/
	//var cmsng_url = 'http://119.151.20.69:7003/InstallerPortal/rest/json/mma/';

	/*----SIT-----*/// SIT with VPN (Note: SIT with Modem is not created yet. Confirm URL from Masihur or Manoj if ever asked)
	//var cmsng_url = 'http://172.30.34.2:7004/InstallerPortal/rest/json/mma';
	//var cmsng_url2 = cmsng_url;
	
	/*----UAT with VPN----*/
	//var cmsng_url = 'http://172.30.32.232:8004/InstallerPortal/rest/json/mma';
	//var cmsng_url2 = cmsng_url;
	
	/*----UAT on Modem----*/
	//var cmsng_url  = 'http://instpnp.yahsat.com.br:8003/InstallerPortal/rest/json/mma';
    //var cmsng_url2 = cmsng_url;  

    /*----PROD with the VPN----*/
	//var cmsng_url  = 'http://172.30.32.230:7004/InstallerPortal/rest/json/mma';
  //var cmsng_url2 = cmsng_url;
	
	/*----PROD with the modem----*/
	//var cmsng_url  = 'http://100.100.0.11:7004/InstallerPortal/rest/json/mma';
	//var cmsng_url2 = 'http://[2804:3778:0:00aa::b]:7004/InstallerPortal/rest/json/mma';
	var cmsng_url  = 'http://installerportal.yahsat.com.br:7004/InstallerPortal/rest/json/mma';
	var cmsng_url2 = cmsng_url;
	localStorage.setItem("MODEMAPI", "TRUE");
	localStorage.setItem("ODUAPI", "TRUE");

	/*----PERFORMANCE TESTING with the VPN----*/	
	//var cmsng_url  = 'http://172.30.34.26:7004/InstallerPortal/rest/json/mma';
	//var cmsng_url2 = cmsng_url;
		
	var cmsngObj = {};
    
    cmsngObj.validate = function(postData){
		/* Implemented by Vijay */
		for (var i=0; i<postData.equipment.length; i++) {
			if(postData.equipment){
				if ("user" in postData.equipment[i]) delete postData.equipment[i]['user'];
				if ("equipmentsalemode" in postData.equipment[i]) delete postData.equipment[i]['equipmentsalemode'];
				if ("inventorydetail" in postData.equipment[i]) delete postData.equipment[i]['inventorydetail'];
			}
		}
		/* Display alert only when debug mode is on */
		if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
			alert( 'SOA VALIDATION URL: '+ cmsng_url+'/soa_validation');
			alert( 'SOA VALIDATION Request: '+ JSON.stringify(postData) );
		}
		/* Over */
		
		return $http({
            method: 'POST',
            url: cmsng_url+'/soa_validation',
            //url: cmsng_url+'js/applicationJS/services/validate.json',
            crossDomain: true,
            data: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Basic bW1hMmlwOm1tYTJpcA=='
            }
        })
       // $http.post(cmsng_url+'soa_validation',JSON.stringify(postData));
	};
	
	cmsngObj.comission = function(postData){
		/* Implemented by Vijay - Display alert only when debug mode is on */
		if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
			alert( 'COMISSION URL: '+ cmsng_url+'/soa_commission');
			alert( 'COMISSION Request: '+ JSON.stringify(postData) );
		}
		/* Over */
	    return $http({
            method: 'POST',
            url: cmsng_url+'/soa_commission',
            //url: cmsng_url+'js/applicationJS/services/commission.json',
            crossDomain: true,
            data: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Basic bW1hMmlwOm1tYTJpcA=='
            }
        })
	};
	
	cmsngObj.status = function(postData){
		/* Implemented by Vijay - Display alert only when debug mode is on */
		if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
			alert( 'COMISSION STATUS URL: '+ cmsng_url+'/soa_commission_status');
			alert( 'COMISSION STATUS Request: '+ JSON.stringify(postData) );
		}
		/* Over */
	    return $http({
            method: 'POST',
            url: cmsng_url2+'/soa_commission_status',
            //url: cmsng_url+'js/applicationJS/services/status2.json',
            crossDomain: true,
            data: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Basic bW1hMmlwOm1tYTJpcA=='
            }
        })
	};
	return cmsngObj;
})


//for testing from local
/*

'use strict'
app.factory('cmsngService',  function($q, $http)  {
    */
/*---DEV----*//*

	//var cmsng_url = 'http://119.151.20.69:7003/InstallerPortal/rest/json/mma/';
	*/
/*----SIT-----*//*

	//var cmsng_url = 'http://172.30.34.2:7004/InstallerPortal/rest/json/mma';
	*/
/*----UAT----*//*

	var cmsng_url = 'js/applicationJS/services/';
	var cmsngObj = {};
	cmsngObj.validate = function(postData){
		return $http({
            method: 'POST',
            url: cmsng_url+'validate.json',
            crossDomain: true,
            data: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Basic bW1hMmlwOm1tYTJpcA=='
            }
        })

       // $http.post(cmsng_url+'soa_validation',JSON.stringify(postData));


	};
	cmsngObj.comission = function(postData){
	    return $http({
            method: 'POST',
            url: cmsng_url+'commission.json',
            crossDomain: true,
            data: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Basic bW1hMmlwOm1tYTJpcA=='
            }
        })
	};
	cmsngObj.status = function(postData){
	    return $http({
            method: 'POST',
            url: cmsng_url+'status2.json',
            crossDomain: true,
            data: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Basic bW1hMmlwOm1tYTJpcA=='
            }
        })
	};
	return cmsngObj;
})
*/


