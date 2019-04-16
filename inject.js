(function(window) {
  function num(n,cs) {
    if (!n) return cs[2];
    n = n % 100;
    if ((n % 10 == 0) || (n % 10 > 4) || (n > 4 && n < 21)) {
      return cs[2];
    } else
    if (n % 10 == 1) {
      return cs[0];
    } else {
      return cs[1];
    }
  }

  function fixUrl(url) {
    if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) url = 'http://' + url;
    return url;
  }

  var linksStopList = ['/friends', '/im', '/feed', '/video', '/audio', '/albums', '/photo', '/groups', /*'/group', '/public', '/event',*/ '/fave', '/apps', '/app', '/docs', '/dev', '/settings', '/search', '/wall', '/gifts', '/away', '/tag', '/support', '/about', '/terms', '/ads', '/jobs', 'http'];
  var linksRegex = /^\/([a-z0-9._]+)$/;
  var links = document.getElementsByTagName('a');
  var linksPaused = false;
  function updateLinks() {
    if (linksPaused) return;

    //console.time('processing links');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute('href');

      if (!href || linksStopList.indexOf(href) != -1) continue;
      if (!link.hasAttribute('vk_notes_tooltip')) {
        link.setAttribute('vk_notes_tooltip', true);
        if (href.indexOf('?') != -1) continue;
        var valid = true;
        for (var i = 0; i < linksStopList.length; i++) {
          if (href.indexOf(linksStopList[i]) == 0) {
            valid = false;
            break;
          }
        }
        if (!valid) continue;

        var match = href.match(linksRegex);
        var isGroup = false;
        if (href.indexOf('/group') > -1 || href.indexOf('/public') > -1 || href.indexOf('/event') > -1) {
          match = href.match(/^\/[a-z]+([0-9]+)$/);
          isGroup = true;
        }

        if (match) {
          (function(link, match, isGroup) {
            link.addEventListener('mouseover', function(e) {

              var to = setTimeout(function() {
                clearTimeout(to);
                to = false;

                stManager.add('md5.js', function() {
                  var query = ajx2q({
                    format: 'json',
                    api_id: 4273167,
                    access_token: window.vkNotesOptions.accessToken,
                    v: '5.16',
                    code:
                      (!isGroup? 'var self = API.users.get()[0]; var user = API.users.get({"user_ids": "' + match[1] + '", "fields": "photo_100,status,bdate,city,country,online,online_mobile,last_seen,lists,contacts,site,education"})[0];' +
                      'if (self.id == user.id) return false;' +
                      'if (user) { ' +
                      'var mutual = API.friends.getMutual({"target_uid": user.id});' +
                      'return {"user": user, "mutual": API.users.get({"user_ids": mutual, "fields": "photo_50"})};' +
                      '} else { ' : '') +
                      'var group = API.groups.getById({"group_ids": "' + match[1] + '", "fields": "status,activity,description,contacts,links,site,city,country"})[0];' +
                      'if (group) { ' +
                      'return {"group": group, "members": API.groups.getMembers({"group_id": group.id, "fields": "photo_50", "count": 50})};' +
                      '} else ' +
                      'return false;' +
                      (!isGroup ? '}' : '')
                  });
                  query += '&method=execute&oauth=1&sig=' + MD5('/method/?' + unescape(query) + window.vkNotesOptions.secret);

                  ajax.plainpost('/api.php', query, function(result) {
                    result = JSON.parse(result);
                    if (!result.response) return;
                    if (result.response.user) {
                      var user = result.response.user;
                      var bdate = (user.bdate || '').split('.');
                      var now = new Date();
                      var age = (bdate.length == 3) ? (
                        (now.getFullYear() - bdate[2] - 1) +
                        (now.getMonth() + 1 > bdate[1]) +
                        (now.getMonth() + 1 == bdate[1] && now.getDate() >= bdate[0])
                      ) : false;
                      var mutual = result.response.mutual;
                      var mutualArr = [];
                      if (mutual) {
                        for (var i = 0; i < Math.min(mutual.length, 15); i++) {
                          mutualArr.push(
                            `<a class="mention_tt_person" style="margin: 2px" href="/${mutual[i].id}" title="${mutual[i].first_name} ${mutual[i].last_name}">
                              <img class="mention_tt_person_img" src="${mutual[i].photo_50}">
                            </a>`
                          );
                        }
                      }

                      chrome.runtime.sendMessage(window.vkNotesExtensionId, { method: 'getNote', user_id: user.id }, function(note) {
                        //linksPaused = true;
                        showTooltip(link, {
                          className: 'tt_default mention_tt',
                          content:
`<div class="wrapped"><div class="mention_tt_wrap clear_fix">
  <a vk_notes_tooltip href="/${match[1]}" class="mention_tt_photo">
    <img class="mention_tt_img" src="${user.photo_100}">
  </a>
  <div class="mention_tt_data">
    <div class="mention_tt_title">
      <a class="mention_tt_name" vk_notes_tooltip href="/${match[1]}">${user.first_name} ${user.last_name}</a><!--
      -->${(window.vkNotesOptions.showUserAge && age)? ', ' + age + num(age, [' год', ' года', ' лет']) : ''}
    </div>
    <div class="mention_tt_row mention_tt_online">Online<b class="mob_onl " onclick="mobilePromo();" onmouseover="mobileOnlineTip(this, {mid: 16058189, right: 1})"></b></div>
    <div class="mention_tt_info">` +
      ((window.vkNotesOptions.showUserStatus && user.status)? '<div class="mention_tt_row">' + user.status + '</div>' : '') +
      '<div style="height: 7px"></div>' +
      ((window.vkNotesOptions.showUserNote && note && note.visible)? '<div class="mention_tt_row"><span style="color: #000; display: inline-block; width: 58px">Заметка:</span> ' + note.text + '</div>' : '') +
      ((window.vkNotesOptions.showUserCity && user.city && user.country)? '<div class="mention_tt_row"><span style="color: #000; display: inline-block; width: 58px">Город:</span> <a href="/search?c[name]=0&c[section]=people&c[country]=' + user.country.id + '&c[city]=' + user.city.id + '" title="' + user.city.title + ', ' + user.country.title + '">' + user.city.title + '</a></div>' : '') +
      ((window.vkNotesOptions.showUserUniversity && user.university_name)? '<div class="mention_tt_row"><span style="color: #000; display: inline-block; width: 58px">ВУЗ:</span> <a href="/search?c[name]=0&c[section]=people&c[university]=' + user.university + '">' + user.university_name + '</a></div>' : '') +
      ((window.vkNotesOptions.showUserSite && user.site)? '<div class="mention_tt_row"><span style="color: #000; display: inline-block; width: 58px">Сайт:</span> <a href="' + fixUrl(user.site) + '" target="_blank">' + user.site + '</a></div>' : '') +
      ((window.vkNotesOptions.showUserPhone && user.mobile_phone)? '<div class="mention_tt_row"><span style="color: #000; display: inline-block; width: 58px">Телефон:</span> <a href="tel:' + user.mobile_phone + '">' + user.mobile_phone + '</a></div>' : '') +
      ((window.vkNotesOptions.showUserMutual && mutual)? 
      `<div class="mention_tt_people_wrap">
        <div class="mention_tt_row mention_tt_extra">
          <a href="friends?id=${user.id}&amp;section=common" onclick="return page.showPageMembers(event, ${user.id}, 'common');">
            ${(mutual.length || 'нет') + ' ' + num(mutual.length, ['общий друг', 'общих друга', 'общих друзей'])}
          </a>
        </div>
        <div class="mention_tt_people clear_fix" style="margin: 4px -2px 0">
          ${mutualArr.join('')}
        </div>
      </div>` : '') +
    `</div>
  </div>
</div>
<!--div class="mention_tt_actions">
  <button class="flat_button button_small mention_tt_subscr secondary" onclick="return mentionSubscribe(this, ${user.id}, '');">
  <span class="mention_tt_subscr_icon"></span>
  <span class="mention_tt_unsub_label">Вы подписаны</span>
  <span class="mention_tt_sub_label">Подписаться</span>
</button><button class="flat_button button_small mention_tt_write" onclick="return showWriteMessageBox(event, ${user.id});">
  Написать сообщение
</button></div--></div>`, 
                          //black: 1,
                          shift: [54, 8, 8],
                          hidedt: 500,
                          slide: 15
                        });
                        //linksPaused = false;
                      });
                    } else
                    if (result.response.group) {
                      var group = result.response.group;
                      var members = result.response.members;
                      var membersArr = [];
                      if (members) {
                        for (var i = 0; i < Math.min(members.items.length, 12); i++) {
                          membersArr.push(
                            `<a class="mention_tt_person" style="margin: 2px" href="/${members.items[i].id}" title="${members.items[i].first_name} ${members.items[i].last_name}">
                              <img class="mention_tt_person_img" src="${members.items[i].photo_50}">
                            </a>`
                          );
                        }
                      }

                      showTooltip(link, {
                        className: 'tt_default mention_tt',
                        content:
`<div class="wrapped"><div class="mention_tt_wrap clear_fix">
  <a vk_notes_tooltip href="/${match[1]}" class="mention_tt_photo">
    <img class="mention_tt_img" src="${group.photo_100}">
  </a>
  <div class="mention_tt_data">
    <div class="mention_tt_title">
      <a class="mention_tt_name" vk_notes_tooltip href="/${match[1]}">${group.name}</a>
    </div>` +
    ((window.vkNotesOptions.showGroupActivity && group.activity)? '<div class="mention_tt_row mention_tt_online">' + group.activity + '</div>' : '') +
    `<div class="mention_tt_info">` +
        ((window.vkNotesOptions.showGroupStatus && group.status)? '<div class="mention_tt_row">' + group.status + '</div>' : '') +
        '<div style="height: 7px"></div>' +
        ((window.vkNotesOptions.showGroupDescription && group.description)? '<div class="mention_tt_row" style="overflow: hidden; max-height: 70px">' + group.description + '</div>' : '') +
        ((window.vkNotesOptions.showGroupCity && group.city && group.country)? '<div class="mention_tt_row"><span style="color: #000; display: inline-block; width: 56px">Город:</span> <a href="/search?c[name]=0&c[section]=communities&c[country]=' + group.country.id + '&c[city]=' + group.city.id + '" title="' + group.city.title + ', ' + group.country.title + '">' + group.city.title + '</a></div>' : '') +
        ((window.vkNotesOptions.showGroupSite && group.site)? '<div class="mention_tt_row"><span style="color: #000; display: inline-block; width: 56px">Сайт:</span> <a href="' + fixUrl(group.site) + '" target="_blank">' + group.site + '</a></div>' : '') +
        ((window.vkNotesOptions.showGroupMembers && members && members.count)?
        `<div class="mention_tt_people_wrap">
        <div class="mention_tt_row mention_tt_extra">
          <a href="/search?c%5Bgroup%5D=' + group.id + '&c%5Bsection%5D=people" vk_notes_tooltip>
            ${(members.count || 'нет') + ' ' + num(members.count, ['участник', 'участника', 'участников'])}
          </a>
        </div>
        <div class="mention_tt_people clear_fix" style="margin: 4px -2px 0">
          ${membersArr.join('')}
        </div>
      </div>` : '') +
    `</div>
  </div>
</div>
<!--div class="mention_tt_actions">
  <button class="flat_button button_small mention_tt_subscr secondary" onclick="return mentionSubscribe(this, ${group.id}, '');">
  <span class="mention_tt_subscr_icon"></span>
  <span class="mention_tt_unsub_label">Вы подписаны</span>
  <span class="mention_tt_sub_label">Подписаться</span>
</button><button class="flat_button button_small mention_tt_write" onclick="return showWriteMessageBox(event, ${group.id});">
  Написать сообщение
</button></div--></div>`, 
                        //black: 1,
                        shift: [54, 8, 8],
                        hidedt: 500,
                        slide: 15
                      });
                      //linksPaused = false;
                    }
                  });
                });
              }, 700);

              link.addEventListener('mouseout', function(e) {
                if (to) {
                  clearTimeout(to);
                  to = false;
                }
              });
            });
          })(link, match, isGroup);
        }
      }
    }
    //console.timeEnd('processing links');
  }

  window.addEventListener('message', function(event) {
    if (event.source != window)
      return;

    if (event.data.type && (event.data.type == 'VK_NOTES_UPDATE_LINKS')) {
      updateLinks();
    }
  }, false);
  updateLinks();

  window.mentionOver = function() {}; // stub
})(window);