'use strict';

(function(){
	window['Apriori'] = {
		MIN_CONFIDENCE: 0,	//置信度阈值
		MIN_SUPPORT: 0,		//支持度阈值
		Transcrtions: [],	//事务集合
 	 	Frequents: [],	//符合支持度的频繁集
 	 	Association: [	//最终结果--强规则集
				// {first: ['A'], last: ['B'], confidence: 10}	// c(A -> B) = confidence
 	 	],
 	 	fail: function(thing){	//错误提示
			throw new Error(thing);
		},
		warn: function(thing){	//警告
			console.log(["WARNING:", thing].join(' '));
		},
		note: function(thing){	//消息
			console.log(["NOTE:", thing].join(' '));
		},
 	 	compaire: function(arr1, arr2){		//比较两个数组是否相等
			arr1 = _.uniq(arr1);
			arr2 = _.uniq(arr2);
			var flag = true;
			if(arr1.length != arr2.length) return false;
			_.each(arr1, function(item){
				if(_.indexOf(arr2, item) == -1) {
					flag = false;
				}
			});
			return flag;
		},
		contains: function(arr1, arr2){		//arr1数组是否包含arr2数组
			arr1 = _.uniq(arr1);
			arr2 = _.uniq(arr2);
			var flag = true;
			if(arr1.length < arr2.length) return false;
			_.each(arr2, function(item){
				if(_.indexOf(arr1, item) == -1) {
					flag = false;
				}
			});
			return flag;
		},
		subset: function(str, arr){			//通过二进制字符串，来得到子集 例:['A','B','C'] , '001' => ['C']
			var result = [];
			_.each(arr, function(item, index){
				if(str[index] == '1')
					result.push(item);
			});
			return result;
		},
		result: function(arr){				//显示结果
			/*_.each(arr, function(item){
				console.log(item.first + ' -> ' + item.last + ' : ' + item.confidence + '%');
			})*/
			return _.map(arr, function(item){
				return item.first + ' -> ' + item.last + ' : ' + item.confidence + '%';
			})
		},
		invoke: function(transcrtions, min_sup, min_conf){			//根据事务集合计算所有强规则
			if(transcrtions == undefined || min_sup == undefined || min_conf == undefined){
				Apriori.fail("缺少必要参数");
				return ;
			}
			if(isNaN(min_sup) || isNaN(min_conf)){
				Apriori.fail("支持度阈值和置信度阈值必须是0~100数");
			}
			Apriori.Transcrtions = transcrtions;	//暂存事务集合
			Apriori.MIN_SUPPORT = min_sup;			//设置支持度阈值
 	 		Apriori.MIN_CONFIDENCE = min_conf;		//设置置信度阈值
			var 	
				list = [[],[]],		//临时集合
				condidate = [],		//候选表
				frequent = [],		//频繁集
				association = [],	//关联规则集合
				len = Apriori.Transcrtions.length,	//总事务条数
				endFlag = false,	//是否得到所有层频繁集
				loop = 1;			//循环次数
			//一层频繁集
			_.each(Apriori.Transcrtions, function(transcrtion){

				var items = transcrtion.items;

				_.each(items, function(item, index){
					if(!_.contains(list[0], item)){
						list[0].push(item);
						list[1][_.indexOf(list[0], item)] = 1 ;
					}
					else{
						list[1][_.indexOf(list[0], item)] ++ ;
					}
				});
			});
			//一层频繁集候选表
			condidate = _.map(list[0], function(item, index){
				var i = {
					items: [item],
					support: list[1][index]
				};
				return i;
			});
			//筛选得到一层频繁集
			frequent = _.filter(condidate, function(item){
				return item.support >= Apriori.MIN_SUPPORT ;
			});
			//将频繁集添加到总的频繁集
			Apriori.Frequents.push(frequent);
			//循环得到各层频繁集
			while(!endFlag){
				let items = [],temp = [];
				loop ++ ;
				condidate = [];

				_.each(frequent, function(f){
					items.push(f.items);
				});
				//得到候选表
				for(let i = 0, len = items.length; i < len; i++){
					for(let j = i + 1; j < len; j++){
						var flag = true;
						let item = _.union(items[i],items[j]);
						_.each(condidate, function(a){
							if(Apriori.compaire(item,a.items))
								flag = false;
						});
						if(flag){
							condidate.push({
									items: item,
									support: 0
								});
						}
					}
				}
				//计算支持度
				_.each(condidate, function(item){
					_.each(Apriori.Transcrtions, function(i){
						if(Apriori.contains(i.items, item.items))
							item.support ++ ;
					});
				});
				//过滤得到频繁集
				frequent = _.filter(condidate, function(item){
					return ( item.items.length < loop ) || ( item.support >= Apriori.MIN_SUPPORT) ;
				});
				//判断是否结束循环
				if(frequent.length == 0 || loop == Apriori.Transcrtions.length){
					endFlag = true;
				}
				else{
					Apriori.Frequents.push(frequent);
				}
			}
			//由最高层频繁集计算关联规则集合
			_.each(_.last(Apriori.Frequents), function(item){
				var items = item.items,
					support = item.support;

				for(let i = 1, len = Math.pow(2,items.length) - 1; i < len; i++){
					var first = i.toString(2),
						last = (len - i).toString(2);
						first = first.length != items.length ? '0'.repeat(items.length - first.length) + first : first ;
						last = last.length != items.length ? '0'.repeat(items.length - last.length) + last : last ;
					association.push({
						first: Apriori.subset(first, items),
						last: Apriori.subset(last, items),
						confidence: 0
					});
				}
				//计算所有关联规则的置信度
				_.each(association, function(item){
					var items = item.first,
						sub_support = 0;
						_.each(Apriori.Frequents[items.length - 1], function(i){
							if(Apriori.compaire(i.items, items)){
								 sub_support = i.support;
								 return ;
							}
						});
					item.confidence = ( parseFloat(support) / sub_support) * 100;
				});
			});	
			//剔除置信度不满足要求的关联规则，得到强关联规则集合
			Apriori.Association = _.filter(association, function(item){
				return item.confidence >= Apriori.MIN_CONFIDENCE;
			});
		}
	}
})();