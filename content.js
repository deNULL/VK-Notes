// Content scripts run in isolated world, we don't have access to any libraries
function ge(e) {
  return document.getElementById(e);
}
function geByClass(c, n) {
  return Array.prototype.slice.call((n || document).getElementsByClassName(c));
}
function geByClass1(c, n) {
  return (n || document).getElementsByClassName(c)[0];
}


function update() {
  var info = ge('page_info_wrap');
  var short = ge('profile_short');
  var bottom_actions = geByClass1('page_actions_cont');

  if (info && short && bottom_actions && !ge('vk_notes_profile')) {
    var link = document.createElement('a');
    link.id = 'vk_notes_profile';
    link.href = 'about:blank';
    info.insertBefore(link, short);

    var css = document.createElement('link');
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = chrome.extension.getURL('style.css');
    info.insertBefore(css, short);

    var box = document.createElement('div');
    box.id = 'vk_notes_box';
    box.style.display = 'none';
    info.insertBefore(box, short);

    var text = document.createElement('div');
    text.id = 'vk_notes_note';
    text.style.display = 'none';
    text.style.borderBottom = '1px solid #E8EBEE';
    text.style.padding = '10px 0';
    text.className = 'profile_info';
    info.insertBefore(text, short);

    var user_id = parseInt(bottom_actions.innerHTML.match(/oid: ([0-9]+)/)[1], 10); // not really elegant way to get user id
    chrome.extension.sendRequest({ method: 'getNote', user_id: user_id }, function(response) {
      var note = response.note;

      link.innerHTML = note ? (note.visible ? 'Изменить заметку' : 'Показать заметку') : 'Добавить заметку';
      link.onclick = function() {
        if (note && text.style.display == 'none') {
          text.style.display = 'block';
          link.innerHTML = 'Изменить заметку';
        } else
        if (box.style.display == 'none') {
          box.style.display = 'block';
          link.innerHTML = 'Отмена';
          ge('vk_notes_input').focus();
        } else {
          box.style.display = 'none';
          link.innerHTML = note ? (note.visible ? 'Изменить заметку' : 'Показать заметку') : 'Добавить заметку';
        }
        return false;
      }

      box.innerHTML =
'<table class="box" cellspacing="0" cellpadding="0">\
  <tbody><tr>\
    <td class="sidesh" rowspan="2"><div></div></td>\
    <td><div class="editor">\
      <textarea class="text" maxlength="140" id="vk_notes_input">' + (note ? note.text : '') + '</textarea>\
      <a id="vk_notes_delete" class="fl_r" style="margin: 4px;" vk_notes_tooltip="true">удалить</a>\
      <div class="fl_l button_blue"><button id="vk_notes_save">Сохранить</button></div>\
      <div class="fl_l checkbox' + (note && !note.visible ? '' : ' on') + '" id="vk_notes_visible" onclick="checkbox(this);"><div></div>Отображать по умолчанию</div>\
      <div class="clear"></div>\
    </div></td>\
    <td class="sidesh" rowspan="2"><div></div></td>\
  </tr>\
  <tr><td class="bottomsh1"><div></div></td></tr>\
  <tr><td class="bottomsh2" colspan="3"><div></div></td></tr>\
</tbody></table>';

      ge('vk_notes_save').onclick = function() {
        box.style.display = 'none';
        link.innerHTML = 'Изменить заметку';
        text.style.display = 'block';

        note = { text: ge('vk_notes_input').value, visible: ge('vk_notes_visible').classList.contains('on') };
        ge('vk_notes_text').innerHTML = note.text.replace(/\n/g, '<br/>');

        chrome.extension.sendRequest({ method: 'saveNote', user_id: user_id, note: note });
      }

      ge('vk_notes_delete').onclick = function() {
        box.style.display = 'none';
        link.innerHTML = 'Добавить заметку';
        text.style.display = 'none';

        note = false;
        ge('vk_notes_text').innerHTML = '';

        chrome.extension.sendRequest({ method: 'saveNote', user_id: user_id, note: note });
      }

      text.style.display = (note && note.visible) ? 'block' : 'none';
      text.innerHTML =
'<div class="clear_fix miniblock">\
  <div class="label fl_l">Ваша заметка:</div>\
  <div class="labeled fl_l" id="vk_notes_text">' + (note ? note.text.replace(/\n/g, '<br/>') : '') + '</div>\
</div>';
    });
  }
}

function updateFriends() {
  var friends_list = ge('friends_list');
  if (friends_list) {
    geByClass('user_block', friends_list).forEach(function(user_block) {
      if (!user_block.classList.contains('vk_notes_added')) {
        user_block.classList.add('vk_notes_added');
        var user_id = parseInt((user_block.id.match(/user_block([0-9]+)/) || user_block.innerHTML.match(/request_controls_([0-9]+)/))[1], 10);
        chrome.extension.sendRequest({ method: 'getNote', user_id: user_id }, function(response) {
          if (response.note) {
            var info = geByClass1('info', user_block);
            var text = document.createElement('div');
            //text.id = 'vk_notes_note';
            text.className = 'friends_field';
            text.innerHTML = response.note.text;
            info.appendChild(text);
          }
        });
      }
    });
  }
}

chrome.extension.sendRequest({ method: 'getOptions' }, function(opts) {
  if (opts.enableTooltips) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL('inject.js');
    document.body.appendChild(script);

    var script = document.createElement('script');
    script.innerHTML = 'window.vkNotesExtensionId = "' + chrome.runtime.id + '"; window.vkNotesOptions = ' + JSON.stringify(opts) + ';';
    document.body.appendChild(script);
  }

  if (opts.enableTooltips || opts.enableNotes) {
    (new MutationObserver(function(mutations, observer) {
      mutations.forEach(function(mutation) {
        //if (mutation.target.id == 'wrap3') {
          if (opts.enableNotes) {
            update();
            updateFriends();
          }
        //}
        //console.log(mutation.target);
        if (opts.enableTooltips) {
          window.postMessage({ type: 'VK_NOTES_UPDATE_LINKS' }, '*');
        }
      });
    })).observe(document.body, {
      childList: true,
      subtree: true
    });

    if (opts.enableNotes) {
      update();
      updateFriends();
    }
  }
});