 'use strict';

 var 
 	 transcrtions = [
 	 	{items: ['I1', 'I2', 'I5']},
 	 	{items: ['I2', 'I4']},
 	 	{items: ['I2', 'I3']},
 	 	{items: ['I1', 'I2', 'I4']},
 	 	{items: ['I1', 'I3']},
 	 	{items: ['I2', 'I3']},
 	 	{items: ['I1', 'I3']},
 	 	{items: ['I1', 'I2', 'I3', 'I5']},
 	 	{items: ['I1', 'I2', 'I3']}
 	 ],
 	 min_sup = 2,
 	 min_conf = 60;



 $(function(){
 	$.ajax({
		url: '/list',
		type:'get',
		dataType: 'json',
		success: function(data){
			console.log(data);
			transcrtions = data;

            Apriori.invoke(transcrtions, min_sup, min_conf);
            var association = Apriori.Association;

            var tbody = $('.transcation tbody');
            tbody.empty();
            _.each(transcrtions, function(item, index){
                let tr = $("<tr></tr>");
                tr.append("<td>"+(index+1)+"</td>");
                tr.append("<td>"+item.items.join(',')+"</td>");
                tbody.append(tr);
            });
            $(".min-conf").html(min_conf);
            tbody = $('.association tbody');
            tbody.empty();
            _.each(association, function(item, index){
                let tr = $("<tr></tr>");
                tr.append("<td>"+item.first+' -> '+item.last+"</td>");
                tr.append("<td>"+item.confidence+"</td>");
                tbody.append(tr);
            });
		}
	});

 	$(".add-btn").click(function(){
 	    var items = [];
 	    $('.add-transcation input[name=transcation]').each(function(){
            if($(this).prop('checked'))
                items.push($(this).val());
        });
 	    $.ajax({
            url:'/add',
            type:'POST',
            dataType: 'json',
            data:{
                data: items.toString()
            },
            success: function(data){
                if(data.success === true){
                    alert('添加成功');
                    location.reload();
                }
                else
                    alert('添加失败:');
            }
        });
     });

 });

