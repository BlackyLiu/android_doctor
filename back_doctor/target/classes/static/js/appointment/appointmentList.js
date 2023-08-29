layui.use(['form','layer','table','laypage','util'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        util = layui.util,
        table = layui.table;
       laypage = layui.laypage;


    page=1;
    size =10;
    count=0;
    data = [];
    searchObj = {},
    //设置搜索条件 和分页数
    tableIns = null;
    queryData(page,size,searchObj,true);
    function queryData(p,s,searchObj,isRenderPage){
        $.post("/appointment/page",{
            	"appointment":searchObj,
            	"page":p,
            	"size":s
        },function(res){
    		     console.log(res)
//    		     let res = JSON.parse(resStr)
        		if(res.code != 200){
        			layer.msg("Server error, please reload the page.");
        			return false;
        		}
    		     count  = res.data.total;
    		     data = res.data.records
    		    //用户列表 重新渲染表格
    		    tableIns = table.render({
    		         elem: '#appointmentList',
    		         data:data,
    		         cellMinWidth : 95,
    		         height : "full-200",
    		         cols : [[
    		             {type: "checkbox", fixed:"left"},
                          {field: 'appointmentName', title: 'Name of the reservation person', align:"center"},
                          {field: 'beAppointmentName', title: 'Doctor appointment', align:"center"},
                          {field: 'medicalRecord', title: 'Medical record', align:"center"},
                          {field: 'prescription', title: 'prescription', align:"center"},
                            {field: 'appointmentTime', title: 'Appointment time', align:"center",templet:function(d){
			    		            	 return util.toDateString(new Date(d.appointmentTime).getTime(), "yyyy-MM-dd HH:mm:ss");
			    		   }},
                            {field: 'createTime', title: 'createTime', align:"center",templet:function(d){
			    		            	 return util.toDateString(new Date(d.createTime).getTime(), "yyyy-MM-dd HH:mm:ss");
			    		   }},
                            {field: 'updateTime', title: 'updateTime', align:"center",templet:function(d){
			    		            	 return util.toDateString(new Date(d.updateTime).getTime(), "yyyy-MM-dd HH:mm:ss");
			    		   }},
    		             {title: 'operate', templet:'#appointmentListBar',width:200,fixed:"right",align:"center"}
    		         ]]
    		     });
    		     if(isRenderPage){
    			     laypage.render({
     		    	    elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
     		    	    ,count: count, //数据总数，从服务端得到
     		    	    limit:size,
     		    	   layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
     		    	    jump: function(obj, first){
     		    	        if(!first){
     		    	            page = obj.curr;
     		    	            size = obj.limit;
     		    	        	queryData(page,size,searchObj,false);
     		    	        }
     		    	    }
     		     });
    		     }
    	})
    }





    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
    	let val = $(".searchVal").val();
        if(val){
        	searchObj = {be_appointment_name:val}
        	queryData(page,size,searchObj,false);
        }else{
//            layer.msg("请输入搜索的内容,暂支持用户名的模糊搜索");
        	searchObj = {}
        	queryData(page,size,searchObj,false);
        }
    });

    //添加用户
    function addAppointment(edit){
        var index = layui.layer.open({
            title : "Add appointment",
            type : 2,
            content : "/jump/toAppointmentAdd",
            end:function(){
              	 queryData(page,size,searchObj,true);
               },
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
//                console.log(edit);
                body.find(".edit").hide();
                if(edit){
               body.find("#id").val(edit.id);
               body.find("#appointmentId").val(edit.appointmentId);
               body.find("#beAppointmentId").val(edit.beAppointmentId);
               body.find("#appointmentName").val(edit.appointmentName);
               body.find("#beAppointmentName").val(edit.beAppointmentName);
               body.find("#medicalRecord").val(edit.medicalRecord);
               body.find("#prescription").val(edit.prescription);
               body.find("#appointmentTime").val(util.toDateString(new Date(edit.appointmentTime).getTime(), "yyyy-MM-dd HH:mm:ss"));

                    body.find(".edit").show();
                    body.find(".add").hide();
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('Click here to return to the reservation list.', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })
        layui.layer.full(index);
        window.sessionStorage.setItem("index",index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    $(".addNews_btn").click(function(){
        addAppointment();
    })

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('appointmentList'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('Are you sure to delete the selected appointment？', {icon: 3, title: '提示信息'}, function (index) {
                 $.post("/appointment/batchDelete",{
                	 ids:JSON.stringify(newsId)  //将需要删除的newsId作为参数传入
                 },function(res){
                   	 if(res.code == 200){
                      	 queryData(page,size,searchObj,true);
                         layer.close(index);
                         layer.msg("Batch deletion succeeded.");
                   	 }
                 })
            })
        }else{
            layer.msg("Please select the reserved account to delete.");
        }
    })

    //列表操作
    table.on('tool(appointmentList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addAppointment(data);
        }
        else if(layEvent === 'del'){ //删除
             layer.confirm('Are you sure you want to delete this reservation account？',{icon:3, title:'prompting message'},function(index){
                 $.get("/appointment/delete",{
                     id : data.id  //将需要删除的newsId作为参数传入
                 },function(res){
                	 if(res.code == 200){
                		 queryData(page,size,searchObj,true);
                		 layer.msg("Delete succeeded.");
                         layer.close(index);
                	 }
                 })
            });
        }
    });

})
