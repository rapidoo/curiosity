// aggregationCtrlUtils.js

/*
function clone(obj)
{
	var result = {};

	for (field in obj) {
		result[field] = obj[field];	
	}
	return (result);
}*/

Curiosity.provider("agg", function() {
	function aggrega(type, field, params, nested, constructor){
		this.type = type;
		this.template = type + "_template";
		this.name = "";
		this.field = "";
		this.idx = 0;
		this.params = params;
		this.nested = nested;
		this.nestedAgg = new Array();
		this.constructor = constructor;

		this.autoSetName = function() {
			this.name = this.field.split('.');
			this.name = this.name[this.name.length - 1];
			this.name = "agg_" + this.name + "_" + this.type;
		}
	}

	function builtAggregationRec(aggLaunched, aggResult){
		var re = new RegExp("^" + "agg_" + ".*");
		for (var key in aggResult) {
			var i = 0;
			if (re.test(key)) {
				while (i < aggLaunched.length) {
					if (key == aggLaunched[i].name) {
						aggResult[key].agg = aggLaunched[i];
						if (aggLaunched[i].nested && aggLaunched[i].nestedAgg.length) {
							var j = 0;
							while (j < aggResult[key].buckets.length) {
								builtAggregationRec(aggLaunched[i].nestedAgg, aggResult[key].buckets[j]);
								j++;
							}
						}
						break;
					}
					i++;
				}
			}
		}
	}
	function addAggregationFilterToQuery(query, filter) {
		var i = 0;
		while (i < filter.length) {
			var j = 0;
			if (filter[i].agg.length) {
				if (i > 0)
					query+= " AND ";
				query += " " + filter[i].field + ":("; 
				while (j < filter[i].agg.length) {				
					if (j > 0 || filter[i].agg[j].opBool == "NOT") {
						query += filter[i].agg[j].opBool + " ";
					}
					query += "\"" + filter[i].agg[j].key + "\" "; 
					j++;
				}
				query += ")";
			}
			i++;
		}
	return (query);
	}


	function builtRangeAgg(obj) {
		obj.autoSetName();
		var result = ejs.RangeAggregation(name);
		result.field(obj.field);
		result.range(obj.params[0].value, obj.params[1].value);
		return (result);
	}


	function builtTermAgg(obj) {
		obj.autoSetName();
		var result = ejs.TermsAggregation(obj.name);
		result.field(obj.field);
		obj.nbResult = 5;
		obj.predicate = 'doc_count';
		return (result);
	}


	function builtAvgAgg(obj) {
		obj.autoSetName();
		var result = ejs.AvgAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}

	function builtCardinalityAgg(obj) {
		obj.autoSetName();
		var result = ejs.CardinalityAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}


	function builtDateHistogramAgg(obj) {
		obj.autoSetName();
		var result = ejs.DateHistogramAggregation(obj.name);
		result.field(obj.field);
		result.interval(obj.params[0].value);
		return (result);	
	}



	function builtDateRangeAgg(obj) {
		obj.autoSetName();
		var result = ejs.DateRangeAggregation(obj.name);
		result.field(obj.field);
		result.range(obj.params[0].value, obj.params[1].value);
		return (result);	
	}


	function builtExtendedStatsAgg(obj) {
		obj.autoSetName();
		var result = ejs.ExtendedStatsAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}


	function builtHistogramAgg(obj) {
		obj.autoSetName();
		var result = ejs.HistogramAggregation(obj.name);
		result.field(obj.field);
		result.interval(obj.params[0].value);
		return (result);	
	}


	function builtMaxAgg(obj) {
		obj.autoSetName();
		var result = ejs.MaxAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}


	function builtMinAgg(obj) {
		obj.autoSetName();
		var result = ejs.MinAggregation(obj.name);
		result.field(obj.field);
		return (result);
	}

	function builtMissingAgg(obj) {
		obj.autoSetName();
		var result = ejs.MissingAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}

	function builtStatsAgg(obj) {
		obj.autoSetName();
		var result = ejs.StatsAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}

	function builtSignificantTermsAgg(obj) {
		obj.autoSetName();
		var result = ejs.SignificantTermsAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}

	function builtSumAgg(obj) {
		obj.autoSetName();
		var result = ejs.SumAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}

	function builtValueCountAgg(obj) {
		obj.autoSetName();
		var result = ejs.ValueCountAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}
	
	function builtMissingAgg(obj) {
		obj.autoSetName();
		var result = ejs.MissingAggregation(obj.name);
		result.field(obj.field);
		return (result);	
	}

	function newMissingAgg  () {
		return new aggrega("Missing", "", [], false, builtMinAgg);
	}

	function newMinAgg  () {
		return new aggrega("Min", "", [], false, builtMinAgg);
	}

	function newMissingAgg () {
		return new aggrega("Missing", "", [], false, builtMissingAgg);
	}

	function newSignificantTermsAgg () {
		return new aggrega("SignificantTerms", "", [], true, builtSignificantTermsAgg);
	}

	function newStatsAgg () {
		return new aggrega("Stats", "", [], false, builtStatsAgg);
	}

	function newSumAgg () {
		return new aggrega("Sum", "", [], false, builtSumAgg);
	}

	function newValueCountAgg () {
		return new aggrega("ValueCount", "", [], false, builtValueCountAgg);
	}

	function newRangeAgg () {
		return new aggrega("Range", "", [{type:"number",name:"from",value:""},{type:"number",name:"to",value:""}], false, builtRangeAgg)
	}

	function newTermAgg (){
		return new aggrega("Terms", "", [], true , builtTermAgg);
	}

	function newAvgAgg () {
		return new aggrega("Avg", "", [], false, builtAvgAgg)
	}

	function newCardinalityAgg () {
		return new aggrega("Cardinality", "", [], false, builtCardinalityAgg);
	}

	function newDateHistogramAgg () {
		return new aggrega("DateHistogram", "", [{type:"text", name:"interval", value:""}], true, builtDateHistogramAgg);
	}

	function newDateRangeAgg () {
		return new aggrega("DateRange", "", [{type:"text", name:"from", value:""} , {type:"text", name:"to", value:""}], false, builtDateRangeAgg);
	}

	function newExtendedStatsAgg () {
		return new aggrega("ExtendedStats", "", [], false, builtExtendedStatsAgg);
	}

	function newHistogramAgg () {
		return new aggrega("Histogram", "", [{type:"number", name:"interval", value:""}], true, builtHistogramAgg);
	}

	function newMaxAgg () {
		return new aggrega("Max", "", [], false, builtMaxAgg);
	}

	this.$get = function() {
		return {
			"cloneAgg" : function (aggs) {
				var result =  new Array ();
				var i = 0;
				while (i < aggs.length) {
					var tmp = {	
						type:aggs[i].obj.type, 
						name:aggs[i].obj.name,
						template:aggs[i].obj.template,
						field:aggs[i].obj.field, 
						params:aggs[i].obj.params,
						nbResult:aggs[i].obj.nbResult,
						predicate:aggs[i].obj.predicate,
						nested:aggs[i].obj.nested,
						nestedAgg:this.cloneAgg(aggs[i].obj.nestedAgg)
					} 
					result.push(tmp);
					i++;
				}
				return (result);
			},

			"builtAggregation" : builtAggregationRec,

			"possibleAggregation" : [{type:"Terms", func:newTermAgg}, 
				{type:"Range", func:newRangeAgg}, 
				{type:"Avg", func:newAvgAgg},
				{type:"Cardinality", func:newCardinalityAgg},
				{type:"DateHistogram", func:newDateHistogramAgg},
				{type:"DateRange", func:newDateRangeAgg},
				{type:"ExtendedStats", func:newExtendedStatsAgg},
				{type:"Histogram", func:newHistogramAgg},
				{type:"Max", func:newMaxAgg},
				{type:"Min", func:newMinAgg},
				{type:"SignificantTerms", func:newSignificantTermsAgg},
				{type:"Stats", func:newStatsAgg},
				{type:"Sum", func:newSumAgg},
				{type:"ValueCount", func:newValueCountAgg},
				{type:"Missing", func:newMissingAgg}
				],
			"quickAgg" : function (field) {
				var result =  newTermAgg();
				result.field = field;
				return ({"idx":0,"obj":result});
			},  

			"addAggregationFilter" : function(tab, type, field, key){
				var i = 0;
				while (i < tab.length){
					if (tab[i].field == field) {
						var j = 0;
						while (j < tab[i].agg.length) {
							if (tab[i].agg[j].key == key) {
								return ;
							}
							j++;
						}
						tab[i].agg.push({"key":key, type:type, "opBool":"AND"});
						return;
					}
					i++;
				}
				tab.push({"field":field, agg:[{"key":key, "type":type,"opBool":"AND"}]})
			},

			"addAggregationFilterToQuery" : addAggregationFilterToQuery,
		
			"aggregationFilterEmpty" : function(tab) {
				var i = 0;
				console.log(tab);
				while (i < tab.length) {
					if (tab[i].agg.length)
						return (false);
					i++;
				}
				return (true);
			}
		}
	};
})






