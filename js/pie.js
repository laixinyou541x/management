(function(){
    // 获取学生数据
   function getData(){
       $.ajax({
           type:'get',
           url:'https://open.duyiedu.com/api/student/findAll',
           data:{
               appkey:'13456744935_1569760285507',
           },
           dataType:'json',
           success:function(res){
                if(res.status == 'success'){
                   MakeChart(res.data);
                    MakeChart2(res.data);
                }else{
                    console.log(res);
                }
           }

       })
   }

   getData();

//    数据处理
// function drawData(data){
//     // console.log(data);
//     var arr = [];
//     var arr1 = [0,0];
//     var obj1 = {};
//     for(var i = 0; i < data.length; i++){
//         if(data[i].sex == 0){
//             arr1[0]++;
//         }else{
//             arr[1]++;
//         }
//         if(obj1[data[i].address] == undefined){
//             obj1[data[i].address] = 1;
//         }else{
//             obj1[data[i].address]++;
//         }
//     }
//     var data1= ss(obj1);
   
   
// }

// // 处理地区数据
// function ss(obj){
//     var arr = []
//     for(prop in obj){
//         var obj1 = {};
//         obj1.name = prop;
//         obj1.value = obj[prop];
//         arr.push(obj1);
//     }
//     return arr;
// }
    //绘制地区图表
   function MakeChart(data1){
    var legArr = [];
    var serArr = [];
    var obj1 = {};
    for(var i = 0; i < data1.length; i++){
        if(obj1[data1[i].address] == undefined){
            obj1[data1[i].address] = 1;
            legArr.push(data1[i].address);
        }else{
            obj1[data1[i].address]++;
        }
       
    }
    for(prop in obj1){
        var obj2 = {};
        obj2.name = prop;
        obj2.value = obj1[prop];
        serArr.push(obj2);
    }
    // console.log(legArr)
    // console.log(serArr)
    var myChart1 = echarts.init(document.getElementById('chart1'));
    myChart1.setOption({
        title:{
            text:'地区分布',  //标题
            left:'center',  //位置居中
            subtext:'纯属虚构'  //副标题
        },
        // 图例
        legend:{
            orient:"vertical",  //垂直排列
            left:'left',  //左对齐
            data:legArr
        },
        series:{
            name:legArr,
            type:'pie',
            data:serArr,
            radius:'55%',  //圆的半径大小，相对于整个canvas的
            center:['50%', '60%'], //圆心新，y坐标 相对于整个canvas
            // 每个扇形的样式
            itemStyle:{
                emphasis:{
                    shadowBlur:10,
                    shadowColor:"rgba(0,0,0,0.5)"
                }
            }
        },
        // 提示框组件  显示鼠标移入饼图的时候的提示文字
        tooltip:{
            formatter:"{a}<br>{b}:{c}({d}%)"  
        }
        
        
    })
   }
//    绘制性别比例图表
   function MakeChart2(data){
       var sexArr = [
           {name:"男",value:0},
           {name:"女",value:0}
       ];
       
       for(var i = 0; i < data.length; i++){
            if(data[i].sex == 0){
                sexArr[0].value++
            }else{
                sexArr[1].value++
            }
       }

       var myChart2 = echarts.init(document.getElementById('chart2'));
       myChart2.setOption({
           title:{
               text:'性别结构',
               left:'center',  //位置居中
               subtext:'纯属虚构'  //副标题
            },
           legend:{
               data:['男','女'],
               orient:"vertical",  //垂直排列
               left:'left',  //左对齐
           },
           series:{
                name:['男','女'],
                type:"pie",
                data:sexArr,
                radius:'55%',  //圆的半径大小，相对于整个canvas的
                center:['50%', '60%'], //圆心新，y坐标 相对于整个canvas
                // 每个扇形的样式
                itemStyle:{
                    emphasis:{
                        shadowBlur:10,
                        shadowColor:"rgba(0,0,0,0.5)"
                    }
                }
           },
          
           tooltip:{
            formatter:"{a}<br>{b}:{c}({d}%)"  
        }
       })
   }
   document.getElementsByClassName('menu-list')[0].addEventListener('click',getData())
})()