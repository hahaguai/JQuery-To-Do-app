(function() {
  'use strict';

  var $form_add_task = $('.add-task')
    , task_list = []
    , $task_delete_trigger
    , $task_detail_trigger
    , $task_detail = $('.task-detail')
    , $task_detail_mask = $('.task-detail-mask')
    , $task_delete
    , current_index
    , $update_form
    , $task_detail_content
    , $task_detail_content_input
    ;

  init();

  // $task_detail.show();
  // console.log(111);
  
  
  // 使用表单用默认提交事件
  $form_add_task.on('submit', on_add_task_form_submit);
  
  $task_detail_mask.on('click', hide_task_detail);

  function on_add_task_form_submit(e) {
    var new_task = {}, $input;
    // 禁用默认行为
    e.preventDefault();
    $input = $(this).find('input[name=content]');
    new_task.content = $input.val();
    if(!new_task.content) return;
    if(add_task(new_task)) {
      $input.val(null);
    }
  }

  function listen_task_detail(){
    var index;
    $('.task-item').on('dblclick', function(){
      $task_detail.show(index);
      $task_detail_mask.show();          
    });

    $task_detail_trigger.on('click', function(){
      var $this = $(this);
      var $item = $this.parent().parent();
      index =  $item.data('index');
      show_task_detail(index);
    });
  } 

  // 展示详情页面
  function show_task_detail(index){
    // 生成详情模版
    render_task_detail(index);
    current_index = index;
    // 显示详情模版，默认隐藏
    $task_detail.show();
    $task_detail_mask.show();
  }

  // 更新task
  function update_task(index, data){
    if(!index || !task_list[index]) return;
    task_list[index] = data;
    refresh_task_list();
    $task_detail.hide();
    $task_detail_mask.hide();
  }

  // 渲染指定task的详细信息
  function render_task_detail(index) {
    if(index === undefined || !task_list[index]) return;
    var item = task_list[index];
    var tpl ='<form>' +
      '<div class="content">' +
      (item.content || '') +
      '</div>' +
      '<div class="input-item"><input style="display:none;" type="text" name="content" value="' + item.content +'"></di>' +
      '<div class="desc input-item">' +
      '<textarea name="desc">'+ (item.desc || '') +'</textarea>' +
      '</div>' +
      '<div class="remind input-item">' +
      '<input name="remind_date" type="date" value="' + (item.remind_date || '') + '">' +
      '</div>' +
      '<div class="desc input-item">' +
      '<button type="submit">更新</button>' +
      '</div>' +
      '</form>';
    // 用新模版替换旧模版
    $task_detail.html();
    $task_detail.html(tpl);
    // 选中其中的form元素，因为之后会使用其监听submit事件
    $update_form = $task_detail.find('form');
    // 选中显示task内容的元素
    $task_detail_content = $task_detail.find('.content');
    // 选中task input的元素
    $task_detail_content_input = $task_detail.find('[name=content]');
    // 双击显示input，同时隐藏自己
    $task_detail_content.on('dblclick', function(){
      $task_detail_content_input.show();
      $task_detail_content.hide();
    })
    $update_form.on('submit', function(e){
      e.preventDefault();
      var data = {};
      // 获取表单中input的值
      data.content = $(this).find('[name=content]').val();
      console.log(data.content);
      data.desc = $(this).find('[name=desc]').val();
      console.log(data.desc);
      data.remind_date = $(this).find('[name=remind_date]').val();
      console.log(data.remind_date);
      console.log(data);
      update_task(index, data);
    })
  }

  // 隐藏隐藏页面
  function hide_task_detail(){
    $task_detail.hide();
    $task_detail_mask.hide();
  }

  // 查找并监听所有删除按钮的点击事件
  function listen_delet_task(){
    $task_delete_trigger.on('click', function(){
      var $this = $(this);
      // 找到删除按钮所在的task元素
      var $item = $this.parent().parent();
      var index =  $item.data('index');
      var tmp = confirm('确定要删除吗');
      tmp ? delete_task(index) : null;
    });
  }

  // 增加单条任务
  function add_task(new_task) {
    // 将新task存入task_list
    task_list.push(new_task);
    // 更新localstorage
    refresh_task_list()
    return true;
  }

  // 每次修改都要进行更新
  function refresh_task_list(){
    store.set('task_list', task_list);
    render_task_list();
  }

  // 根据索引删除单条任务
  function delete_task(index){
    if(index === undefined || !task_list[index]) return;
    delete task_list[index];
    refresh_task_list(); 
  }

  // 初始化
  function init(){
    // store.clear();
    task_list = store.get('task_list') || [];
    if(task_list.length) {
      render_task_list();
    }
  }

  // 渲染整个任务列表
  function render_task_list() {
    var $task_list = $('.task-list');
    $task_list.html('');
    for(var i = 0; i < task_list.length; i++) {
      var $task = render_task_item(task_list[i], i);
      $task_list.prepend($task);
    }
    // 只是触发的按钮
    $task_delete_trigger = $('.action.delete');
    $task_detail_trigger = $('.action.detail');
    listen_delet_task();
    listen_task_detail();
  }

  // 渲染单条task模版
  function render_task_item(data, index) {
    if(!index || !data) return;
    var list_item_tpl = 
    '<div class="task-item" data-index="' + index+ '">' +
      '<span><input type="checkbox"></span>' +
      '<span class="task-content">'+ data.content + '</span>' +
      '<span class="fr">' +
      '<span class="action delete"> 删除 </span>' +
      '<span class="action detail"> 详细 </span>' +
      '</span>' +
    '</div>';
    return $(list_item_tpl);
  }

})();