/*
 * Parse the data and create a graph with the data.
 */
function parseData(createGraphOne) {
	Papa.parse(window.location.pathname + "/graphs-from-csv/data/sfpd_dispatch_data_subset.csv", {
		download: true,
		complete: function(results) {
			createGraphOne(results.data);
			createGraphTwo(results.data);
			createGraphThree(results.data);
		}
	});
}

function createGraphOne(data) {
	// create a bar graph that shows the number of Alarms, non life threatening,
	// potentially life threatening, and fire calls for every zipcode in SF

	var zipcode_callType = ["zipcode_callType"];

	for (var i = 0; i < data.length; i++) {
		var inner_arr = [];
		inner_arr.push(data[i][17]);
		inner_arr.push(data[i][25]);
		zipcode_callType.push(inner_arr);
	}

	zipcode_callType.sort(sortFunction);

	zipcode_callType.splice(0, 2);

	countF = 0;
	countA = 0;
	countPLT = 0;
	countNLT = 0;
	zipcode_numF_numA_numPLT_numNLT = [ ["94102", 0, 0, 0, 0] ];

	for (var i = 0; i < 28; i++) {
		zipcode_numF_numA_numPLT_numNLT.push([0, 0, 0, 0, 0]);
	}

	var j = 0;
	for (var i = 0; i < zipcode_callType.length; i++) {
		/* for every year in zipcode_finalPri, check if that exists in zipcode_num2_num3
		*  if it does, add one to count2 if the final_priority is 2
		*  add one to count3 if the final_priority is 3
		*  if the zipcode doesnt exist, add new year to zipcode_num2_num3
		*  and increment count2 or count3 corresspondingly
		*/
		if (zipcode_callType[i][0] == zipcode_numF_numA_numPLT_numNLT[j][0]) {
			if (zipcode_callType[i][1] == "Fire") {
				countF++;
			}
			else if (zipcode_callType[i][1] == "Alarm") {
				countA++;
			}
			else if (zipcode_callType[i][1] == "Potentially Life-Threatening") {
				countPLT++;
			}
			else if (zipcode_callType[i][1] == "Non Life-threatening") {
				countNLT++;
			}
		}
		else {
			// moving on to a new zipcode,
			// so add count2 and count3 to the previous zipcode and reset the counts
			j++;
			zipcode_numF_numA_numPLT_numNLT[j-1][1] = countF;
			zipcode_numF_numA_numPLT_numNLT[j-1][2] = countA;
			zipcode_numF_numA_numPLT_numNLT[j-1][3] = countPLT;
			zipcode_numF_numA_numPLT_numNLT[j-1][4] = countNLT;
			countF = 0;
			countA = 0;
			countPLT = 0;
			countNLT = 0;

			// set new zipcode
			zipcode_numF_numA_numPLT_numNLT[j][0] = zipcode_callType[i][0];

			// increment count2 or count3
			if (zipcode_callType[i][1] == "Fire") {
				countF++;
			}
			else if (zipcode_callType[i][1] == "Alarm") {
				countA++;
			}
			else if (zipcode_callType[i][1] == "Potentially Life-Threatening") {
				countPLT++;
			}
			else if (zipcode_callType[i][1] == "Non Life-threatening") {
				countNLT++;
			}
		}
	}

	var zipcodes = ['x'];
	for (var i = 0; i < zipcode_numF_numA_numPLT_numNLT.length - 2; i++) {
		zipcodes.push(zipcode_numF_numA_numPLT_numNLT[i][0]);
	}

	// create an array with just the counts of Fire, in order of zipcodes
	var countFs = ['Fire'];
	for (var i = 0; i < zipcode_numF_numA_numPLT_numNLT.length - 2; i++) {
		countFs.push(zipcode_numF_numA_numPLT_numNLT[i][1]);
	}

	var countAs = ['Alarm'];
	for (var i = 0; i < zipcode_numF_numA_numPLT_numNLT.length - 2; i++) {
		countAs.push(zipcode_numF_numA_numPLT_numNLT[i][2]);
	}

	var countPLTs = ['Potentially Life-Threatening'];
	for (var i = 0; i < zipcode_numF_numA_numPLT_numNLT.length - 2; i++) {
		countPLTs.push(zipcode_numF_numA_numPLT_numNLT[i][3]);
	}

	var countNLTs = ['Non Life-threatening'];
	for (var i = 0; i < zipcode_numF_numA_numPLT_numNLT.length - 2; i++) {
		countNLTs.push(zipcode_numF_numA_numPLT_numNLT[i][4]);
	}

	var chart = c3.generate({
		bindto: '#chart',
    	data: {
	        x : 'x',
	        columns: [
	            zipcodes,
	            countFs,
	            countAs,
	            countPLTs,
	            countNLTs
	        ],
	        groups: [
	            ['Fire', 'Alarm', 'Potentially Life-Threatening', 'Non Life-threatening']
	        ],
	        type: 'bar'
	    },
	    legend: {
	    	show: true
	    },
	    axis: {
	        x: {
	            type: 'category', // this needed to load string x value
	            label: {
	            	text: 'Zipcode',
	            	position: 'outer-center'
	            }
	        },
	        y: {
            	label: {
            		text: 'Call Count',
            		position: 'outer-middle'
            	}
        	},
	    },
	});
}

