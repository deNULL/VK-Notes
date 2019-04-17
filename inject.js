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

  var svgStar = 'data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20transform%3D%22%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%2F%3E%3Cpath%20d%3D%22m15.5613624%207.61424573%204.1232765.40547982c1.8475418.18168582%202.4302769%202.10217885%201.0315542%203.29372465l-3.2381377%202.7585091%201.2135185%204.5365102c.4990238%201.8655064-1.2159241%203.0628192-2.7879244%201.9246694l-3.9032512-2.8260073-3.90325115%202.8260073c-1.57244697%201.1384732-3.28639451-.0612327-2.78792437-1.9246694l1.21351848-4.5365102-3.23813774-2.7585091c-1.40914217-1.200422-.81520471-3.11210235%201.03132179-3.29372216l4.12252005-.40548095%201.83210894-4.32967168c.7247928-1.71284293%202.7318017-1.72044928%203.4595816.00020126zm-8.51221969%2011.45541287%204.71667809-3.4149396c.1399679-.1013387.3291871-.1013387.469155%200l4.7166781%203.4149396-1.4409425-5.386692c-.039877-.1490729.0095529-.307789.1270219-.4078587l3.9111968-3.33187559c.1977945-.16849744.216491-.1068801-.040452-.13214768l-4.9514802-.48692472c-.1458426-.01434204-.2721667-.10728843-.3292545-.24225786l-2.1554134-5.09592669c-.1064525-.2516798-.0374455-.25194133-.1440793.0000575l-2.1563512%205.09592669c-.05709907.13493751-.18340543.2278574-.3292229.24219965l-4.95055793.48692472c-.26344883.02591218-.24283707-.04042997-.0402521.13214839l3.91119679%203.33187559c.11746902.1000697.16689893.2587858.12702186.4078587z%22%20fill%3D%22%23828a99%22%20fill-rule%3D%22nonzero%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E';
  var svgStarCrossed = 'data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20transform%3D%22%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%2F%3E%3Cg%20fill%3D%22%23828a99%22%20fill-rule%3D%22nonzero%22%3E%3Cpath%20d%3D%22m20.7261172%2011.3076738-3.2480618%202.7642855%201.2135185%204.5365102c.4990238%201.8655064-1.2159241%203.0628192-2.7879244%201.9246694l-3.9305398-2.8560826c-.2485361-.1601732-.4131097-.4393956-.4131097-.7570563%200-.4930253.3964348-.8934584.887926-.8999207l3.052074-3.2700793-3.052074%203.2700793c.0040183-.0000528.0080431-.0000793.012074-.0000793.2162416%200%20.4146711.0762626.5698599.2033593l3.921794%202.8462993-1.4409425-5.386692c-.039877-.1490729.0095529-.307789.1270219-.4078587l3.9271701-3.34134339c.0317324-.02883742.0655333-.05543885.1011539-.07955539l-.6660573-.85420912-3.5%203.75%203.5-3.75.6669657.85359489c.1436087-.09697413.3167093-.15359489.5030343-.15359489.4970563%200%20.9.4029437.9.9%200%20.2871464-.1344745.5428846-.3438828.7076738z%22%2F%3E%3Cpath%20d%3D%22m14.353334%204.75943967c.0429765.10505222.066666.22003979.066666.34056033%200%20.49705627-.4029437.9-.9.9-.1506866%200-.2927239-.03703247-.4175071-.10249286l-6.20844921%206.20844916c.06761609.1263502.10595631.2707195.10595631.4240437%200%20.4970563-.40294373.9-.9.9-.23181723%200-.44316399-.0876445-.60271163-.2316049l-2.21268485-1.8849449c-1.40914217-1.200422-.81520471-3.11210235%201.03132179-3.29372216l4.12252005-.40548095%201.83210894-4.32967168c.7247928-1.71284293%202.7318017-1.72044928%203.4595816.00020126l.6235909%201.47432206zm-1.2536138%201.1366068c-.1680479-.0889064-.3045581-.2294674-.388384-.40053651l-.0041719-.00863034c-.0114575-.02402942-.021881-.04864677-.0312127-.07379449l-.6036216-1.42710977c-.1064525-.2516798-.0374455-.25194133-.1440793.0000575l-2.1563512%205.09592669c-.05709907.13493751-.18340543.2278574-.3292229.24219965l-4.95055793.48692472c-.26344883.02591218-.24283707-.04042997-.0402521.13214839l2.26801853%201.93208269-.00057856.0016437c.06974059.0661597.12889222.1433727.17464904.228833z%22%2F%3E%3Cpath%20d%3D%22m6.5363961%2018.7363961c-.35147186.3514719-.92132034.3514719-1.2727922%200-.35147187-.3514719-.35147187-.9213203%200-1.2727922l13.2-13.2c.3514719-.35147187.9213203-.35147187%201.2727922%200%20.3514719.35147186.3514719.92132034%200%201.2727922z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
  var linksStopList = ['/friends', '/im', '/feed', '/video', '/audio', '/albums', '/photo', '/groups', /*'/group', '/public', '/event',*/ '/fave', '/apps', '/app', '/docs', '/dev', '/settings', '/search', '/wall', '/gifts', '/away', '/tag', '/support', '/about', '/terms', '/ads', '/jobs', 'http'];
  var linksRegex = /^\/([a-z0-9._]+)$/;
  var links = document.getElementsByTagName('a');
  var linksPaused = false;
  window.vkNotesToggleFave = function(btn, kind, id) {
    var method;
    lockButton(btn);
    if (btn.classList.contains('secondary')) {
      method = 'fave.remove' + kind[0].toUpperCase() + kind.substr(1);
    } else {
      method = 'fave.add' + kind[0].toUpperCase() + kind.substr(1);
    }
    //console.log(btn, userId);
    var query = ajx2q({
      format: 'json',
      api_id: 4273167,
      access_token: window.vkNotesOptions.accessToken,
      [kind + '_id']: id,
      v: '5.16'
    });
    query += '&method=' + method + '&oauth=1&sig=' + MD5('/method/?' + unescape(query) + window.vkNotesOptions.secret);
    ajax.plainpost('/api.php', query, function(result) {
      result = JSON.parse(result);
      console.log(result);
      unlockButton(btn);
      if (btn.classList.contains('secondary')) {
        // Remove
        btn.children[0].style.backgroundImage = `url(${svgStar})`;
        btn.children[0].style.filter = 'brightness(500%)';
        btn.title = 'Добавить в закладки';
      } else {
        btn.children[0].style.backgroundImage = `url(${svgStarCrossed})`;
        btn.children[0].style.filter = 'none';
        btn.title = 'Убрать из закладок';
      }
      btn.classList.toggle('secondary');
    });
  }
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
                  var userFields = [
                    'sex', 'photo_100','status','bdate','maiden_name','nickname',
                    'blacklisted','blacklisted_by_me','trending','verified',
                    'city','country',
                    'online','online_mobile','last_seen',
                    'lists','contacts','site','education','connections',
                    'followers_count','friend_status','is_hidden_from_feed', 'is_favorite',
                  ];
                  var groupFields = [
                    'status','activity','description','contacts','links','site','city','country','is_favorite'
                  ];
                  var query = ajx2q({
                    format: 'json',
                    api_id: 4273167,
                    access_token: window.vkNotesOptions.accessToken,
                    v: '5.16',
                    code:
                      (!isGroup? `
var self = API.users.get()[0];
var user = API.users.get({"user_ids": "${match[1]}", "fields": "${userFields.join(',')}"})[0];
if (self.id == user.id) return false;
if (user) {
  var mutual = API.friends.getMutual({"target_uid": user.id});
  var app = false;
  if (user.online_app) {
    app = API.apps.get({"app_id": user.online_app});
  }
  return {"user": user, "app": app, "mutual": API.users.get({"user_ids": mutual, "fields": "photo_50"})};
} else { ` : '') + `
  var group = API.groups.getById({"group_ids": "${match[1]}", "fields": "${groupFields.join(',')}"})[0];
  if (group) {
    return {"group": group, "members": API.groups.getMembers({"group_id": group.id, "fields": "photo_50", "count": 50})};
  } else {
    return false;
  }` +
(!isGroup ? '}' : '') });
                  query += '&method=execute&oauth=1&sig=' + MD5('/method/?' + unescape(query) + window.vkNotesOptions.secret);

                  ajax.plainpost('/api.php', query, function(result) {
                    result = JSON.parse(result);
                    console.log(result);
                    window.cur.lang.global_short_date_time = 
                      window.cur.lang.global_short_date_time || ["", "{day} {month} в {hour}:{minute}", "вчера в {hour}:{minute}", "сегодня в {hour}:{minute}", "завтра в {hour}:{minute}"];
                    if (!result.response) return;
                    if (result.response.user) {
                      var user = result.response.user;
                      var app = result.response.app;
                      if (!user.online && user.last_seen) {
                        user.online_mobile = user.last_seen.platform < 6;
                        if (user.last_seen.platform > 1 && user.last_seen.platform < 7) {
                          app = { title: ['iPhone', 'iPad', 'Android', 'Windows Phone', 'Windows 10'][user.last_seen.platform - 2] }
                        }
                      }
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
                        for (var i = 0; i < Math.min(mutual.length, 14); i++) {
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
    </div>` +
    ((user.online || user.last_seen)? '<div class="mention_tt_row mention_tt_online">' +
      (user.online ? '<span style="color: #2a5885; font-weight: 500">В сети</span>' : `Был${user.sex == 1 ? 'а' : ''} в сети ${getSmDate(user.last_seen.time)}`) +
      ((user.online_mobile || app) ? '<span style="background: #eee;padding: 2px 4px;border-radius: 3px; margin-left: 7px">' : '') +
      (user.online_mobile? `<span class="mob_onl " style="margin: 0 ${app? '5px' : '0'} 0 0" onclick="mobilePromo();" onmouseover="mobileOnlineTip(this, {mid: ${user.id}, right: 1})"></span>` : '') +
      (app? `${app.title}` : '') +
      ((user.online_mobile || app) ? '</span>' : '') +
      '</div>' : '') +
    `<div class="mention_tt_info">` +
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
<div class="mention_tt_actions">
  <!--button class="flat_button button_small mention_tt_subscr secondary" onclick="return mentionSubscribe(this, ${user.id}, '');">
    <span class="mention_tt_subscr_icon"></span>
    <span class="mention_tt_unsub_label">Вы подписаны</span>
    <span class="mention_tt_sub_label">Подписаться</span>
  </button-->
  <button class="flat_button button_small${user.is_favorite? ' secondary' : ''}" style="padding: 4px 7px 2px;" title="${user.is_favorite? 'Убрать из закладок' : 'Добавить в закладки'}" onclick="return vkNotesToggleFave(this, 'user', ${user.id});">
    <span style="display: inline-block; width: 19px; height: 19px; filter: ${user.is_favorite? 'none' : 'brightness(500%)'}; background: url('${user.is_favorite ? svgStarCrossed : svgStar}'); background-size: contain; background-repeat: no-repeat;"></span>
  </button>
  <button class="flat_button button_small mention_tt_write" onclick="return showWriteMessageBox(event, ${user.id});">
    Написать сообщение
  </button>
</div></div>`, 
                          //black: 1,
                          shift: [54, 8, 8],
                          hidedt: 500,
                          dir: 'auto',
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
                        for (var i = 0; i < Math.min(members.items.length, 14); i++) {
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
<div class="mention_tt_actions">
<!--button class="flat_button button_small mention_tt_subscr secondary" onclick="return mentionSubscribe(this, ${group.id}, '');">
  <span class="mention_tt_subscr_icon"></span>
  <span class="mention_tt_unsub_label">Вы подписаны</span>
  <span class="mention_tt_sub_label">Подписаться</span>
</button!-->
  <button class="flat_button button_small${group.is_favorite? ' secondary' : ''}" style="padding: 4px 7px 2px;" title="${group.is_favorite? 'Убрать из закладок' : 'Добавить в закладки'}" onclick="return vkNotesToggleFave(this, 'group', ${group.id});">
    <span style="display: inline-block; width: 19px; height: 19px; filter: ${group.is_favorite? 'none' : 'brightness(500%)'}; background: url('${group.is_favorite ? svgStarCrossed : svgStar}'); background-size: contain; background-repeat: no-repeat;"></span>
  </button>
  <button class="flat_button button_small mention_tt_write" onclick="return showWriteMessageBox(event, ${-group.id});">
    Написать сообщение
  </button>
</div></div>`, 
                        //black: 1,
                        shift: [54, 8, 8],
                        hidedt: 500,
                        dir: 'auto',
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