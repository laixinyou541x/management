
var nowPage = 1;
var pageSize = 3;
var allPage = 1;
var tableData = []; 

// 绑定事件函数
function bindEvent(){
    $('.menu-list').on('click', 'dd', function(){
        $('.active').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('data-id');
        // console.log(id);
        $('.right-content > div').fadeOut();
        setTimeout(function(){
            $("#" + id).fadeIn();

        },500);
    });
    $('#add-student-btn').click(function(e){
        // 阻止默认事件
        e.preventDefault();
        // 获取表单数据 需要有name属性 和value属性
        // var data = $('#student-add-form').serialize();
        var data = $('#student-add-form').serializeArray();
        data = formatData(data);
        // console.log(data);
        if(!data){
            alert('数据不完整！');
            return false;
        }else{
            // $.ajax({
            //     url:'https://open.duyiedu.com/api/student/addStudent',
            //     type:'GET',
            //     data:$.extend({
            //         appkey:'13456744935_1569760285507',
            //     }, data),
            //     dataType:'json',
            //     success: function(res){
            //         if(res.status === 'success'){
            //             alert('添加成功！');
            //             // jq没有重置表单方法，需要用原生方法重置
            //             $('#student-add-form')[0].reset();
            //             console.log(1);
            //             $('.menu-list > dd[data-id=student-list]').click();

            //         }else{
            //             alert(res.msg);
            //         }
            //     }
            // })
            transferData('/api/student/addStudent', data, function(){
                alert('添加成功！');

                // jq没有重置表单方法，需要用原生方法重置
                $('#student-add-form')[0].reset();
                $('.menu-list > dd[data-id=student-list]').click();
                getTableData();

            })
        }
    });
    // 编辑按钮点击事件
    $('#table-body').on('click', '.edit', function(e){
        $('.modal').slideDown();
        var index = $(this).parents('tr').index();
        renderEditForm(tableData[index]);
    }).on('click', '.delete', function(e){
        var isDel = confirm('确认删除?');
        var index = $(this).parents('tr').index();
        // console.log(idDel);
        if(isDel){
            transferData('/api/student/delBySno', {
                sNo: tableData[index].sNo
            }, function(data){
                alert('删除成功');
                getTableData();
            })
        }
    });
    // 遮罩层点击事件
    $('.mask').click(function(){
        $('.modal').slideUp();
    });
    $('#edit-student-btn').click(function(e){
        e.preventDefault();
       
        var data = $('#edit-form').serializeArray();
        data = formatData(data);
        if(!data){
            alert('数据不完整！');
            return false;
        }else{
            // $.ajax({
            //     url:'https://open.duyiedu.com/api/student/updateStudent',
            //     type:'GET',
               
            //     data:$.extend({
            //         appkey:'13456744935_1569760285507',
            //     }, data),
            //     dataType:'json',
            //     success: function(res){
            //         // console.log(res);
            //         if(res.status === 'success'){
            //             alert('修改成功！');
            //             $('.modal').slideUp();
            //             getTableData();
            //             // jq没有重置表单方法，需要用原生方法重置
            //             // $('#student-add-form')[0].reset();
            //             // $('.menu-list > dd[data-id=student-list]').click();

            //         }else{
            //             alert(res.msg);
            //         }
            //     }
            // })
            transferData('/api/student/updateStudent', data, function(data){
                alert('修改成功！');
                $('.modal').slideUp();
                getTableData();
            })
        }
    })
}

// 用来将数组结构的表单数据转换成对象结构的表单数据
// 校验数据是否填写完全 如果没有填写完全则返回false 如果填写全了返回数据对象
function formatData(data){
    var resultObj = {};
    // 数据是否填写完整
    var flag = true;
    data.forEach(function(item){
        if(!item.value){
            flag = false;
        }
        resultObj[item.name] = item.value;

    });
    return flag ? resultObj : false;
}

// 获取学生列表数据
function getTableData(){
    // $.ajax({
    //     type:'GET',
    //     url:'https://open.duyiedu.com/api/student/findByPage',
    //     data:{
    //         appkey: '13456744935_1569760285507',
    //         page: nowPage,
    //         size: pageSize,
    //     },
    //     dataType:'json',
    //     success: function(res){
    //         // console.log(res);
    //         if(res.status === 'success'){
    //             allPage = Math.ceil(res.data.count / pageSize);
    //             tableData = res.data.findByPage;
    //             renderTable(tableData);
    //         }else{
    //             alert(res.msg);
    //         }
    //     }
    // })
    transferData('/api/student/findByPage', {page: nowPage,size: pageSize,}, function(data){
        // console.log(data);
        allPage = Math.ceil(data.cont / pageSize);
        // console.log(allPage);
        tableData = data.findByPage;
        renderTable(tableData);
    });
}

// 渲染表格数据
function renderTable(data){
    var str = '';
    data.forEach(function(item, index){
        // console.log(item);
        str += '<tr>\
        <td>' + item.sNo + '</td>\
        <td>' + item.name + '</td>\
        <td>' + (item.sex == 0 ? '男' : '女') + '</td>\
        <td>' + item.email + '</td>\
        <td>' + (new Date().getFullYear() - item.birth) + '</td>\
        <td>' + item.phone + '</td>\
        <td>' + item.address + '</td>\
        <td>\
            <button class="btn edit">编辑</button>\
            <button class="btn delete">删除</button>\
        </td>\
    </tr>';
    })
    $('#table-body').html(str);

    $('#turn-page').page({
        curPage: nowPage,
        totalPage: allPage,
        changeCb: function (page) {
            nowPage = page;
            getTableData();
        }
    })
}

// 回填编辑表单数据
function renderEditForm(data){

    var form = $('#edit-form')[0];
    // console.log(1);
    // console.log(form);
    for(var prop in data){
        if(form[prop]){
            form[prop].value = data[prop];
        }
    }
}

// 数据交互函数
function transferData (url, data, successCB) {
    $.ajax({
        url:'https://open.duyiedu.com' + url,
        type: 'GET',
        data:$.extend({
            appkey:'13456744935_1569760285507',
        }, data),
        dataType:'json',
        success: function(res){
            if(res.status === 'success'){
                successCB(res.data);
                // alert('添加成功！');
                // // jq没有重置表单方法，需要用原生方法重置
                // $('#student-add-form')[0].reset();
                // console.log(1);
                // $('.menu-list > dd[data-id=student-list]').click();

            }else{
                alert(res.msg);
            }
        }
    })
}

getTableData();
bindEvent();