function createGraphTwo(data) {
	var recievedHour = []; // array of the hour the call was recieved

	for (var i = 1; i < data.length - 1; i++) {
		recievedHour.push(data[i][6].slice(11, 13));
	}

	var countOfHourCalls = ['Num of Recieved Calls Per Hour'];
	// array of how many times a call was recieved at that hour


	for (var i = 0; i < 24; i++) {
		countOfHourCalls.push(0);
	}

	for (var i = 1; i < recievedHour.length; i++) {
		countOfHourCalls[parseInt(recievedHour[i])+1]++;
	}

	var chart = c3.generate({
		bindto: '#chart2',
	    data: {
	        columns: [
	            countOfHourCalls
	        ]
	    },
	    axis: {
	        x: {
	            type: 'category',
	            categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
	            			 '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
	            			 '22', '23'],
	            label: {
	            	text: 'Hour',
	            	position: 'outer-center'
	            }
	        },
	        y: {
	        	label: {
	        		text: 'Count',
	        		position: 'outer-middle'
	        	}
	        }
	    }
	});
}

function createGraphThree(data) {
	var zipcode_entryHrMin_onsceneHrMin = [];

	for (var i = 1; i < data.length - 1; i++) {
		var inner_arr = [];
		inner_arr.push(data[i][17]);
		inner_arr.push(data[i][7].substring(11, 13));
		inner_arr.push(data[i][7].substring(14, 16));
		inner_arr.push(data[i][10].substring(11, 13));
		inner_arr.push(data[i][10].substring(14, 16));
		zipcode_entryHrMin_onsceneHrMin.push(inner_arr);
	}

	var wasSpliced = false;
	for (var i = 0; i < zipcode_entryHrMin_onsceneHrMin.length; i++) {
		if (wasSpliced) {
			i = 0;
			wasSpliced = false;
		}
		if (!zipcode_entryHrMin_onsceneHrMin[i][3]) {
			zipcode_entryHrMin_onsceneHrMin.splice(i, 1);
			wasSpliced = true;
		}
	}

	var zipcode_diffMins = [];
	var entryHr = 0;
	var entryMin = 0;
	var onsceneHr = 0;
	var onsceneMin = 0;
	for (var i = 0; i < zipcode_entryHrMin_onsceneHrMin.length; i++) {
		entryHr = parseInt(zipcode_entryHrMin_onsceneHrMin[i][1]) * 60;
		entryMin = parseInt(zipcode_entryHrMin_onsceneHrMin[i][2]);
		onsceneHr = parseInt(zipcode_entryHrMin_onsceneHrMin[i][3]) * 60;
		onsceneMin = parseInt(zipcode_entryHrMin_onsceneHrMin[i][4]);
		var inner_arr = [];
		inner_arr.push(zipcode_entryHrMin_onsceneHrMin[i][0]);
		inner_arr.push(onsceneHr + onsceneMin - entryHr - entryMin);
		zipcode_diffMins.push(inner_arr);
	}

	zipcode_diffMins.sort(sortFunction);

	for (var i = 0; i < zipcode_diffMins.length; i++) {
		if (zipcode_diffMins[i][1] < 0) {
			zipcode_diffMins.splice(i, 1);
			i = -1;
		}
	}

	var zipcode_avgDiff = [];
	for (var i = 0; i < 27; i++) {
		zipcode_avgDiff.push(['94102',0]);
	}

	var sum = 0;
	var count = 0;
	var j = 0;
	for (var i = 0; i < zipcode_diffMins.length; i++) {
		if (zipcode_avgDiff[j][0] == zipcode_diffMins[i][0]) {
			sum += zipcode_diffMins[i][1];
			count++;
		}
		else {
			j++;
			zipcode_avgDiff[j-1][1] = sum / count;
			zipcode_avgDiff[j][0] = zipcode_diffMins[i][0];
			sum = 0;
			count = 0;
			sum += zipcode_diffMins[i][1];
			count++;
		}
	}

	zipcode_avgDiff[26][1] = sum / count;

	var zipcodes = ['x'];
	var avgDiff = ['Average Time (Min) for Dispatch Arrival'];
	for (var i = 0; i < zipcode_avgDiff.length; i++) {
		zipcodes.push(zipcode_avgDiff[i][0]);
		avgDiff.push(zipcode_avgDiff[i][1]);
	}

	var chart = c3.generate({
		bindto: '#chart3',
	    data: {
	        x : 'x',
	        columns: [
	            zipcodes,
	            avgDiff
	        ],
	        type: 'bar'
	    },
	    axis: {
	        x: {
	            type: 'category' // this needed to load string x value
	        }
	    }
	});
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

parseData(createGraphOne);
